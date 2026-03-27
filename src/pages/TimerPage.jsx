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
    <div className="min-h-screen bg-[#f8fafc] text-black px-6 py-10 font-sans selection:bg-blue-100">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Standardization */}
        <div className="mb-12 flex flex-col gap-2">
          <h1 className="text-4xl font-black text-gray-900">Timer</h1>
          <p className="text-base text-gray-400 font-bold">
            공부 시간을 기록하고 집중력을 유지하세요.
          </p>
        </div>

        {/* 타이머 표시 화면 */}
        {(isActive || timeLeft > 0) && (
          <div className="text-center py-16 bg-white rounded-[48px] border border-gray-100 shadow-sm transition-all mb-12">
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

        {/* 타이머 설정 섹션: REVERT TO ORIGINAL STYLE (Wider) */}
        <div className="w-full space-y-16">
          <section className="space-y-12">
            <h2 className="text-2xl font-black text-gray-900 border-b border-gray-100 pb-4">타이머 설정</h2>
            
            <div className="grid grid-cols-3 gap-12">
              {[
                { label: '시', max: 23, value: hours, setter: setHours },
                { label: '분', max: 59, value: minutes, setter: setMinutes },
                { label: '초', max: 59, value: seconds, setter: setSeconds }
              ].map((item) => (
                <div key={item.label} className="space-y-4 text-center">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.label}</label>
                  <div className="relative">
                    <select 
                      value={item.value}
                      onChange={(e) => item.setter(Number(e.target.value))}
                      className="w-full bg-[#f1f3f5] border-none rounded-[20px] p-6 appearance-none text-4xl font-extrabold focus:ring-4 focus:ring-blue-100 transition-all text-center text-gray-900"
                    >
                      {[...Array(item.max + 1).keys()].map(v => (
                        <option key={v} value={v}>{v.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 프리셋: 사용자가 요청한 기존 스타일(가로 정렬 + 아이콘 옆 텍스트) 유지 */}
          <div className="grid grid-cols-4 gap-y-12 py-8">
            {presets.map((preset, index) => (
              <button 
                key={index} 
                onClick={() => handlePreset(preset.value)}
                className="flex items-center gap-3 text-gray-400 hover:text-blue-600 transition-all group justify-self-center hover:scale-110"
              >
                <div className="p-2 bg-white rounded-full shadow-sm ring-1 ring-gray-100 group-hover:ring-blue-100">
                  <Bell size={20} className="group-hover:animate-bounce text-black" />
                </div>
                <span className="text-[17px] font-bold">{preset.label}</span>
              </button>
            ))}
          </div>

          <div className="pb-20">
            <button 
              onClick={handleStart}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-7 rounded-[28px] transition-all text-2xl shadow-[0_20px_40px_rgba(37,99,235,0.3)] active:scale-[0.98]"
            >
              START
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}