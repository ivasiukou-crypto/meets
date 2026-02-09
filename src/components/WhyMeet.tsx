import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const WhyMeet = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State
  const [activeCard, setActiveCard] = useState(0);
  const [walkerPos, setWalkerPos] = useState(0); // 0 to 100%
  const [actionState, setActionState] = useState<"walking" | "acting">("walking");

  // Cards data
  const cards = [
    { id: 0, title: t("why_meet.card1_title"), desc: t("why_meet.card1_desc"), action: "meet" },
    { id: 1, title: t("why_meet.card2_title"), desc: t("why_meet.card2_desc"), action: "solve" },
    { id: 2, title: t("why_meet.card3_title"), desc: t("why_meet.card3_desc"), action: "find" },
    { id: 3, title: t("why_meet.card4_title"), desc: t("why_meet.card4_desc"), action: "talk" },
  ];

  // Animation Sequence Logic
  useEffect(() => {
    let isMounted = true;
    const SEQUENCE = [
      { type: "walk", to: 12.5, duration: 2000, nextCardIndex: 0 },
      { type: "act", card: 0, duration: 3000 },
      { type: "walk", to: 37.5, duration: 2000, nextCardIndex: 1 },
      { type: "act", card: 1, duration: 3000 },
      { type: "walk", to: 62.5, duration: 2000, nextCardIndex: 2 },
      { type: "act", card: 2, duration: 3000 },
      { type: "walk", to: 87.5, duration: 2000, nextCardIndex: 3 },
      { type: "act", card: 3, duration: 3000 },
      { type: "walk", to: 100, duration: 1000 }, // Walking away
      { type: "reset", to: 0, duration: 0, nextCardIndex: 0 },
    ];

    let currentStep = 0;

    const runSequence = async () => {
      while (isMounted) {
        const step = SEQUENCE[currentStep];

        if (step.type === "walk") {
          setActionState("walking");
          // Update activeCard for "walking towards" phase to keep previous cards active
          if (step.nextCardIndex !== undefined) {
             setActiveCard(step.nextCardIndex);
          }
          
          // Smoothly interpolate walkerPos
          const startPos = step.to === 12.5 && currentStep === 0 ? 0 : 
                           step.to === 100 ? 87.5 :
                           step.to - 25; // heuristic prev pos
          
          // Actually, we can just let CSS transition handle it if we set state
          // But for precise control, we might want to just set the target
          setWalkerPos(step.to!);
          await new Promise(r => setTimeout(r, step.duration));
        } 
        else if (step.type === "act") {
          setActionState("acting");
          setActiveCard(step.card!);
          await new Promise(r => setTimeout(r, step.duration));
        }
        else if (step.type === "reset") {
           setWalkerPos(0);
           setActiveCard(0); // Reset to first
           await new Promise(r => setTimeout(r, 100)); // Brief reset
        }

        currentStep = (currentStep + 1) % SEQUENCE.length;
      }
    };

    runSequence();

    return () => { isMounted = false; };
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 bg-background overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-24 sm:mb-32">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            {t("why_meet.title")}
          </h2>
        </div>

        {/* Animation Track Container */}
        <div className="relative" ref={containerRef}>
          
          {/* The Walking Path (Line) */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-border/50 mt-[-20px] hidden md:block" />

          {/* The Walker Container */}
          <div 
            className="absolute top-0 left-0 z-20 hidden md:block transition-all ease-linear will-change-transform mt-[-150px]"
            style={{ 
              left: `${walkerPos}%`,
              transform: "translateX(-50%)",
              transitionDuration: actionState === "walking" ? "2000ms" : "0ms" 
            }}
          >
            {/* Dynamic Character Scene */}
            <div className="relative w-48 h-32 -ml-16"> {/* Larger container for interactions */}
                <AnimatePresence mode="wait">
                    {actionState === "walking" ? (
                        <motion.div
                            key="walking"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2"
                        >
                            <WalkingSilhouette />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={`acting-${activeCard}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full"
                        >
                           {activeCard === 0 && <MeetingScene />}
                           {activeCard === 1 && <SolvingScene />}
                           {activeCard === 2 && <FindingScene />}
                           {activeCard === 3 && <TalkingScene />}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Thought Bubble */}
            <AnimatePresence>
                {actionState === "acting" && (
                    <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-[100%] left-1/2 -translate-x-1/2 mb-8 whitespace-nowrap bg-primary text-primary-foreground text-sm font-bold px-4 py-2 rounded-2xl shadow-xl z-30"
                    >
                    {activeCard === 0 && t("why_meet.bubble1")}
                    {activeCard === 1 && t("why_meet.bubble2")}
                    {activeCard === 2 && t("why_meet.bubble3")}
                    {activeCard === 3 && t("why_meet.bubble4")}
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 md:pt-0">
            {cards.map((card, idx) => (
              <div key={card.id} className="relative group">
                {/* Progress Bar */}
                <div className={cn(
                  "absolute -top-8 left-0 w-full h-1 bg-muted rounded-full overflow-hidden transition-all hidden md:block",
                  activeCard === idx && actionState === "acting" ? "h-1.5" : "h-1"
                )}>
                  <div 
                    className={cn(
                      "h-full bg-primary transition-all duration-300",
                      (activeCard > idx) || (activeCard === idx && actionState === "acting") ? "w-full" : "w-0"
                    )} 
                  />
                </div>

                {/* Card Body */}
                <motion.div
                  className={cn(
                    "relative p-6 rounded-2xl border transition-all duration-500 h-full",
                    activeCard === idx && actionState === "acting"
                      ? "bg-primary/5 border-primary/50 shadow-lg scale-105 z-10" 
                      : "bg-background border-border/50 opacity-70 hover:opacity-100 hover:border-primary/20"
                  )}
                >
                  {/* Decorative Gradient Bar */}
                  <div className={cn(
                    "w-1.5 h-10 rounded-full mb-4 bg-gradient-to-b transition-all duration-500",
                     idx === 0 ? "from-pink-500 to-rose-500" :
                     idx === 1 ? "from-purple-500 to-indigo-500" :
                     idx === 2 ? "from-blue-500 to-cyan-500" :
                                 "from-amber-500 to-orange-500",
                     activeCard === idx && actionState === "acting" ? "h-12 scale-110" : "h-10 opacity-70"
                  )} />

                  <h3 className={cn(
                    "text-lg font-bold mb-3 transition-colors",
                    activeCard === idx && actionState === "acting" ? "text-primary" : "text-foreground"
                  )}>
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>

                  {/* Solved Checkmark */}
                  <div className={cn(
                     "absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500",
                     activeCard >= idx && !(activeCard === idx && actionState === "walking") ? "bg-green-500 text-white scale-100" : "bg-muted text-transparent scale-0"
                  )}>
                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                     </svg>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- SCENES ---

const WalkerSVG = ({ className, ...props }: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0" className={cn("w-16 h-16 drop-shadow-xl", className)} {...props}>
        <circle cx="12" cy="7" r="3" fill="currentColor" />
        <path d="M12 10 L12 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 11 L9 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 11 L15 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 17 L10 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 17 L14 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
);

const WalkingSilhouette = () => (
    <div className="w-16 h-16 relative text-primary">
         <motion.svg viewBox="0 0 24 24" fill="none" className="w-full h-full drop-shadow-lg">
            <circle cx="12" cy="7" r="3" fill="currentColor" />
            <path d="M12 10 L12 17" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            {/* Animated Limbs */}
            <motion.path d="M12 11 L9 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
                animate={{ d: ["M12 11 L9 14", "M12 11 L15 14", "M12 11 L9 14"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M12 11 L15 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
                animate={{ d: ["M12 11 L15 14", "M12 11 L9 14", "M12 11 L15 14"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M12 17 L10 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
                animate={{ d: ["M12 17 L10 22", "M12 17 L14 22", "M12 17 L10 22"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
            <motion.path d="M12 17 L14 22" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" 
                animate={{ d: ["M12 17 L14 22", "M12 17 L10 22", "M12 17 L14 22"] }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />
         </motion.svg>
    </div>
);

// 1. Meeting Scene: Handshake with Green Guy
const MeetingScene = () => (
    <div className="flex items-end justify-between px-4 w-full h-20 relative">
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-primary z-10">
             <WalkerSVG />
        </motion.div>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-green-500 z-0">
             <WalkerSVG style={{ transform: "scaleX(-1)" }} />
        </motion.div>
        {/* Handshake Effect */}
        <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1.2 }} 
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-yellow-400 text-2xl font-bold"
        >
            🤝
        </motion.div>
    </div>
);

// 2. Solving Scene: Holding a Gear with Blue Guy
const SolvingScene = () => (
    <div className="flex items-end justify-between px-4 w-full h-20 relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary">
             <WalkerSVG />
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-blue-500">
             <WalkerSVG style={{ transform: "scaleX(-1)" }} />
        </motion.div>
        {/* Gear */}
        <motion.div 
            animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-600"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
        </motion.div>
    </div>
);

// 3. Finding Scene: Surrounded by faint silhouettes
const FindingScene = () => (
    <div className="flex items-end justify-center w-full h-20 relative">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-primary z-20">
             <WalkerSVG />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.5, x: 0 }} className="text-purple-400 absolute left-8 bottom-0 z-10 scale-90">
             <WalkerSVG />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 0.5, x: 0 }} className="text-pink-400 absolute right-8 bottom-0 z-10 scale-90">
             <WalkerSVG style={{ transform: "scaleX(-1)" }} />
        </motion.div>
        {/* Search Icon */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: -40 }} transition={{ delay: 0.5 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-white rounded-full p-1 shadow-sm"
        >
            🔍
        </motion.div>
    </div>
);

// 4. Talking Scene: Chat bubbles
const TalkingScene = () => (
    <div className="flex items-end justify-between px-4 w-full h-20 relative">
        <div className="text-primary">
             <WalkerSVG />
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-orange-500">
             <WalkerSVG style={{ transform: "scaleX(-1)" }} />
        </motion.div>
        
        {/* Bubbles */}
        <motion.div 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
            className="absolute top-0 left-8 bg-primary text-white text-[10px] px-2 py-1 rounded-tr-xl rounded-tl-xl rounded-bl-xl"
        >
            Hello!
        </motion.div>
        <motion.div 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2 }}
            className="absolute top-4 right-8 bg-orange-500 text-white text-[10px] px-2 py-1 rounded-tr-xl rounded-tl-xl rounded-br-xl"
        >
            Hi there!
        </motion.div>
    </div>
);
