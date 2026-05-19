import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user has already seen the preloader in this session
    const hasVisited = sessionStorage.getItem("hasVisited");
    
    if (hasVisited) {
      setIsLoading(false);
      return;
    }

    // Give it 2.8s to do the full 360 sweep and exit
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem("hasVisited", "true");
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground overflow-hidden"
        >
          {/* Watch Face Animation */}
          <div className="relative flex items-center justify-center mb-8">
            <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
              {/* Outer Bezel */}
              <circle
                cx="60"
                cy="60"
                r="56"
                fill="transparent"
                stroke="hsl(var(--primary) / 0.2)"
                strokeWidth="2"
              />
              
              {/* Animated drawing of the bezel (optional extra touch) */}
              <motion.circle
                cx="60"
                cy="60"
                r="56"
                fill="transparent"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="352" // 2 * pi * 56 = 351.8
                initial={{ strokeDashoffset: 352 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="origin-center -rotate-90"
              />

              {/* Center Pin */}
              <circle cx="60" cy="60" r="4" fill="hsl(var(--primary))" />

              {/* Sweeping Seconds Hand */}
              <motion.line
                x1="60"
                y1="60"
                x2="60"
                y2="15"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2.5, ease: "easeInOut" }}
                className="origin-[60px_60px]" // Rotate around the center (cx, cy)
              />
              
              {/* 12 o'clock marker */}
              <line x1="60" y1="4" x2="60" y2="10" stroke="hsl(var(--primary))" strokeWidth="2" />
              {/* 3 o'clock marker */}
              <line x1="116" y1="60" x2="110" y2="60" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
              {/* 6 o'clock marker */}
              <line x1="60" y1="116" x2="60" y2="110" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
              {/* 9 o'clock marker */}
              <line x1="4" y1="60" x2="10" y2="60" stroke="hsl(var(--primary) / 0.5)" strokeWidth="2" />
            </svg>
          </div>

          {/* Loading Text */}
          <div className="flex flex-col items-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-display text-2xl tracking-[0.2em] uppercase font-light mb-3 text-foreground"
            >
              ByBin<span className="text-primary font-medium">Bashir</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-[10px] tracking-widest text-primary/70 uppercase flex items-center gap-2"
            >
              Calibrating Movement
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                ...
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
