"use client";

import { useMemo, useState } from "react";

type View = "weekly" | "report" | "database";

const navItems: { id: View; label: string; eyebrow: string }[] = [
  { id: "weekly", label: "本週重點", eyebrow: "3 MIN READ" },
  { id: "report", label: "市場分析報告", eyebrow: "FOR DECISION MAKERS" },
  { id: "database", label: "情報資料庫", eyebrow: "30 DAY WINDOW" },
];

const intelligence = [
  { date: "08/14", region: "US", company: "Axon", technology: "Digital evidence", title: "公共安全採購開始將證據治理納入整體平台評估", source: "示範資料 · 待接原始來源", status: "DAILY VERIFIED", relevance: "核心" },
  { date: "08/13", region: "Europe-DE", company: "—", technology: "AI surveillance", title: "影像分析專案的透明度與稽核要求受到更多關注", source: "示範資料 · 待接原始來源", status: "INDEXED", relevance: "相鄰" },
  { date: "08/13", region: "Canada", company: "Motorola Solutions", technology: "BWC", title: "執法影像設備評估延伸至保留政策與跨系統整合", source: "示範資料 · 待接原始來源", status: "DAILY VERIFIED", relevance: "核心" },
  { date: "08/12", region: "Middle East", company: "Dedrone", technology: "Counter-drone", title: "大型場域持續評估反無人機監測與指揮整合", source: "示範資料 · 待接原始來源", status: "PENDING", relevance: "相鄰" },
  { date: "08/11", region: "Europe-FR", company: "Genetec", technology: "Video analytics", title: "城市安全專案強調影像平台的資料最小化設計", source: "示範資料 · 待接原始來源", status: "WEEKLY VERIFIED", relevance: "核心" },
  { date: "08/09", region: "Global", company: "Flock Safety", technology: "ALPR / LPR", title: "車牌辨識資料共享與保存期限成為治理焦點", source: "示範資料 · 待接原始來源", status: "EXCLUDED", relevance: "一般" },
];

function Status({ children }: { children: string }) {
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
    const matchesRegion = region === "全部地區" || item.region === region;
    const matchesStatus = status === "全部狀態" || item.status === status;
    return matchesQuery && matchesRegion && matchesStatus;
  }), [query, region, status]);

  const go = (next: View) => {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand" onClick={() => go("weekly")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && go("weekly")}>
          <div className="brand-mark">V</div>
          <div><strong>VISION INTEL</strong><small>Global Security Briefing</small></div>
        </div>

        <nav aria-label="主要導覽">
          {navItems.map((item, index) => (
            <button key={item.id} onClick={() => go(item.id)} className={view === item.id ? "active" : ""}>
              <span className="nav-index">0{index + 1}</span>
              <span><strong>{item.label}</strong><small>{item.eyebrow}</small></span>
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="pulse" />
          <div><strong>情報更新中</strong><small>資料基準時間 08/14 09:30</small></div>
        </div>
        <div className="sidebar-footer">內部閱讀版 · 無需 GPT 登入</div>
      </aside>

      <button className="mobile-menu" aria-label="開啟選單" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </button>
      {menuOpen && <button className="backdrop" aria-label="關閉選單" onClick={() => setMenuOpen(false)} />}

      <main>
        <header className="topbar">
          <div><span className="live-dot" /> Asia / Taipei <b>·</b> 2026.08.14 FRI</div>
          <div className="preview-flag">PREVIEW DATA</div>
        </header>

        {view === "weekly" && <WeeklyView onOpenReport={() => go("report")} />}
        {view === "report" && <ReportView version={reportVersion} setVersion={setReportVersion} />}
        {view === "database" && <DatabaseView query={query} setQuery={setQuery} region={region} setRegion={setRegion} status={status} setStatus={setStatus} filtered={filtered} />}

        <footer>
          <span>VISION INTELLIGENCE · INTERNAL BRIEFING</span>
          <span>事實與分析判斷分開呈現 · 重大結論可追溯</span>
        </footer>
      </main>
    </div>
  );
}

function PageIntro({ number, eyebrow, title, description }: { number: string; eyebrow: string; title: string; description: string }) {
  return <div className="page-intro">
    <div className="section-number">{number}</div>
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>
  </div>;
}

function WeeklyView({ onOpenReport }: { onOpenReport: () => void }) {
  return <div className="view weekly-view">
    <PageIntro number="01" eyebrow="THIS WEEK · 3 MIN READ" title="本週重點" description="讓每位同事快速掌握市場變化、重要性，以及可能影響的工作。" />

    <section className="hero-statement">
      <div className="hero-rule" />
      <div className="hero-copy">
        <span className="eyebrow">本週一句話</span>
        <h2>安防採購的競爭焦點，正從單一硬體規格移向<span>證據治理與跨系統工作流。</span></h2>
        <p>分析示例｜待正式 VERIFIED 情報接入後，由每週證據更新。</p>
      </div>
      <div className="hero-week"><strong>W33</strong><small>2026</small></div>
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">SIGNALS</span><h2>本週三項重要變化</h2></div><span className="count">03</span></div>
      <div className="signal-grid">
        <article className="signal-card featured">
          <div className="card-top"><span>01 / 工作流</span><Status>DAILY VERIFIED</Status></div>
          <h3>數位證據管理成為設備採購的核心評估項</h3>
          <p>示範情境顯示，買方不只比較攝影品質，也開始檢視上傳、保存、調閱與稽核流程。</p>
          <div className="why"><span>WHY IT MATTERS</span>產品規格與後端治理能力需要被放在同一套價值主張中。</div>
          <a href="#data-note">查看資料說明 <span>↗</span></a>
        </article>
        <article className="signal-card">
          <div className="card-top"><span>02 / 治理</span><Status>DAILY VERIFIED</Status></div>
          <h3>AI 影像分析的透明度要求持續上升</h3>
          <p>採購端更重視模型使用範圍、人工覆核、資料保留與可稽核性。</p>
          <div className="why"><span>WHY IT MATTERS</span>治理設計可能從加分題，轉為專案准入條件。</div>
          <a href="#data-note">查看資料說明 <span>↗</span></a>
        </article>
        <article className="signal-card dark">
          <div className="card-top"><span>03 / 整合</span><Status>INDEXED</Status></div>
          <h3>平台整合能力擴大競爭邊界</h3>
          <p>相鄰領域供應商正以軟體平台、資料互通與合作夥伴生態切入公共安全市場。</p>
          <div className="why"><span>WHY IT MATTERS</span>競爭對手不再只來自同類型硬體品牌。</div>
          <a href="#data-note">查看資料說明 <span>↗</span></a>
        </article>
      </div>
    </section>

    <section className="impact-section">
      <div className="section-heading"><div><span className="eyebrow">POSSIBLE IMPACT</span><h2>對公司的可能影響</h2></div></div>
      <div className="impact-grid">
        <div><span className="impact-icon">P</span><small>產品與方案</small><h3>從設備規格延伸到完整證據生命週期</h3><p>產品敘事可能需要更清楚涵蓋資料移轉、權限、稽核與保存。</p></div>
        <div><span className="impact-icon">B</span><small>業務與標案</small><h3>提案須更早回答整合與治理問題</h3><p>跨系統相容、導入責任與總持有成本可能成為前期關鍵題。</p></div>
        <div><span className="impact-icon">L</span><small>法務與營運</small><h3>區域政策差異影響專案設計</h3><p>資料保留、公開紀錄與 AI 使用規範可能需要因地區調整。</p></div>
      </div>
    </section>

    <section className="numbers-section">
      <div><span className="eyebrow">MARKET NUMBERS</span><h2>本週關鍵市場數字</h2><p>正式資料接入後，僅呈現有原始來源、且具市場意義的數字。</p></div>
      <div className="number-grid"><div><strong>48h</strong><span>每日情報發現窗</span></div><div><strong>3–5</strong><span>每日最高相關複核</span></div><div><strong>6</strong><span>核心監測地區</span></div></div>
    </section>

    <div className="report-cta">
      <div><span className="eyebrow">GO DEEPER</span><h2>需要完整決策脈絡？</h2><p>前往市場分析報告，查看訊號演變、SWOT、競爭態勢與建議行動。</p></div>
      <button onClick={onOpenReport}>閱讀市場分析 <span>→</span></button>
    </div>
    <p className="data-note" id="data-note">目前畫面內容為網站結構與視覺示範，未作為正式市場情報；上線後應以 VERIFIED 原始資料取代。</p>
  </div>;
}

function ReportView({ version, setVersion }: { version: string; setVersion: (value: string) => void }) {
  return <div className="view report-view">
    <PageIntro number="02" eyebrow="MARKET ANALYSIS · DECISION VIEW" title="市場分析報告" description="將已複核的市場訊號，轉化為管理判斷、決策摘要與具體下一步。" />
    <div className="report-toolbar">
      <div><span className="eyebrow">REPORT VERSION</span><select value={version} onChange={(e) => setVersion(e.target.value)} aria-label="報告版本"><option>本週持續更新版</option><option>上週正式封存版</option><option>2026 W31 正式封存版</option></select></div>
      <div className="report-state"><span className="pulse" /><div><strong>{version.includes("持續") ? "持續更新" : "正式封存"}</strong><small>{version.includes("持續") ? "使用 DAILY VERIFIED 情報" : "使用 WEEKLY VERIFIED 情報"}</small></div></div>
    </div>

    <section className="conclusion">
      <span className="eyebrow">EXECUTIVE CONCLUSION</span><h2>本期分析結論</h2>
      <div className="conclusion-list">
        <div><span>01</span><p><strong>平台價值正在超越單一設備。</strong>採購評估逐步延伸至證據治理、跨系統整合與長期營運成本。</p></div>
        <div><span>02</span><p><strong>治理能力將影響市場進入。</strong>AI 透明度、保留政策與可稽核性，可能成為專案設計的前置條件。</p></div>
        <div><span>03</span><p><strong>競爭邊界持續擴大。</strong>軟體平台與相鄰安防業者透過整合能力進入公共安全工作流。</p></div>
      </div>
    </section>

    <section className="signal-evolution">
      <div className="section-heading"><div><span className="eyebrow">SIGNAL EVOLUTION</span><h2>市場訊號演變</h2></div></div>
      <div className="flow">
        <div><small>SIGNAL 01</small><strong>大型設備採購</strong><span>規模化部署帶來後端需求</span></div><b>→</b>
        <div><small>SIGNAL 02</small><strong>治理要求擴大</strong><span>保存、稽核與權限成為條件</span></div><b>→</b>
        <div className="flow-accent"><small>IMPLICATION</small><strong>競爭基準改變</strong><span>硬體、軟體與服務必須整體回答</span></div>
      </div>
      <p className="assessment"><span>ANALYST ASSESSMENT</span> 若後續 VERIFIED 情報持續支持此方向，BU 的產品定位應更明確涵蓋工作流價值，而非僅以單點設備效能溝通。</p>
    </section>

    <section>
      <div className="section-heading"><div><span className="eyebrow">DECISION SUMMARY</span><h2>管理者決策摘要</h2></div></div>
      <div className="decision-table" role="table" aria-label="管理者決策摘要">
        <div className="table-head" role="row"><span>優先級</span><span>建議行動</span><span>負責單位</span><span>時程</span><span>下一決策點</span></div>
        <div role="row"><span><b className="priority high">HIGH</b></span><span>盤點標案所需的證據治理能力與現有缺口</span><span>產品 × 法務</span><span>2 週</span><span>是否納入下一版方案基線</span></div>
        <div role="row"><span><b className="priority medium">MED</b></span><span>建立區域資料保留與 AI 治理需求矩陣</span><span>法務 × 業務</span><span>4 週</span><span>優先支援市場排序</span></div>
        <div role="row"><span><b className="priority medium">MED</b></span><span>評估平台整合夥伴與 API 需求</span><span>策略 × 研發</span><span>6 週</span><span>自建或合作</span></div>
      </div>
    </section>

    <section className="swot-section">
      <div className="section-heading"><div><span className="eyebrow">STRATEGIC VIEW</span><h2>SWOT</h2></div><span className="sample-label">分析示例</span></div>
      <div className="swot-grid">
        <div className="swot strength"><span>S</span><div><small>STRENGTHS</small><h3>可立即利用的能力</h3><ul><li>既有影像設備與垂直市場經驗</li><li>彈性的硬體整合基礎</li></ul></div></div>
        <div className="swot weakness"><span>W</span><div><small>WEAKNESSES</small><h3>需要補強的缺口</h3><ul><li>跨區域治理敘事尚待系統化</li><li>工作流能力需更明確產品化</li></ul></div></div>
        <div className="swot opportunity"><span>O</span><div><small>OPPORTUNITIES</small><h3>可轉化的外部變化</h3><ul><li>設備汰換帶動平台整合需求</li><li>治理需求創造顧問型價值</li></ul></div></div>
        <div className="swot threat"><span>T</span><div><small>THREATS</small><h3>影響市場進入的風險</h3><ul><li>平台商綁定擴大轉換成本</li><li>法規差異增加交付複雜度</li></ul></div></div>
      </div>
    </section>

    <section className="coverage">
      <div><span className="eyebrow">COVERAGE & LIMITATIONS</span><h2>資料涵蓋與限制</h2></div>
      <div className="coverage-grid"><div><small>報告期間</small><strong>08/08 — 08/14</strong></div><div><small>IPVM 同步</small><strong>尚未接入</strong></div><div><small>複核狀態</small><strong>展示資料</strong></div><div><small>版本</small><strong>{version}</strong></div></div>
      <p>此版本用於確認網站資訊架構與閱讀體驗。正式發布前，需由情報流程寫入真實來源、完成獨立複核，並移除所有展示資料。</p>
    </section>
  </div>;
}

type DatabaseProps = {
  query: string; setQuery: (value: string) => void; region: string; setRegion: (value: string) => void;
  status: string; setStatus: (value: string) => void; filtered: typeof intelligence;
};

function DatabaseView({ query, setQuery, region, setRegion, status, setStatus, filtered }: DatabaseProps) {
  return <div className="view database-view">
    <PageIntro number="03" eyebrow="INTELLIGENCE DATABASE · 30 DAYS" title="情報資料庫" description="保存完整、可追溯且可篩選的市場情報；索引完整度與分析可信度分開管理。" />
    <div className="method-stats">
      <div><small>掃描篇數</small><strong>128</strong><span>展示統計</span></div><div><small>合併／去重</small><strong>34</strong><span>26.6%</span></div><div><small>新增索引</small><strong>18</strong><span>本週</span></div><div><small>DAILY VERIFIED</small><strong>07</strong><span>已複核</span></div><div><small>WEEKLY VERIFIED</small><strong>—</strong><span>週五封存</span></div>
    </div>
    <section className="database-panel">
      <div className="filters">
        <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="搜尋標題、公司或技術…" /></label>
        <label><span>地區</span><select value={region} onChange={(e) => setRegion(e.target.value)}><option>全部地區</option><option>US</option><option>Canada</option><option>Europe-DE</option><option>Europe-FR</option><option>Middle East</option><option>Global</option></select></label>
        <label><span>狀態</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option>全部狀態</option><option>INDEXED</option><option>DAILY VERIFIED</option><option>WEEKLY VERIFIED</option><option>PENDING</option><option>EXCLUDED</option></select></label>
      </div>
      <div className="results-meta"><span>顯示 <strong>{filtered.length}</strong> 筆展示資料</span><span>預設範圍：最近 30 天</span></div>
      <div className="intel-list">
        {filtered.map((item) => <article key={`${item.date}-${item.title}`}>
          <div className="intel-date"><strong>{item.date}</strong><small>2026</small></div>
          <div className="intel-content"><div className="intel-meta"><span>{item.region}</span><span>{item.technology}</span><span className={`relevance relevance-${item.relevance}`}>{item.relevance}</span></div><h3>{item.title}</h3><p>{item.source}</p></div>
          <div className="intel-company"><small>COMPANY</small><strong>{item.company}</strong></div>
          <Status>{item.status}</Status>
          <button className="row-action" aria-label={`查看 ${item.title}`}>↗</button>
        </article>)}
        {filtered.length === 0 && <div className="empty"><strong>找不到符合條件的情報</strong><span>請調整關鍵字或篩選條件。</span></div>}
      </div>
    </section>
    <div className="database-note"><span>i</span><p><strong>關於展示資料</strong>此頁用來展示篩選、狀態與資料層級；數字及事件不是正式市場情報。正式版只顯示可追溯來源，且不保存 IPVM 付費全文。</p></div>
  </div>;
}
