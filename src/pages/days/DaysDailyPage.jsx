import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function pad2(n) {
  return String(n).padStart(2, "0");
}
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function safeJSONParse(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export default function DaysDailyPage() {
  const [dateISO, setDateISO] = useState(todayISO());

  const storageKey = useMemo(
    () => `study-planner:daily-board:${dateISO}`,
    [dateISO]
  );

  const [board, setBoard] = useState(() => ({
    lists: [],
  }));

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    setBoard(safeJSONParse(raw, { lists: [] }));
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(board));
  }, [storageKey, board]);

  const addList = () => {
    setBoard((prev) => ({
      ...prev,
      lists: [
        ...prev.lists,
        {
          id: crypto.randomUUID(),
          title: "새 리스트",
          cards: [],
        },
      ],
    }));
  };

  const renameList = (listId, title) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => (l.id === listId ? { ...l, title } : l)),
    }));
  };

  const removeList = (listId) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.filter((l) => l.id !== listId),
    }));
  };

  const addCard = (listId, text) => {
    const v = text.trim();
    if (!v) return;

    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => {
        if (l.id !== listId) return l;
        return {
          ...l,
          cards: [
            {
              id: crypto.randomUUID(),
              text: v,
              done: false,
              createdAt: Date.now(),
            },
            ...l.cards,
          ],
        };
      }),
    }));
  };

  const toggleCard = (listId, cardId) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => {
        if (l.id !== listId) return l;
        return {
          ...l,
          cards: l.cards.map((c) =>
            c.id === cardId ? { ...c, done: !c.done } : c
          ),
        };
      }),
    }));
  };

  const removeCard = (listId, cardId) => {
    setBoard((prev) => ({
      ...prev,
      lists: prev.lists.map((l) => {
        if (l.id !== listId) return l;
        return { ...l, cards: l.cards.filter((c) => c.id !== cardId) };
      }),
    }));
  };

  const { total, done, progress } = useMemo(() => {
    const all = board.lists.flatMap((l) => l.cards);
    const d = all.filter((c) => c.done).length;
    const t = all.length;
    const p = t === 0 ? 0 : Math.round((d / t) * 100);
    return { total: t, done: d, progress: p };
  }, [board]);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10">
      {/* Header: 좌(뒤로+일간) / 중(타이틀) / 우(날짜) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start">
        <div className="md:col-span-4">
          <Link
            to="/Days"
            className="text-sm font-semibold text-blue-600 hover:underline"
          >
            ← Days로 돌아가기
          </Link>
          <div className="mt-3 text-xl font-extrabold text-gray-900">일간</div>
        </div>

        <div className="md:col-span-4 md:text-center">
          <h1 className="text-2xl font-extrabold text-gray-900">To-Do-List</h1>
        </div>

        <div className="md:col-span-4 md:flex md:justify-end">
          <div className="w-full md:w-[320px]">
            <label className="text-xs font-semibold text-gray-500">날짜</label>
            <input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* Main layout: 좌(투두/주간) + 우(위젯 placeholder) */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* LEFT */}
        <div className="lg:col-span-8">
          {/* 상단 진행률(스크린샷처럼 숫자 크게 안 보여도 됨) */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-700">
              진행률 {progress}%{" "}
              <span className="text-gray-400">
                ({done}/{total})
              </span>
            </div>
          </div>

          {/* 좌측 영역은 '리스트들(2열)' + '주간 카드(1열)' 느낌 */}
          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Lists area (2 columns) */}
            <div className="xl:col-span-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {board.lists.map((list) => (
                  <ListColumn
                    key={list.id}
                    list={list}
                    onRename={(title) => renameList(list.id, title)}
                    onRemove={() => removeList(list.id)}
                    onAddCard={(text) => addCard(list.id, text)}
                    onToggleCard={(cardId) => toggleCard(list.id, cardId)}
                    onRemoveCard={(cardId) => removeCard(list.id, cardId)}
                  />
                ))}

                {/* 스크린샷 느낌의 "새로 할 일 추가" 카드 */}
                <AddListCard onClick={addList} />
              </div>

              {/* 리스트가 아예 없을 때 안내 */}
              {board.lists.length === 0 && (
                <div className="mt-4 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-600">
                  아직 리스트가 없습니다. <b>“새로 할 일 추가”</b>로 시작하세요.
                </div>
              )}
            </div>

            {/* Weekly placeholder (네 팀원이 구현 예정이면 UI 틀만) */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-base font-extrabold text-gray-900">
                    주간
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    이번 주 주간 목표 확인
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">
                    주간 목표
                  </p>
                  <p className="mt-1 text-base font-extrabold text-gray-900">
                    0
                  </p>
                </div>
                <div className="rounded-xl bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500">진행률</p>
                  <p className="mt-1 text-base font-extrabold text-gray-900">
                    0%
                  </p>
                </div>
              </div>

              <div className="mt-5 text-sm font-semibold text-blue-600">
                카드 클릭시 이동 →
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT (상대가 만들 영역) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-extrabold text-gray-900">오른쪽 위젯</p>
            <p className="mt-2 text-sm text-gray-600">
              (오늘의 성취도 / 추천 루틴 등은 상대가 이 영역에서 구성)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddListCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-h-[140px] items-center gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md active:scale-[0.99]"
    >
      <span className="grid h-10 w-10 place-items-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-extrabold">
        +
      </span>
      <span className="text-sm font-semibold text-gray-900">
        새로 할 일 추가
      </span>
    </button>
  );
}

function ListColumn({
  list,
  onRename,
  onRemove,
  onAddCard,
  onToggleCard,
  onRemoveCard,
}) {
  const [editingTitle, setEditingTitle] = useState(list.title);
  const [input, setInput] = useState("");

  useEffect(() => {
    setEditingTitle(list.title);
  }, [list.title]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* List header */}
      <div className="flex items-start justify-between gap-2">
        <input
          value={editingTitle}
          onChange={(e) => setEditingTitle(e.target.value)}
          onBlur={() => onRename(editingTitle.trim() || "새 리스트")}
          className="w-full rounded-xl bg-gray-50 px-3 py-2 text-sm font-extrabold text-gray-900 outline-none focus:ring-2 focus:ring-blue-200"
        />

        {/* 스크린샷 느낌: 3점 메뉴(지금은 클릭 시 리스트 삭제로 단순 처리) */}
        <button
          type="button"
          onClick={onRemove}
          className="grid h-10 w-10 place-items-center rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100"
          title="리스트 삭제"
        >
          ⋮
        </button>
      </div>

      {/* Add card */}
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAddCard(input);
              setInput("");
            }
          }}
          placeholder="할 일 추가"
          className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-gray-400"
        />
        <button
          type="button"
          onClick={() => {
            onAddCard(input);
            setInput("");
          }}
          className="h-10 rounded-xl bg-gray-900 px-3 text-sm font-semibold text-white hover:bg-black active:scale-[0.99]"
          title="추가"
        >
          +
        </button>
      </div>

      {/* Cards */}
      <ul className="mt-3 space-y-2">
        {list.cards.length === 0 ? (
          <li className="rounded-xl bg-gray-50 px-3 py-6 text-center text-xs text-gray-500">
            할 일을 추가해주세요.
          </li>
        ) : (
          list.cards.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2"
            >
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={c.done}
                  onChange={() => onToggleCard(c.id)}
                  className="h-4 w-4"
                />
                <span
                  className={[
                    "text-sm font-semibold",
                    c.done ? "text-gray-400 line-through" : "text-gray-900",
                  ].join(" ")}
                >
                  {c.text}
                </span>
              </label>

              {/* 스크린샷처럼 텍스트 버튼 대신 '⋮'로 최소화 */}
              <button
                type="button"
                onClick={() => onRemoveCard(c.id)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100"
                title="삭제"
              >
                ⋮
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
