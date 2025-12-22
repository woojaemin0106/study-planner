import React, { useState, useEffect } from 'react';
import { Bell, PlayCircle, Pause, RotateCcw } from 'lucide-react';

export default function TimerPage() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const presets = [
    { label: '15초', value: 15 }, { label: '45초', value: 45 }, { label: '10분', value: 600 }, { label: '25분', value: 1500 },
    { label: '20초', value: 20 }, { label: '1분', value: 60 }, { label: '15분', value: 900 }, { label: '30분', value: 1800 },
    { label: '30초', value: 30 }, { label: '5분', value: 300 }, { label: '20분', value: 1200 }, { label: '45분', value: 2700 }
  ];

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

  const handlePreset = (additionalSeconds) => {
    const currentTotalInSeconds = hours * 3600 + minutes * 60 + seconds;
    const newTotal = currentTotalInSeconds + additionalSeconds;

    const h = Math.floor(newTotal / 3600);
    const m = Math.floor((newTotal % 3600) / 60);
    const s = newTotal % 60;

    setHours(h > 23 ? 23 : h);
    setMinutes(m >= 60 ? 59 : m);
    setSeconds(s >= 60 ? 59 : s);
  };

  const formatTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white text-black px-6 pt-16 pb-12 font-sans selection:bg-blue-100">
      <div className="max-w-3xl mx-auto">
        
        {/* 타이머 표시 화면: 상하단 모두 둥글게(rounded-[48px]) 및 상단 여백(mt-8) 추가 */}
        {(isActive || timeLeft > 0) && (
          <div className="text-center py-16 bg-[#f8f9fa] rounded-[48px] border border-gray-100 shadow-sm transition-all mb-12">
            <div className="text-9xl font-extralight mb-10 tabular-nums tracking-tighter text-gray-900 leading-none">
              {formatTime(timeLeft)}
            </div>
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setIsActive(!isActive)} 
                className="p-5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-blue-50 transition-all"
              >
                {isActive ? <Pause size={32} /> : <PlayCircle size={32} className="text-blue-600" />}
              </button>
              <button 
                onClick={() => {setIsActive(false); setTimeLeft(0);}} 
                className="p-5 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 transition-all"
              >
                <RotateCcw size={32} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* 타이머 설정 섹션 */}
        <section className={`space-y-10 ${!(isActive || timeLeft > 0) ? 'pt-12' : ''}`}>
          <h2 className="text-[26px] font-bold tracking-tight text-center">타이머 설정</h2>
          
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: '시', max: 23, value: hours, setter: setHours },
              { label: '분', max: 59, value: minutes, setter: setMinutes },
              { label: '초', max: 59, value: seconds, setter: setSeconds }
            ].map((item) => (
              <div key={item.label} className="space-y-3 text-center">
                <label className="text-[13px] font-bold text-gray-400">{item.label}</label>
                <div className="relative">
                  <select 
                    value={item.value}
                    onChange={(e) => item.setter(Number(e.target.value))}
                    className="w-full bg-[#f1f3f5] border-none rounded-2xl p-5 appearance-none text-2xl font-semibold focus:ring-2 focus:ring-blue-500/20 text-center"
                  >
                    {[...Array(item.max + 1).keys()].map(v => (
                      <option key={v} value={v}>{v.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* 프리셋: 사용자가 요청한 기존 스타일(가로 정렬 + 아이콘 옆 텍스트) 유지 */}
          <div className="grid grid-cols-4 gap-y-8 pt-4">
            {presets.map((preset, index) => (
              <button 
                key={index} 
                onClick={() => handlePreset(preset.value)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group justify-self-center"
              >
                <Bell size={18} className="group-hover:animate-bounce text-black" />
                <span className="text-[15px] font-medium">{preset.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="pt-10">
          <button 
            onClick={handleStart}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 rounded-2xl transition-all text-xl shadow-lg"
          >
            START
          </button>
        </div>
      </div>
    </div>
  );
}