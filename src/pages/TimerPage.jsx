import React, { useState, useEffect } from 'react';
import { Bell, ChevronDown, PlayCircle, Pause, RotateCcw } from 'lucide-react';

export default function TimerPage() {
  // 1. 상태 관리
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // 2. 프리셋 데이터
  const presets = [
    { label: '15초', value: 15 }, { label: '45초', value: 45 }, 
    { label: '10분', value: 600 }, { label: '25분', value: 1500 },
    { label: '20초', value: 20 }, { label: '1분', value: 60 }, 
    { label: '15분', value: 900 }, { label: '30분', value: 1800 },
    { label: '30초', value: 30 }, { label: '5분', value: 300 }, 
    { label: '20분', value: 1200 }, { label: '45분', value: 2700 }
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
    /* 여기서 pt-24가 네브바 아래로 영역을 밀어주는 역할을 합니다 */
    <div className="min-h-screen bg-[#0a0a0a] text-white px-8 pt-24 pb-12 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* 타이머 표시 화면 (작동 중일 때) */}
        {(isActive || timeLeft > 0) && (
          <div className="text-center py-10 bg-[#1a1c1e] rounded-2xl border border-gray-800 shadow-xl">
            <div className="text-6xl font-mono mb-6 tracking-tight">{formatTime(timeLeft)}</div>
            <div className="flex justify-center gap-4">
              <button onClick={() => setIsActive(!isActive)} className="p-3 bg-[#333537] hover:bg-gray-600 rounded-full transition-colors">
                {isActive ? <Pause size={24} /> : <PlayCircle size={24} />}
              </button>
              <button onClick={() => {setIsActive(false); setTimeLeft(0);}} className="p-3 bg-[#333537] hover:bg-gray-600 rounded-full transition-colors">
                <RotateCcw size={24} />
              </button>
            </div>
          </div>
        )}

        {/* 타이머 설정 섹션 */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">타이머 설정</h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: '시', max: 23, value: hours, setter: setHours },
              { label: '분', max: 59, value: minutes, setter: setMinutes },
              { label: '초', max: 59, value: seconds, setter: setSeconds }
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <label className="text-sm text-gray-400">{item.label}</label>
                <div className="relative">
                  <select 
                    value={item.value}
                    onChange={(e) => item.setter(Number(e.target.value))}
                    className="w-full bg-[#1a1c1e] border border-gray-800 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    {[...Array(item.max + 1).keys()].map(v => (
                      <option key={v} value={v}>{v.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-y-4 pt-4">
            {presets.map((preset, index) => (
              <button 
                key={index} 
                onClick={() => handlePreset(preset.value)}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-sm text-left"
              >
                <Bell size={16} />
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* 알람 소리 섹션 */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-bold">알람 소리</h2>
            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
              <PlayCircle size={14} />
              소리 테스트
            </button>
          </div>
          <div className="relative">
            <select className="w-full bg-[#1a1c1e] border border-gray-800 rounded-lg p-3 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>알람 시계</option>
              <option>벨소리</option>
              <option>전자음</option>
            </select>
            <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </section>

        <button 
          onClick={handleStart}
          className="w-full bg-[#5eb8f3] hover:bg-[#4da8e2] text-black font-bold py-4 rounded-lg transition-all mt-8 active:scale-[0.99]"
        >
          타이머 시작
        </button>
      </div>
    </div>
  );
}