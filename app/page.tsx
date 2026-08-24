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
  { date: "08/24", region: "US", company: "—", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Lebanon 將討論 ALPR 使用規範；提案尚未通過", titleEn: "Lebanon to discuss ALPR-use ordinance; proposal not yet adopted", source: "Lebanon, Missouri 官方網站 · 提案中", sourceEn: "City of Lebanon, Missouri · Proposed, not adopted", url: "https://www.lebanonmissouri.org/1080/Proposed-Ordinance", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/23", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Oviedo 以誘餌攝影機因應 Flock 設備破壞（原始頁待確認）", titleEn: "Oviedo uses a decoy camera amid Flock vandalism (source pending)", source: "WESH · IPVM Brief · 原始頁待確認", sourceEn: "WESH · IPVM Brief · Source pending", url: "https://www.wesh.com/article/police-florida-fake-flock-camera-oviedo-mayor-says/73497418", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/23", region: "US", company: "Flock Safety／Motorola Solutions", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "三個 Iowa 城鎮終止 Flock 合約；Des Moines 維持 Motorola ALPR（原始頁待確認）", titleEn: "Three Iowa towns end Flock contracts while Des Moines keeps Motorola ALPR (source pending)", source: "WHO 13 · IPVM Brief · 原始頁待確認", sourceEn: "WHO 13 · IPVM Brief · Source pending", url: "https://who13.com/news/metro-news/des-moines-police-stand-by-license-plate-readers-as-three-communities-end-contracts/", status: "PENDING", relevance: "核心", relevanceEn: "Core" },
  { date: "08/22", region: "US", company: "Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Flock CEO 再度主張 7 天建議保存期，並呼籲全國性折衷方案", titleEn: "Flock CEO reiterates a seven-day recommendation and calls for national compromise", source: "Fox News · 兩則 IPVM Brief 合併為單一事件", sourceEn: "Fox News · Two IPVM briefs merged as one event", url: "https://www.foxnews.com/media/flock-safety-ceo-calls-national-compromise-amid-camera-sabotage-public-revolt", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/22", region: "US", company: "Axon／Motorola Solutions／Verkada", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "NPR：Flock 遭遇反彈之際，其他 ALPR 供應商爭取轉換商機", titleEn: "NPR: Rival ALPR vendors seek openings amid backlash against Flock", source: "NPR／KUOW · 市場與競爭報導", sourceEn: "NPR / KUOW · Market and competition report", url: "https://www.kuow.org/npr-news/2026-08-22/as-flock-battles-public-scrutiny-other-police-surveillance-companies-see-an-opening", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/21", region: "US", company: "Verkada／Flock Safety", technology: "ALPR / LPR", technologyEn: "ALPR / LPR", title: "Santa Barbara 不續約 Flock；Verkada 替代方案預計 8 月 25 日審議", titleEn: "Santa Barbara will not renew Flock; Verkada replacement proposal set for Aug 25", source: "Santa Barbara Independent · 不續約已確定／替代案待審議", sourceEn: "Santa Barbara Independent · Non-renewal confirmed / replacement pending", url: "https://www.independent.com/2026/08/21/city-of-santa-barbara-to-end-contract-with-flock-cameras/", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/21", region: "US", company: "Axon", technology: "BWC／ALPR／無人機／AI", technologyEn: "BWC / ALPR / Drone / AI", title: "Covington 評估約 600 萬美元、10 年期 Axon 整合方案；尚待表決", titleEn: "Covington weighs a roughly $6M, 10-year Axon package; vote still pending", source: "LINK nky · 提案中／尚未核准", sourceEn: "LINK nky · Proposed / not yet approved", url: "https://linknky.com/news/2026/08/21/covington-weighs-6m-police-tech-deal-for-license-plate-readers-ai-and-drone/", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
  { date: "08/21", region: "Global", company: "Axon", technology: "BWC／ALPR／數位證據", technologyEn: "BWC / ALPR / Digital evidence", title: "Axon 8 月版本將 ALPR 紀錄直接轉入 Fleet 3 證據工作流", titleEn: "Axon's August release moves ALPR records directly into the Fleet 3 evidence workflow", source: "Axon 官方版本說明 · 8 月 24 日查核", sourceEn: "Axon official release notes · Checked Aug 24", url: "https://www.axon.com/help/release-notes/cameras-and-sensors/2026/08-2026.htm", status: "INDEXED", relevance: "核心", relevanceEn: "Core" },
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
    hero: "資料治理正在推動 LPR 政策調整，也伴隨聯邦 BWC 的快速部署。", heroNote: "分析判斷｜根據本週主要來源整理",
    shifts: "本週市場變化", original: "原始來源", possibleImpact: "對公司的可能影響",
    signals: [
      { tag: "01 / LPR 治理", title: "Flock 宣布建議資料刪除期改為 7 天", body: "Flock CEO 的原始貼文明確表示，建議刪除期改為 7 天；調查需要保存時將引入 Evidence Mode。這不是對所有客戶強制套用的單一政策。", why: "供應商正把刪除預設與案件保全機制一起產品化，治理設定將影響採購與實務工作流。", url: "https://www.linkedin.com/feed/update/urn:li:activity:7493743726108798976" },
      { tag: "02 / BWC 部署", title: "ICE 7 月向 Axon 採購 3,090 萬美元 BWC", body: "AP 報導顯示，超過半數外勤人員已取得設備；其餘外勤人員預計 9 月底前收到設備，部署與訓練仍在進行。", why: "問責壓力可推動大規模設備部署，但採購、配發與影像發布政策必須分開判讀。", url: "https://abc7ny.com/post/ice-will-release-body-camera-video-when-seen-agencys-best-interests-policy-says/19640591/" },
    ],
    impacts: [
      ["產品與方案", "保存期、證據鎖定與稽核需成為可配置能力", "LPR 與 BWC 方案應把刪除政策、案件保全、查詢權限與稽核軌跡整體呈現。"],
      ["業務與標案", "治理條件會直接影響採購與競爭定位", "大型機關可因外部事件加速採購；資料處理與發布政策也會影響買方評估。"],
      ["法務與營運", "「保存多久」不是唯一的隱私答案", "令狀、存取控制、外部稽核與影像公開政策，可能比單一保存天數更具決定性。"],
    ],
    marketNumbers: "本週關鍵市場數字", numberNote: "僅呈現具可追溯來源、且對市場判斷有意義的數字。",
    numbers: [["7 天", "Flock 建議資料刪除期"], ["$30.9M", "ICE 7 月 Axon 設備採購"], [">50%", "已取得 BWC 的 ICE 外勤"]],
    goDeeper: "需要完整決策脈絡？", goText: "查看市場訊號演變、SWOT、管理者決策摘要與資料限制。", readReport: "閱讀市場分析",
    dataNote: "更新自已登入的 IPVM Briefs；網站僅保存工作必要欄位、摘要與原始連結，不保存或重製 IPVM 付費全文。",
    report: "市場分析報告", reportIntro: "將市場訊號轉化為管理判斷、決策摘要與具體下一步。", reportVersion: "報告版本",
    versions: ["本週持續更新版", "上週正式封存版", "2026 W31 正式封存版"], liveState: "持續更新", archiveState: "正式封存", liveUse: "納入本週最新情報", archiveUse: "使用封存資料",
    conclusions: "本期分析結論", conclusionItems: [
      ["LPR 治理已進入產品設計核心。", "Flock 將建議刪除期改為 7 天，並以 Evidence Mode 支援案件保全；這是建議設定，不代表所有客戶已被強制套用。"],
      ["BWC 問責壓力可轉化為快速、大型採購。", "ICE 案顯示，設備採購、實際配發與影像發布政策可能不同步。"],
      ["新 Brief 不等於新事件。", "ICE 採購發生於 7 月，本次 IPVM 發布反映新的政策與媒體關注訊號，不應重複計為 8 月新訂單。"],
    ],
    evolution: "市場訊號演變", flow: [["隱私與濫用疑慮升高", "媒體、社群與地方政府壓力擴大"], ["供應商調整保存政策", "7 天建議設定與案件證據保全並行"], ["治理成為競爭條件", "設定、權限、稽核與工作流須一起回答"]],
    assessment: "分析判斷", assessmentText: "對 BU 而言，產品價值主張應同時覆蓋設備效能、證據保全與可稽核治理，而非把資料政策留到法務附件。",
    decisions: "管理者決策摘要", decisionHeads: ["優先級", "建議行動", "負責單位", "時程", "下一決策點"], decisionRows: [
      ["HIGH", "盤點 LPR／BWC 的保存期、Evidence Hold、權限與稽核能力", "產品 × 法務", "2 週", "是否納入方案基線"],
      ["HIGH", "建立大型機關 BWC 緊急部署的完整交付清單", "業務 × 產品", "3 週", "部署與發布政策如何拆分"],
      ["MED", "將 Brief 發布日與底層事件日分開納入情報欄位", "情報 × 業務", "1 週", "避免重複計算訂單"],
    ],
    swot: "SWOT", swotBadge: "本週分析", swotItems: [
      ["STRENGTHS", "可立即利用的能力", "既有影像設備與垂直應用經驗", "可整合硬體與後端工作流"],
      ["WEAKNESSES", "需要補強的缺口", "治理能力尚未形成清楚方案基線", "區域資料政策證據需持續累積"],
      ["OPPORTUNITIES", "可轉化的外部變化", "BWC 問責需求推動大規模部署", "治理設計可形成差異化價值"],
      ["THREATS", "影響市場進入的風險", "隱私爭議可能快速損害品牌信任", "政策與客戶工作流需求可能衝突"],
    ],
    coverage: "資料涵蓋與限制", coverageItems: [["分析基準", "08/08 — 08/14"], ["最新資料檢查", "08/24 · 14:37"], ["資料狀態", "2 項可用 · 5 項待查"]], coverageText: "8 月 24 日已補查 IPVM 最新頁面可見的 20 筆 Briefs，並核對公開來源；8 月 21 至 24 日新增資料目前為 INDEXED 或 PENDING，因此未改寫首頁與本期分析結論。Fox News 同一訪談的兩則 Brief 已合併為單一事件；Covington、Santa Barbara 與 Lebanon 均按實際階段標示為待表決、待審議或提案中。",
    database: "情報資料庫", dbIntro: "保存可追溯且可篩選的市場情報；索引完整度與分析可信度分開管理。", stats: [["掃描項目", "24", "本次 IPVM＋公開來源"], ["事件合併", "02", "本次同事件多篇報導"], ["新增索引", "08", "8/21 — 8/24"], ["資料庫總數", "20", "最近 30 天"], ["待查資料", "05", "原始來源待確認"], ["可用於分析", "02", "來源確認完成"]],
    search: "搜尋標題、公司或技術…", region: "地區", status: "狀態", allRegions: "全部地區", allStatus: "全部狀態", showing: "顯示", records: "筆情報", defaultRange: "預設範圍：最近 30 天", company: "公司", open: "開啟", empty: "找不到符合條件的情報", emptyHint: "請調整關鍵字或篩選條件。", dbNoteTitle: "關於 IPVM 資料", dbNote: "網站只保存標題、日期、來源、原始連結、分類、摘要與資料狀態，不保存 IPVM 付費全文。最新 Brief 不等同底層事件發生於今日。",
    footer: "事實與分析判斷分開呈現 · 重大結論可追溯",
  },
  en: {
    nav: [["Weekly Highlights", "3 MIN READ"], ["Market Analysis", "FOR DECISION MAKERS"], ["Intelligence Database", "30 DAY WINDOW"]],
    sync: "IPVM sync complete", basis: "Latest check Aug 24, 14:37", internal: "Internal reading · No GPT login required", live: "LIVE INTELLIGENCE",
    weeklyIntro: "A three-minute view of market shifts, why they matter, and where they may affect our work.", weekly: "Weekly Highlights", weekLine: "This week in one line",
    hero: "Data governance is reshaping LPR policy while federal BWC deployment accelerates.", heroNote: "Analyst assessment · Based on this week's primary sources",
    shifts: "Market shifts this week", original: "Original source", possibleImpact: "Potential impact on the company",
    signals: [
      { tag: "01 / LPR GOVERNANCE", title: "Flock changes its recommended data deletion period to seven days", body: "The CEO's original post says the recommended deletion period is now seven days, with Evidence Mode planned for investigations that require preservation. This is not a mandatory setting for every customer.", why: "Vendors are productizing deletion defaults and evidence preservation together, making governance settings part of purchasing and operational workflows.", url: "https://www.linkedin.com/feed/update/urn:li:activity:7493743726108798976" },
      { tag: "02 / BWC ROLLOUT", title: "ICE purchased $30.9M in Axon BWCs in July", body: "AP reports that more than half of field officers have received equipment. The remainder are expected to receive devices by the end of September; rollout and training remain underway.", why: "Accountability pressure can drive large deployments, but procurement, distribution, and footage-release policy must be evaluated separately.", url: "https://abc7ny.com/post/ice-will-release-body-camera-video-when-seen-agencys-best-interests-policy-says/19640591/" },
    ],
    impacts: [
      ["Product & solutions", "Retention, evidence holds, and auditability must be configurable", "LPR and BWC offers should present deletion, evidence preservation, access controls, and audit trails as one system."],
      ["Sales & bids", "Governance requirements directly affect buying decisions", "External events can accelerate public-sector purchasing, while data and release policies shape buyer evaluation."],
      ["Legal & operations", "Retention length is not the only privacy answer", "Warrants, access control, independent auditing, and release rules may matter more than a single retention period."],
    ],
    marketNumbers: "Key market numbers", numberNote: "Only figures with traceable sources and clear market relevance are shown.", numbers: [["7 days", "Flock recommended deletion period"], ["$30.9M", "ICE Axon equipment purchased in July"], [">50%", "ICE field officers who received BWCs"]],
    goDeeper: "Need the full decision context?", goText: "Review signal evolution, SWOT, management decisions, and data limitations.", readReport: "Read market analysis", dataNote: "Updated from an authenticated IPVM Briefs session. The site stores only necessary metadata, summaries, and source links—not paid IPVM full text.",
    report: "Market Analysis", reportIntro: "Turning market signals into management judgments, decision summaries, and clear next steps.", reportVersion: "Report version", versions: ["Current week · Live", "Last week · Archived", "2026 W31 · Archived"], liveState: "Live update", archiveState: "Official archive", liveUse: "Includes this week's latest intelligence", archiveUse: "Uses archived intelligence",
    conclusions: "Key conclusions", conclusionItems: [["LPR governance is now part of product design.", "Flock moved its recommended deletion period to seven days and plans Evidence Mode for preservation. This is a recommended setting, not a mandate for all customers."], ["BWC accountability pressure can convert into rapid, large purchases.", "The ICE case shows that purchasing, field distribution, and footage-release policy may move on different timelines."], ["A new brief is not necessarily a new event.", "The ICE purchase occurred in July. Today's IPVM brief is a new policy and media signal, not a new August order."]],
    evolution: "How the signal is evolving", flow: [["Privacy and misuse concerns rise", "Media, public, and local-government pressure expands"], ["Vendor adjusts retention policy", "Seven-day recommendation pairs with evidence preservation"], ["Governance becomes a buying criterion", "Settings, permissions, audit, and workflow must be addressed together"]], assessment: "Analyst assessment", assessmentText: "For the BU, product positioning should cover device performance, evidence preservation, and auditable governance together—not leave data policy to a legal appendix.",
    decisions: "Management decision summary", decisionHeads: ["Priority", "Recommended action", "Owner", "Timing", "Next decision"], decisionRows: [["HIGH", "Map retention, Evidence Hold, access, and audit capabilities across LPR and BWC", "Product × Legal", "2 weeks", "Include in offer baseline?"], ["HIGH", "Build a complete delivery checklist for accelerated large-agency BWC rollouts", "Sales × Product", "3 weeks", "How should rollout and release policy be separated?"], ["MED", "Store brief publication date separately from the underlying event date", "Intel × Sales", "1 week", "Prevent duplicate order counting"]],
    swot: "SWOT", swotBadge: "This week", swotItems: [["STRENGTHS", "Capabilities available now", "Existing video hardware and vertical-market experience", "Ability to integrate hardware and backend workflow"], ["WEAKNESSES", "Gaps to close", "Governance capability is not yet a clear offer baseline", "Regional policy evidence must keep growing"], ["OPPORTUNITIES", "External changes to convert", "BWC accountability demand drives large rollouts", "Governance design can differentiate the offer"], ["THREATS", "Market-entry risks", "Privacy controversy can rapidly damage trust", "Policy and customer workflow needs may conflict"]],
    coverage: "Coverage & limitations", coverageItems: [["Analysis baseline", "Aug 8 — Aug 14"], ["Latest data check", "Aug 24 · 14:37"], ["Data status", "2 usable · 5 pending"]], coverageText: "On Aug 24, the 20 Briefs visible on IPVM's latest page were checked together with public sources. Items added from Aug 21–24 remain INDEXED or PENDING, so they do not rewrite the homepage or current analytical conclusions. Two briefs from the same Fox News interview were merged as one event; Covington, Santa Barbara, and Lebanon are labeled according to their actual pending vote, hearing, or proposal stage.",
    database: "Intelligence Database", dbIntro: "Traceable, searchable market intelligence with indexing completeness separated from analytical confidence.", stats: [["Items scanned", "24", "This IPVM + public-source sync"], ["Events merged", "02", "Same-event reports this sync"], ["New indexes", "08", "Aug 21 — Aug 24"], ["Database total", "20", "Last 30 days"], ["Pending items", "05", "Source confirmation pending"], ["Analysis-ready", "02", "Source confirmation complete"]],
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
  return <div className="view weekly-view"><PageIntro number="W35" eyebrow="THIS WEEK · 3 MIN READ" title={lang === "zh" ? "安防市場情報速覽" : "Security Market Brief"} description={t.hero} dateLabel={lang === "zh" ? "2026.08.24 · 最新資料至 08.24 · 分析基準 08.14" : "2026.08.24 · LATEST DATA 08.24 · ANALYSIS BASELINE 08.14"} />
    <section><div className="section-heading"><div><span className="eyebrow">01 · SIGNAL EVOLUTION</span><h2>{t.shifts}</h2></div><span className="count">02</span></div><div className="signal-grid two">{t.signals.map((signal, i) => <article className={`signal-card ${i === 0 ? "featured" : "dark"}`} key={signal.title}><div className="card-top"><span>{signal.tag}</span><span>W33</span></div><h3>{signal.title}</h3><p>{signal.body}</p><div className="why"><span>WHY IT MATTERS</span>{signal.why}</div><a href={signal.url} target="_blank" rel="noreferrer">{t.original} <span>↗</span></a></article>)}</div></section>
    <section className="impact-section"><div className="section-heading"><div><span className="eyebrow">POSSIBLE IMPACT</span><h2>{t.possibleImpact}</h2></div></div><div className="impact-grid">{t.impacts.map((item, i) => <div key={item[0]}><span className="impact-icon">{["P", "B", "L"][i]}</span><small>{item[0]}</small><h3>{item[1]}</h3><p>{item[2]}</p></div>)}</div></section>
    <section className="numbers-section"><div><span className="eyebrow">MARKET NUMBERS</span><h2>{t.marketNumbers}</h2><p>{t.numberNote}</p></div><div className="number-grid">{t.numbers.map((item) => <div key={item[0]}><strong>{item[0]}</strong><span>{item[1]}</span></div>)}</div></section>
    <div className="report-cta"><div><span className="eyebrow">GO DEEPER</span><h2>{t.goDeeper}</h2><p>{t.goText}</p></div><button onClick={onOpenReport}>{t.readReport} <span>→</span></button></div><p className="data-note">{t.dataNote}</p>
  </div>;
}

function ReportView({ lang, version, setVersion }: { lang: Lang; version: ReportVersion; setVersion: (value: ReportVersion) => void }) {
  const t = copy[lang]; const live = version === "live"; const versionIndex = version === "live" ? 0 : version === "last" ? 1 : 2;
  const reportWeek = version === "live" ? "W35" : version === "last" ? "W34" : "W31";
  return <div className="view report-view"><PageIntro number={reportWeek} eyebrow="MARKET ANALYSIS · DECISION VIEW" title={t.report} description={t.reportIntro} dateLabel={live ? (lang === "zh" ? "2026.08.24 · 最新資料至 08.24 · 分析基準 08.14" : "2026.08.24 · LATEST DATA 08.24 · ANALYSIS BASELINE 08.14") : lang === "zh" ? "正式封存" : "OFFICIAL ARCHIVE"} />
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
