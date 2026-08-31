import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the security intelligence portal", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Vision Intelligence｜全球安防市場情報<\/title>/i);
  assert.match(html, /全球安防市場情報中心/);
  assert.match(html, /本週重點/);
  assert.match(html, /市場分析報告/);
  assert.match(html, /情報資料庫/);
  assert.match(html, /W36/);
  assert.match(html, /資料與分析截至 08\.31/);
  assert.match(html, /Texas 將 Flock 爭議升高到州政府資金限制/);
  assert.match(html, /Boston 停止 Flock 後仍測試 Axon 與 Motorola ALPR/);
  assert.match(html, /Boston 以 Motorola Solutions 與 BRINC 啟動 DFR 試辦/);
  assert.match(html, /美國與法國同步擴大 Drone 與演算法影像的制度空間/);
  assert.match(html, /多廠商 DFR/);
  assert.match(html, /Language/);
  assert.doesNotMatch(html, /codex-preview|Building your site|Your site is taking shape/i);
});

test("renders the requested market-report visual structure", async () => {
  const response = await render();
  const html = await response.text();

  assert.match(html, /class="site-header"/);
  assert.match(html, /class="page-intro"/);
  assert.match(html, /class="signal-grid two"/);
  assert.match(html, /INTERNAL/);
  assert.match(html, /中文/);
  assert.match(html, />EN</);
  assert.doesNotMatch(html, /INDEXED|DAILY VERIFIED|WEEKLY VERIFIED|已複核訊號/);
});

test("includes verified Europe and Middle East regional records", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /region: "Europe-DE"/);
  assert.match(source, /region: "Europe-FR"/);
  assert.match(source, /region: "Middle East"/);
  assert.match(source, /法國憲兵破獲監獄無人機運毒網/);
  assert.match(source, /阿布達比完成第二次自主巡邏船實地試驗/);
  assert.match(source, /柏林規劃在 Kottbusser Tor/);
  assert.match(source, /Texas 州長要求州機關暫停以州資金採購 Flock 攝影機/);
  assert.match(source, /Boston Police 啟動 Motorola Solutions 與 BRINC 的 DFR 試辦/);
  assert.match(source, /FAA 啟動 BEYOND Phase 2/);
  assert.match(source, /value: "未定案"/);
  assert.match(source, /value: "導入中"/);
  assert.match(source, /value: "已運作"/);
  assert.match(source, /value: "研究"/);
  assert.match(source, /value: "安全事件"/);
  assert.match(source, /className="intel-title-link"/);
  assert.doesNotMatch(source, /<Status>/);
});
