import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CircularProgressBar from "../../components/CircularProgressBar";

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
function safeJSONParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

const DOW_KO = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "일요일"];
const CHART_LABELS = ["월", "화", "수", "목", "금", "토", "일"];

const DEFAULT_ROUTINES = [
  { title: "아침 루틴", items: ["영어 단어 읽기", "아침 기상"], color: "blue" },
  { title: "시험 대비", items: ["시험 20분 전", "오답 노트"], color: "purple" },
  { title: "코딩 루틴", items: ["백준 문제 풀기", "오전 루틴"], color: "blue" },
];

export default function DaysWeeklyPage() {
  const navigate = useNavigate();
  const todayISO = useMemo(() => toISO(new Date()), []);
  const [anchorISO, setAnchorISO] = useState(todayISO);
  const weekStartISO = useMemo(() => getWeekStartISO(anchorISO), [anchorISO]);
  const weekDates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDaysISO(weekStartISO, i)),
    [weekStartISO]
  );

  const storageKey = useMemo(() => `study-planner:weekly:${weekStartISO}`, [weekStartISO]);
  const configKey = useMemo(() => `study-planner:weekly-config:${weekStartISO}`, [weekStartISO]);
  const [weekly, setWeekly] = useState({ days: {} });
  const [visibleCount, setVisibleCount] = useState(7);

  /** load */
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    const loaded = safeJSONParse(raw, { days: {} });
    const normalized = { days: { ...(loaded.days || {}) } };
    
    // Config for visible days
    const configRaw = localStorage.getItem(configKey);
    const config = safeJSONParse(configRaw, { visibleCount: 7 }); 
    setVisibleCount(config.visibleCount);

    // Initialize mock data if empty
    weekDates.forEach((iso, idx) => {
      if (!normalized.days[iso] || normalized.days[iso].tasks.length === 0) {
        if (idx === 0) {
          normalized.days[iso] = { tasks: [
            { id: 1, text: "영어 단어 30개", done: true },
            { id: 2, text: "복습 20분", done: false },
            { id: 3, text: "문제 1세트 풀기", done: false },
          ]};
        } else if (idx === 1) {
          normalized.days[iso] = { tasks: [
            { id: 4, text: "알고리즘 2문제 풀기", done: true },
            { id: 5, text: "풀이 과정 정리", done: false },
            { id: 6, text: "오답 노트 업데이트", done: false },
          ]};
        } else {
          normalized.days[iso] = { tasks: [
            { id: Math.random(), text: "할 일 추가예시", done: false },
          ]};
        }
      }
    });

    setWeekly(normalized);
  }, [storageKey, configKey, weekDates]);

  /** save */
  useEffect(() => {
    if (Object.keys(weekly.days).length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(weekly));
    }
  }, [storageKey, weekly]);

  /** actions */
  const handleAddDay = () => {
    if (visibleCount < 7) {
      const next = visibleCount + 1;
      setVisibleCount(next);
      localStorage.setItem(configKey, JSON.stringify({ visibleCount: next }));
    } else {
      const nextWeekStart = addDaysISO(weekStartISO, 7);
      setAnchorISO(nextWeekStart);
      // Ensure the next week starts with 1 day visible
      localStorage.setItem(`study-planner:weekly-config:${nextWeekStart}`, JSON.stringify({ visibleCount: 1 }));
      setVisibleCount(1);
    }
  };

  const addTask = (dayISO, text = "새로운 할 일") => {
    const v = text.trim();
    if (!v) return;
    setWeekly((prev) => {
      const day = prev.days[dayISO] || { tasks: [] };
      const nextTask = {
        id: Date.now() + Math.random(),
        text: v,
        done: false,
      };
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayISO]: { ...day, tasks: [...day.tasks, nextTask] },
        },
      };
    });
  };

  const removeTask = (dayISO, taskId) => {
    setWeekly((prev) => {
      const day = prev.days[dayISO];
      if (!day) return prev;
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayISO]: {
            ...day,
            tasks: day.tasks.filter((t) => t.id !== taskId),
          },
        },
      };
    });
  };

  const toggleTask = (dayISO, taskId) => {
    setWeekly((prev) => {
      const day = prev.days[dayISO];
      if (!day) return prev;
      return {
        ...prev,
        days: {
          ...prev.days,
          [dayISO]: {
            ...day,
            tasks: day.tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t),
          },
        },
      };
    });
  };

  /** metrics */
  const visibleDates = useMemo(() => weekDates.slice(0, visibleCount), [weekDates, visibleCount]);

  const { total, done, percent, perDayPercent } = useMemo(() => {
    const allTasks = visibleDates.flatMap((iso) => weekly.days?.[iso]?.tasks || []);
    const d = allTasks.filter((t) => t.done).length;
    const t = allTasks.length;
    const p = t === 0 ? 0 : Math.round((d / t) * 100);

    const per = weekDates.map((iso, idx) => {
      if (idx >= visibleCount) return 0; // Hide bars for non-visible days
      const tasks = weekly.days?.[iso]?.tasks || [];
      if (tasks.length === 0) return 0;
      const dd = tasks.filter((x) => x.done).length;
      return Math.round((dd / tasks.length) * 100);
    });

    // Add average of the week
    const avg = per.filter(v => v > 0).length > 0
      ? Math.round(per.reduce((a, b) => a + b, 0) / per.filter(v => v > 0).length)
      : 0;
    
    return { total: t, done: d, percent: p, perDayPercent: [...per, avg] };
  }, [weekly, weekDates, visibleDates, visibleCount]);

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 px-20 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: Weekly Cards */}
          <div className="flex-1 flex flex-col">
            <div className="mb-8 flex flex-col gap-4">
              <Link to="/Days" className="text-blue-600 text-sm font-bold flex items-center gap-1 mb-4">
                <span className="text-lg">←</span> Days로 돌아가기
              </Link>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-[40px] font-black text-gray-900 leading-none">주간</h1>
                  <div className="flex items-baseline gap-4 mt-2">
                    <h2 className="text-[28px] font-bold text-gray-900 leading-none">Week-List</h2>
                    <p className="text-gray-400 font-bold text-xl">{anchorISO}</p>
                  </div>
                </div>
                {/* Week Pagination */}
                <div className="flex items-center gap-2 pr-4">
                  <button 
                    onClick={() => setAnchorISO(addDaysISO(anchorISO, -7))}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-bold"
                  >
                    ←
                  </button>
                  <button 
                    onClick={() => setAnchorISO(addDaysISO(anchorISO, 7))}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all font-bold"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start content-start">
              {visibleDates.map((iso, idx) => {
                const d = fromISO(iso);
                const dayName = DOW_KO[idx];
                const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
                const dayData = weekly.days[iso] || { tasks: [] };
                return (
                  <DayCard 
                    key={iso}
                    title={dayName}
                    date={dateLabel}
                    tasks={dayData.tasks}
                    onToggle={(taskId) => toggleTask(iso, taskId)}
                    onGoDaily={() => navigate(`/Days/daily?date=${iso}`)}
                    onAddTask={(text) => addTask(iso, text)}
                  />
                );
              })}
              <div 
                onClick={handleAddDay}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group min-h-[220px] flex-col justify-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                  +
                </div>
                <span className="font-bold text-gray-700">새로 할 일 추가</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Status & Chart */}
          <div className="w-full lg:w-[480px] flex flex-col gap-6">
            
            {/* Weekly Achievement */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center gap-4">
              <h3 className="text-lg font-black text-gray-900">주간 성취도</h3>
              <CircularProgressBar progress={percent} />
              <p className="text-blue-600 font-black text-xl">{done}/{total} 완료</p>
            </div>

            {/* Daily Chart */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-lg font-black text-gray-900">요일별 성취도</h3>
              <WeekBarChart values={perDayPercent} />
            </div>

            {/* Recommended Routines */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-xl font-black text-gray-900">추천 루틴</h3>
              <div className="grid grid-cols-3 gap-3">
                {DEFAULT_ROUTINES.map((routine, i) => (
                  <RoutineCard key={i} {...routine} />
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function DayCard({ title, date, tasks, onToggle, onGoDaily, onAddTask }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");

  const handleAdd = () => {
    if (newText.trim()) {
      onAddTask(newText);
      setNewText("");
      setIsAdding(false);
    } else {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col min-h-[220px]">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-extrabold text-gray-900 text-base">{title}</h4>
          <p className="text-gray-400 text-xs font-bold">{date}</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-gray-300 font-bold text-xl px-2 hover:text-gray-500"
        >
          ⋮
        </button>
      </div>

      <div className="flex-1 space-y-2 mt-2">
        {tasks.map(t => (
          <div key={t.id} className="flex items-center gap-2">
            <div 
              onClick={() => onToggle(t.id)}
              className={`w-4 h-4 rounded flex items-center justify-center cursor-pointer transition-all border ${t.done ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-50 border-gray-200'}`}
            >
              {t.done && <span className="text-[8px] font-black transform scale-125">✓</span>}
            </div>
            <span className={`text-[11px] font-bold truncate ${t.done ? 'text-gray-300 line-through' : 'text-gray-700'}`}>
              {t.text}
            </span>
          </div>
        ))}
        {isAdding && (
          <input 
            autoFocus
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onBlur={handleAdd}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="할 일 입력"
            className="text-[11px] font-bold w-full bg-blue-50 rounded px-1 outline-none"
          />
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button 
          onClick={onGoDaily}
          className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          보기
        </button>
      </div>
    </div>
  );
}

const BAR_LABELS = ["월", "화", "수", "목", "금", "토", "일", "평균"];

function WeekBarChart({ values }) {
  const yLabels = [100, 75, 45, 0];
  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="relative h-[140px] w-full mt-4">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-1 pointer-events-none">
          {yLabels.map(label => (
            <div key={label} className="flex items-center gap-2 h-0">
              <span className="text-[10px] font-bold text-gray-300 w-6 text-right">{label}</span>
              <div className="flex-1 border-t border-gray-100"></div>
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="absolute inset-0 flex items-end justify-between px-6 pb-[2px]">
          {values.slice(0, 8).map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group relative flex-1">
              {/* Persistent Value Label */}
              {v > 0 && (
                <span className="absolute -top-5 text-[9px] font-black text-blue-600 transition-all duration-300">
                  {v}%
                </span>
              )}
              <div 
                className="w-5 bg-blue-600 rounded-t-sm transition-all duration-500 ease-out mx-auto shadow-[0_-2px_4px_rgba(37,99,235,0.2)]"
                style={{ height: `${v}%`, transitionDelay: `${i * 50}ms` }}
              >
                {/* Tooltip on hover (extra) */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  {v}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Labels */}
      <div className="flex items-center justify-between px-6 pl-[38px]">
        {BAR_LABELS.map((l, i) => (
          <span key={i} className={`text-[10px] font-black flex-1 text-center ${i === 7 ? 'text-blue-600' : 'text-gray-400'}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function RoutineCard({ title, items }) {
  return (
    <div className="min-w-[120px] bg-gray-50 rounded-2xl p-4 flex flex-col gap-3 relative">
      <div>
        <h4 className="font-black text-gray-900 text-[11px]">{title}</h4>
        <ul className="mt-2 flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={i} className="text-gray-400 text-[9px] font-bold flex items-center gap-1">
              <span>•</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-gray-300 text-[8px] font-bold">저장</span>
        <button className="bg-blue-600 text-white text-[9px] font-black py-1 px-2 rounded-lg">
          바로가기
        </button>
      </div>
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
