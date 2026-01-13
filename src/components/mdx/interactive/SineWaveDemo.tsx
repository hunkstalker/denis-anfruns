import React, { useState, useEffect } from 'react';

interface SineWaveDemoProps {
  showControls?: boolean;
}

export default function SineWaveDemo({ showControls = false }: SineWaveDemoProps) {
  const [time, setTime] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [speed, setSpeed] = useState(1.5);

  // Canvas dimensions
  const circleSize = 160;
  const waveWidth = 280;
  const canvasWidth = circleSize + waveWidth + 60;
  const canvasHeight = 200;
  
  const circleRadius = 60;
  const circleCenterX = circleRadius + 20;
  const circleCenterY = canvasHeight / 2;
  
  const waveStartX = circleSize + 20;
  const waveHeight = circleRadius;

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;
    
    let animationId: number;
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      setTime(prev => (prev + delta * speed) % (Math.PI * 4));
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isAnimating, speed]);

  // Calculate positions
  const angle = time;
  const pointX = circleCenterX + Math.cos(angle) * circleRadius;
  const pointY = circleCenterY + Math.sin(angle) * circleRadius;
  
  const sinValue = Math.sin(angle);
  const cosValue = Math.cos(angle);

  // Generate wave path
  const generateWavePath = () => {
    const points: string[] = [];
    const samples = 100;
    
    for (let i = 0; i <= samples; i++) {
      const t = (i / samples) * Math.PI * 2;
      const x = waveStartX + (i / samples) * waveWidth;
      const y = circleCenterY + Math.sin(angle - t) * waveHeight;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    
    return points.join(' ');
  };

  const toggleAnimation = () => setIsAnimating(!isAnimating);

  return (
    <div className="my-8 flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      {/* Visualization */}
      <div className="relative flex justify-center bg-zinc-50 dark:bg-black/20 rounded-lg overflow-hidden py-4">
        <svg width={canvasWidth} height={canvasHeight} className="overflow-visible">
          {/* Unit Circle */}
          <circle 
            cx={circleCenterX} 
            cy={circleCenterY} 
            r={circleRadius} 
            fill="none" 
            stroke="currentColor" 
            className="text-zinc-300 dark:text-zinc-700" 
            strokeWidth="2"
          />
          
          {/* Axes on circle */}
          <line 
            x1={circleCenterX - circleRadius - 10} y1={circleCenterY} 
            x2={circleCenterX + circleRadius + 10} y2={circleCenterY} 
            stroke="currentColor" 
            className="text-zinc-200 dark:text-zinc-800" 
            strokeWidth="1"
          />
          <line 
            x1={circleCenterX} y1={circleCenterY - circleRadius - 10} 
            x2={circleCenterX} y2={circleCenterY + circleRadius + 10} 
            stroke="currentColor" 
            className="text-zinc-200 dark:text-zinc-800" 
            strokeWidth="1"
          />
          
          {/* Radius line to point */}
          <line 
            x1={circleCenterX} y1={circleCenterY} 
            x2={pointX} y2={pointY} 
            className="stroke-[--tangerine]" 
            strokeWidth="3"
          />
          
          {/* Cos projection (X) */}
          <line 
            x1={circleCenterX} y1={circleCenterY} 
            x2={pointX} y2={circleCenterY} 
            className="stroke-blue-500" 
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          
          {/* Sin projection (Y) */}
          <line 
            x1={pointX} y1={circleCenterY} 
            x2={pointX} y2={pointY} 
            className="stroke-emerald-500" 
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          
          {/* Horizontal connector to wave */}
          <line 
            x1={pointX} y1={pointY} 
            x2={waveStartX} y2={pointY} 
            className="stroke-emerald-500/40" 
            strokeWidth="1"
            strokeDasharray="2 2"
          />
          
          {/* Moving point on circle */}
          <circle 
            cx={pointX} 
            cy={pointY} 
            r="8" 
            className="fill-[--tangerine]"
          />
          
          {/* Wave path */}
          <path 
            d={generateWavePath()} 
            fill="none" 
            className="stroke-violet-500" 
            strokeWidth="2"
          />
          
          {/* Wave axis */}
          <line 
            x1={waveStartX} y1={circleCenterY} 
            x2={waveStartX + waveWidth} y2={circleCenterY} 
            stroke="currentColor" 
            className="text-zinc-300 dark:text-zinc-700" 
            strokeWidth="1"
          />
          
          {/* Current point on wave */}
          <circle 
            cx={waveStartX} 
            cy={pointY} 
            r="6" 
            className="fill-violet-500"
          />
          
          {/* Labels */}
          <text x={circleCenterX - 45} y={circleCenterY + 4} className="fill-blue-500 text-xs font-bold">cos</text>
          <text x={pointX + 5} y={circleCenterY + (sinValue > 0 ? 15 : -8)} className="fill-emerald-500 text-xs font-bold">sin</text>
          
          {/* Angle indicator */}
          <text x={circleCenterX + 15} y={circleCenterY - 5} className="fill-zinc-500 text-[10px] font-mono">
            θ
          </text>
        </svg>
        
        {isAnimating && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[--tangerine] backdrop-blur dark:bg-black/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[--tangerine] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[--tangerine]"></span>
            </span>
            Animación
          </div>
        )}
      </div>

      {/* Values Display */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-3">
          <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Ángulo (θ)</div>
          <code className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            {(angle % (Math.PI * 2)).toFixed(2)} rad
          </code>
        </div>
        <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 border border-blue-200 dark:border-blue-800">
          <div className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1">cos(θ)</div>
          <code className="text-sm font-bold text-blue-700 dark:text-blue-300">
            {cosValue.toFixed(3)}
          </code>
        </div>
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 border border-emerald-200 dark:border-emerald-800">
          <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1">sin(θ)</div>
          <code className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {sinValue.toFixed(3)}
          </code>
        </div>
      </div>

      {/* Optional Controls */}
      {showControls && (
        <div className="flex items-center justify-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
          <button 
            onClick={toggleAnimation}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {isAnimating ? '⏸ Pausar' : '▶ Continuar'}
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Velocidad:</span>
            <input 
              type="range" 
              min="0.5" 
              max="4" 
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-20 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-[--tangerine]"
            />
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{speed}x</span>
          </div>
        </div>
      )}
    </div>
  );
}
