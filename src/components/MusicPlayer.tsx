/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "SIGNAL_LOST",
    artist: "CORE_DUMP",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&h=400&fit=crop"
  },
  {
    id: 2,
    title: "HEX_VOLT",
    artist: "NEURAL_LINK",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop"
  },
  {
    id: 3,
    title: "ROOT_ACCESS",
    artist: "STATIC_VOID",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("IO_ERROR", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-black border-2 border-magenta-500 shadow-[4px_4px_0px_#00ffff] font-mono">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="relative overflow-hidden aspect-video border border-magenta-500/30 group">
        <motion.div
          key={currentTrack.id}
          className="w-full h-full grayscale contrast-150 brightness-75 transition-all group-hover:grayscale-0 group-hover:brightness-100"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-magenta-500/10 mix-blend-color" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-cyan-400 opacity-50 animate-glitch-line" />
        
        {isPlaying && (
          <div className="absolute top-2 left-2 flex gap-1">
            <span className="text-[8px] bg-magenta-500 text-black px-1 font-bold animate-pulse">STREAMING_LIVE</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-0 border-l-2 border-magenta-500 pl-3">
        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase leading-tight glitch-text">
          {currentTrack.title}
        </h2>
        <p className="text-[10px] text-cyan-400 font-bold tracking-[0.2em]">
          SRC://{currentTrack.artist}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div className="h-1 w-full bg-slate-900 border border-white/10 relative">
          <motion.div 
            className="h-full bg-magenta-500 shadow-[0_0_10px_#ff00ff]"
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-magenta-500/60 font-bold">
          <span>00:00:00</span>
          <span>SYSTEM_END</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <button 
          onClick={handlePrev}
          className="flex items-center justify-center p-2 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 active:bg-cyan-400 hover:text-black transition-all"
        >
          <SkipBack size={16} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="col-span-2 flex items-center justify-center p-2 bg-magenta-500 text-black font-bold uppercase transition-transform active:scale-95 shadow-[0_4px_0_#008888] hover:shadow-[0_2px_0_#008888] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none"
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
        </button>

        <button 
          onClick={handleNext}
          className="flex items-center justify-center p-2 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 active:bg-cyan-400 hover:text-black transition-all"
        >
          <SkipForward size={16} />
        </button>
      </div>

      <div className="flex gap-1 mt-2">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="flex-1 h-3 border border-cyan-400/10 flex items-center justify-center">
            {isPlaying && (
              <motion.div
                animate={{ height: ['20%', '80%', '40%', '100%', '30%'] }}
                transition={{ duration: 0.5 + Math.random(), repeat: Infinity, ease: "steps(4)" }}
                className="w-[1px] bg-cyan-400"
              />
            )}
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-line {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-glitch-line {
          animation: glitch-line 2s linear infinite;
        }
      `}} />
    </div>
  );
}
