export const CATEGORY_META = {
  student: { label: "學生問題", icon: "🎒", description: "先確保現場安全，再整理事件脈絡。" },
  parent: { label: "家長問題", icon: "💬", description: "保留往來紀錄，讓溝通有跡可循。" },
  school: { label: "學校／行政問題", icon: "🏫", description: "留下正式紀錄，了解可用的校內程序。" }
};

export function allCases(data) {
  return Object.entries(data).flatMap(([category, cases]) => cases.map((item) => ({ ...item, category })));
}
