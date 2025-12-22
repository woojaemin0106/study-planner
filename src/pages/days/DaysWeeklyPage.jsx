import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/** -------- date utils -------- */
function pad2(n) {
  return String(n).padStart(2, "0");
}
function toISO(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function fromISO(iso) {
  const [y, m, dd] = iso.split("-").map(Number);
  return new Date(y, m - 1, dd);
}
/** Monday-start week */
function getWeekStartISO(anchorISO) {
  const d = fromISO(anchorISO);
  const day = d.getDay(); // 0 Sun ~ 6 Sat
  const diffToMon = (day + 6) % 7; // Mon=0, Sun=6
  d.setDate(d.getDate() - diffToMon);
  return toISO(d);
}
function addDaysISO(iso, n) {
  const d = fromISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
function formatRangeLabel(weekStartISO) {
  const start = fromISO(weekStartISO);
  const end = fromISO(addDaysISO(weekStartISO, 6));
  const s = `${start.getFullYear()}.${pad2(start.getMonth() + 1)}.${pad2(
    start.getDate()
  )}`;
  const e = `${end.getFullYear()}.${pad2(end.getMonth() + 1)}.${pad2(
    end.getDate()
  )}`;
  return `${s} ~ ${e}`;
}
function safeJSONParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

const DOW_KO_BY_GETDAY = [
  "일요일",
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
];
const CHART_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

export default function DaysWeeklyPage() {
  const navigate = useNavigate();

  const todayISO = useMemo(() => toISO(new Date()), []);
  const [anchorISO, setAnchorISO] = useState(todayISO);

  const weekStartISO = useMemo(() => getWeekStartISO(anchorISO), [anchorISO]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysISO(weekStartISO, i)),
    [weekStartISO]
  );

  const storageKey = useMemo(
    () => `study-planner:weekly:${weekStartISO}`,
    [weekStartISO]
  );

  // { days: { [dateISO]: { tasks: [{id,text,done,createdAt}] } } }
  const [weekly, setWeekly] = useState({ days: {} });

  // add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDayISO, setModalDayISO] = useState("");
  const [modalText, setModalText] = useState("");

  /** load */
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const loaded = safeJSONParse(raw, { days: {} });

    const normalized = { days: { ...(loaded.days || {}) } };
    weekDates.forEach((iso) => {
      if (!normalized.days[iso]) normalized.days[iso] = { tasks: [] };
      if (!Array.isArray(normalized.days[iso].tasks))
        normalized.days[iso].tasks = [];
    });

    setWeekly(normalized);
  }, [storageKey, weekDates]);

  /** save */
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(weekly));
  }, [storageKey, weekly]);

  /** actions */
  const addTask = (dayISO, text) => {
    const v = text.trim();
    if (!v) return;

    setWeekly((prev) => {
      const day = prev.days?.[dayISO] || { tasks: [] };
      const nextTask = {
        id: uid(),
        text: v,
        done: false,
        createdAt: Date.now(),
      };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayISO]: { ...day, tasks: [nextTask, ...(day.tasks || [])] },
        },
      };
    });
  };

  const toggleTask = (dayISO, taskId) => {
    setWeekly((prev) => {
      const day = prev.days?.[dayISO] || { tasks: [] };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayISO]: {
            ...day,
            tasks: (day.tasks || []).map((t) =>
              t.id === taskId ? { ...t, done: !t.done } : t
            ),
          },
        },
      };
    });
  };

  const removeTask = (dayISO, taskId) => {
    setWeekly((prev) => {
      const day = prev.days?.[dayISO] || { tasks: [] };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayISO]: {
            ...day,
            tasks: (day.tasks || []).filter((t) => t.id !== taskId),
          },
        },
      };
    });
  };

  const openAddModal = () => {
    setModalDayISO(weekDates[0] || weekStartISO);
    setModalText("");
    setIsModalOpen(true);
  };

  const submitModal = () => {
    addTask(modalDayISO, modalText);
    setIsModalOpen(false);
  };

  /** metrics */
  const { total, done, percent, perDayPercent } = useMemo(() => {
    const allTasks = weekDates.flatMap(
      (iso) => weekly.days?.[iso]?.tasks || []
    );
    const d = allTasks.filter((t) => t.done).length;
    const t = allTasks.length;
    const p = t === 0 ? 0 : Math.round((d / t) * 100);

    const per = weekDates.map((iso) => {
      const tasks = weekly.days?.[iso]?.tasks || [];
      if (tasks.length === 0) return 0;
      const dd = tasks.filter((x) => x.done).length;
      return Math.round((dd / tasks.length) * 100);
    });

    return { total: t, done: d, percent: p, perDayPercent: per };
  }, [weekly, weekDates]);

  /** routines (UI only for now) */
  const routines = [
    {
      id: "morning",
      title: "아침 루틴",
      items: ["영어 단어 읽기", "아침 기상"],
    },
    { id: "exam", title: "시험 대비", items: ["시험 20분 전", "오답 노트"] },
    {
      id: "coding",
      title: "코딩 루틴",
      items: ["백준 문제 풀기", "오전 루틴!"],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1500px] px-10 py-12">
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
        {/* LEFT SIDEBAR */}
        <aside className="shrink-0 lg:w-[220px]">
          <Link
            to="/Days"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Days로 돌아가기
          </Link>

          <div className="mt-6 text-2xl font-extrabold text-gray-900">주간</div>
          <div className="mt-3 text-sm font-semibold text-gray-500">
            {formatRangeLabel(weekStartISO)}
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          {/* header: title + date controls (너희가 유지하고 싶어서 남김) */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900">Week-List</h1>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAnchorISO(addDaysISO(anchorISO, -7))}
                className="h-11 w-11 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.99]"
                title="이전 주"
              >
                ←
              </button>

              <input
                type="date"
                value={anchorISO}
                onChange={(e) => setAnchorISO(e.target.value)}
                className="h-11 w-[240px] rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900"
              />

              <button
                type="button"
                onClick={() => setAnchorISO(addDaysISO(anchorISO, 7))}
                className="h-11 w-11 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-[0.99]"
                title="다음 주"
              >
                →
              </button>
            </div>
          </div>

          {/* FIGMA GRID
              lg에서 6컬럼 고정:
              [Day, Day, Day, Day, Donut, (empty)]
              [Day, Day, Day, Chart, Routines(span2)]
          */}
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-[repeat(4,220px)_240px_240px] lg:gap-6">
            {/* Row 1: Mon~Thu */}
            {weekDates.slice(0, 4).map((dayISO) => {
              const d = fromISO(dayISO);
              const title = DOW_KO_BY_GETDAY[d.getDay()];
              const tasks = weekly.days?.[dayISO]?.tasks || [];

              return (
                <DayCard
                  key={dayISO}
                  title={title}
                  dateLabel={`${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`}
                  tasks={tasks}
                  onToggle={(taskId) => toggleTask(dayISO, taskId)}
                  onRemove={(taskId) => removeTask(dayISO, taskId)}
                  onGoDaily={() => navigate(`/Days/daily?date=${dayISO}`)}
                />
              );
            })}

            {/* Row 1: Donut (col 5) */}
            <WeeklyDonut percent={percent} done={done} total={total} />

            {/* Row 1: empty (col 6) - 피그마 여백 */}
            <div className="hidden lg:block" />

            {/* Row 2: Fri~Sun */}
            {weekDates.slice(4, 7).map((dayISO) => {
              const d = fromISO(dayISO);
              const title = DOW_KO_BY_GETDAY[d.getDay()];
              const tasks = weekly.days?.[dayISO]?.tasks || [];

              return (
                <DayCard
                  key={dayISO}
                  title={title}
                  dateLabel={`${pad2(d.getMonth() + 1)}/${pad2(d.getDate())}`}
                  tasks={tasks}
                  onToggle={(taskId) => toggleTask(dayISO, taskId)}
                  onRemove={(taskId) => removeTask(dayISO, taskId)}
                  onGoDaily={() => navigate(`/Days/daily?date=${dayISO}`)}
                />
              );
            })}

            {/* Row 2: Chart (col 4) */}
            <WeekBarChart values={perDayPercent} />

            {/* Row 2: Routines (col 5~6 span2) */}
            <RoutinePanel routines={routines} className="lg:col-span-2" />
          </div>

          {/* Add button (피그마처럼 왼쪽 아래) */}
          <button
            type="button"
            onClick={openAddModal}
            className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-7 py-5 text-sm font-semibold text-gray-900 shadow-sm transition hover:shadow-md active:scale-[0.99]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-extrabold">
              +
            </span>
            새로 할 일 추가
          </button>
        </main>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} title="할 일 추가">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-500">
                요일 선택
              </label>
              <select
                value={modalDayISO}
                onChange={(e) => setModalDayISO(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-900"
              >
                {weekDates.map((iso) => {
                  const d = fromISO(iso);
                  const dow = d.getDay();
                  return (
                    <option key={iso} value={iso}>
                      {DOW_KO_BY_GETDAY[dow]} ({pad2(d.getMonth() + 1)}/
                      {pad2(d.getDate())})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500">
                내용
              </label>
              <input
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitModal();
                }}
                placeholder="예) 알고리즘 2문제"
                className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-11 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-800 hover:bg-gray-200 active:scale-[0.99]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={submitModal}
                className="h-11 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 active:scale-[0.99]"
              >
                추가
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/** -------- UI components -------- */

function DayCard({ title, dateLabel, tasks, onToggle, onRemove, onGoDaily }) {
  const preview = tasks.slice(0, 3);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-extrabold text-gray-900">{title}</div>
          <div className="mt-1 text-xs font-semibold text-gray-500">
            {dateLabel}
          </div>
        </div>

        {/* 나중에 DropdownMenu 붙일 자리 */}
        <button
          type="button"
          className="grid h-9 w-9 place-items-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100"
          title="옵션(추후)"
          aria-label="옵션"
        >
          ⋮
        </button>
      </div>

      <div className="mt-3 rounded-xl bg-gray-50 px-3 py-3">
        {preview.length === 0 ? (
          <div className="text-center text-xs font-semibold text-gray-500">
            할 일을 추가해주세요.
          </div>
        ) : (
          <ul className="space-y-2">
            {preview.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between gap-2"
              >
                <label className="flex min-w-0 items-center gap-2">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => onToggle(t.id)}
                    className="h-4 w-4"
                  />
                  <span
                    className={[
                      "min-w-0 truncate text-xs font-semibold",
                      t.done ? "text-gray-400 line-through" : "text-gray-900",
                    ].join(" ")}
                    title={t.text}
                  >
                    {t.text}
                  </span>
                </label>
                <button
                  type="button"
                  onClick={() => onRemove(t.id)}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-700"
                  title="삭제"
                >
                  x
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={onGoDaily}
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.99]"
        >
          보기
        </button>
      </div>
    </div>
  );
}

function WeeklyDonut({ percent, done, total }) {
  const ringStyle = {
    background: `conic-gradient(#2563eb ${percent}%, #e5e7eb 0)`,
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-extrabold text-gray-900 text-center">
        주간 성취도
      </div>

      <div className="mt-4 grid place-items-center">
        <div
          className="grid h-24 w-24 place-items-center rounded-full"
          style={ringStyle}
        >
          <div className="grid h-16 w-16 place-items-center rounded-full bg-white">
            <div className="text-lg font-extrabold text-gray-900">
              {percent}%
            </div>
          </div>
        </div>

        <div className="mt-2 text-sm font-semibold text-blue-600">
          {done}/{total} 완료
        </div>
      </div>
    </div>
  );
}

function WeekBarChart({ values }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-sm font-extrabold text-gray-900">요일별 성취도</div>

      <div className="mt-3 h-28 w-full rounded-xl bg-gray-50 p-3">
        <div className="flex h-full items-end justify-between gap-2">
          {values.map((v, idx) => (
            <div key={idx} className="flex w-full flex-col items-center gap-2">
              <div className="relative h-20 w-full rounded-md bg-gray-200">
                <div
                  className="absolute bottom-0 left-0 w-full rounded-md bg-blue-600"
                  style={{ height: `${v}%` }}
                  title={`${CHART_LABELS[idx]} ${v}%`}
                />
              </div>
              <div className="text-[11px] font-semibold text-gray-600">
                {CHART_LABELS[idx]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** 피그마처럼: 추천 루틴 “패널 1개” + 내부 3개 카드 가로 */
function RoutinePanel({ routines, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="text-base font-extrabold text-gray-900">추천 루틴</div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {routines.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-extrabold text-gray-900">
                {r.title}
              </div>
              <button
                type="button"
                className="rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 active:scale-[0.99]"
                title="저장(추후)"
              >
                저장
              </button>
            </div>

            <ul className="mt-3 space-y-1">
              {r.items.map((it, i) => (
                <li key={`${r.id}-${i}`} className="text-sm text-gray-700">
                  • {it}
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700 active:scale-[0.99]"
                title="바로가기(추후)"
              >
                바로가기
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-500">
        추천 루틴 저장/적용은 다음 PR에서 템플릿 기능으로 연결하면 됩니다.
      </p>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-3">
          <div className="text-base font-extrabold text-gray-900">{title}</div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
            title="닫기"
          >
            x
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
