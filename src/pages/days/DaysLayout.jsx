import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const cards = [
  {
    key: "daily",
    title: "일간",
    desc: "오늘 할 일 · 백로그 · 빠른 체크",
    to: "/Days/daily",
  },
  {
    key: "weekly",
    title: "주간",
    desc: "이번 주 계획 · 요일별 분배",
    to: "/Days/weekly",
  },
  {
    key: "monthly",
    title: "월간",
    desc: "월간 흐름 · 큰 일정 확인",
    to: "/Days/monthly",
  },
];

export default function DaysLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredKey, setHoveredKey] = useState(null);

  const [summary, setSummary] = useState({
    daily: { a: "오늘 할 일", b: "0개", c: "완료", d: "0개" },
    weekly: { a: "주간 목표", b: "0개", c: "진행률", d: "0%" },
    monthly: { a: "이번 달", b: "0개", c: "완료", d: "0개" },
  });

  useEffect(() => {
    const pad2 = (n) => String(n).padStart(2, "0");
    const now = new Date();
    const todayISO = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;

    const getWeekStartISO = (dateStr) => {
      const [y, m, dd] = dateStr.split("-").map(Number);
      const d = new Date(y, m - 1, dd);
      const day = d.getDay(); 
      const diffToMon = (day + 6) % 7;
      d.setDate(d.getDate() - diffToMon);
      return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    };

    // 1. Daily Sync
    const dailyRaw = localStorage.getItem(`study-planner:daily-board:${todayISO}`);
    let dTotal = 0, dDone = 0;
    if (dailyRaw) {
      const dData = JSON.parse(dailyRaw);
      const cards = dData.lists.flatMap(l => l.cards);
      dTotal = cards.length;
      dDone = cards.filter(c => c.done).length;
    }

    // 2. Weekly Sync
    const weekStart = getWeekStartISO(todayISO);
    const weeklyRaw = localStorage.getItem(`study-planner:weekly:${weekStart}`);
    let wTotal = 0, wDone = 0;
    if (weeklyRaw) {
      const wData = JSON.parse(weeklyRaw);
      Object.values(wData.days || {}).forEach(day => {
        if (day.tasks) {
          wTotal += day.tasks.length;
          wDone += day.tasks.filter(t => t.done).length;
        }
      });
    }

    // 3. Monthly Sync
    const monthlyRaw = localStorage.getItem('study-planner:monthly-board');
    let mTotal = 0, mDone = 0;
    if (monthlyRaw) {
      const mData = JSON.parse(monthlyRaw);
      mTotal = mData.length;
      mDone = mData.filter(d => d.completed).length;
    }

    setSummary({
      daily: { a: "오늘 할 일", b: `${dTotal}개`, c: "완료", d: `${dDone}개` },
      weekly: { a: "주간 목표", b: `${wTotal}개`, c: "진행률", d: `${wTotal > 0 ? Math.round((wDone / wTotal) * 100) : 0}%` },
      monthly: { a: "이번 달", b: `${mTotal}개`, c: "완료", d: `${mDone}개` },
    });
  }, []);

  const templates = [
    {
      id: "morning",
      title: "아침 루틴",
      items: ["영단어 30개", "복습 20분", "문제 1세트"],
    },
    {
      id: "exam",
      title: "시험 대비",
      items: ["기출 2회", "오답 정리", "요약 노트"],
    },
    {
      id: "coding",
      title: "코테 루틴",
      items: ["알고리즘 2문제", "풀이 정리", "복습 체크"],
    },
  ];

  const activeKey = useMemo(() => {
    const seg = location.pathname.split("/").filter(Boolean);
    const key = seg[1] || "daily";
    return ["daily", "weekly", "monthly"].includes(key) ? key : "daily";
  }, [location.pathname]);

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-2 transition-all">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900">Days</h1>
        <p className="text-sm md:text-base text-gray-400 font-bold">
          일간/주간/월간을 한눈에 보고, 클릭해서 해당 페이지로 이동하세요.
        </p>
      </div>

      {/* Overview cards */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const isHovered = hoveredKey === card.key;
          const showCurrentView = isHovered;
          const s = summary[card.key];

          return (
            <Link
              key={card.key}
              to={card.to}
              onPointerEnter={() => {
                setHoveredKey(card.key);
              }}
              onPointerLeave={() => {
                setHoveredKey(null);
              }}
              className={[
                "min-h-100 flex flex-col group rounded-3xl border bg-white p-6 shadow-sm transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-xl",
                "active:scale-[0.98]",
                isHovered
                  ? "border-blue-500 bg-blue-50/10"
                  : "border-gray-100 bg-white",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400 font-bold leading-tight">{card.desc}</p>
                </div>

                <span
                  className={[
                    "rounded-full px-4 py-1.5 text-xs font-black transition-all duration-300",
                    showCurrentView
                      ? "bg-blue-600 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-400 font-bold",
                  ].join(" ")}
                >
                  {showCurrentView ? "현재 보기" : "이동"}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-gray-50 p-4 border border-transparent group-hover:bg-white group-hover:border-blue-100 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{s.a}</p>
                  <p className="mt-1 text-xl font-black text-gray-900">
                    {s.b}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4 border border-transparent group-hover:bg-white group-hover:border-blue-100 transition-colors">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{s.c}</p>
                  <p className="mt-1 text-xl font-black text-gray-900">
                    {s.d}
                  </p>
                </div>
              </div>

              <div className="mt-8 text-sm font-black text-blue-600 flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                카드 클릭 시 이동 <span className="text-lg">→</span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Templates 섹션 */}
      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-gray-900">최근 루틴</h3>
            <p className="mt-1 text-sm text-gray-600">
              클릭하면 일간 페이지로 이동합니다. (추후: 할 일 자동 추가)
            </p>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-blue-600 hover:underline"
            onClick={() => navigate("/Days/daily")}
          >
            일간으로 이동 →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() =>
                navigate("/Days/daily", {
                  state: { templateTitle: t.title, templateItems: t.items },
                })
              }
              className="group rounded-2xl border border-gray-200 bg-gray-50 p-5 text-left transition hover:bg-white hover:shadow-sm active:scale-[0.99]"
            >
              <div className="flex items-start justify-between">
                <p className="text-base font-extrabold text-gray-900">
                  {t.title}
                </p>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 group-hover:bg-gray-200">
                  적용
                </span>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-gray-600">
                {t.items.map((it) => (
                  <li key={it}>• {it}</li>
                ))}
              </ul>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
