import React, { useMemo } from "react";
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
                카드 클릭 시 이동 →
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
