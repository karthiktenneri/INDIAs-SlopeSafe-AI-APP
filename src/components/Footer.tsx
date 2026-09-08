import React from 'react';
import { ExternalLink, Radio } from 'lucide-react';
import { SlopeSafeLogo } from './SlopeSafeLogo';

interface FooterProps {
  isDarkMode?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode = false }) => {
  return (
    <footer 
      id="slope-safe-footer" 
      className={`mt-8 border-t py-6 px-4 sm:px-6 text-xs transition-colors ${
        isDarkMode 
          ? 'border-slate-800 bg-slate-950/80 text-slate-400' 
          : 'border-slate-200 bg-white text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Mandate and Governance with SlopeSafeLogo */}
        <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 text-center md:text-left">
          <SlopeSafeLogo size={48} isDarkMode={isDarkMode} />
          <div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
              <span className={`font-black font-display text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                SlopeSafe-AI National Landslide Early Warning System
              </span>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
                NDMA-GSI Joint Command
              </span>
              <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-800">
                ERROR 404
              </span>
            </div>
            <p className="text-[11px] max-w-2xl leading-relaxed">
              Operated under the National Disaster Management Authority (NDMA), Ministry of Earth Sciences (MoES), and Geological Survey of India (GSI) in operational synergy with ISRO Earth Observation and IMD Doppler Radar Network.
            </p>
          </div>
        </div>

        {/* Right Side: Nodes & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-[11px]">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700 font-bold">542 In-Situ IoT Nodes Active</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span className="font-semibold text-cyan-700 hover:underline cursor-pointer">
            National Emergency 112
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="font-bold">
            &copy; 2026 Government of India
          </span>
        </div>
      </div>
    </footer>
  );
};

