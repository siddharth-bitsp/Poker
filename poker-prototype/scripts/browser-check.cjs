const { chromium } = require('C:/Users/sid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const out = path.resolve('qa');
fs.mkdirSync(out, { recursive: true });

let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1356, height: 900 }, deviceScaleFactor: 1 });
  const errors = [], failures = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('requestfailed', r => failures.push({ url: r.url(), error: r.failure()?.errorText }));
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Fold', exact: true }).waitFor();
  await page.screenshot({ path: path.join(out, 'desktop-initial.png'), fullPage: true });
  console.log(JSON.stringify({ phase: 'initial', size: await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })), errors, failures }));
  await page.getByRole('button', { name: 'BB', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'BB', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.match(await page.locator('.hero-seat .seat-info strong').innerText(), /100 BB/);
  await page.getByRole('button', { name: 'Chips', exact: true }).click();
  await page.getByRole('button', { name: 'Pot', exact: true }).click();
  assert.equal(await page.getByLabel('Raise to chips', { exact: true }).inputValue(), '70');
  await page.getByRole('button', { name: 'Pause table', exact: true }).click();
  assert.equal(await page.getByRole('button', { name: 'Fold', exact: true }).isDisabled(), true);
  await page.getByRole('button', { name: 'Resume table', exact: true }).click();
  await page.getByRole('button', { name: 'How to play', exact: true }).click();
  await page.screenshot({ path: path.join(out, 'rules.png'), fullPage: true });
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog[open]').count(), 0);
  await page.getByLabel('Bot pace', { exact: true }).selectOption('350');

  let completed = 0, moves = 0;
  const deadline = Date.now() + 120000;
  while (completed < 4 && moves < 150 && Date.now() < deadline) {
    if (await page.getByRole('button', { name: 'Deal next hand', exact: true }).count()) {
      completed++;
      await page.screenshot({ path: path.join(out, `showdown-${completed}.png`), fullPage: true });
      if (completed === 1) {
        await page.getByRole('tab', { name: /History/ }).click();
        await page.locator('.history-row').first().click();
        await page.screenshot({ path: path.join(out, 'hand-history.png'), fullPage: true });
        await page.getByRole('button', { name: 'Close dialog' }).click();
        await page.getByRole('tab', { name: 'Activity', exact: true }).click();
      }
      if (completed < 4) await page.getByRole('button', { name: 'Deal next hand', exact: true }).click();
    } else if (await page.getByRole('button', { name: 'Start fresh', exact: true }).count()) {
      completed++;
      break;
    } else if (await page.locator('.call-button:enabled').count()) {
      if (moves === 0) await page.locator('.raise-button').click();
      else if (completed === 2) await page.locator('.fold-button').click();
      else await page.locator('.call-button').click();
      moves++;
    } else await page.waitForTimeout(180);
    assert.equal(await page.locator('.error-message').count(), 0);
  }
  assert.ok(completed > 0, 'Completed at least one real hand');
  await page.getByRole('button', { name: 'My session', exact: true }).click();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download hand history', exact: true }).click();
  const download = await downloadEvent;
  await download.saveAs(path.join(out, 'tested-hand-history.json'));
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('button', { name: 'Table settings', exact: true }).click();
  await page.getByLabel('Players at the table').selectOption('2');
  await page.getByLabel('Starting chips').selectOption('1000');
  await page.getByLabel('Blinds', { exact: true }).selectOption('10');
  await page.screenshot({ path: path.join(out, 'settings.png'), fullPage: true });
  await page.getByRole('button', { name: 'Start new session', exact: true }).click();
  assert.equal(await page.locator('.seat').count(), 3);
  await page.getByRole('button', { name: 'Table settings', exact: true }).click();
  await page.getByLabel('Players at the table').selectOption('5');
  await page.getByLabel('Starting chips').selectOption('2000');
  await page.getByLabel('Blinds', { exact: true }).selectOption('20');
  await page.getByRole('button', { name: 'Start new session', exact: true }).click();

  const widths = [1440, 1024, 820, 600, 390, 360];
  for (const width of widths) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 900 });
    await page.screenshot({ path: path.join(out, `responsive-${width}.png`), fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert.equal(overflow, false, `No horizontal overflow at ${width}px`);
    const buttons = await page.locator('.action-buttons button').all();
    for (const button of buttons) {
      const box = await button.boundingBox();
      assert.ok(box.x >= 0 && box.x + box.width <= width + 1, 'Primary actions stay inside viewport');
    }
  }
  await page.getByRole('button', { name: 'BB', exact: true }).click();
  await page.getByRole('button', { name: 'Table settings', exact: true }).click();
  await page.screenshot({ path: path.join(out, 'mobile-settings.png'), fullPage: true });
  await page.keyboard.press('Escape');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.getByRole('button', { name: 'BB', exact: true }).getAttribute('aria-pressed'), 'true');
  const result = { completed, moves, widths, errors, failures };
  fs.writeFileSync(path.join(out, 'browser-results.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result));
  await browser.close();
  if (errors.length) process.exitCode = 1;
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
