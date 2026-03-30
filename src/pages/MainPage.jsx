import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import MonthCalendar from "../components/MonthCalendar";

export default function MainPage() {
  const navigate = useNavigate();

  const [progressData, setProgressData] = useState({ percent: 0, done: 0, total: 0 });

  useEffect(() => {
    const pad2 = (n) => String(n).padStart(2, "0");
    const now = new Date();
    const todayISO = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    
    const dailyRaw = localStorage.getItem(`study-planner:daily-board:${todayISO}`);
    if (dailyRaw) {
      const dData = JSON.parse(dailyRaw);
      const allCards = dData.lists.flatMap(l => l.cards);
      const total = allCards.length;
      const done = allCards.filter(c => c.done).length;
      const percent = total > 0 ? Math.round((done / total) * 100) : 0;
      setProgressData({ percent, done, total });
    }
  }, []);

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
        <div className="mx-auto max-w-6xl px-6 py-12 md:py-20">
          <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-2xl font-extrabold tracking-tight md:text-4xl">
              Study planner
            </h1>
            <p className="mt-3 max-w-xl text-xs text-gray-700 md:text-base">
              오늘의 계획, 공부 시간, 달성률을 한 곳에서 관리하는 스터디 플래너.
            </p>

            {/* Placeholder logo/icon area */}
            <div className="mt-8 flex h-20 w-20 md:h-28 md:w-28 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
              <span className="text-3xl md:text-4xl font-black text-gray-400">
                <img
                  src="/logo.png"
                  alt="앱 로고"
                  className="h-6 md:h-8 w-auto"
                />
              </span>
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
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-10 md:py-14 md:grid-cols-3">
          {/* Left text */}
          <div className="md:col-span-2">
            <p className="mt-3 text-sm leading-6 text-gray-600 font-bold text-center md:text-left">
              Days에서 오늘 할 일을 정리하고, Timer로 공부 시간을 기록하고,
              Challenges에서 달성률을 확인합니다.
            </p>

            {/* Quick links */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
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
            <div className="mt-8">
              <MonthCalendar
                onSelectDate={(dateObj, iso) => {
                  navigate(`/Days/daily?date=${iso}`);
                }}
              />
            </div>
          </div>

          {/* Right widgets (fixed progress card) */}
          <div className="space-y-4">
            {/* Progress card: Dark Blue BG, Blue Bar, Compact Size */}
            <div className="rounded-2xl bg-[#334155] p-5 text-white shadow-lg">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-black text-white/70 uppercase tracking-wider">
                  오늘 달성률
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black leading-none">
                    {progressData.percent}%
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${progressData.percent}%` }}
                  />
                </div>
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
