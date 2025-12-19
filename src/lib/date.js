export const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function toISO(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseISO(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function todayISO() {
  return toISO(new Date());
}

export function startOfWeekISO(iso, weekStartsOnMonday = true) {
  const d = parseISO(iso);
  const day = d.getDay(); // 0..6 (Sun..Sat)
  const offset = weekStartsOnMonday ? (day === 0 ? -6 : 1 - day) : -day;
  d.setDate(d.getDate() + offset);
  return toISO(d);
}

export function addDaysISO(iso, delta) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + delta);
  return toISO(d);
}

export function monthLabel(d) {
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}
