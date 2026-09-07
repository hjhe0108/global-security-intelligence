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
  assert.match(html, /W37/);
  assert.match(html, /資料與分析截至 09\.07/);
  assert.match(html, /Flock 成為美國跨黨派選舉議題/);
  assert.match(html, /Flock 以 Traffic Analytics 的資料隔離回應治理疑慮/);
  assert.match(html, /Fairfax County 公布 LPR 警示銜接無人機的實際案例/);
  assert.match(html, /Ventura County 的 Axon DFR 長約仍是平台化採購指標/);
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
  assert.match(source, /Florida 撤銷州級道路用地內所有 ALPR 設備許可/);
  assert.match(source, /Milwaukee 保留 Flock，但改為主管專用/);
  assert.match(source, /Shively 警局承認 Flock 稽核紀錄有重大缺口/);
  assert.match(source, /Rekor 提出供應商中立的 ALPR 責任標準/);
  assert.match(source, /Pennsylvania 參議員提出跨黨派 ALPR 問責架構/);
  assert.match(source, /美國眾議員 Boebert 要求以聯邦資金限制/);
  assert.match(source, /FCC 維持 9 月 2 日外國製『軍規』無人機限制提案/);
  assert.match(source, /Lancashire Police 將於 Blackpool 活動首度部署即時人臉辨識/);
  assert.match(source, /Saudi Public Security 在 LEAP 2026 展示智慧無人機/);
  assert.match(source, /Palm Bay 暫停 Flock ALPR 系統/);
  assert.match(source, /Ventura County 核准 691\.5 萬美元 Axon DFR 合約/);
  assert.match(source, /Riverside County 核准 3,269 萬美元 Axon Body 4 合約/);
  assert.match(source, /Pueblo Police 以 Genetec 平台整合 70 部 Cloudrunner/);
  assert.match(source, /德國政府將萊比錫機場爆裂物無人機事件歸因於俄羅斯混合行動/);
  assert.match(source, /Flock 說明 Traffic Analytics 僅保留彙總道路統計/);
  assert.match(source, /Flock ALPR 成為美國跨黨派選舉議題/);
  assert.match(source, /Fairfax County 公布三起以 Flock LPR 即時警示銜接無人機/);
  assert.match(source, /\["資料庫總數", "58"/);
  assert.match(source, /\["核心情報", "51"/);
  assert.match(source, /\["Drone／DFR", "23"/);
  assert.match(source, /\["本次新增", "03"/);
  assert.match(source, /value: "未定案"/);
  assert.match(source, /value: "導入中"/);
  assert.match(source, /value: "已運作"/);
  assert.match(source, /value: "研究"/);
  assert.match(source, /value: "安全事件"/);
  assert.match(source, /className="intel-title-link"/);
  assert.doesNotMatch(source, /<Status>/);
});

test("report version selector loads distinct archived analysis", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /value="last"/);
  assert.match(source, /value="w35"/);
  assert.match(source, /平台黏著正在主導大型 BWC 續約/);
  assert.match(source, /反 Flock 不等於反 ALPR/);
  assert.match(source, /Platform lock-in is shaping major BWC renewals/);
  assert.match(source, /Anti-Flock does not equal anti-ALPR/);
  assert.match(source, /aria-controls="report-content"/);
  assert.doesNotMatch(source, /value="w31"/);
});

test("intelligence database supports 30/60-day range and incremental loading", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /type RangeDays = 30 \| 60/);
  assert.match(source, /useState<RangeDays>\(30\)/);
  assert.match(source, /rangeDays=\{rangeDays\}/);
  assert.match(source, /<option value=\{30\}>/);
  assert.match(source, /<option value=\{60\}>/);
  assert.match(source, /filtered\.slice\(0, visibleCount\)/);
  assert.match(source, /setVisibleCount\(\(count\) => count \+ 20\)/);
  assert.match(source, /60 DAY WINDOW/);
  assert.match(source, /載入更多/);
  assert.match(source, /Load more/);
});

test("uses explicit cross-region and other-Europe labels", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /value: "Europe-Other", zh: "歐洲／其他地區"/);
  assert.match(source, /value: "Global", zh: "跨區／全球性"/);
  assert.match(source, /region: "Europe-Other"[\s\S]*Cleveland Police/);
  assert.match(source, /getRegionLabel\(item\.region, lang\)/);
  assert.doesNotMatch(source, /region: "Global"[\s\S]{0,180}Cleveland Police/);
});
