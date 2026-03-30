import React from "react";
import ChallengeCard from "../components/ChallengeCard";

const ONGOING_CHALLENGES = [
  {
    icon: "📖",
    title: "영단어 완독 챌린지 🏆",
    progress: 70,
    timeLeft: "D-3",
    isOngoing: true,
  },
  {
    icon: "🔥",
    title: "매일 복습하기",
    participants: "1.1만명",
    isOngoing: true,
  },
  {
    icon: "📘",
    title: "매일 북마크함",
    participants: "1.1만명",
    isOngoing: true,
  },
];

const EXPLORE_CHALLENGES = [
  {
    icon: "🔥",
    title: "영단어 북마크집",
    subtitle: "너의 첫 기억을 채워 봐",
    participants: "25,601명",
    isOngoing: false,
  },
  {
    icon: "📚",
    title: "오답 노트 적기",
    subtitle: "죽어가는 첫 번째",
    participants: "11,213명",
    isOngoing: false,
  },
  {
    icon: "💻",
    title: "일일 코딩",
    subtitle: "너의 첫 코딩을 채워 봐",
    participants: "12,512명",
    isOngoing: false,
  },
];

export default function ChallengesPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black text-gray-900">Challenges</h1>
        <p className="text-sm md:text-base text-gray-400 font-bold">
          달성률을 확인하고 목표를 향해 도전하세요.
        </p>
      </header>

      {/* Ongoing Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900">진행중인 나의 챌린지</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ONGOING_CHALLENGES.map((challenge, index) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="h-[1px] bg-gray-100" />

      {/* Explore Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-lg font-bold text-gray-900">새로운 챌린지 탐험</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXPLORE_CHALLENGES.map((challenge, index) => (
            <ChallengeCard key={index} {...challenge} />
          ))}
        </div>
      </section>
    </div>
  );
}
