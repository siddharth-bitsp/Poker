const { chromium } = require('C:/Users/sid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const sharp = require('C:/Users/sid/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const fs = require('node:fs');
const path = require('node:path');
let browser;
(async () => {
  browser = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1356, height: 819 }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'qa/final-desktop.png', fullPage: true, animations: 'disabled' });
  await page.getByLabel('Bot pace', { exact: true }).selectOption('350');
  let flop = false;
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    const label = await page.locator('.street-label').innerText();
    if (label.startsWith('FLOP') && await page.locator('.call-button:enabled').count()) { flop = true; break; }
    if (await page.locator('.call-button:enabled').count()) await page.locator('.call-button').click();
    else if (await page.getByRole('button', { name: 'Deal next hand', exact: true }).count()) await page.getByRole('button', { name: 'Deal next hand', exact: true }).click();
    else if (await page.getByRole('button', { name: 'Start fresh', exact: true }).count()) { await page.reload(); await page.getByLabel('Bot pace').selectOption('350'); }
    else await page.waitForTimeout(100);
  }
  if (!flop) throw new Error('Could not reach a human-action flop');
  await page.getByLabel('Bot pace', { exact: true }).selectOption('1100');
  await page.screenshot({ path: 'qa/final-flop.png', fullPage: true, animations: 'disabled' });
  const box = await page.locator('.poker-app').boundingBox();
  const source = 'C:/Users/sid/AppData/Local/Temp/codex-clipboard-0a12a8f5-cf3e-4f1b-b9b1-08492f64a401.png';
  const reference = await sharp(source).extract({ left: 136, top: 137, width: 1105, height: 622 }).resize({ width: 1105 }).png().toBuffer();
  const implementation = await sharp('qa/final-flop.png').extract({ left: Math.floor(box.x), top: Math.floor(box.y), width: Math.floor(box.width), height: Math.floor(box.height) }).resize({ width: 1105 }).png().toBuffer();
  const meta = await sharp(implementation).metadata();
  await sharp({ create: { width: 1105 * 2 + 20, height: Math.max(622, meta.height), channels: 3, background: '#10121a' } }).composite([{ input: reference, left: 0, top: 0 }, { input: implementation, left: 1125, top: 0 }]).png().toFile('qa/comparison-full.png');
  const board = await page.locator('.community-area').boundingBox();
  const actions = await page.locator('.action-area').boundingBox();
  const sourceBoard = await sharp(source).extract({ left: 540, top: 335, width: 290, height: 116 }).resize(580, 232).png().toBuffer();
  const implBoard = await sharp('qa/final-flop.png').extract({ left: Math.floor(board.x - 12), top: Math.floor(board.y - 5), width: Math.floor(board.width + 24), height: Math.floor(board.height + 10) }).resize({ width: 580 }).png().toBuffer();
  const ibMeta = await sharp(implBoard).metadata();
  await sharp({ create: { width: 1180, height: Math.max(232, ibMeta.height), channels: 3, background: '#10121a' } }).composite([{ input: sourceBoard, left: 0, top: 0 }, { input: implBoard, left: 600, top: 0 }]).png().toFile('qa/comparison-board.png');
  const sourceAction = await sharp(source).extract({ left: 420, top: 630, width: 560, height: 120 }).resize({ width: 560 }).png().toBuffer();
  const implAction = await sharp('qa/final-flop.png').extract({ left: Math.floor(actions.x), top: Math.floor(actions.y), width: Math.floor(actions.width), height: Math.floor(actions.height) }).resize({ width: 560 }).png().toBuffer();
  const iaMeta = await sharp(implAction).metadata();
  await sharp({ create: { width: 1140, height: Math.max(120, iaMeta.height), channels: 3, background: '#10121a' } }).composite([{ input: sourceAction, left: 0, top: 0 }, { input: implAction, left: 580, top: 0 }]).png().toFile('qa/comparison-actions.png');
  for (const width of [1440, 1024, 820, 600, 390, 360]) {
    await page.setViewportSize({ width, height: width < 760 ? 844 : 900 });
    await page.screenshot({ path: `qa/final-${width}.png`, fullPage: true, animations: 'disabled' });
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error(`Overflow at ${width}`);
  }
  const metrics = { viewport: { width: 1356, height: 819, deviceScaleFactor: 1 }, source: { width: 1356, height: 819 }, applicationBox: box, comparisonWidth: 1105, state: 'Flop, human action', errors };
  fs.writeFileSync('qa/final-capture.json', JSON.stringify(metrics, null, 2));
  console.log(JSON.stringify(metrics));
  await browser.close();
  if (errors.length) process.exitCode = 1;
})().catch(async e => { console.error(e); await browser?.close(); process.exitCode = 1; });
