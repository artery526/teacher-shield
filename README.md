# teacher-shield

「師盾｜教師自保指南」是一個 Mobile First、資料驅動的原生靜態網站前端範例。

## 目的

不要讓教師先查法律，而是從正在遭遇的事件出發，協助整理：立即安全、自我紀錄、蒐證、校內程序、可能相關法律，以及何時尋求專業協助。

## 技術與結構

- HTML、CSS、Vanilla JavaScript，無 React 或其他前端框架。
- `index.html`：單頁入口與共用頁尾。
- `css/style.css`：Mobile First 響應式樣式，支援 320px 寬度。
- `js/app.js`：資料載入、路由與畫面渲染。
- `js/cases.js`：分類 metadata、處理頁區塊定義與資料工具。
- `data/student.json`、`parent.json`、`school.json`：事件內容。
- `data/laws.json`：獨立法律資料；事件只透過 `lawIds` 引用。

## 本地預覽

因為瀏覽器的 ES Module 與 `fetch` 需要 HTTP 來源，請用任一靜態伺服器預覽，例如：

```bash
python -m http.server 8080
```

再開啟 <http://localhost:8080>。

## 法律資料狀態

目前所有法律項目皆為「待補資料」，沒有自行虛構法條、條號或官方連結。補入資料時，請同時填寫法律名稱、條文、官方來源 URL 與最後確認日期。

## GitHub

本專案先完成本地 Git 初始化。若 GitHub CLI 已登入且具備建立 private repository 的權限，可執行：

```bash
gh repo create teacher-shield --private --source . --remote origin --push
```
