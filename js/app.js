import { CATEGORY_META, GUIDE_SECTIONS, allCases } from "./cases.js";

const app = document.querySelector("#app");
const backButton = document.querySelector("#back-button");
let state = { cases: {}, laws: [], flatCases: [] };

async function loadData() {
  const [student, parent, school, laws] = await Promise.all([
    fetch("data/student.json").then((r) => r.json()),
    fetch("data/parent.json").then((r) => r.json()),
    fetch("data/school.json").then((r) => r.json()),
    fetch("data/laws.json").then((r) => r.json())
  ]);
  state = { cases: { student, parent, school }, laws, flatCases: allCases({ student, parent, school }) };
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function renderHome() {
  document.title = "師盾｜教師自保指南";
  backButton.hidden = true;
  app.innerHTML = `
    <section class="hero">
      <p class="eyebrow">TEACHER SHIELD / FIRST RESPONSE</p>
      <h1>🚨 老師，你現在遇到什麼狀況？</h1>
      <p class="hero-copy">先從事件開始，不用一次讀完所有法律。選擇最接近的情境，整理現在能做的事。</p>
      <div class="notice" role="note"><span aria-hidden="true">💡</span><div>如果你正處於立即危險，請先離開現場、尋求身邊的人協助，並視情況聯繫校安或警方。</div></div>
    </section>
    <section class="category-grid" aria-label="事件類型">
      ${Object.entries(CATEGORY_META).map(([key, meta]) => `
        <article class="category-card">
          <div class="category-heading"><span class="category-icon" aria-hidden="true">${meta.icon}</span><div><h2>${meta.label}</h2><p>${meta.description}</p></div></div>
          <nav class="case-list" aria-label="${meta.label}事件">
            ${state.cases[key].map((item) => `<a class="case-link" href="#case/${item.id}">${item.title}</a>`).join("")}
          </nav>
        </article>`).join("")}
    </section>`;
}

function renderLaw(law) {
  if (!law || law.status === "pending") return `<li class="law-item"><strong>相關法律資料待確認</strong><small>條文、官方來源與確認日期皆待補資料</small></li>`;
  return `<li class="law-item"><strong>${escapeHtml(law.name)}｜${escapeHtml(law.article)}</strong><small>最後確認：${escapeHtml(law.lastVerifiedDate)}</small><a href="${escapeHtml(law.officialSourceUrl)}" target="_blank" rel="noopener">查看官方來源</a></li>`;
}

function renderCase(item) {
  const meta = CATEGORY_META[item.category];
  document.title = `${item.title}｜師盾`;
  backButton.hidden = false;
  app.innerHTML = `
    <div class="breadcrumbs"><a class="back-link" href="#home">${meta.icon} ${meta.label}</a> ／ 事件處理</div>
    <section class="case-hero"><p class="eyebrow">CASE GUIDE / ${meta.label}</p><h1>${item.title}</h1><p>${item.summary}</p></section>
    <section class="case-layout">
      ${GUIDE_SECTIONS.map(([key, label], index) => {
        let content = "";
        if (key === "laws") {
          const laws = item.lawIds.map((id) => state.laws.find((law) => law.id === id));
          content = `<ul class="law-list">${laws.map(renderLaw).join("")}</ul>`;
        } else {
          content = `<ul>${(item[key] || []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`;
        }
        return `<article class="guide-card"><h2><span>${index + 1}</span>${label}</h2>${content}</article>`;
      }).join("")}
    </section>
    <a class="back-link" href="#home">← 回到事件列表</a>`;
  window.scrollTo(0, 0);
}

function route() {
  const id = decodeURIComponent(location.hash.replace(/^#case\//, ""));
  if (location.hash.startsWith("#case/")) {
    const item = state.flatCases.find((candidate) => candidate.id === id);
    item ? renderCase(item) : renderHome();
  } else renderHome();
  app.focus({ preventScroll: true });
}

backButton.addEventListener("click", () => { location.hash = "#home"; });

loadData().then(route).catch((error) => {
  console.error(error);
  app.innerHTML = `<div class="error-state"><h1>資料暫時無法載入</h1><p>請確認你是透過靜態伺服器開啟本網站，再重新整理頁面。</p></div>`;
});
window.addEventListener("hashchange", route);
