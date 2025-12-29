import { useState } from "react";
import { Link } from "react-router-dom";

export default function DaysMonthlyPage() {
  const today = new Date();
  const dateNum = today.getDate();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const formattedToday = `${dateNum}일(${dayNames[today.getDay()]})`;

  const [days, setDays] = useState(
    Array.from({ length: 31 }, (_, i) => ({
      id: i + 1,
      title: "",
      tag: "",
      completed: false,
    }))
  );

  const [editingTagId, setEditingTagId] = useState(null);

  // --- 성취도 계산 로직 ---
  const completedCount = days.filter((d) => d.completed).length;
  const totalCount = days.length;
  // 퍼센트 계산 (소수점 없이 반올림)
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  
  // 만약 10%씩 고정으로 올리고 싶다면 아래 변수를 사용하세요:
  // const progressPercent = Math.min(completedCount * 10, 100); 
  // -----------------------

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
    <div className="w-full min-h-screen bg-white font-sans flex flex-col items-center">
      <main className="w-full max-w-[1400px] flex justify-between px-10 py-10 relative">
        
        {/* 1. LEFT */}
        <div className="w-[150px] flex-shrink-0 flex flex-col items-start">
          <Link to="/Days" className="flex items-center gap-1 text-blue-500 text-[13px] font-bold mb-4">
            ← Days로 돌아가기
          </Link>
          <h2 className="text-[36px] font-black leading-none">월간</h2>
        </div>

        {/* 2. CENTER */}
        <div className="flex-1 flex flex-col items-center">
          <div className="w-[660px] mb-6 px-2">
            <h1 className="text-[28px] font-black leading-tight text-gray-800">Month-List</h1>
            <p className="text-[14px] font-bold text-gray-400">{formattedToday}</p>
          </div>

          <div className="grid grid-cols-4 gap-x-4 gap-y-4 max-w-[660px]">
            {days.map(day => {
              const hasTag = day.tag.length > 0;
              const isEditing = editingTagId === day.id;

              return (
                <div
                  key={day.id}
                  className={`relative w-[150px] h-[85px] rounded-[20px] px-3 py-3 transition-all
                  ${day.completed ? "bg-[#C5DCFF]" : "bg-[#EAF2FC]"}`}
                >
                  <span className="text-[10px] font-bold text-gray-400">{day.id}</span>
                  
                  <div className="absolute top-3 right-3">
                    {isEditing ? (
                      <input
                        autoFocus
                        value={day.tag}
                        onChange={(e) => handleTagChange(day.id, e.target.value)}
                        onBlur={() => setEditingTagId(null)}
                        className="w-10 text-[8px] px-1 py-0.5 rounded-full bg-blue-600 text-white font-bold text-center outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingTagId(day.id)}
                        className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold
                        ${hasTag ? "bg-blue-600 text-white" : "bg-white/60 text-blue-400"}`}
                      >
                        {hasTag ? day.tag : "+"}
                      </button>
                    )}
                  </div>

                  <input
                    value={day.title}
                    onChange={(e) => handleTitleChange(day.id, e.target.value)}
                    placeholder="내용 입력"
                    className="mt-2 w-full bg-transparent text-[10px] font-bold text-gray-700 outline-none"
                  />

                  {/* 체크 표시 클릭 시 성취도 반영 */}
                  <button
                    onClick={() => toggleComplete(day.id)}
                    className="absolute bottom-3 right-3"
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all
                      ${day.completed ? "bg-blue-500 shadow-sm scale-110" : "bg-white/40 hover:bg-white/60"}`}>
                      <svg className={`w-3 h-3 ${day.completed ? "text-white" : "text-transparent"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. RIGHT */}
        <aside className="w-[320px] flex flex-col gap-6 flex-shrink-0">
          {/* 주간 성취도 - 데이터 연동됨 */}
          <div className="rounded-[30px] bg-white border border-gray-100 p-6 shadow-sm flex flex-col items-center">
            <h3 className="text-[13px] font-black mb-4">주간 성취도</h3>
            <div className="relative w-24 h-24 mb-3">
              <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#F1F5F9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="#2563EB"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 * (1 - progressPercent / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[18px] font-black text-gray-800">
                {progressPercent}%
              </span>
            </div>
            <p className="text-blue-600 font-black text-[12px]">
              {completedCount}/{totalCount} 완료
            </p>
          </div>

          <div className="rounded-[30px] bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="text-[18px] font-black mb-5">추천 루틴</h3>
            <div className="flex gap-2">
              <RoutineBox title="아침" items={["영단어", "기상"]} />
              <RoutineBox title="시험" items={["20분전", "오답"]} />
              <RoutineBox title="코딩" items={["백준", "오전"]} isSpecial />
            </div>
          </div>
        </aside>

      </main>
    </div>
  );
}

function RoutineBox({ title, items, isSpecial }) {
  return (
    <div className="flex-1 bg-[#F8FAFC] rounded-[18px] p-2.5 border border-gray-100 flex flex-col justify-between h-[100px]">
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-black text-gray-800">{title}</span>
          {isSpecial && <span className="text-[7px] text-gray-400 font-bold">저장</span>}
        </div>
        <ul className="text-[8px] text-gray-400 space-y-0.5 font-medium">
          {items.map((item, i) => (
            <li key={i} className="truncate">• {item}</li>
          ))}
        </ul>
      </div>
      {isSpecial && (
        <button className="w-full py-1 bg-blue-600 text-white text-[7px] rounded-full font-black">
          이동
        </button>
      )}
    </div>
  );
}