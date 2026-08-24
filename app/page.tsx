"use client";

import { useMemo, useState } from "react";

type View = "weekly" | "report" | "database";
type Lang = "zh" | "en";
type IntelStatus = "INDEXED" | "DAILY VERIFIED" | "WEEKLY VERIFIED" | "PENDING" | "EXCLUDED";
type ReportVersion = "live" | "last" | "w31";

const intelligence: Array<{
  date: string; region: string; company: string; technology: string; technologyEn: string;
  title: string; titleEn: string; source: string; sourceEn: string; url: string; relatedUrl?: string; status: IntelStatus; relevance: string; relevanceEn: string;
}> = [
  { date: "08/24", region: "US", company: "—", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Lebanon 將討論 ALPR 使用規範；提案尚未通過", titleEn: "Lebanon to discuss ALPR-use ordinance; proposal not yet adopted", source: "Lebanon, Missouri 官方網站 · 提案中", sourceEn: "City of Lebanon, Missouri · Proposed, not adopted", url: "https://www.lebanonmissouri.org/1080/Proposed-Ordinance", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/23", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Oviedo 以誘餌攝影機因應 Flock 設備破壞（原始頁待確認）", titleEn: "Oviedo uses a decoy camera amid Flock vandalism (source pending)", source: "WESH · IPVM Brief · 原始頁待確認", sourceEn: "WESH · IPVM Brief · Source pending", url: "https://www.wesh.com/article/police-florida-fake-flock-camera-oviedo-mayor-says/73497418", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/23", region: "US", company: "Flock Safety／Motorola Solutions", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "三個 Iowa 城鎮終止 Flock 合約；Des Moines 維持 Motorola ALPR（原始頁待確認）", titleEn: "Three Iowa towns end Flock contracts while Des Moines keeps Motorola ALPR (source pending)", source: "WHO 13 · IPVM Brief · 原始頁待確認", sourceEn: "WHO 13 · IPVM Brief · Source pending", url: "https://who13.com/news/metro-news/des-moines-police-stand-by-license-plate-readers-as-three-communities-end-contracts/", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/22", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Flock CEO 再度主張 7 天建議保存期，並呼籲全國性折衷方案", titleEn: "Flock CEO reiterates a seven-day recommendation and calls for national compromise", source: "Fox News · 兩則 IPVM Brief 合併為單一事件", sourceEn: "Fox News · Two IPVM briefs merged as one event", url: "https://www.foxnews.com/media/flock-safety-ceo-calls-national-compromise-amid-camera-sabotage-public-revolt", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/22", region: "US", company: "Axon／Motorola Solutions／Verkada", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "NPR：Flock 遭遇反彈之際，其他 ALPR 供應商爭取轉換商機", titleEn: "NPR: Rival ALPR vendors seek openings amid backlash against Flock", source: "NPR／KUOW · 市場與競爭報導", sourceEn: "NPR / KUOW · Market and competition report", url: "https://www.kuow.org/npr-news/2026-08-22/as-flock-battles-public-scrutiny-other-police-surveillance-companies-see-an-opening", status: "DAILY VERIFIED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/21", region: "US", company: "Verkada／Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Santa Barbara 確定不續約 Flock；12 部 Verkada 替代方案仍待 8 月 25 日審議", titleEn: "Santa Barbara confirms Flock non-renewal; 12-camera Verkada proposal awaits Aug 25 hearing", source: "Santa Barbara Independent · 不續約已確定／替代案待審議", sourceEn: "Santa Barbara Independent · Non-renewal confirmed / replacement pending", url: "https://www.independent.com/2026/08/21/city-of-santa-barbara-to-end-contract-with-flock-cameras/", status: "DAILY VERIFIED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/21", region: "US", company: "Axon", technology: "BWC／ALPR／無人機／AI", technologyEn: "BWC / ALPR / Drone / AI", title: "Covington 評估 602.5 萬美元、10 年期 Axon 整合方案；尚待表決", titleEn: "Covington weighs a $6.025M, 10-year Axon package; vote still pending", source: "LINK nky · 提案中／尚未核准", sourceEn: "LINK nky · Proposed / not yet approved", url: "https://linknky.com/news/2026/08/21/covington-weighs-6m-police-tech-deal-for-license-plate-readers-ai-and-drone/", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/21", region: "Global", company: "Axon", technology: "BWC／ALPR／數位證據", technologyEn: "BWC / ALPR / Digital evidence", title: "Axon 8 月版本將 ALPR 紀錄直接轉入 Fleet 3 證據工作流", titleEn: "Axon's August release moves ALPR records directly into the Fleet 3 evidence workflow", source: "Axon 官方版本說明 · 8 月 24 日確認", sourceEn: "Axon official release notes · Confirmed Aug 24", url: "https://www.axon.com/help/release-notes/cameras-and-sensors/2026/08-2026.htm", status: "DAILY VERIFIED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/20", region: "US", company: "Coreforce", technology: "身體攝影機／數位證據", technologyEn: "Body-worn camera / Digital evidence", title: "小型警局以可擴充方案降低 BWC 導入門檻（贊助內容）", titleEn: "Sponsored article outlines a scalable BWC model for small agencies", source: "Police1 BrandFocus · Coreforce 贊助內容", sourceEn: "Police1 BrandFocus · Sponsored by Coreforce", url: "https://www.police1.com/police-products/body-cameras/adopting-body-cameras-without-a-big-city-budget", status: "INDEXED", relevance: "相鄰", relevanceEn: "Adjacent" },
  { date: "08/20", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Luray 多部 Flock 攝影機遭破壞，追捕期間嫌犯向警員開火", titleEn: "Luray Flock camera vandalism escalates into pursuit and gunfire", source: "WHSV（主要來源）· Police1（相關報導）· 事件 08/16", sourceEn: "WHSV (primary) · Police1 (related) · Event Aug 16", url: "https://www.whsv.com/2026/08/17/luray-flock-camera-vandalism-leads-shootout-with-deputy/", relatedUrl: "https://www.police1.com/arrests-sentencing/man-opens-fire-at-va-officers-during-pursuit-over-alpr-camera-vandalism", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Flock 宣布將 LPR 建議資料刪除期改為 7 天", titleEn: "Flock changes its recommended LPR data deletion period to seven days", source: "Flock CEO／Fox Business · 原始來源", sourceEn: "Flock CEO / Fox Business · Original source", url: "https://www.youtube.com/watch?v=3jUw590ltig", status: "DAILY VERIFIED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "警界批評 7 天保存期不足以支援長期與跨區案件", titleEn: "Law enforcement criticizes seven-day retention as insufficient for long-running cases", source: "LinkedIn · IPVM Brief", sourceEn: "LinkedIn · IPVM Brief", url: "https://www.linkedin.com/feed/update/urn:li:activity:7493743726108798976", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Axon", technology: "身體攝影機", technologyEn: "Body-worn camera", title: "ICE 7 月向 Axon 採購 3,090 萬美元 BWC，部署持續進行", titleEn: "ICE purchased $30.9M in Axon BWCs in July; rollout remains underway", source: "Associated Press · 新 Brief／較早事件 · 原始來源", sourceEn: "Associated Press · New brief / earlier event · Original source", url: "https://abc7ny.com/post/ice-will-release-body-camera-video-when-seen-agencys-best-interests-policy-says/19640591/", status: "DAILY VERIFIED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "融合中心監測反 Flock 社群活動（原始文件待查）", titleEn: "Fusion centers monitor anti-Flock social activity (documents pending review)", source: "404 Media · IPVM Brief · 原始來源待查", sourceEn: "404 Media · IPVM Brief · Source pending", url: "https://www.404media.co/the-government-is-monitoring-anti-flock-tiktok-and-instagram-accounts/", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "—", technology: "校園安全", technologyEn: "School security", title: "Wichita 校園安全補助案（原始來源待查）", titleEn: "Wichita school safety grant proposal (source pending review)", source: "KWCH／KAKE · IPVM Brief · 原始來源待查", sourceEn: "KWCH / KAKE · IPVM Brief · Source pending", url: "https://www.kwch.com/2026/08/12/school-security-technology-raises-surveillance-racial-bias-concerns-wichita-city-council-meeting/", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "紐時晨報以「監控天羅地網」描述 Flock 攝影機網路", titleEn: "The New York Times describes Flock's camera network as a surveillance dragnet", source: "The New York Times · IPVM Brief", sourceEn: "The New York Times · IPVM Brief", url: "https://www.nytimes.com/2026/08/10/briefing/flock-cameras.html", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "影像監控", technologyEn: "Video surveillance", title: "Flock 說明固定影像攝影機並不等同 LPR", titleEn: "Flock explains that fixed video cameras are not the same as LPR cameras", source: "Flock Safety Blog · IPVM Brief", sourceEn: "Flock Safety Blog · IPVM Brief", url: "https://www.flocksafety.com/blog/flock-lpr-vs-fixed-video-same-camera-body-two-different-jobs", status: "INDEXED", relevance: "相鄰", relevanceEn: "Adjacent" },
  { date: "08/14", region: "US", company: "—", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "犯罪學者主張：歷史 LPR 搜尋應採令狀，而非僅縮短保存期", titleEn: "Criminologist argues warrants should govern historical LPR searches", source: "Andrew Wheeler · IPVM Brief", sourceEn: "Andrew Wheeler · IPVM Brief", url: "https://andrewpwheeler.com/2026/08/12/license-plate-reader-searches-should-require-a-warrant/", status: "INDEXED", relevance: "相鄰", relevanceEn: "Adjacent" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Flock CEO 將部分公眾疑慮歸因於對地方警察的不信任", titleEn: "Flock CEO attributes some public concerns to distrust of local police", source: "Puck · IPVM Brief", sourceEn: "Puck · IPVM Brief", url: "https://puck.news/flock-safetys-ceo-on-crime-privacy-and-backlash/", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/14", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Flock CEO 表示安全與隱私不應被視為二選一", titleEn: "Flock CEO rejects framing safety and privacy as a binary choice", source: "USA Today · IPVM Brief", sourceEn: "USA Today · IPVM Brief", url: "https://www.usatoday.com/story/news/nation/2026/08/13/flock-cameras-update-after-police-abuse-scandals/91272776007/", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
];

const copy = {
  zh: {
    nav: [["本週重點", "3 MIN READ"], ["市場分析報告", "FOR DECISION MAKERS"], ["情報資料庫", "30 DAY WINDOW"]],
    sync: "IPVM 同步完成", basis: "最新檢查時間 08/24 14:37", internal: "內部閱讀版 · 無需 GPT 登入", live: "即時市場情報",
    weeklyIntro: "讓每位同事快速掌握市場變化、重要性，以及可能影響的工作。", weekly: "本週重點", weekLine: "本週一句話",
    hero: "ALPR 市場並未因 Flock 反彈而消失，而是轉向替代供應商、資料控制與整合工作流的新競爭。", heroNote: "分析判斷｜根據本週主要來源整理",
    shifts: "本週市場變化", original: "原始來源", possibleImpact: "對公司的可能影響",
    signals: [
      { tag: "01 / 供應商轉換", title: "反 Flock 壓力正在創造轉換商機，而非終結 ALPR", body: "NPR 報導指出，部分機關正從 Flock 轉向 Axon 等替代方案。焦點不是是否繼續使用 ALPR，而是改由哪一家供應商、採用何種資料架構。", why: "ALPR 需求仍在，但供應商信任、資料網路與治理設計已開始影響替換決策。", url: "https://www.kuow.org/npr-news/2026-08-22/as-flock-battles-public-scrutiny-other-police-surveillance-companies-see-an-opening" },
      { tag: "02 / 資料架構", title: "Santa Barbara 退出 Flock，替代方案強調封閉式資料控制", body: "市府已確認不續約 Flock；人員建議以 12 部市府持有、警局控制的 Verkada LPR 取代，但替代合約仍待 8 月 25 日審議。", why: "資料所有權、跨機關搜尋、保存設定與使用者權限，正從法務附註進入供應商比較核心。", url: "https://www.independent.com/2026/08/21/city-of-santa-barbara-to-end-contract-with-flock-cameras/" },
      { tag: "03 / 平台整合", title: "Axon 把 ALPR、BWC 與數位證據工作流進一步串接", body: "Axon 8 月更新允許 Fleet 3 的 ALPR 紀錄直接轉入 Evidence，並擴大 Body 4、附近 BWC 與 Fleet 攝影機的聯動控制。", why: "單一攝影機產品正面對端到端平台競爭；工作流整合、管理員控制與證據交付會形成更高轉換成本。", url: "https://www.axon.com/help/release-notes/cameras-and-sensors/2026/08-2026.htm" },
    ],
    impacts: [
      ["產品與方案", "同時準備共享情報與機關封閉式兩種資料架構", "方案需清楚回答資料由誰持有、誰能搜尋、如何分享、保存多久，以及如何進入證據工作流。"],
      ["業務與標案", "把汰換與遷移能力納入競爭方案", "客戶可能保留 ALPR、但更換供應商；提案應包含既有設備替換、資料遷移、權限重建與系統整合。"],
      ["法務與營運", "治理條件需要成為可展示的產品能力", "封閉網路、跨機關分享、保存設定、稽核與年度報告機制，應能在標案回覆中被具體證明。"],
    ],
    marketNumbers: "本週關鍵市場數字", numberNote: "僅呈現具可追溯來源、且對市場判斷有意義的數字。",
    numbers: [["12 部", "Santa Barbara 現有 Flock 攝影機；替代案待審"], ["08/25", "Verkada 替代方案預定審議日"], ["08/21", "Axon ALPR-to-Evidence 功能發布日"]],
    goDeeper: "需要完整決策脈絡？", goText: "查看市場訊號演變、SWOT、管理者決策摘要與資料限制。", readReport: "閱讀市場分析",
    dataNote: "更新自 IPVM Briefs 與公開原始來源；網站只保存必要欄位、摘要與連結，不保存或重製 IPVM 付費全文。",
    report: "市場分析報告", reportIntro: "將市場訊號轉化為管理判斷、決策摘要與具體下一步。", reportVersion: "報告版本",
    versions: ["本週持續更新版", "上週正式封存版", "2026 W31 正式封存版"], liveState: "持續更新", archiveState: "正式封存", liveUse: "納入本週最新情報", archiveUse: "使用封存資料",
    conclusions: "本期分析結論", conclusionItems: [
      ["反 Flock 不等於反 ALPR，而是供應商重新洗牌。", "NPR 與 Santa Barbara 案例顯示，部分機關選擇保留 ALPR 能力、改換供應商或資料架構。這是近期案例方向，不代表全市場已普遍轉換。"],
      ["資料架構已成為競爭條件。", "Santa Barbara 的替代方案將市府持有、警局控制、無公共或跨機關搜尋列為核心；Verkada 合約仍待 8 月 25 日審議。"],
      ["整合工作流正在拉高平台型競爭門檻。", "Axon 將 Fleet ALPR 紀錄直接接入 Evidence，並擴大 BWC 與車載攝影機聯動，顯示競爭由設備延伸至證據與管理流程。"],
    ],
    evolution: "市場訊號演變", flow: [["公眾反彈轉成不續約", "Flock 信任與資料分享爭議進入地方決策"], ["客戶改選資料架構", "保留 ALPR，但要求封閉系統與機關控制"], ["競爭升級為平台能力", "設備、證據、權限、保存與稽核必須一起回答"]],
    assessment: "分析判斷", assessmentText: "買方正在從『攝影機辨識率如何』進一步追問『資料屬於誰、誰能搜尋、如何分享、能否直接進入證據流程』。對 BU 而言，產品規格、資料治理與整合交付必須形成同一套方案，而不是分散在硬體、法務與介接附件。",
    decisions: "管理者決策摘要", decisionHeads: ["優先級", "建議行動", "負責單位", "時程", "下一決策點"], decisionRows: [
      ["HIGH", "建立共享網路與機關封閉式架構的功能差異矩陣", "產品 × 法務", "2 週", "哪些治理能力納入方案基線"],
      ["HIGH", "設計 ALPR 汰換與遷移包：設備、資料、權限及證據介接", "業務 × 產品", "3 週", "是否形成獨立轉換方案"],
      ["MED", "比較 Axon 式端到端工作流與 BU 可合作／補強的能力", "產品 × 策略", "4 週", "自建、整合或合作的邊界"],
    ],
    swot: "SWOT", swotBadge: "本週分析", swotItems: [
      ["STRENGTHS", "可立即利用的能力", "既有影像硬體與執法場景經驗", "可從設備端切入資料與證據整合"],
      ["WEAKNESSES", "需要補強的缺口", "治理與遷移能力尚未形成標準方案", "端到端證據生態系的完整度需明確比較"],
      ["OPPORTUNITIES", "可轉化的外部變化", "Flock 汰換創造替代與遷移需求", "封閉資料架構可形成差異化價值"],
      ["THREATS", "影響市場進入的風險", "Axon 等平台以工作流整合提高轉換成本", "Flock 爭議可能外溢為整體 ALPR 信任風險"],
    ],
    coverage: "資料涵蓋與限制", coverageItems: [["分析期間", "08/15 — 08/24"], ["最新資料檢查", "08/24 · 14:37"], ["資料狀態", "5 項可用 · 7 項待查"]], coverageText: "W35 分析使用 NPR／KUOW、Santa Barbara Independent 與 Axon 官方版本說明三組新來源；Santa Barbara 已確定不續約 Flock，但 Verkada 替代案仍待 8 月 25 日審議。Covington 整合方案與 Lebanon 條例草案仍標示 PENDING，不用於本期結論。分析描述的是近期案例方向，不代表所有機關或整體市場已全面轉換。",
    database: "情報資料庫", dbIntro: "保存可追溯且可篩選的市場情報；索引完整度與分析可信度分開管理。", stats: [["掃描項目", "24", "本次 IPVM＋公開來源"], ["事件合併", "02", "本次同事件多篇報導"], ["新增索引", "08", "8/21 — 8/24"], ["資料庫總數", "20", "最近 30 天"], ["待查資料", "07", "原始來源或階段待確認"], ["可用於分析", "05", "來源確認完成"]],
    search: "搜尋標題、公司或技術…", region: "地區", status: "狀態", allRegions: "全部地區", allStatus: "全部狀態", showing: "顯示", records: "筆情報", defaultRange: "預設範圍：最近 30 天", company: "公司", open: "開啟", empty: "找不到符合條件的情報", emptyHint: "請調整關鍵字或篩選條件。", dbNoteTitle: "關於 IPVM 資料", dbNote: "網站只保存標題、日期、來源、原始連結、分類、摘要與資料狀態，不保存 IPVM 付費全文。最新 Brief 不等同底層事件發生於今日。",
    footer: "事實與分析判斷分開呈現 · 重大結論可追溯",
  },
  en: {
    nav: [["Weekly Highlights", "3 MIN READ"], ["Market Analysis", "FOR DECISION MAKERS"], ["Intelligence Database", "30 DAY WINDOW"]],
    sync: "IPVM sync complete", basis: "Latest check Aug 24, 14:37", internal: "Internal reading · No GPT login required", live: "LIVE INTELLIGENCE",
    weeklyIntro: "A three-minute view of market shifts, why they matter, and where they may affect our work.", weekly: "Weekly Highlights", weekLine: "This week in one line",
    hero: "The ALPR market is not disappearing with the Flock backlash; competition is shifting to alternative vendors, data control, and integrated workflows.", heroNote: "Analyst assessment · Based on this week's primary sources",
    shifts: "Market shifts this week", original: "Original source", possibleImpact: "Potential impact on the company",
    signals: [
      { tag: "01 / VENDOR SWITCHING", title: "Flock backlash is creating switching opportunities—not ending ALPR", body: "NPR reports that some agencies are moving from Flock to alternatives such as Axon. The question is increasingly which vendor and data architecture to use, rather than whether to keep ALPR.", why: "Demand remains, but vendor trust, network design, and governance are beginning to shape replacement decisions.", url: "https://www.kuow.org/npr-news/2026-08-22/as-flock-battles-public-scrutiny-other-police-surveillance-companies-see-an-opening" },
      { tag: "02 / DATA ARCHITECTURE", title: "Santa Barbara exits Flock as its replacement proposal emphasizes closed data control", body: "The city confirmed it will not renew Flock. Staff recommends replacing 12 cameras with a city-owned, department-controlled Verkada system, but the contract still awaits the Aug 25 hearing.", why: "Data ownership, cross-agency search, retention settings, and user permissions are moving into the core vendor comparison.", url: "https://www.independent.com/2026/08/21/city-of-santa-barbara-to-end-contract-with-flock-cameras/" },
      { tag: "03 / PLATFORM INTEGRATION", title: "Axon further connects ALPR, BWCs, and digital-evidence workflows", body: "Axon's August update lets Fleet 3 ALPR records move directly into Evidence and expands coordinated activation across Body 4, nearby BWCs, and Fleet cameras.", why: "Point products increasingly compete against end-to-end platforms; workflow integration, admin control, and evidence delivery can raise switching costs.", url: "https://www.axon.com/help/release-notes/cameras-and-sensors/2026/08-2026.htm" },
    ],
    impacts: [
      ["Product & solutions", "Prepare both shared-intelligence and agency-controlled architectures", "Offers should state who owns data, who can search it, how it is shared, how long it is retained, and how it enters evidence workflows."],
      ["Sales & bids", "Make replacement and migration a defined offer", "Customers may retain ALPR while changing vendors; bids should cover hardware replacement, data migration, permission rebuilding, and system integration."],
      ["Legal & operations", "Turn governance terms into demonstrable product capabilities", "Closed networks, interagency sharing, retention, audit, and reporting controls should be provable in procurement responses."],
    ],
    marketNumbers: "Key market numbers", numberNote: "Only figures with traceable sources and clear market relevance are shown.", numbers: [["12 cameras", "Santa Barbara's current Flock system; replacement pending"], ["Aug 25", "Scheduled hearing for the Verkada proposal"], ["Aug 21", "Axon ALPR-to-Evidence release date"]],
    goDeeper: "Need the full decision context?", goText: "Review signal evolution, SWOT, management decisions, and data limitations.", readReport: "Read market analysis", dataNote: "Updated from IPVM Briefs and public primary sources. The site stores only necessary metadata, summaries, and links—not paid IPVM full text.",
    report: "Market Analysis", reportIntro: "Turning market signals into management judgments, decision summaries, and clear next steps.", reportVersion: "Report version", versions: ["Current week · Live", "Last week · Archived", "2026 W31 · Archived"], liveState: "Live update", archiveState: "Official archive", liveUse: "Includes this week's latest intelligence", archiveUse: "Uses archived intelligence",
    conclusions: "Key conclusions", conclusionItems: [["Anti-Flock does not equal anti-ALPR; it is reshuffling vendors.", "NPR and Santa Barbara show agencies retaining ALPR while changing vendors or data architecture. These are recent cases, not evidence of a market-wide switch."], ["Data architecture is becoming a competitive criterion.", "Santa Barbara's proposed alternative emphasizes city ownership, department control, and no public or cross-agency search. The Verkada contract still awaits the Aug 25 hearing."], ["Integrated workflows are raising the platform barrier.", "Axon now moves Fleet ALPR records directly into Evidence and expands coordinated activation across BWCs and vehicle cameras, extending competition beyond devices into evidence and administration workflows."]],
    evolution: "How the signal is evolving", flow: [["Public backlash becomes non-renewal", "Trust and data-sharing concerns enter local decisions"], ["Agencies choose a different architecture", "ALPR stays, but closed systems and agency control gain weight"], ["Competition expands to the platform", "Devices, evidence, permissions, retention, and audit must work together"]], assessment: "Analyst assessment", assessmentText: "Buyers are moving beyond recognition accuracy to ask who owns the data, who can search it, how it is shared, and whether it flows directly into evidence. Product specifications, governance, and integration delivery should therefore be one offer—not separate hardware, legal, and interface appendices.",
    decisions: "Management decision summary", decisionHeads: ["Priority", "Recommended action", "Owner", "Timing", "Next decision"], decisionRows: [["HIGH", "Build a feature matrix for shared-network versus agency-controlled architectures", "Product × Legal", "2 weeks", "Which controls become offer baseline?"], ["HIGH", "Design an ALPR replacement package covering hardware, data, permissions, and evidence integration", "Sales × Product", "3 weeks", "Launch a dedicated migration offer?"], ["MED", "Compare Axon-style end-to-end workflows with capabilities the BU can build, integrate, or partner for", "Product × Strategy", "4 weeks", "Where to build versus partner?"]],
    swot: "SWOT", swotBadge: "This week", swotItems: [["STRENGTHS", "Capabilities available now", "Existing video hardware and public-safety experience", "A device-level entry point into evidence integration"], ["WEAKNESSES", "Gaps to close", "Governance and migration are not yet a standard offer", "End-to-end evidence ecosystem depth needs explicit comparison"], ["OPPORTUNITIES", "External changes to convert", "Flock replacement creates migration demand", "Closed data architectures can differentiate an offer"], ["THREATS", "Market-entry risks", "Integrated platforms such as Axon can raise switching costs", "Flock controversy may spill into broader ALPR distrust"]],
    coverage: "Coverage & limitations", coverageItems: [["Analysis period", "Aug 15 — Aug 24"], ["Latest data check", "Aug 24 · 14:37"], ["Data status", "5 usable · 7 pending"]], coverageText: "The W35 analysis uses three new source groups: NPR/KUOW, the Santa Barbara Independent, and Axon's official release notes. Santa Barbara confirmed the Flock non-renewal, but the Verkada proposal still awaits the Aug 25 hearing. The Covington package and Lebanon ordinance remain PENDING and do not support this edition's conclusions. The analysis describes a direction visible in recent cases, not a completed market-wide transition.",
    database: "Intelligence Database", dbIntro: "Traceable, searchable market intelligence with indexing completeness separated from analytical confidence.", stats: [["Items scanned", "24", "This IPVM + public-source sync"], ["Events merged", "02", "Same-event reports this sync"], ["New indexes", "08", "Aug 21 — Aug 24"], ["Database total", "20", "Last 30 days"], ["Pending items", "07", "Source or stage pending"], ["Analysis-ready", "05", "Source confirmation complete"]],
    search: "Search title, company, or technology…", region: "Region", status: "Status", allRegions: "All regions", allStatus: "All statuses", showing: "Showing", records: "records", defaultRange: "Default range: last 30 days", company: "Company", open: "Open", empty: "No matching intelligence", emptyHint: "Adjust the keyword or filters.", dbNoteTitle: "About IPVM data", dbNote: "The site stores only titles, dates, sources, original links, classifications, summaries, and review status—not paid IPVM full text. A newly published brief does not mean the underlying event happened today.", footer: "Facts and analyst assessments are separated · Major conclusions are traceable",
  },
} as const;

function Status({ children }: { children: IntelStatus }) {
  const tone = children.includes("VERIFIED") ? "verified" : children === "INDEXED" ? "indexed" : children === "PENDING" ? "pending" : "excluded";
  return <span className={`status status-${tone}`}><span />{children}</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("weekly");
  const [lang, setLang] = useState<Lang>("zh");
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [reportVersion, setReportVersion] = useState<ReportVersion>("live");
  const t = copy[lang];
  const navIds: View[] = ["weekly", "report", "database"];

  const filtered = useMemo(() => intelligence.filter((item) => {
    const haystack = `${item.title} ${item.titleEn} ${item.company} ${item.technology} ${item.technologyEn}`.toLowerCase();
    return haystack.includes(query.toLowerCase()) && (region === "all" || item.region === region) && (status === "all" || item.status === status);
  }), [query, region, status]);

  const go = (next: View) => { setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return <div className="site-shell" lang={lang === "zh" ? "zh-Hant" : "en"}>
    <header className="site-header">
      <div className="brand" onClick={() => go("weekly")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && go("weekly")}>
        <div className="brand-mark">SI</div>
        <div><strong>{lang === "zh" ? "全球安防市場情報中心" : "Global Security Intelligence"}</strong><small>{lang === "zh" ? "GLOBAL SECURITY INTELLIGENCE · INTERNATIONAL EDITION" : "INTERNAL MARKET BRIEFING · INTERNATIONAL EDITION"}</small></div>
      </div>
      <nav className={menuOpen ? "header-nav open" : "header-nav"} aria-label={lang === "zh" ? "主要導覽" : "Main navigation"}>{navIds.map((id, index) => <button key={id} onClick={() => go(id)} className={view === id ? "active" : ""}><span className="nav-index">0{index + 1}</span><span><strong>{t.nav[index][0]}</strong><small>{t.nav[index][1]}</small></span></button>)}</nav>
      <div className="header-actions"><div className="internal-state"><span className="live-dot" /> INTERNAL</div><div className="lang-toggle" role="group" aria-label="Language"><button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中文</button><button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button></div></div>
    </header>
    <button className="mobile-menu" aria-label={lang === "zh" ? "開啟選單" : "Open menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>{menuOpen && <button className="backdrop" aria-label={lang === "zh" ? "關閉選單" : "Close menu"} onClick={() => setMenuOpen(false)} />}
    <main>
      {view === "weekly" && <WeeklyView lang={lang} onOpenReport={() => go("report")} />}
      {view === "report" && <ReportView lang={lang} version={reportVersion} setVersion={setReportVersion} />}
      {view === "database" && <DatabaseView lang={lang} query={query} setQuery={setQuery} region={region} setRegion={setRegion} status={status} setStatus={setStatus} filtered={filtered} />}
      <footer><span>VISION INTELLIGENCE · INTERNAL BRIEFING</span><span>{t.footer}</span></footer>
    </main>
  </div>;
}

function PageIntro({ number, eyebrow, title, description, dateLabel = "2026.08.24" }: { number: string; eyebrow: string; title: string; description: string; dateLabel?: string }) { return <div className="page-intro"><div className="page-intro-inner"><div className="eyebrow">{eyebrow}</div><h1><span className="section-number">{number}</span> {title}</h1><p>{description}</p><div className="hero-meta"><span>ASIA / TAIPEI</span><span>{dateLabel}</span></div></div></div>; }

function WeeklyView({ lang, onOpenReport }: { lang: Lang; onOpenReport: () => void }) {
  const t = copy[lang];
  return <div className="view weekly-view"><PageIntro number="W35" eyebrow="THIS WEEK · 3 MIN READ" title={lang === "zh" ? "安防市場情報速覽" : "Security Market Brief"} description={t.hero} dateLabel={lang === "zh" ? "2026.08.24 · 資料與分析截至 08.24" : "2026.08.24 · DATA & ANALYSIS THROUGH 08.24"} />
    <section><div className="section-heading"><div><span className="eyebrow">01 · SIGNAL EVOLUTION</span><h2>{t.shifts}</h2></div><span className="count">03</span></div><div className="signal-grid">{t.signals.map((signal, i) => <article className={`signal-card ${i === 0 ? "featured" : "dark"}`} key={signal.title}><div className="card-top"><span>{signal.tag}</span><span>W35</span></div><h3>{signal.title}</h3><p>{signal.body}</p><div className="why"><span>WHY IT MATTERS</span>{signal.why}</div><a href={signal.url} target="_blank" rel="noreferrer">{t.original} <span>↗</span></a></article>)}</div></section>
    <section className="impact-section"><div className="section-heading"><div><span className="eyebrow">POSSIBLE IMPACT</span><h2>{t.possibleImpact}</h2></div></div><div className="impact-grid">{t.impacts.map((item, i) => <div key={item[0]}><span className="impact-icon">{["P", "B", "L"][i]}</span><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></div>)}</div></section>
    <section className="numbers-section"><div><span className="eyebrow">MARKET NUMBERS</span><h2>{t.marketNumbers}</h2><p>{t.numberNote}</p></div><div className="number-grid">{t.numbers.map((item) => <div key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span></div>)}</div></section>
    <div className="report-cta"><div><span className="eyebrow">GO DEEPER</span><h2>{t.goDeeper}</h2><p>{t.goText}</p></div><button onClick={onOpenReport}>{t.readReport} <span>→</span></button></div><p className="data-note">{t.dataNote}</p>
  </div>;
}

function ReportView({ lang, version, setVersion }: { lang: Lang; version: ReportVersion; setVersion: (value: ReportVersion) => void }) {
  const t = copy[lang]; const live = version === "live"; const versionIndex = version === "live" ? 0 : version === "last" ? 1 : 2;
  const reportWeek = version === "live" ? "W35" : version === "last" ? "W34" : "W31";
  return <div className="view report-view"><PageIntro number={reportWeek} eyebrow="MARKET ANALYSIS · DECISION VIEW" title={t.report} description={t.reportIntro} dateLabel={live ? (lang === "zh" ? "2026.08.24 · 資料與分析截至 08.24" : "2026.08.24 · DATA & ANALYSIS THROUGH 08.24") : lang === "zh" ? "正式封存" : "OFFICIAL ARCHIVE"} />
    <div className="report-toolbar"><div><span className="eyebrow">{t.reportVersion}</span><select value={version} onChange={(e) => setVersion(e.target.value as ReportVersion)} aria-label={t.reportVersion}><option value="live">{t.versions[0]}</option><option value="last">{t.versions[1]}</option><option value="w31">{t.versions[2]}</option></select></div><div className="report-state"><span className="pulse" /><div><strong>{live ? t.liveState : t.archiveState}</strong><small>{live ? t.liveUse : t.archiveUse}</small></div></div></div>
    <section className="conclusion"><span className="eyebrow">EXECUTIVE CONCLUSION</span><h2>{t.conclusions}</h2><div className="conclusion-list">{t.conclusionItems.map((item, i) => <div key={item[0]}><span>0{i + 1}</span><p><strong>{item[0]}</strong> {item[1]}</p></div>)}</div></section>
    <section className="signal-evolution"><div className="section-heading"><div><span className="eyebrow">SIGNAL EVOLUTION</span><h2>{t.evolution}</h2></div></div><div className="flow">{t.flow.map((item, i) => <div className={i === 2 ? "flow-accent" : ""} key={item[0]}><small>{i === 2 ? "IMPLICATION" : `SIGNAL 0${i + 1}`}</small><strong>{item[0]}</strong><span>{item[1]}</span></div>).flatMap((node, i) => i < 2 ? [node, <b key={`arrow-${i}`}>→</b>] : [node])}</div><p className="assessment"><span>{t.assessment}</span>{t.assessmentText}</p></section>
    <section><div className="section-heading"><div><span className="eyebrow">DECISION SUMMARY</span><h2>{t.decisions}</h2></div></div><div className="decision-table" role="table"><div className="table-head" role="row">{t.decisionHeads.map((head) => <span key={head}>{head}</span>)}</div>{t.decisionRows.map((row) => <div role="row" key={row[1]}><span><b className={`priority ${row[0] === "HIGH" ? "high" : "medium"}`}>{row[0]}</b></span>{row.slice(1).map((cell) => <span key={cell}>{cell}</span>)}</div>)}</div></section>
    <section className="swot-section"><div className="section-heading"><div><span className="eyebrow">STRATEGIC VIEW</span><h2>{t.swot}</h2></div><span className="sample-label">{t.swotBadge}</span></div><div className="swot-grid">{t.swotItems.map((item, i) => <div className={`swot ${["strength", "weakness", "opportunity", "threat"][i]}`} key={item[0]}><span>{["S", "W", "O", "T"][i]}</span><div><small>{item[0]}</small><h3>{item[1]}</h3><ul><li>{item[2]}</li><li>{item[3]}</li></ul></div></div>)}</div></section>
    <section className="coverage"><div><span className="eyebrow">COVERAGE & LIMITATIONS</span><h2>{t.coverage}</h2></div><div className="coverage-grid">{t.coverageItems.map((item) => <div key={item[0]}><small>{item[0]}</small><strong>{item[1]}</strong></div>)}<div><small>{t.reportVersion}</small><strong>{t.versions[versionIndex]}</strong></div></div><p>{t.coverageText}</p></section>
  </div>;
}

type DatabaseProps = { lang: Lang; query: string; setQuery: (value: string) => void; region: string; setRegion: (value: string) => void; status: string; setStatus: (value: string) => void; filtered: typeof intelligence };
function DatabaseView({ lang, query, setQuery, region, setRegion, status, setStatus, filtered }: DatabaseProps) {
  const t = copy[lang];
  return <div className="view database-view"><PageIntro number="30D" eyebrow="INTELLIGENCE DATABASE · 30 DAYS" title={t.database} description={t.dbIntro} dateLabel={lang === "zh" ? "資料截至 2026.08.24 · 14:37" : "DATA THROUGH 2026.08.24 · 14:37"} />
    <div className="method-stats">{t.stats.map((item) => <div key={item[0]}><small>{item[0]}</small><strong>{item[1]}</strong><span>{item[2]}</span></div>)}</div>
    <section className="database-panel"><div className="filters"><label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} /></label><label><span>{t.region}</span><select value={region} onChange={(e) => setRegion(e.target.value)}><option value="all">{t.allRegions}</option><option>US</option><option>Canada</option><option>Europe-DE</option><option>Europe-FR</option><option>Middle East</option><option>Global</option></select></label><label><span>{t.status}</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">{t.allStatus}</option><option>INDEXED</option><option>DAILY VERIFIED</option><option>WEEKLY VERIFIED</option><option>PENDING</option><option>EXCLUDED</option></select></label></div>
      <div className="results-meta"><span>{t.showing} <strong>{filtered.length}</strong> {t.records}</span><span>{t.defaultRange}</span></div><div className="intel-list">{filtered.map((item) => { const title = lang === "zh" ? item.title : item.titleEn; return <article key={`${item.date}-${item.title}`}><div className="intel-date"><strong>{item.date}</strong><small>2026</small></div><div className="intel-content"><div className="intel-meta"><span>{item.region}</span><span>{lang === "zh" ? item.technology : item.technologyEn}</span><span className="relevance">{lang === "zh" ? item.relevance : item.relevanceEn}</span></div><h3>{title}</h3><p>{lang === "zh" ? item.source : item.sourceEn}{item.relatedUrl && <> · <a className="related-source" href={item.relatedUrl} target="_blank" rel="noreferrer">{lang === "zh" ? "Police1 相關報導 ↗" : "Police1 related report ↗"}</a></>}</p></div><div className="intel-company"><small>{t.company.toUpperCase()}</small><strong>{item.company}</strong></div><Status>{item.status}</Status><a className="row-action" href={item.url} target="_blank" rel="noreferrer" aria-label={`${t.open}: ${title}`}>↗</a></article>; })}{filtered.length === 0 && <div className="empty"><strong>{t.empty}</strong><span>{t.emptyHint}</span></div>}</div>
    </section><div className="database-note"><span>i</span><p><strong>{t.dbNoteTitle}</strong>{t.dbNote}</p></div>
  </div>;
}
