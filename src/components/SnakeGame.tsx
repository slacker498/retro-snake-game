/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, RotateCcw, Play, AlertTriangle } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  
  const lastTimeRef = useRef(0);
  const directionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: {x: number, y: number}[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const collision = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!collision) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setGameStarted(true);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    const current = directionRef.current;
    
    if ((key === 'ArrowUp' || key === 'w') && current.y === 0) setDirection({ x: 0, y: -1 });
    if ((key === 'ArrowDown' || key === 's') && current.y === 0) setDirection({ x: 0, y: 1 });
    if ((key === 'ArrowLeft' || key === 'a') && current.x === 0) setDirection({ x: -1, y: 0 });
    if ((key === 'ArrowRight' || key === 'd') && current.x === 0) setDirection({ x: 1, y: 0 });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const update = useCallback((time: number) => {
    if (isGameOver || !gameStarted) return;

    if (time - lastTimeRef.current < (BASE_SPEED - Math.min(score * 2, 100))) {
      requestAnimationFrame(update);
      return;
    }
    lastTimeRef.current = time;

    setSnake(prevSnake => {
      const head = { 
        x: prevSnake[0].x + directionRef.current.x, 
        y: prevSnake[0].y + directionRef.current.y 
      };

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setIsGameOver(true);
        return prevSnake;
      }

      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      if (head.x === food.x && head.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    requestAnimationFrame(update);
  }, [food, isGameOver, gameStarted, score, generateFood]);

  useEffect(() => {
    if (gameStarted && !isGameOver) {
      requestAnimationFrame(update);
    }
  }, [gameStarted, isGameOver, update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width / GRID_SIZE;

    // BACKGROUND: PURE BLACK
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // GRID: HARSH CYAN/MAGENTA
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * size, 0); ctx.lineTo(i * size, canvas.height); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * size); ctx.lineTo(canvas.width, i * size); ctx.stroke();
    }

    // FOOD: PIXELATED SQUARE
    ctx.fillStyle = '#ff00ff'; // MAGENTA
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * size + 2, food.y * size + 2, size - 4, size - 4);

    // SNAKE: BLOCKY BRUTALIST
    snake.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
      ctx.shadowBlur = isHead ? 20 : 5;
      ctx.shadowColor = '#00ffff';
      
      ctx.fillRect(
        segment.x * size + 1, 
        segment.y * size + 1, 
        size - 2, 
        size - 2
      );
      
      if (isHead) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(segment.x * size + 5, segment.y * size + 5, 4, 4);
      }
    });

    ctx.shadowBlur = 0;
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-2 p-6 bg-black border-2 border-cyan-400 shadow-[8px_8px_0px_#ff00ff] relative overflow-hidden font-mono">
      <div className="flex justify-between w-full mb-4 px-2">
        <div className="flex flex-col">
          <span className="text-[10px] text-magenta-500 font-bold tracking-widest">DATA_HARVESTED</span>
          <span className="text-3xl font-black italic glitch-text text-white leading-none">
            {score.toString().padStart(6, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-cyan-400 font-bold tracking-widest">LOCAL_RECORD</span>
          <span className="text-xl font-bold text-cyan-400/50 leading-none">
            {highScore.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      <div className="relative border-4 border-magenta-500 bg-black p-1 shadow-[inset_0_0_20px_#ff00ff22]">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="max-w-full h-auto block grayscale contrast-125"
        />
        
        <AnimatePresence>
          {(!gameStarted || isGameOver) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 border-2 border-magenta-500 animate-pulse"
            >
              <div className="mb-6">
                <AlertTriangle className="text-magenta-500 mx-auto mb-2" size={48} />
                <h3 className="text-4xl font-black italic tracking-tighter text-white glitch-text uppercase">
                  {isGameOver ? 'CRITICAL_FAIL' : 'RUN_SERPENT'}
                </h3>
                <p className="text-[10px] text-magenta-500 font-bold mt-2">ERR_CODE: {isGameOver ? 'SEGMENTATION_FAULT' : 'AWAITING_EXEC'}</p>
              </div>
              
              <button 
                onClick={resetGame}
                className="group relative flex items-center gap-3 px-10 py-5 bg-white text-black font-black text-sm uppercase tracking-tighter hover:bg-cyan-400 transition-all shadow-[4px_4px_0px_#ff00ff] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                {isGameOver ? <RotateCcw size={20} /> : <Play size={20} />}
                <span>{isGameOver ? 'RE-INITIALIZE' : 'INIT_KERNEL'}</span>
              </button>

              <div className="mt-8 flex gap-8 text-[8px] font-bold text-white/30 uppercase tracking-[0.3em]">
                <div className="flex flex-col gap-1">
                  <span className="text-white border border-white/20 px-2 py-1">WASD</span>
                  <span>NAV_PROTO</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white border border-white/20 px-2 py-1">E_BITS</span>
                  <span>FEED_STK</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full mt-4 flex justify-between items-center text-[10px] text-cyan-400/40 font-bold uppercase tracking-widest">
        <span>GRID_ACTIVE: 20x20</span>
        <div className="flex items-center gap-2">
          <Activity size={10} className="animate-pulse" />
          <span>REALTIME_OS</span>
        </div>
      </div>
    </div>
  );
}
