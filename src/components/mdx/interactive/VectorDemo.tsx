import React, { useState, useEffect } from 'react';

export default function VectorDemo() {
  const [input, setInput] = useState({ x: 0, y: 0 });
  const [isNormalized, setIsNormalized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  // Grid settings
  const canvasWidth = 460;
  const canvasHeight = 320;
  
  const scale = 80;
  const gridRadius = 130; // 260px grid size
  const gridSize = gridRadius * 2;
  
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  // Grid top-left
  const gridX = centerX - gridRadius;
  const gridY = centerY - gridRadius;

  // Animation Sequence
  useEffect(() => {
    if (!isAnimating) return;

    const sequence = [
      { t: 0, action: () => { setInput({ x: 0, y: 0 }); setIsNormalized(false); } }, // Start
      { t: 1000, action: () => setInput({ x: 1, y: 0 }) }, // Right
      { t: 2500, action: () => setInput({ x: 1, y: 1 }) }, // Down (Diagonal)
      { t: 4000, action: () => setIsNormalized(true) },   // Normalize
      { t: 7000, action: () => { setInput({ x: 0, y: 0 }); setIsNormalized(false); } }, // Reset
    ];

    const timeouts: NodeJS.Timeout[] = [];
    const loopDuration = 8000;

    const schedule = () => {
      sequence.forEach(({ t, action }) => {
        timeouts.push(setTimeout(action, t));
      });
    };

    schedule();
    const interval = setInterval(schedule, loopDuration);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [isAnimating]);

  // Calculate actual vector values
  const rawMagnitude = Math.sqrt(input.x * input.x + input.y * input.y);
  
  // Normalized values
  const normalizedX = rawMagnitude > 0 ? input.x / rawMagnitude : 0;
  const normalizedY = rawMagnitude > 0 ? input.y / rawMagnitude : 0;

  // Values to display based on mode
  const displayX = isNormalized ? normalizedX : input.x;
  const displayY = isNormalized ? normalizedY : input.y;
  const displayMagnitude = isNormalized ? (rawMagnitude > 0 ? 1 : 0) : rawMagnitude;

  // Visual coordinates
  const endX = centerX + displayX * scale;
  const endY = centerY + displayY * scale;

  const handleManualInput = (dx: number, dy: number) => {
    setIsAnimating(false); // Stop animation on interaction
    setInput(prev => {
      const newX = Math.max(-1, Math.min(1, prev.x + dx));
      const newY = Math.max(-1, Math.min(1, prev.y + dy));
      return { x: newX, y: newY };
    });
  };

  const handleReset = () => {
     setIsAnimating(false);
     setInput({ x: 0, y: 0 });
     setIsNormalized(false);
  };
  
  const toggleNormalize = () => {
    setIsAnimating(false);
    setIsNormalized(!isNormalized);
  };
  
  const restartAnimation = () => {
    setIsAnimating(true);
    setInput({ x: 0, y: 0 });
    setIsNormalized(false);
  }

  return (
    <div className="my-8 flex flex-col gap-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Visualization Area - Centered & Prominent */}
      <div className="relative flex justify-center bg-zinc-50 dark:bg-black/20 rounded-lg overflow-hidden py-4">
        <svg width={canvasWidth} height={canvasHeight} className="">
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width={scale} height={scale} patternUnits="userSpaceOnUse" x={centerX} y={centerY}>
              <path d={`M ${scale} 0 L 0 0 0 ${scale}`} fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800" strokeWidth="1" />
            </pattern>
          </defs>
          
          {/* Background & Grid (Restricted to grid area) */}
          <rect x={gridX} y={gridY} width={gridSize} height={gridSize} fill="url(#grid)" />
          
          {/* Limits / Border of grid */}
          <rect x={gridX} y={gridY} width={gridSize} height={gridSize} fill="none" stroke="currentColor" className="text-zinc-200 dark:text-zinc-800 opacity-50" strokeWidth="1" />
          
          {/* Axis */}
          <line x1={centerX} y1={gridY} x2={centerX} y2={gridY + gridSize} stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />
          <line x1={gridX} y1={centerY} x2={gridX + gridSize} y2={centerY} stroke="currentColor" className="text-zinc-300 dark:text-zinc-700" strokeWidth="2" />

          {/* Unit Circle (Ghost) */}
          <circle cx={centerX} cy={centerY} r={scale} fill="none" stroke="currentColor" className="text-blue-500/20" strokeWidth="2" strokeDasharray="4 4" />

          {/* Raw Input Ghost Vector (when normalized) */}
          {isNormalized && rawMagnitude > 1.01 && (
             <line 
               x1={centerX} y1={centerY} 
               x2={centerX + input.x * scale} 
               y2={centerY + input.y * scale} 
               className="stroke-zinc-300 dark:stroke-zinc-700" 
               strokeWidth="4" 
               strokeLinecap="round"
             />
          )}

          {/* The Vector Arrow */}
          <line 
            x1={centerX} y1={centerY} 
            x2={endX} 
            y2={endY} 
            className="stroke-[--tangerine] transition-all duration-300" 
            strokeWidth="4" 
            strokeLinecap="round"
          />
          <circle cx={centerX} cy={centerY} r="4" className="fill-zinc-500" />
          <circle cx={endX} cy={endY} r="6" className="fill-[--tangerine] transition-all duration-300" />

          {/* Labels - Adjusted to keep inside bounds */}
           <text 
             x={endX + (displayX >= 0 ? 10 : -10)} 
             y={endY + (displayY >= 0 ? 20 : -10)} 
             textAnchor={displayX >= 0 ? "start" : "end"}
             className="fill-[--tangerine] text-xs font-bold font-mono transition-all duration-300"
           >
             ({displayX.toFixed(2)}, {displayY.toFixed(2)})
           </text>
        </svg>
        <div className="absolute top-4 right-4 text-xs font-mono text-zinc-400 pointer-events-none">
           Y+ (Abajo)
        </div>
        {isAnimating && (
           <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[--tangerine] backdrop-blur dark:bg-black/50">
             <span className="relative flex h-2 w-2">
               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--tangerine] opacity-75"></span>
               <span className="relative inline-flex h-2 w-2 rounded-full bg-[--tangerine]"></span>
             </span>
             Demo Automática
           </div>
        )}
      </div>

      {/* Controls & Stats Area - Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Left: Controls */}
        <div className="flex flex-col items-center justify-center p-4">
          <h3 className="mb-2 text-base font-bold text-zinc-800 dark:text-zinc-100 text-center">Simulador</h3>
          
          <div className="flex flex-col items-center gap-2">
            <button 
              onMouseDown={() => handleManualInput(0, -1)} 
              className={`flex size-12 items-center justify-center rounded-lg border font-mono text-xl font-bold transition-all ${input.y === -1 ? 'bg-[--tangerine] text-white border-[--tangerine]' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm'}`}
            >W</button>
            <div className="flex gap-2">
              <button 
                onMouseDown={() => handleManualInput(-1, 0)}
                className={`flex size-12 items-center justify-center rounded-lg border font-mono text-xl font-bold transition-all ${input.x === -1 ? 'bg-[--tangerine] text-white border-[--tangerine]' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm'}`}
              >A</button>
              <button 
                onMouseDown={() => handleManualInput(0, 1)}
                 className={`flex size-12 items-center justify-center rounded-lg border font-mono text-xl font-bold transition-all ${input.y === 1 ? 'bg-[--tangerine] text-white border-[--tangerine]' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm'}`}
              >S</button>
              <button 
                onMouseDown={() => handleManualInput(1, 0)}
                 className={`flex size-12 items-center justify-center rounded-lg border font-mono text-xl font-bold transition-all ${input.x === 1 ? 'bg-[--tangerine] text-white border-[--tangerine]' : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-sm'}`}
              >D</button>
            </div>
            
            { !isAnimating ? (
               <button onClick={restartAnimation} className="mt-3 text-xs text-[--tangerine] font-medium hover:underline">
                 ▶ Ver animación automática
               </button>
            ) : (
                <button onClick={handleReset} className="mt-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  ⏹ Detener
                </button>
            )}
          </div>
        </div>

        {/* Right: Stats */}
        <div className="flex flex-col justify-center rounded-lg bg-zinc-50 p-5 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 h-full">
           <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-200 dark:border-zinc-700">
             <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Input Raw</span>
             <code className="text-sm font-mono text-zinc-800 dark:text-zinc-200">({input.x}, {input.y})</code>
           </div>
           
           <div className="flex items-center justify-between mb-4">
             <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Magnitud</span>
             <code className={`text-sm font-bold font-mono ${rawMagnitude > 1.01 && !isNormalized ? 'text-red-500' : 'text-emerald-500'}`}>
               {isNormalized ? '1.000' : rawMagnitude.toFixed(3)}
             </code>
           </div>

           <label className="flex items-center gap-3 cursor-pointer group">
             <div className="relative">
               <input type="checkbox" checked={isNormalized} onChange={toggleNormalize} className="peer sr-only" />
               <div className="h-5 w-9 rounded-full bg-zinc-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-zinc-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[--tangerine] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none dark:bg-zinc-700 dark:border-zinc-600 group-hover:bg-zinc-300 dark:group-hover:bg-zinc-600"></div>
             </div>
             <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">Activar .normalized()</span>
           </label>
           
           <p className="mt-3 text-xs text-zinc-500 min-h-[3.5em] flex items-center leading-relaxed">
             {isNormalized 
               ? "✅ Velocidad constante (1.0)." 
               : rawMagnitude > 1.01 
                  ? "❌ ¡Error! Magnitud > 1. Corres más rápido." 
                  : (input.x === 0 && input.y === 0) ? "💤 Nave parada." : "✅ Velocidad normal."}
           </p>
        </div>
      </div>
    </div>
  );
}
