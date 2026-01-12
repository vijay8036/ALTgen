import React, { useState, useEffect } from 'react';

const LoadingScanner = () => {
  const [text, setText] = useState("Scanning image...");

  useEffect(() => {
    const states = ["Scanning image...", "Analyzing content...", "Generating ALT text..."];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % states.length;
      setText(states[i]);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Grid configuration
  const gridSize = 12; // 12x12 grid
  const dots = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      // Calculate distance from center (approx 5.5, 5.5)
      const dx = col - gridSize / 2 + 0.5;
      const dy = row - gridSize / 2 + 0.5;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Max distance is approx sqrt(6^2 + 6^2) = 8.48
      const maxDist = gridSize / 1.5;

      // Only render if within a circle for a sphere shape
      if (dist < maxDist) {
        dots.push({
          id: `${row}-${col}`,
          style: {
            '--delay': `${dist * 0.1}s`,
            '--scale-factor': Math.max(0.2, 1 - dist / maxDist), // Larger in middle
          }
        });
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
      <div className="relative p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center">
        <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
          {/* Container for the dot sphere */}
          <div className="grid grid-cols-12 gap-1.5 w-full h-full p-2 place-content-center">
            {dots.map(dot => (
              <div
                key={dot.id}
                className="w-1.5 h-1.5 rounded-full bg-candy-btn-start animate-sphere-breathing"
                style={dot.style}
              />
            ))}
          </div>
        </div>

        <p className="text-candy-green font-mono text-lg tracking-wider animate-pulse uppercase">
          {text}
        </p>
      </div>

      <style jsx>{`
        @keyframes sphere-breathing {
          0%, 100% { 
            transform: scale(var(--scale-factor));
            opacity: 0.3;
          }
          50% { 
            transform: scale(calc(var(--scale-factor) * 1.5));
            opacity: 1;
            background-color: var(--color-end, #a855f7); /* purple */
          }
        }
        
        .animate-sphere-breathing {
          animation: sphere-breathing 2s ease-in-out infinite;
          animation-delay: var(--delay);
        }
      `}</style>
    </div>
  );
};

export default LoadingScanner;
