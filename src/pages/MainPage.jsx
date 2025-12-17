import React from "react";
import { Link } from "react-router-dom";

export default function MainPage() {
  const quickLinks = [
    {
      title: "Days",
      desc: "오늘 날짜 · 할 일 · 백로그를 한 화면에서 관리",
      to: "/Days",
      cta: "오늘 플래너 열기",
    },
    {
      title: "Timer",
      desc: "공부 시작/종료로 오늘 공부 시간을 자동 기록",
      to: "/Timer",
      cta: "타이머 시작하기",
    },
    {
      title: "Challenges",
      desc: "주간 달성률과 진행 상황을 퍼센트로 확인",
      to: "/Challenges",
      cta: "달성률 보기",
    },
  ];

  const mockLaterTasks = [
    { title: "자료구조 과제 정리", meta: "Backlog" },
    { title: "영단어 30개", meta: "Backlog" },
    { title: "알고리즘 2문제", meta: "Backlog" },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full relative bg-gray-100">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col items-center justify-redcenter text-center">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Day planner
            </h1>
            <p className="mt-3 max-w-xl text-sm text-gray-700 md:text-base">
              오늘의 계획, 공부 시간, 달성률을 한 곳에서 관리하는 스터디 플래너.
            </p>

            {/* Placeholder logo/icon area */}
            <div className="mt-10 flex h-28 w-28 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
              <span className="text-4xl font-black text-gray-400">μ</span>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/Days"
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                시작하기
              </Link>
              <Link
                to="/Timer"
                className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 hover:bg-gray-50"
              >
                타이머 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro + Right widgets */}
      <section className="w-full bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 md:grid-cols-3">
          {/* Left text */}
          <div className="md:col-span-2">
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Days에서 오늘 할 일을 정리하고, Timer로 공부 시간을 기록하고,
              Challenges에서 달성률을 확인합니다.
            </p>

            {/* Quick links */}
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {quickLinks.map((item) => (
                <Link
                  key={item.title}
                  to={item.to}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600">
                      MVP
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
                  <div className="mt-4 text-sm font-semibold text-blue-600">
                    {item.cta} →
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right widgets (placeholder cards like your screenshot) */}
          <div className="space-y-4">
            {/* Progress card */}
            <div className="rounded-2xl bg-slate-700 p-5 text-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/80">
                    오늘 달성률
                  </p>
                  <p className="mt-1 text-2xl font-extrabold">0%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <span className="text-lg font-black">%</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-white/20">
                  <div className="h-2 w-0 rounded-full bg-white" />
                </div>
                <p className="mt-2 text-xs text-white/80">
                  Tasks와 연동되면 자동으로 계산됩니다.
                </p>
              </div>
            </div>

            {/* Later tasks card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  나중에 할 일
                </h3>
                <Link
                  to="/Days"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  관리 →
                </Link>
              </div>
              <ul className="mt-4 space-y-3">
                {mockLaterTasks.map((t, idx) => (
                  <li
                    key={`${t.title}-${idx}`}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {t.title}
                    </span>
                    <span className="text-xs font-semibold text-gray-500">
                      {t.meta}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  to="/Days"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
                >
                  할 일 추가하러 가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (optional) */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} study-planner. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
