import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CircularProgressBar from "../../components/CircularProgressBar";

function pad2(n) {
  return String(n).padStart(2, "0");
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

const DEFAULT_ROUTINES = [
  {
    title: "아침 루틴",
    items: ["영어 단어 읽기", "아침 기상"],
  },
  {
    title: "시험 대비",
    items: ["시험 20분 전", "오답 노트"],
  },
  {
    title: "코딩 루틴",
    items: ["백준 문제 풀기", "오전 루틴"],
    isNew: true,
  },
];

export default function DaysDailyPage() {
  const [dateISO, setDateISO] = useState(todayISO());
  const storageKey = useMemo(() => `study-planner:daily-board:${dateISO}`, [dateISO]);

  const [board, setBoard] = useState(() => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : {
      lists: [
        { id: "1", title: "영어 단어 30개", cards: [{ id: "c1", text: "영어 단어 30개", done: true }] },
        { id: "2", title: "코테 20개 풀기", cards: [
          { id: "c2", text: "코테 20개 풀기", done: true },
          { id: "c3", text: "문제집 15개 풀기", done: false }
        ] },
        { id: "3", title: "윗몸일으키기 2세트", cards: [{ id: "c4", text: "윗몸일으키기 2세트", done: false }], tags: ["태그", "발표"] },
        { id: "4", title: "영어 단어 30개", cards: [{ id: "c5", text: "영어 단어 30개", done: true }] },
        { id: "5", title: "알고리즘 문제 풀기", cards: [{ id: "c6", text: "알고리즘 문제 풀기", done: false }] },
        { id: "6", title: "오답 노트 적기", cards: [{ id: "c7", text: "오답 노트 요약", done: false }] },
        { id: "7", title: "코딩 테스트", cards: [{ id: "c8", text: "코딩 테스트", done: false }] },
      ]
    };
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(board));
  }, [storageKey, board]);

  const toggleCard = (listId, cardId) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => {
        if (l.id !== listId) return l;
        return {
          ...l,
          cards: l.cards.map((c) => (c.id === cardId ? { ...c, done: !c.done } : c)),
        };
      }),
    }));
  };

  const addList = () => {
    setBoard((prev) => ({
      ...prev,
      lists: [...prev.lists, { id: crypto.randomUUID(), title: "새로운 할 일", cards: [] }],
    }));
  };

  const updateListTitle = (listId, title) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
    }));
  };

  const { total, done, progress } = useMemo(() => {
    const all = board.lists.flatMap((l) => l.cards);
    const d = all.filter((c) => c.done).length;
    const t = Math.max(all.length, 10); 
    const p = Math.round((d / t) * 100);
    return { total: t, done: d, progress: p };
  }, [board]);

  // --- Weekly Sync ---
  const [weeklyData, setWeeklyData] = useState({ totalTasks: 0, progress: 0 });

  useEffect(() => {
    const getWeekStartISO = (dateStr) => {
      if (!dateStr) return "";
      const [y, m, dd] = dateStr.split("-").map(Number);
      const d = new Date(y, m - 1, dd);
      const day = d.getDay(); 
      const diffToMon = (day + 6) % 7;
      d.setDate(d.getDate() - diffToMon);
      return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    };
    const weekStart = getWeekStartISO(dateISO);
    const raw = localStorage.getItem(`study-planner:weekly:${weekStart}`);
    
    if (raw) {
      const data = JSON.parse(raw);
      let total = 0;
      let completed = 0;
      Object.values(data.days || {}).forEach(day => {
        if (day.tasks) {
          total += day.tasks.length;
          completed += day.tasks.filter(t => t.done).length;
        }
      });
      setWeeklyData({
        totalTasks: total,
        progress: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    }
  }, [dateISO]);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10 md:pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: To-Do List */}
          <div className="flex-1 flex flex-col">
            <div className="mb-6 md:mb-8 flex flex-col gap-4 text-center md:text-left">
              <Link to="/Days" className="text-blue-600 text-sm font-bold flex items-center justify-center md:justify-start gap-1 mb-2 md:mb-4">
                <span className="text-lg">←</span> Days로 돌아가기
              </Link>
              <div>
                <h1 className="text-3xl md:text-[40px] font-black text-gray-900 leading-none">일간</h1>
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 mt-2">
                  <h2 className="text-2xl md:text-[28px] font-bold text-gray-900 leading-none">To-Do-List</h2>
                  <p className="text-gray-400 font-bold text-lg md:text-xl">{dateISO}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 items-start content-start">
              {board.lists.map((list) => (
                <TodoCard 
                  key={list.id} 
                  list={list} 
                  onToggle={(cardId) => toggleCard(list.id, cardId)}
                  onUpdateTitle={(title) => updateListTitle(list.id, title)}
                />
              ))}
              <button 
                onClick={addList}
                className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all group min-h-[80px]"
              >
                <div className="w-10 h-10 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                  +
                </div>
                <span className="font-bold text-gray-700">새로 할 일 추가</span>
              </button>
            </div>
          </div>

          {/* RIGHT: Status & Routines */}
          <div className="w-full lg:w-[480px] flex flex-col gap-6">
            
            {/* Weekly Status */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6 h-fit min-h-[280px]">
              <div>
                <h3 className="text-xl font-black text-gray-900">주간</h3>
                <p className="text-gray-400 text-sm font-medium mt-1">이번 주 주간 목표 확인</p>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 bg-gray-50 rounded-2xl p-5">
                  <span className="text-gray-400 text-[10px] font-black uppercase">주간 목표</span>
                  <p className="text-3xl font-black text-gray-900 mt-1">{weeklyData.totalTasks}</p>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-5">
                  <span className="text-gray-400 text-[10px] font-black uppercase">진행률</span>
                  <p className="text-3xl font-black text-gray-900 mt-1">{weeklyData.progress}%</p>
                </div>
              </div>
              <Link to="/Days/weekly" className="text-blue-600 font-black text-sm flex items-center gap-2 hover:translate-x-1 transition-transform">
                카드 클릭 시 이동 <span className="text-lg">→</span>
              </Link>
            </div>

            {/* Achievement */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col items-center gap-4">
              <h3 className="text-lg font-black text-gray-900">오늘의 성취도</h3>
              <CircularProgressBar progress={progress} />
              <p className="text-blue-600 font-black text-xl">{done}/{total} 완료</p>
            </div>

            {/* Recommended Routines */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col gap-6">
              <h3 className="text-xl font-black text-gray-900">추천 루틴</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

function TodoCard({ list, onToggle, onUpdateTitle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(list.title);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdateTitle(title);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative group min-h-[100px] flex flex-col justify-center">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3 w-full">
          {list.cards.length === 1 && (
            <div 
              onClick={() => onToggle(list.cards[0].id)}
              className={`w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all border ${list.cards[0].done ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-50 border-gray-200'}`}
            >
              {list.cards[0].done && <span className="text-[10px] font-black transform scale-125">✓</span>}
            </div>
          )}
          {isEditing ? (
            <input 
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              className="font-bold text-gray-800 text-sm outline-none bg-blue-50 rounded px-1 w-full"
            />
          ) : (
            <span className="font-bold text-gray-800 text-sm line-clamp-1">{list.title}</span>
          )}
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="text-gray-300 hover:text-gray-500 font-bold text-xl px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ⋮
        </button>
      </div>

      {list.cards.length > 1 && (
        <div className="flex flex-col gap-2 ml-8">
          {list.cards.map(card => (
            <div key={card.id} className="flex items-center gap-3">
              <div 
                onClick={() => onToggle(card.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-all ${card.done ? 'bg-blue-500 border-blue-500 text-white' : 'bg-gray-50 border-gray-200'}`}
              >
                {card.done && <span className="text-[10px] font-black transform scale-125">✓</span>}
              </div>
              <span className={`text-sm font-medium ${card.done ? 'text-gray-300 line-through' : 'text-gray-600'}`}>
                {card.text}
              </span>
            </div>
          ))}
        </div>
      )}

      {list.tags && (
        <div className="flex gap-2 mt-2 ml-8">
          {list.tags.map((tag, i) => (
            <span key={i} className={`text-[9px] font-black px-2 py-0.5 rounded-full ${tag === '발표' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RoutineCard({ title, items, isNew }) {
  return (
    <div className="min-w-[140px] bg-gray-50 rounded-2xl p-4 flex flex-col gap-3 relative">
      <div>
        <h4 className="font-black text-gray-900 text-sm">{title}</h4>
        <ul className="mt-2 flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={i} className="text-gray-400 text-[10px] font-bold flex items-center gap-1">
              <span>•</span> {item}
            </li>
          ))}
        </ul>
      </div>
      {isNew && (
        <>
          <span className="absolute top-2 right-2 text-gray-300 text-[8px] font-bold">저장</span>
          <button className="bg-blue-600 text-white text-[10px] font-black py-1 px-3 rounded-lg self-end mt-auto">
            바로가기
          </button>
        </>
      )}
    </div>
  );
}
