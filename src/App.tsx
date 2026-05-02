/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';
import { motion } from 'motion/react';
import { Terminal, Activity, Zap, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 flex flex-col font-mono selection:bg-magenta-500/50 overflow-x-hidden relative">
      {/* GLOBAL ARTIFACTS */}
      <div className="fixed inset-0 crt-lines opacity-20 pointer-events-none z-50" />
      <div className="fixed inset-0 vhs-noise pointer-events-none z-40" />
      
      {/* TOP NAVIGATION BAR [SYSTEM STATUS] */}
      <header className="relative z-30 px-6 py-4 flex items-center justify-between border-b-2 border-cyan-400/30 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Zap className="text-magenta-500 animate-pulse" size={24} />
            <h1 className="text-2xl font-black tracking-tighter uppercase glitch-text italic">
              NEURAL_SERPENT.v04
            </h1>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[10px] text-cyan-400/40 border-l border-white/10 pl-6">
            <div className="flex items-center gap-2">
              <Cpu size={12} />
              <span>KERNEL: STABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={12} />
              <span>SYNC: 100%</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="px-3 py-1 border border-cyan-400/30 text-[10px] hover:bg-cyan-400/10 transition-colors uppercase">
            [REBOOT]
          </button>
          <button className="px-3 py-1 border border-magenta-500/30 text-[10px] text-magenta-500 hover:bg-magenta-500/10 transition-colors uppercase">
            [DISP_ERROR]
          </button>
        </div>
      </header>

      {/* CORE INTERFACE GRID */}
      <main className="relative z-20 flex-1 flex flex-col lg:grid lg:grid-cols-[400px_1fr] gap-0">
        
        {/* LEFT SECTOR: AUDIO CONTROL & LOGS */}
        <aside className="border-r-2 border-cyan-400/20 p-8 flex flex-col gap-8 bg-black/40 backdrop-blur-sm lg:h-[calc(100vh-70px)] lg:overflow-y-auto">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-magenta-500 font-bold mb-2">
              {'>'} AUDIO_LATTICE_MODULE
            </span>
            <MusicPlayer />
          </div>

          <div className="mt-auto">
            <div className="p-4 border-2 border-white/5 bg-slate-950/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400/50 animate-scanliner shadow-[0_0_10px_#00ffff]" />
              <h3 className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-4 italic">
                <Terminal size={14} className="text-cyan-400" />
                TERMINAL_OUTPUT
              </h3>
              <div className="space-y-2 text-[10px] font-mono leading-tight">
                <p className="text-cyan-400/60 leading-none">
                  [17:44:28] INITIALIZING NEURAL_SOCKETS...
                </p>
                <p className="text-cyan-400/60 leading-none">
                  [17:44:29] CALIBRATING MOTION_SENSORS...
                </p>
                <p className="text-magenta-500 animate-pulse leading-none">
                  [SYSTEM] AWAITING OPERATOR INPUT_
                </p>
                <p className="text-cyan-400/20 leading-none">
                  _UUID: 5049-7065-4394-AIS-PRE
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER SECTOR: THE VOID / GAME GRID */}
        <section className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.05)_0%,transparent_70%)]">
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl relative z-10"
          >
            <SnakeGame />
          </motion.div>

          {/* BRUTALIST STATUS HUD */}
          <div className="mt-12 flex flex-wrap justify-center gap-10">
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 italic font-bold">X-PLANE</span>
              <div className="w-16 h-1 bg-cyan-400/20 relative">
                <motion.div 
                  animate={{ left: ["0%", "100%", "0%"] }} 
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-0 w-4 h-full bg-cyan-400" 
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 italic font-bold">Y-COORD</span>
              <div className="w-16 h-1 bg-magenta-500/20 relative">
                <motion.div 
                  animate={{ left: ["100%", "0%", "100%"] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-0 w-4 h-full bg-magenta-500" 
                />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 italic font-bold">BIT_RATE</span>
              <span className="text-white text-xs font-bold font-mono">1.21 GW</span>
            </div>
          </div>
        </section>
      </main>

      {/* SYSTEM OVERVIEW FOOTER */}
      <footer className="relative z-30 px-6 py-3 border-t-2 border-cyan-400/20 flex flex-col md:flex-row items-center justify-between text-[9px] text-cyan-400/40 uppercase tracking-[0.2em] bg-black/90">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold italic">PROPRIETARY NEURAL ENGINE</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>EST_1992_REBIRTH_2026</span>
        </div>
        <div className="flex items-center gap-8 mt-2 md:mt-0">
          <div className="flex gap-2 items-center">
            <span className="text-magenta-500">THREAT_LEVEL:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`w-1 h-2 ${i < 4 ? 'bg-magenta-500' : 'bg-magenta-900'}`} />
              ))}
            </div>
          </div>
          <span>OPERATOR: jachinkpogli</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanliner {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(300px); }
        }
        .animate-scanliner {
          animation: scanliner 4s linear infinite;
        }
      `}} />
    </div>
  );
}

