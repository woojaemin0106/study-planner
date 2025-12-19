import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, PlayCircle, Pause, RotateCcw } from 'lucide-react';

export default function TimerPage() {
  // 1. 상태 관리
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // 2. 프리셋 데이터 (이미지 순서에 맞춰 배치)
  const presets = [
    { label: '15초', value: 15 }, { label: '45초', value: 45 }, { label: '10분', value: 600 }, { label: '25분', value: 1500 },
    { label: '20초', value: 20 }, { label: '1분', value: 60 }, { label: '15분', value: 900 }, { label: '30분', value: 1800 },
    { label: '30초', value: 30 }, { label: '5분', value: 300 }, { label: '20분', value: 1200 }, { label: '45분', value: 2700 }
  ];

  // 3. 타이머 로직
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleStart = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds > 0) {
      setTimeLeft(totalSeconds);
      setIsActive(true);
    }
  };

  const handlePreset = (val) => {
    setTimeLeft(val);
    setIsActive(true);
  };

  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-24 pb-12 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* 타이머 표시 화면 (작동 중일 때) */}
        {(isActive || timeLeft > 0) && (
          <div className="text-center py-14 bg-[#f8f9fa] rounded-[32px] border border-gray-100 mb-10 shadow-sm transition-all animate-in fade-in zoom-in duration-300">
            <div className="text-8xl font-light mb-10 tabular-nums tracking-tight text-gray-900">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setIsActive(!isActive)} 
                className="p-5 bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50 rounded-full shadow-sm transition-all active:scale-95"
              >
                {isActive ? <Pause size={32} className="text-gray-700" /> : <PlayCircle size={32} className="text-[#2b66f6]" />}
              </button>
              <button 
                onClick={() => {setIsActive(false); setTimeLeft(0);}} 
                className="p-5 bg-white border border-gray-200 hover:bg-gray-50 rounded-full shadow-sm transition-all active:scale-95"
              >
                <RotateCcw size={32} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* 타이머 설정 섹션 */}
        <section className="space-y-8">
          <h2 className="text-[24px] font-bold tracking-tight px-1">타이머 설정</h2>
          
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: '시', max: 23, value: hours, setter: setHours },
              { label: '분', max: 59, value: minutes, setter: setMinutes },
              { label: '초', max: 59, value: seconds, setter: setSeconds }
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <label className="text-[13px] font-semibold text-gray-400 ml-1">{item.label}</label>
                <div className="relative">
                  <select 
                    value={item.value}
                    onChange={(e) => item.setter(Number(e.target.value))}
                    className="w-full bg-[#f1f3f5] border-none rounded-[14px] p-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer text-xl font-medium transition-all"
                  >
                    {[...Array(item.max + 1).keys()].map(v => (
                      <option key={v} value={v}>{v.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* 프리셋 그리드 - 정렬 불균형 해결을 위해 justify-items-start 적용 */}
          <div className="grid grid-cols-4 gap-y-7 pt-4 px-1">
            {presets.map((preset, index) => (
              <button 
                key={index} 
                onClick={() => handlePreset(preset.value)}
                className="flex items-center gap-3 text-gray-800 hover:text-[#2b66f6] transition-colors group w-fit justify-self-start"
              >
                <Bell size={18} className="text-black group-hover:text-[#2b66f6] transition-colors" />
                <span className="text-[15px] font-medium tracking-tight">{preset.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 알람 소리 섹션 */}
        <section className="space-y-5 pt-4">
          <h2 className="text-[24px] font-bold tracking-tight px-1">알람 소리</h2>
          <div className="relative">
            <select className="w-full bg-[#f1f3f5] border-none rounded-[14px] p-5 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-[16px] font-medium cursor-pointer">
              <option>알람시계</option>
              <option>벨소리</option>
              <option>전자음</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </section>

        {/* 시작 버튼 */}
        <div className="pt-6">
          <button 
            onClick={handleStart}
            className="w-full bg-[#2b66f6] hover:bg-[#1a52e0] text-white font-bold py-5 rounded-[16px] transition-all active:scale-[0.98] text-[18px] shadow-lg shadow-blue-100/50"
          >
            타이머 시작
          </button>
        </div>
      </div>
    </div>
  );
}
