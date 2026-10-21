const { chromium } = require('C:/Users/sid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
let browser;
(async () => {
  fs.mkdirSync('qa/variants',{recursive:true});
  browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
  const page=await browser.newPage({viewport:{width:1356,height:900}, reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const results=[];
  for(const [id,name,count] of [['omahaFixed','Omaha Fixed',4],['omahaClean','Omaha Clean',4],['omahaDirty','Omaha Dirty',4],['irish','Irish',3],['discard','Discard',5]]) {
    await page.getByRole('button',{name:'Change game',exact:true}).click();
    await page.getByLabel('Poker variation',{exact:true}).selectOption(id);
    await page.getByLabel('Players at the table',{exact:true}).selectOption('5');
    await page.getByRole('button',{name:'Start new session',exact:true}).click();
    assert.match(await page.locator('h1').innerText(),new RegExp(name));
    assert.equal(await page.locator('.hero-hand .card').count(),count);
    await page.screenshot({path:`qa/variants/${id}-desktop.png`,fullPage:true,animations:'disabled'});
    await page.setViewportSize({width:390,height:844});
    await page.screenshot({path:`qa/variants/${id}-mobile.png`,fullPage:true,animations:'disabled'});
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.setViewportSize({width:1356,height:900});
    await page.getByLabel('Bot pace',{exact:true}).selectOption('350');
    let discards=0, completed=false, moves=0;
    const deadline=Date.now()+90000;
    while(Date.now()<deadline) {
      assert.equal(await page.locator('.error-message').count(),0);
      if(await page.locator('.discard-options button').count()) {
        await page.screenshot({path:`qa/variants/discard-choice-${discards}.png`,fullPage:true,animations:'disabled'});
        assert.equal(await page.getByRole('button',{name:'Confirm discard',exact:true}).isDisabled(),true);
        await page.locator('.discard-options button').first().click();
        await page.getByRole('button',{name:'Confirm discard',exact:true}).click();
        discards++;
      } else if(await page.locator('.call-button:enabled').count()) {
        await page.locator('.call-button').click();moves++;
      } else if(await page.locator('.completed-actions').count()) {
        completed=true;break;
      } else await page.waitForTimeout(120);
    }
    assert.ok(completed,`${id} finished`);
    if(id==='discard') assert.equal(discards,3,'Human made flop, turn and river discards');
    await page.screenshot({path:`qa/variants/${id}-complete.png`,fullPage:true,animations:'disabled'});
    await page.getByRole('tab',{name:/History/}).click();
    await page.locator('.history-row').first().click();
    await page.getByRole('button',{name:'Close dialog',exact:true}).click();
    results.push({id,completed,moves,discards});
    console.log(JSON.stringify(results.at(-1)));
  }
  await page.reload({waitUntil:'networkidle'});
  assert.match(await page.locator('h1').innerText(),/Discard/);
  fs.writeFileSync('qa/variants/results.json',JSON.stringify({results,errors},null,2));
  assert.deepEqual(errors,[]);
  await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
