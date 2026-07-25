"use client"
import React, { useState, useEffect } from 'react';

const OBSTACLES = [
  { x: 1, y: 2, icon: '🍽️', name: 'Dirty Dishes' },
  { x: 3, y: 1, icon: '⏰', name: 'Late Alarms' },
  { x: 2, y: 4, icon: '🧺', name: 'Laundry Pile' },
  { x: 4, y: 3, icon: '🚗', name: 'Traffic Jam' }
];

const COMPASS_DIRECTIONS = [
  "🧭 North: Travel back to where you first met.",
  "🧭 East: Take a detour and order her favorite sushi 🍣",
  "🧭 South: Head straight to the blanket fort for movie night 🎪",
  "🧭 West: Go back to the kitchen and bake a chocolate soufflé 🍫",
  "🧭 Northeast: Stop by the flower shop and grab a rose 🌹",
  "🧭 Southwest: Hug your partner for at least 20 seconds 🤗"
];

export default function NotFoundPage() {
  const [rayhanPos, setRayhanPos] = useState({ x: 0, y: 0 });
  const [afrinPos, setAfrinPos] = useState({ x: 5, y: 5 });
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [compassText, setCompassText] = useState("Click the compass below to find your romantic direction!");
  const [isCompassSpinning, setIsCompassSpinning] = useState(false);
  const [compassAngle, setCompassAngle] = useState(0);

  const resetGame = () => {
    setRayhanPos({ x: 0, y: 0 });
    setMoves(0);
    setGameWon(false);
  };

  const moveRayhan = (dx, dy) => {
    if (gameWon) return;

    const newX = rayhanPos.x + dx;
    const newY = rayhanPos.y + dy;

    // Boundary check (6x6 Grid, 0 to 5)
    if (newX < 0 || newX > 5 || newY < 0 || newY > 5) return;

    // Obstacle collision check
    const hitObstacle = OBSTACLES.some(obs => obs.x === newX && obs.y === newY);
    if (hitObstacle) {
      // Block movement on hit
      return;
    }

    setRayhanPos({ x: newX, y: newY });
    setMoves(prev => prev + 1);

    // Win condition check
    if (newX === afrinPos.x && newY === afrinPos.y) {
      setGameWon(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameWon) return;
      if (e.key === 'ArrowUp') moveRayhan(0, -1);
      if (e.key === 'ArrowDown') moveRayhan(0, 1);
      if (e.key === 'ArrowLeft') moveRayhan(-1, 0);
      if (e.key === 'ArrowRight') moveRayhan(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rayhanPos, gameWon]);

  const spinCompass = () => {
    if (isCompassSpinning) return;
    setIsCompassSpinning(true);
    
    // Spin dramatically
    const randomSpin = Math.floor(Math.random() * 5) + 3; // 3 to 7 spins
    const targetAngle = compassAngle + (randomSpin * 360) + Math.floor(Math.random() * 360);
    setCompassAngle(targetAngle);

    setTimeout(() => {
      setIsCompassSpinning(false);
      const randomIndex = Math.floor(Math.random() * COMPASS_DIRECTIONS.length);
      setCompassText(COMPASS_DIRECTIONS[randomIndex]);
    }, 1200);
  };

  const handleGoBack = () => {
    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/'; // Fallback
    }
  };

  return (
    <section className="luxury-not-found relative min-h-screen flex flex-col items-center justify-center py-20 px-4 bg-linear-to-b from-rose-50/50 via-purple-50/20 to-white overflow-hidden text-left">
      
      {/* Background soft glowing blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* LEFT COLUMN: 404 HEADING & TEXT */}
        <div className="lg:col-span-5 text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-100/70 text-rose-700 text-xs font-bold tracking-wider uppercase shadow-sm">
            <span>✨</span> Lost in paradise
          </div>

          <h1 className="font-serif text-6xl lg:text-8xl font-extrabold text-slate-900 leading-none">
            4<span className="text-rose-500 italic font-normal">0</span>4
          </h1>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
            Oops! Looks like we wandered off the path...
          </h2>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-medium">
            This digital scrap page doesn't exist. Don't worry, let's find our way back!
          </p>

          {/* COMPASS INTERACTION CONTAINER */}
          <div className="bg-white border border-rose-100 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <button
                onClick={spinCompass}
                className="relative w-14 h-14 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center shadow-md transition-all duration-300 transform active:scale-95 text-xl shrink-0"
                style={{
                  transform: `rotate(${compassAngle}deg)`,
                  transition: isCompassSpinning ? 'transform 1.2s ease-out' : 'none'
                }}
                disabled={isCompassSpinning}
                title="Spin compass for directions"
              >
                🧭
              </button>
              <div className="text-left">
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Love Compass
                </p>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed mt-0.5">
                  {compassText}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGoBack}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              🏠 Take Me Home
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: REUNITE HEARTS MINI-GAME */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm bg-white border border-rose-100/60 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-115">
            
            {/* Game Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-extrabold text-rose-500 tracking-widest uppercase block">
                  Interactive Game
                </span>
                <h3 className="font-serif font-bold text-slate-800 text-sm">
                  Reunite Rayhan &amp; Afrin
                </h3>
              </div>
              <button
                onClick={resetGame}
                className="text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase transition-all"
              >
                🔄 Reset
              </button>
            </div>

            {/* Game Field Grid */}
            <div className="relative aspect-square w-full max-w-[320px] mx-auto bg-rose-50/20 border-2 border-dashed border-rose-100/50 rounded-2xl grid grid-cols-6 grid-rows-6 p-2 gap-1.5 shadow-inner">
              
              {/* Render 6x6 tiles */}
              {[...Array(36)].map((_, index) => {
                const x = index % 6;
                const y = Math.floor(index / 6);

                const isRayhan = rayhanPos.x === x && rayhanPos.y === y;
                const isAfrin = afrinPos.x === x && afrinPos.y === y;
                const obstacle = OBSTACLES.find(obs => obs.x === x && obs.y === y);

                return (
                  <div
                    key={index}
                    className="relative rounded-lg flex items-center justify-center text-lg select-none transition-all duration-200"
                    style={{
                      background: isRayhan ? 'rgba(59, 130, 246, 0.1)' : isAfrin ? 'rgba(244, 63, 94, 0.1)' : 'transparent'
                    }}
                  >
                    {isRayhan && <span className="animate-bounce text-2xl z-10">🙋‍♂️</span>}
                    {isAfrin && <span className="text-2xl z-10">🙋‍♀️</span>}
                    {obstacle && <span className="text-lg filter grayscale-50" title={obstacle.name}>{obstacle.icon}</span>}
                    
                    {/* Subtle grid indicators */}
                    <div className="absolute inset-0 border border-slate-200/5 rounded-lg pointer-events-none" />
                  </div>
                );
              })}

              {/* WIN MODAL COVER */}
              {gameWon && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 animate-fade-in rounded-2xl">
                  <span className="text-5xl block animate-bounce mb-3">💖🎉💐</span>
                  <h4 className="font-serif text-xl font-bold text-slate-900 leading-snug">
                    Reunited in {moves} Moves!
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-50 mx-auto mt-2 font-medium">
                    You guided Rayhan back to Afrin! No error page can keep us apart.
                  </p>
                  <button
                    onClick={handleGoBack}
                    className="mt-6 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-rose-200"
                  >
                    🏠 Back to Scrapbook
                  </button>
                </div>
              )}
            </div>

            {/* Game Controls */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block animate-pulse">
                Moves Played: {moves} | Avoid: ⏰ 🧺 🍽️ 🚗
              </span>

              {/* Directional Pad */}
              <div className="grid grid-cols-3 gap-1.5 w-max">
                <div />
                <button
                  onClick={() => moveRayhan(0, -1)}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-xs font-bold transition-all transform active:scale-95"
                  title="Move Up"
                >
                  ▲
                </button>
                <div />

                <button
                  onClick={() => moveRayhan(-1, 0)}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-xs font-bold transition-all transform active:scale-95"
                  title="Move Left"
                >
                  ◀
                </button>
                <button
                  onClick={() => moveRayhan(0, 1)}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-xs font-bold transition-all transform active:scale-95"
                  title="Move Down"
                >
                  ▼
                </button>
                <button
                  onClick={() => moveRayhan(1, 0)}
                  className="w-10 h-10 rounded-xl border border-slate-200 hover:border-rose-300 bg-slate-50 hover:bg-rose-50 flex items-center justify-center text-xs font-bold transition-all transform active:scale-95"
                  title="Move Right"
                >
                  ▶
                </button>
              </div>

              <span className="text-[9px] text-slate-400 font-bold block mt-1">
                💡 Tip: Use the Arrow keys on your keyboard to play too!
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
