import React, { useState, useEffect } from 'react';
import { Radio, Pause, Play } from 'lucide-react';
import { CorridorData } from '../types';

interface TopTickerProps {
  corridors: CorridorData[];
  onSelectCorridor: (corridor: CorridorData) => void;
  isDarkMode?: boolean;
}

export const TopTicker: React.FC<TopTickerProps> = ({ corridors, onSelectCorridor, isDarkMode = false }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const tickerItems = [
    {
      corridorId: 'sikkim-nh10',
      text: '⚠️ SIKKIM NH-10: 94% Moisture Saturation (Pegong Km 18) • Traffic Diversion Active',
      level: 'CRITICAL'
    },
    {
      corridorId: 'kerala-wayanad-meppadi',
      text: '🔴 KERALA (WAYANAD): Meppadi (Chooralmala) • GSI-EWS 14ms | NDMA PROTOCOL-LEVEL 4',
      level: 'CRITICAL'
    },
    {
      corridorId: 'uttarakhand-joshimath-chamoli',
      text: '🟠 UTTARAKHAND (JOSHIMATH): Subsidence 3.8mm/hr along Alaknanda Riverbed • Convoy Pilot Speed <20 kmph',
      level: 'CRITICAL'
    },
    {
      corridorId: 'himachal-shimla-kinnaur-nh5',
      text: '⚠️ HIMACHAL (NH-05): Rockfall trajectory risk near Nigulsari • Night traffic suspended 19:00 - 05:30 IST',
      level: 'SEVERE'
    },
    {
      corridorId: 'assam-dima-hasao',
      text: '🟠 ASSAM (DIMA HASAO): Disang shale creep at Km 44 • NFR Railway cautionary speed 20kmph active',
      level: 'SEVERE'
    },
    {
      corridorId: 'karnataka-agumbe-ghat',
      text: '🔴 KARNATAKA (AGUMBE GHAT): 210mm Heavy Monsoon Inflow • Soil Pore Pressure 45.1 kPa Limit Breached',
      level: 'CRITICAL'
    }
  ];

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, tickerItems.length]);

  return (
    <div 
      id="national-geohazard-feed-banner"
      className={`border-b text-xs px-3 sm:px-6 py-2 flex items-center justify-between overflow-hidden shadow-xs transition-colors ${
        isDarkMode 
          ? 'bg-slate-950 border-slate-800 text-slate-200' 
          : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      <div className={`flex items-center space-x-2 shrink-0 pr-3 border-r ${
        isDarkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
        </span>
        <span className="font-extrabold text-red-600 uppercase tracking-wider text-[11px] flex items-center gap-1 font-mono">
          <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
          NDMA NATIONAL FEED:
        </span>
      </div>

      <div 
        className="flex-1 overflow-hidden px-3 cursor-pointer"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={() => {
          const item = tickerItems[currentIndex];
          const matched = corridors.find(c => c.id === item.corridorId);
          if (matched) onSelectCorridor(matched);
        }}
        title="Click to inspect this corridor in telemetry console"
      >
        <div className="flex items-center gap-3 truncate">
          <span className={`font-semibold text-xs flex items-center gap-1.5 transition-colors ${
            isDarkMode ? 'text-amber-300 hover:text-amber-200' : 'text-amber-900 hover:text-red-700'
          }`}>
            {tickerItems[currentIndex].text}
          </span>
          <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-red-100 text-red-700 border border-red-300 font-mono">
            {tickerItems[currentIndex].level}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-2 shrink-0 pl-2 text-[10px] font-mono">
        <span className="hidden lg:inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-400 border border-slate-200 dark:border-slate-700 font-bold">
          GSI-EWS 14ms
        </span>
        <span className="hidden sm:inline-block font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
          LEVEL 4
        </span>
        <button 
          id="ticker-pause-toggle"
          onClick={() => setIsPaused(!isPaused)} 
          className={`p-1 rounded transition-colors cursor-pointer ${
            isDarkMode 
              ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' 
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
          title={isPaused ? "Resume Live Feed" : "Pause Live Feed"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
