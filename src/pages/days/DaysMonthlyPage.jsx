import React, { useState } from "react";
import { Link } from "react-router-dom";
import CircularProgressBar from "../../components/CircularProgressBar";

const DEFAULT_ROUTINES = [
  { title: "아침 루틴", items: ["영어 단어 읽기", "아침 기상"], color: "blue" },
  { title: "시험 대비", items: ["시험 20분 전", "오답 노트"], color: "purple" },
  { title: "코딩 루틴", items: ["백준 문제 풀기", "오전 루틴"], color: "blue" },
];

export default function DaysMonthlyPage() {
  const today = new Date();
  const dateNum = today.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedToday = `${dateNum}일(${dayNames[today.getDay()]})`;

  const [days, setDays] = useState(() => {
    const raw = localStorage.getItem('study-planner:monthly-board');
    return raw ? JSON.parse(raw) : Array.from({ length: 31 }, (_, i) => ({
      id: i + 1,
      title: "",
      tag: "",
      completed: false,
    }));
  });

  React.useEffect(() => {
    localStorage.setItem('study-planner:monthly-board', JSON.stringify(days));
  }, [days]);

  const [editingTagId, setEditingTagId] = useState(null);

  // --- Metrics ---
  const completedCount = days.filter((d) => d.completed).length;
  const totalCount = days.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const handleTitleChange = (id, value) => {
    setDays(days.map(d => (d.id === id ? { ...d, title: value } : d)));
  };

  const handleTagChange = (id, value) => {
    setDays(days.map(d => (d.id === id ? { ...d, tag: value } : d)));
  };

  const toggleComplete = (id) => {
    setDays(days.map(d => (d.id === id ? { ...d, completed: !d.completed } : d)));
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-12 px-20 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: Monthly Grid */}
          <div className="flex-1 flex flex-col">
            <div className="mb-8 flex flex-col gap-4">
              <Link to="/Days" className="text-blue-600 text-sm font-bold flex items-center gap-1 mb-4">
                <span className="text-lg">←</span> Days로 돌아가기
              </Link>
              <div>
                <h1 className="text-[40px] font-black text-gray-900 leading-none">월간</h1>
                <div className="flex items-baseline gap-4 mt-2">
                  <h2 className="text-[28px] font-bold text-gray-900 leading-none">Month-List</h2>
                  <p className="text-gray-400 font-bold text-xl">{formattedToday}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4">
              {days.map(day => {
                const hasTag = day.tag.length > 0;
                const isEditing = editingTagId === day.id;

                return (
                  <div
                    key={day.id}
                    className={`relative rounded-3xl p-4 transition-all min-h-[110px] flex flex-col justify-between border border-transparent shadow-sm
                    ${day.completed ? "bg-[#C5DCFF]" : "bg-[#EAF2FC]"}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[14px] font-black text-gray-400">{day.id}</span>
                      
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={day.tag}
                            onChange={(e) => handleTagChange(day.id, e.target.value)}
                            onBlur={() => setEditingTagId(null)}
                            onKeyDown={(e) => e.key === 'Enter' && setEditingTagId(null)}
                            className="w-12 text-[10px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-black text-center outline-none"
                          />
                        ) : (
                          <button
                            onClick={() => setEditingTagId(day.id)}
                            className={`transition-all flex items-center justify-center
                            ${hasTag 
                              ? "text-[10px] px-2 py-0.5 rounded-full font-black bg-blue-600 text-white" 
                              : "w-6 h-6 rounded-full bg-white text-blue-400 hover:bg-blue-50 shadow-sm"}`}
                          >
                            {hasTag ? (
                              <>
                                {day.tag} <span className="text-[8px] ml-1">▼</span>
                              </>
                            ) : (
                              <span className="text-[16px] font-black">+</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex-1">
                      <input
                        value={day.title}
                        onChange={(e) => handleTitleChange(day.id, e.target.value)}
                        placeholder="내용 입력"
                        className="w-full bg-transparent text-[13px] font-black text-gray-800 placeholder-gray-400/70 outline-none"
                      />
                    </div>

                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => toggleComplete(day.id)}
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-all border
                          ${day.completed ? "bg-blue-500 border-blue-500 text-white shadow-md" : "bg-white/40 border-transparent hover:bg-white/60 text-transparent"}`}
                      >
                        <span className="text-[14px] font-black">✓</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="w-full lg:w-[480px] flex flex-col gap-8">
            
            {/* Achievement */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col items-center gap-6">
              <h3 className="text-xl font-black text-gray-900">월간 성취도</h3>
              <CircularProgressBar progress={progressPercent} />
              <p className="text-blue-600 font-black text-2xl">{completedCount}/{totalCount} 완료</p>
            </div>

            {/* Routines */}
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-gray-900">추천 루틴</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
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

function RoutineCard({ title, items }) {
  return (
    <div className="bg-gray-50 rounded-3xl p-5 flex flex-col gap-4 relative min-h-[140px]">
      <div className="flex flex-col gap-1">
        <h4 className="font-black text-gray-900 text-xs">{title}</h4>
        <ul className="mt-2 flex flex-col gap-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-gray-400 text-[10px] font-black flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0"></span>
              <span className="truncate">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-gray-300 text-[10px] font-black">저장</span>
        <button className="bg-blue-600 text-white text-[10px] font-black py-1.5 px-3 rounded-xl hover:bg-blue-700 transition-colors">
          바로가기
        </button>
      </div>
    </div>
  );
}