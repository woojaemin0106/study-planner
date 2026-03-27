import React from "react";

export default function ChallengeCard({ 
  icon, 
  title, 
  subtitle, 
  participants, 
  progress, 
  timeLeft, 
  isOngoing 
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col gap-4 relative">
      {/* Go Badge */}
      <div className="absolute top-4 right-4 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded font-medium">
        이동
      </div>

      <div className="flex flex-col gap-2">
        <div className="text-2xl">{icon}</div>
        <h3 className="font-bold text-lg text-gray-900 leading-tight">
          {title}
        </h3>
        {subtitle && <p className="text-gray-500 text-sm mt-0.5">{subtitle}</p>}
        {participants && (
          <p className="text-gray-400 text-sm">
            {isOngoing ? `참여 ${participants}` : `참여자 ${participants}`}
          </p>
        )}
      </div>

      {progress !== undefined && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-500 h-full transition-all duration-500" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-blue-600 font-bold text-lg">{progress}%</span>
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 flex justify-between items-center">
        {timeLeft ? (
          <span className="text-gray-400 text-[11px] font-medium">남은 기간 <span className="font-bold text-gray-600 ml-1">{timeLeft}</span></span>
        ) : (
          <button className="text-gray-400 text-xs hover:text-gray-600 transition-colors">자세히보기</button>
        )}
        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
          추가하기
        </button>
      </div>
    </div>
  );
}
