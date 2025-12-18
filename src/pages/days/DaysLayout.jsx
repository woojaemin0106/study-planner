import React, { useMemo } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

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
  const location = useLocation();

  const activeKey = useMemo(() => {
    const seg = location.pathname.split("/").filter(Boolean);
    const key = seg[1] || "daily";
    return ["daily", "weekly", "monthly"].includes(key) ? key : "daily";
  }, [location.pathname]);
  //나중에 supabase에서 데이터 받아와서 요약정보 표시하도록 수정 필요
  const summary = {
    daily: { a: "오늘 할 일", b: "3개", c: "완료", d: "0개" },
    weekly: { a: "주간 목표", b: "5개", c: "진행률", d: "0%" },
    monthly: { a: "이번 달", b: "12건", c: "중요 일정", d: "0건" },
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-extrabold text-gray-900">Days</h1>
        <p className="text-sm text-gray-600">
          일간/주간/월간을 한눈에 보고, 클릭해서 해당 페이지로 이동하세요.
        </p>
      </div>

      {/* Overview cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => {
          const isActive = activeKey === card.key;
          const s = summary[card.key];

          return (
            <Link
              key={card.key}
              to={card.to}
              className={[
                "min-h-100 flex flex-col group rounded-2xl border bg-white p-5 shadow-sm transition",
                "hover:-translate-y-0.5 hover:shadow-md",
                "active:scale-[0.99]",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                isActive
                  ? "border-blue-300 ring-1 ring-blue-200"
                  : "border-gray-200 hover:border-gray-300",
              ].join(" ")}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    {card.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">{card.desc}</p>
                </div>

                {/* active pill */}
                <span
                  className={[
                    "rounded-full px-2.5 py-1 text-xs font-semibold",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                  ].join(" ")}
                >
                  {isActive ? "현재 보기" : "이동"}
                </span>
              </div>

              {/* lightweight summary */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">{s.a}</p>
                  <p className="mt-1 text-base font-extrabold text-gray-900">
                    {s.b}
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">{s.c}</p>
                  <p className="mt-1 text-base font-extrabold text-gray-900">
                    {s.d}
                  </p>
                </div>
              </div>

              <div className="mt-auto text-sm font-semibold text-blue-600">
                {card.title} 페이지 열기 →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
