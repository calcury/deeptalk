const { chromium } = require('C:/Users/18106/.workbuddy/plugins/cache/codebuddy-plugins-official/playwright-cli/0.1.0/node_modules/playwright');
(async () => {
  const br = await chromium.launch({ channel: 'msedge', headless: true });
  const ctx = await br.newContext();
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));

  for (const path of ['', 'about', 'terms', 'privacy', 'about/', 'terms/', 'privacy/']) {
    await p.goto('http://localhost:4173/deeptalk/' + path, { waitUntil: 'load' });
    await p.waitForTimeout(250);
    const info = await p.evaluate(async () => {
      const link = document.querySelector('link[rel="icon"]');
      const href = link ? link.href : null;
      let status = 'n/a';
      if (href) { try { status = (await fetch(href)).status; } catch (e) { status = 'ERR'; } }
      return { href, status, title: document.title };
    });
    console.log('/deeptalk/' + path.padEnd(9) + ' icon=' + info.status + ' ' + info.href.replace('http://localhost:4173', '') + ' | "' + info.title + '"');
  }
  console.log('\nERRORS: ' + (errs.length ? JSON.stringify(errs) : 'none'));
  await br.close();
})();
