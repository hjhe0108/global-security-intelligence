"use client";

import { useMemo, useState } from "react";

type View = "weekly" | "report" | "database";
type IntelStatus = "INDEXED" | "DAILY VERIFIED" | "WEEKLY VERIFIED" | "PENDING" | "EXCLUDED";

const navItems: { id: View; label: string; eyebrow: string }[] = [
  { id: "weekly", label: "本週重點", eyebrow: "3 MIN READ" },
  { id: "report", label: "市場分析報告", eyebrow: "FOR DECISION MAKERS" },
  { id: "database", label: "情報資料庫", eyebrow: "30 DAY WINDOW" },
];

const intelligence: Array<{ date: string; region: string; company: string; technology: string; title: string; source: string; url: string; status: IntelStatus; relevance: string }> = [
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", title: "Flock 宣布將 LPR 建議資料刪除期改為 7 天", source: "Flock CEO／Fox Business · 原始來源已複核", url: "https://www.youtube.com/watch?v=3jUw590ltig", status: "DAILY VERIFIED", relevance: "核心" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", title: "警界批評 7 天保存期不足以支援長期與跨區案件", source: "LinkedIn · IPVM Brief", url: "https://www.linkedin.com/feed/update/urn:li:activity:7493743726108798976", status: "PENDING", relevance: "核心" },
  { date: "08/14", region: "US", company: "Axon", technology: "Body-worn camera", title: "ICE 7 月向 Axon 採購 3,090 萬美元 BWC，部署持續進行", source: "Associated Press · 新 Brief／較早事件 · 原始來源已複核", url: "https://abc7ny.com/post/ice-will-release-body-camera-video-when-seen-agencys-best-interests-policy-says/19640591/", status: "DAILY VERIFIED", relevance: "核心" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", title: "融合中心監測反 Flock 社群活動（原始文件待查）", source: "404 Media · IPVM Brief · 原始來源待查", url: "https://www.404media.co/the-government-is-monitoring-anti-flock-tiktok-and-instagram-accounts/", status: "PENDING", relevance: "核心" },
  { date: "08/14", region: "US", company: "—", technology: "School security", title: "Wichita 校園安全補助案（原始來源待查）", source: "KWCH／KAKE · IPVM Brief · 原始來源待查", url: "https://www.kwch.com/2026/08/12/school-security-technology-raises-surveillance-racial-bias-concerns-wichita-city-council-meeting/", status: "PENDING", relevance: "核心" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", title: "紐時晨報以「監控天羅地網」描述 Flock 攝影機網路", source: "The New York Times · IPVM Brief", url: "https://www.nytimes.com/2026/08/10/briefing/flock-cameras.html", status: "INDEXED", relevance: "核心" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "Video surveillance", title: "Flock 說明固定影像攝影機並不等同 LPR", source: "Flock Safety Blog · IPVM Brief", url: "https://www.flocksafety.com/blog/flock-lpr-vs-fixed-video-same-camera-body-two-different-jobs", status: "INDEXED", relevance: "相鄰" },
  { date: "08/14", region: "US", company: "—", technology: "ALPR / LPR", title: "犯罪學者主張：歷史 LPR 搜尋應採令狀，而非僅縮短保存期", source: "Andrew Wheeler · IPVM Brief", url: "https://andrewpwheeler.com/2026/08/12/license-plate-reader-searches-should-require-a-warrant/", status: "INDEXED", relevance: "相鄰" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", title: "Flock CEO 將部分公眾疑慮歸因於對地方警察的不信任", source: "Puck · IPVM Brief", url: "https://puck.news/flock-safetys-ceo-on-crime-privacy-and-backlash/", status: "INDEXED", relevance: "核心" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", title: "Flock CEO 表示安全與隱私不應被視為二選一", source: "USA Today · IPVM Brief", url: "https://www.usatoday.com/story/news/nation/2026/08/13/flock-cameras-update-after-police-abuse-scandals/91272776007/", status: "INDEXED", relevance: "核心" },
];

function Status({ children }: { children: IntelStatus }) {
  const tone = children.includes("VERIFIED") ? "verified" : children === "INDEXED" ? "indexed" : children === "PENDING" ? "pending" : "excluded";
  return <span className={`status status-${tone}`}><span />{children}</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("weekly");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("全部地區");
  const [status, setStatus] = useState("全部狀態");
  const [reportVersion, setReportVersion] = useState("本週持續更新版");

  const filtered = useMemo(() => intelligence.filter((item) => {
    const matchesQuery = `${item.title} ${item.company} ${item.technology}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (region === "全部地區" || item.region === region) && (status === "全部狀態" || item.status === status);
  }), [query, region, status]);

  const go = (next: View) => {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return <div className="site-shell">
    <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
      <div className="brand" onClick={() => go("weekly")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && go("weekly")}>
        <div className="brand-mark">V</div><div><strong>VISION INTEL</strong><small>Global Security Briefing</small></div>
      </div>
      <nav aria-label="主要導覽">{navItems.map((item, index) => <button key={item.id} onClick={() => go(item.id)} className={view === item.id ? "active" : ""}><span className="nav-index">0{index + 1}</span><span><strong>{item.label}</strong><small>{item.eyebrow}</small></span></button>)}</nav>
      <div className="sidebar-note"><span className="pulse" /><div><strong>IPVM 同步完成</strong><small>資料基準時間 08/14 14:50</small></div></div>
      <div className="sidebar-footer">內部閱讀版 · 無需 GPT 登入</div>
    </aside>

    <button className="mobile-menu" aria-label="開啟選單" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
    {menuOpen && <button className="backdrop" aria-label="關閉選單" onClick={() => setMenuOpen(false)} />}

    <main>
      <header className="topbar"><div><span className="live-dot" /> Asia / Taipei <b>·</b> 2026.08.14 FRI</div><div className="preview-flag">LIVE INTELLIGENCE</div></header>
      {view === "weekly" && <WeeklyView onOpenReport={() => go("report")} />}
      {view === "report" && <ReportView version={reportVersion} setVersion={setReportVersion} />}
      {view === "database" && <DatabaseView query={query} setQuery={setQuery} region={region} setRegion={setRegion} status={status} setStatus={setStatus} filtered={filtered} />}
      <footer><span>VISION INTELLIGENCE · INTERNAL BRIEFING</span><span>事實與分析判斷分開呈現 · 重大結論可追溯</span></footer>
    </main>
  </div>;
}

function PageIntro({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description: string }) {
  return <div className="page-intro"><div className="section-number">{number}</div><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div></div>;
}

function WeeklyView({ onOpenReport }: { onOpenReport: () => void }) {
  return <div className="view weekly-view">
    <PageIntro number="01" eyebrow="THIS WEEK · 3 MIN READ" title="本週重點" description="讓每位同事快速掌握已複核的市場變化、重要性，以及可能影響的工作。" />

    <section className="hero-statement"><div className="hero-rule" /><div className="hero-copy"><span className="eyebrow">本週一句話</span><h2>已複核訊號顯示：<span>資料治理正推動 LPR 政策調整，也伴隨聯邦 BWC 的快速部署。</span></h2><p>分析判斷｜以 2 項 DAILY VERIFIED 情報為基礎</p></div><div className="hero-week"><strong>W33</strong><small>2026</small></div></section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">SIGNALS</span><h2>本次已複核重要變化</h2></div><span className="count">02</span></div>
      <div className="signal-grid two">
        <article className="signal-card featured"><div className="card-top"><span>01 / LPR 治理</span><Status>DAILY VERIFIED</Status></div><h3>Flock 宣布建議資料刪除期改為 7 天</h3><p>Flock CEO 的原始貼文明確表示，建議刪除期改為 7 天；調查需要保存時將引入 Evidence Mode。這不是對所有客戶強制套用的單一政策。</p><div className="why"><span>WHY IT MATTERS</span>供應商正把刪除預設與案件保全機制一起產品化，治理設定將影響採購與實務工作流。</div><a href="https://www.linkedin.com/feed/update/urn:li:activity:7493743726108798976" target="_blank" rel="noreferrer">原始來源 <span>↗</span></a></article>
        <article className="signal-card dark"><div className="card-top"><span>02 / BWC 部署</span><Status>DAILY VERIFIED</Status></div><h3>ICE 7 月向 Axon 採購 3,090 萬美元 BWC</h3><p>AP 報導顯示，超過半數外勤人員已取得設備；其餘外勤人員預計 9 月底前收到設備，部署與訓練仍在進行。</p><div className="why"><span>WHY IT MATTERS</span>問責壓力可推動大規模設備部署，但採購、配發與影像發布政策必須分開判讀。</div><a href="https://abc7ny.com/post/ice-will-release-body-camera-video-when-seen-agencys-best-interests-policy-says/19640591/" target="_blank" rel="noreferrer">原始來源 <span>↗</span></a></article>
      </div>
    </section>

    <section className="impact-section"><div className="section-heading"><div><span className="eyebrow">POSSIBLE IMPACT</span><h2>對公司的可能影響</h2></div></div><div className="impact-grid">
      <div><span className="impact-icon">P</span><small>產品與方案</small><h3>保存期、證據鎖定與稽核需成為可配置能力</h3><p>LPR 與 BWC 方案可能需要把刪除政策、案件保全、查詢權限與稽核軌跡整體呈現。</p></div>
      <div><span className="impact-icon">B</span><small>業務與標案</small><h3>治理條件會直接影響採購與競爭定位</h3><p>大型機關可因外部事件加速採購；同時，資料處理與發布政策將影響買方評估。</p></div>
      <div><span className="impact-icon">L</span><small>法務與營運</small><h3>「保存多久」不是唯一的隱私答案</h3><p>令狀、存取控制、外部稽核與影像公開政策，可能比單一保存天數更具決定性。</p></div>
    </div></section>

    <section className="numbers-section"><div><span className="eyebrow">MARKET NUMBERS</span><h2>本週關鍵市場數字</h2><p>僅呈現具有可追溯來源、且對市場判斷有意義的數字。</p></div><div className="number-grid"><div><strong>7 天</strong><span>Flock 建議資料刪除期</span></div><div><strong>$30.9M</strong><span>ICE 7 月 Axon 設備採購</span></div><div><strong>&gt;50%</strong><span>已取得 BWC 的 ICE 外勤</span></div></div></section>

    <div className="report-cta"><div><span className="eyebrow">GO DEEPER</span><h2>需要完整決策脈絡？</h2><p>查看市場訊號演變、SWOT、管理者決策摘要與資料限制。</p></div><button onClick={onOpenReport}>閱讀市場分析 <span>→</span></button></div>
    <p className="data-note" id="data-note">更新自已登入的 IPVM Briefs；網站僅保存工作必要欄位、摘要與原始連結，不保存或重製 IPVM 付費全文。</p>
  </div>;
}

function ReportView({ version, setVersion }: { version: string; setVersion: (value: string) => void }) {
  const live = version.includes("持續");
  return <div className="view report-view">
    <PageIntro number="02" eyebrow="MARKET ANALYSIS · DECISION VIEW" title="市場分析報告" description="將完成複核的市場訊號，轉化為管理判斷、決策摘要與具體下一步。" />
    <div className="report-toolbar"><div><span className="eyebrow">REPORT VERSION</span><select value={version} onChange={(e) => setVersion(e.target.value)} aria-label="報告版本"><option>本週持續更新版</option><option>上週正式封存版</option><option>2026 W31 正式封存版</option></select></div><div className="report-state"><span className="pulse" /><div><strong>{live ? "持續更新" : "正式封存"}</strong><small>{live ? "使用 DAILY VERIFIED 情報" : "使用 WEEKLY VERIFIED 情報"}</small></div></div></div>

    <section className="conclusion"><span className="eyebrow">EXECUTIVE CONCLUSION</span><h2>本期分析結論</h2><div className="conclusion-list">
      <div><span>01</span><p><strong>LPR 治理已進入產品設計核心。</strong>Flock 將建議刪除期改為 7 天，並以 Evidence Mode 支援案件保全；這是建議設定，不代表所有客戶已被強制套用。</p></div>
      <div><span>02</span><p><strong>BWC 問責壓力可轉化為快速、大型採購。</strong>ICE 案顯示，設備採購、實際配發與影像發布政策可能不同步。</p></div>
      <div><span>03</span><p><strong>新 Brief 不等於新事件。</strong>ICE 採購發生於 7 月，本次 IPVM 發布反映新的政策與媒體關注訊號，不應重複計為 8 月新訂單。</p></div>
    </div></section>

    <section className="signal-evolution"><div className="section-heading"><div><span className="eyebrow">SIGNAL EVOLUTION</span><h2>市場訊號演變</h2></div></div><div className="flow"><div><small>SIGNAL 01</small><strong>隱私與濫用疑慮升高</strong><span>媒體、社群與地方政府壓力擴大</span></div><b>→</b><div><small>SIGNAL 02</small><strong>供應商調整保存政策</strong><span>7 天預設與案件證據保全並行</span></div><b>→</b><div className="flow-accent"><small>IMPLICATION</small><strong>治理成為競爭條件</strong><span>設定、權限、稽核與工作流須一起回答</span></div></div><p className="assessment"><span>ANALYST ASSESSMENT</span> 對 BU 而言，產品價值主張應同時覆蓋設備效能、證據保全與可稽核治理，而非把資料政策留到法務附件。</p></section>

    <section><div className="section-heading"><div><span className="eyebrow">DECISION SUMMARY</span><h2>管理者決策摘要</h2></div></div><div className="decision-table" role="table" aria-label="管理者決策摘要">
      <div className="table-head" role="row"><span>優先級</span><span>建議行動</span><span>負責單位</span><span>時程</span><span>下一決策點</span></div>
      <div role="row"><span><b className="priority high">HIGH</b></span><span>盤點 LPR／BWC 的保存期、Evidence Hold、權限與稽核能力</span><span>產品 × 法務</span><span>2 週</span><span>是否納入方案基線</span></div>
      <div role="row"><span><b className="priority high">HIGH</b></span><span>建立大型機關 BWC 緊急部署的完整交付清單</span><span>業務 × 產品</span><span>3 週</span><span>部署與發布政策如何拆分</span></div>
      <div role="row"><span><b className="priority medium">MED</b></span><span>將「Brief 發布日」與「底層事件日」分開納入情報欄位</span><span>情報 × 業務</span><span>1 週</span><span>避免重複計算訂單</span></div>
    </div></section>

    <section className="swot-section"><div className="section-heading"><div><span className="eyebrow">STRATEGIC VIEW</span><h2>SWOT</h2></div><span className="sample-label">本週分析</span></div><div className="swot-grid">
      <div className="swot strength"><span>S</span><div><small>STRENGTHS</small><h3>可立即利用的能力</h3><ul><li>既有影像設備與垂直應用經驗</li><li>可整合硬體與後端工作流</li></ul></div></div>
      <div className="swot weakness"><span>W</span><div><small>WEAKNESSES</small><h3>需要補強的缺口</h3><ul><li>治理能力尚未形成清楚方案基線</li><li>區域資料政策證據需持續累積</li></ul></div></div>
      <div className="swot opportunity"><span>O</span><div><small>OPPORTUNITIES</small><h3>可轉化的外部變化</h3><ul><li>BWC 問責需求推動大規模部署</li><li>治理設計可形成差異化價值</li></ul></div></div>
      <div className="swot threat"><span>T</span><div><small>THREATS</small><h3>影響市場進入的風險</h3><ul><li>隱私爭議可能快速損害品牌信任</li><li>政策與客戶工作流需求可能衝突</li></ul></div></div>
    </div></section>

    <section className="coverage"><div><span className="eyebrow">COVERAGE & LIMITATIONS</span><h2>資料涵蓋與限制</h2></div><div className="coverage-grid"><div><small>報告期間</small><strong>08/08 — 08/14</strong></div><div><small>IPVM 同步</small><strong>成功 · 14:50</strong></div><div><small>複核狀態</small><strong>2 VERIFIED · 3 PENDING</strong></div><div><small>版本</small><strong>{version}</strong></div></div><p>本次同步讀取 IPVM 最新頁面可見的 20 筆項目，僅納入 Briefs；同一 Flock 保存期事件已合併判讀。Fusion centers 與 Wichita 來源尚待核實，因此不進入本期結論；ABC7 鏡像頁資訊由 AP 原稿交叉確認。</p></section>
  </div>;
}

type DatabaseProps = { query: string; setQuery: (value: string) => void; region: string; setRegion: (value: string) => void; status: string; setStatus: (value: string) => void; filtered: typeof intelligence };

function DatabaseView({ query, setQuery, region, setRegion, status, setStatus, filtered }: DatabaseProps) {
  return <div className="view database-view">
    <PageIntro number="03" eyebrow="INTELLIGENCE DATABASE · 30 DAYS" title="情報資料庫" description="保存可追溯且可篩選的市場情報；索引完整度與分析可信度分開管理。" />
    <div className="method-stats"><div><small>掃描項目</small><strong>20</strong><span>IPVM 最新頁面</span></div><div><small>事件合併</small><strong>04</strong><span>同事件多 Brief</span></div><div><small>新增索引</small><strong>10</strong><span>本次同步</span></div><div><small>PENDING</small><strong>03</strong><span>原始來源待查</span></div><div><small>DAILY VERIFIED</small><strong>02</strong><span>獨立複核完成</span></div></div>
    <section className="database-panel"><div className="filters">
      <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋標題、公司或技術…" /></label>
      <label><span>地區</span><select value={region} onChange={(e) => setRegion(e.target.value)}><option>全部地區</option><option>US</option><option>Canada</option><option>Europe-DE</option><option>Europe-FR</option><option>Middle East</option><option>Global</option></select></label>
      <label><span>狀態</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option>全部狀態</option><option>INDEXED</option><option>DAILY VERIFIED</option><option>WEEKLY VERIFIED</option><option>PENDING</option><option>EXCLUDED</option></select></label>
    </div><div className="results-meta"><span>顯示 <strong>{filtered.length}</strong> 筆情報</span><span>預設範圍：最近 30 天</span></div><div className="intel-list">
      {filtered.map((item) => <article key={`${item.date}-${item.title}`}><div className="intel-date"><strong>{item.date}</strong><small>2026</small></div><div className="intel-content"><div className="intel-meta"><span>{item.region}</span><span>{item.technology}</span><span className={`relevance relevance-${item.relevance}`}>{item.relevance}</span></div><h3>{item.title}</h3><p>{item.source}</p></div><div className="intel-company"><small>COMPANY</small><strong>{item.company}</strong></div><Status>{item.status}</Status><a className="row-action" href={item.url} target="_blank" rel="noreferrer" aria-label={`開啟 ${item.title}`}>↗</a></article>)}
      {filtered.length === 0 && <div className="empty"><strong>找不到符合條件的情報</strong><span>請調整關鍵字或篩選條件。</span></div>}
    </div></section>
    <div className="database-note"><span>i</span><p><strong>關於 IPVM 資料</strong>網站只保存標題、日期、來源、原始連結、分類、摘要與複核狀態，不保存 IPVM 付費全文。最新 Brief 不等同底層事件發生於今日。</p></div>
  </div>;
}
