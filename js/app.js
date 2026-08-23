import { CATEGORY_META, allCases } from "./cases.js";

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
      <div class="notice" role="note"><span aria-hidden="true">💡</span><div>處理步驟：事件紀錄➡️蒐證➡️詢問校內正式處理程序➡️尋求法律協助</div></div>
    </section>
    <section class="category-grid" aria-label="事件類型">
      ${Object.entries(CATEGORY_META).map(([key, meta]) => `
        <article class="category-card">
          <a class="category-heading category-heading-link" href="#category/${key}"><span class="category-icon" aria-hidden="true">${meta.icon}</span><div><h2>${meta.label}</h2><p>${meta.description}</p></div></a>
          <nav class="case-list" aria-label="${meta.label}事件">
            ${state.cases[key].map((item) => `<a class="case-link" href="#case/${item.id}">${item.title}</a>`).join("")}
          </nav>
        </article>`).join("")}
    </section>`;
}

function lawText(item) {
  const laws = (item.lawIds || []).map((id) => state.laws.find((law) => law.id === id)).filter(Boolean);
  if (!laws.length || laws.every((law) => law.status === "pending")) return "待補資料";
  return laws.map((law) => law.article).join("／");
}

function renderExampleCard(item, index) {
  return `<article class="example-card">
    <p class="example-label">事例 ${index + 1}</p>
    <h2>${escapeHtml(item.title)}</h2>
    <p class="example-text">${escapeHtml(item.example || "案例範例待補資料")}</p>
    <div class="example-meta"><p><strong>可能涉及</strong>${escapeHtml(item.possible || lawText(item))}</p><p><strong>核心保護</strong>${escapeHtml(item.coreProtection || "待補資料")}</p></div>
  </article>`;
}

function renderCategory(category) {
  const meta = CATEGORY_META[category];
  const items = state.cases[category] || [];
  document.title = `${meta.label}案例｜師盾`;
  backButton.hidden = false;
  app.innerHTML = `<div class="breadcrumbs"><a class="back-link" href="#home">← 回到事件列表</a></div>
    <section class="case-hero"><p class="eyebrow">CASE EXAMPLES / ${meta.label}</p><h1>${meta.icon} ${meta.label}</h1><p>${meta.description}</p></section>
    <section class="example-list" aria-label="${meta.label}案例">${items.map(renderExampleCard).join("")}</section>`;
  window.scrollTo(0, 0);
}

function renderCase(item) {
  const meta = CATEGORY_META[item.category];
  document.title = `${item.title}｜師盾`;
  backButton.hidden = false;
  app.innerHTML = `<div class="breadcrumbs"><a class="back-link" href="#category/${item.category}">← ${meta.label}案例</a></div>
    <section class="case-hero"><p class="eyebrow">CASE EXAMPLE / ${meta.label}</p><h1>${item.title}</h1><p>${item.summary}</p></section>
    <section class="example-list">${renderExampleCard(item, 0)}</section>`;
  window.scrollTo(0, 0);
}

function route() {
  const [routeName, routeId] = location.hash.replace(/^#/, "").split("/");
  const id = decodeURIComponent(routeId || "");
  if (routeName === "category") {
    renderCategory(id);
    app.focus({ preventScroll: true });
    return;
  }
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
