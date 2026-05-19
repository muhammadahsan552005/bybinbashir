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

    // Simulate loading time (e.g., waiting for assets)
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
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-foreground overflow-hidden"
        >
          {/* Logo / Brand Name Reveal */}
          <div className="relative overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.76, 0, 0.24, 1] }}
              className="font-display text-4xl sm:text-5xl md:text-6xl tracking-widest uppercase font-light"
            >
              ByBin<span className="text-primary font-medium">Bashir</span>
            </motion.h1>
          </div>

          {/* Loading Line */}
          <div className="w-64 h-[2px] bg-border relative overflow-hidden rounded-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-primary"
            />
          </div>

          {/* Percentage text (optional) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            className="mt-4 text-xs tracking-widest text-muted-foreground uppercase"
          >
            Curating Luxury...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
