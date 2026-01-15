import React, { useState, useMemo } from "react";

const WEEK = ["일", "월", "화", "수", "목", "금", "토"];

function pad2(n) {
  return string(n).padStart(2, "0");
}

function toISODate(date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function MonthCalendar({ initialMonth, onSelectDate }) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(() => initialMonth ?? new Date());
  const [selected, setSelected] = useState(() => null);

  const { year, monthIndex, monthLabel, days } = useMemo(() => {
    const y = viewMonth.getFullYear();
    const m = viewMonth.getMonth();

    const first = new Date(y, m, 1);
    const last = new Date(y, m + 1, 0);
    const startDay = first.getDay();
    const totalDays = last.getDate();

    const cells = [];
    for (let i = 0; i < 42; i++) {
      const dayNum = i - startDay + 1;
      const inMonth = dayNum >= 1 && dayNum <= totalDays;
      const dateObj = inMonth ? new Date(y, m, dayNum) : null;
      cells.push({ inMonth, dateObj, dayNum: inMonth ? dayNum : null });
    }

    const label = `${y}년 ${m + 1}월`;
    return { year: y, monthIndex: m, monthLabel: label, days: cells };
  }, [viewMonth]);

  const goPrev = () => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  };
  const goNext = () => {
    setViewMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  };
  const handleClick = (cell) => {
    if (cell.inMonth) return;
    setSelected(cell.dateObj);
    const iso = toISODate(cell.dateObj);
    onSelectDate?.(cell.dateObj, iso);
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* header */}
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={goPrev}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.99]"
          aria-label="prev month"
        >
          ‹
        </button>

        <div className="text-sm font-extrabold text-gray-900">{monthLabel}</div>

        <button
          type="button"
          onClick={goNext}
          className="grid h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 active:scale-[0.99]"
          aria-label="next month"
        >
          ›
        </button>
      </div>

      {/* weekday */}
      <div className="mt-4 grid grid-cols-7 gap-2">
        {WEEK.map((w) => (
          <div key={w} className="text-center text-xs font-bold text-gray-500">
            {w}
          </div>
        ))}
      </div>

      {/* grid */}
      <div className="mt-3 grid grid-cols-7 gap-2">
        {days.map((cell, idx) => {
          const isToday = cell.inMonth && isSameDay(cell.dateObj, today);
          const isSelected = cell.inMonth && isSameDay(cell.dateObj, selected);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleClick(cell)}
              disabled={!cell.inMonth}
              className={[
                "h-10 rounded-xl text-sm font-semibold transition",
                cell.inMonth
                  ? "bg-gray-50 text-gray-900 hover:bg-gray-100 active:scale-[0.99]"
                  : "bg-transparent text-gray-300 cursor-default",
                isToday ? "ring-1 ring-gray-300" : "",
                isSelected ? "bg-blue-600 text-white hover:bg-blue-700" : "",
              ].join(" ")}
            >
              {cell.dayNum ?? ""}
            </button>
          );
        })}
      </div>

      {/* footer hint */}
      <div className="mt-4 text-xs text-gray-500">
        날짜를 클릭하면 선택됩니다.
      </div>
    </div>
  );
}
export default MonthCalendar;
