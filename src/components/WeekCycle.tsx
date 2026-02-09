import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle, RefreshCcw, Star, CalendarDays, Users, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

export const WeekCycle = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: t("week_flow.step1_title"), // Суббота: решаешь
      desc: t("week_flow.step1_desc"),   // Получаешь приглашение...
      icon: CalendarDays,
    },
    {
      id: 1,
      title: t("week_flow.step2_title"), // Понедельник: знакомишься
      desc: t("week_flow.step2_desc"),   // Видишь анкету...
      icon: Users,
    },
    {
      id: 2,
      title: t("week_flow.step3_title"), // Среда: если нужно — меняем
      desc: t("week_flow.step3_desc"),   // Не получилось связаться...
      icon: RefreshCcw,
    },
    {
      id: 3,
      title: t("week_flow.step4_title"), // Суббота: делишься опытом
      desc: t("week_flow.step4_desc"),   // Отмечаешь, состоялась ли...
      icon: Star,
    },
  ];

  // Auto-cycle steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000); // 5 seconds per step
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
      {/* Left Column: Visual Animation Circle */}
      <div className="relative order-2 lg:order-1 h-[400px] flex items-center justify-center bg-muted/20 rounded-[2.5rem] overflow-hidden border border-border/50">
        
        {/* Background Decorative Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-[300px] h-[300px] rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" style={{ animationDuration: "30s" }} />
        </div>

        <AnimatePresence mode="wait">
          {activeStep === 0 && <Step1Confirmation key="step1" />}
          {activeStep === 1 && <Step2Chat key="step2" />}
          {activeStep === 2 && <Step3Rematch key="step3" />}
          {activeStep === 3 && <Step4Rating key="step4" />}
        </AnimatePresence>
      </div>

      {/* Right Column: Steps List */}
      <div className="order-1 lg:order-2 space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`cursor-pointer transition-all duration-300 p-4 rounded-2xl flex gap-4 items-start border-2 ${
              activeStep === index
                ? "bg-background border-primary shadow-lg scale-105"
                : "bg-transparent border-transparent opacity-60 hover:opacity-100"
            }`}
            onClick={() => setActiveStep(index)}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                activeStep === index ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className={`font-bold text-lg mb-1 ${activeStep === index ? "text-primary" : "text-foreground"}`}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Animations Components ---

const Step1Confirmation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative flex flex-col items-center gap-6 p-8 bg-background rounded-3xl shadow-xl border border-border/50 max-w-xs w-full"
    >
      <div className="text-center">
        <h4 className="font-bold text-lg mb-2">Участвуешь?</h4>
        <p className="text-sm text-muted-foreground">Новая неделя встреч</p>
      </div>
      
      <div className="flex gap-4 w-full">
         <div className="h-12 flex-1 rounded-xl bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Нет</span>
         </div>
         <motion.div 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ delay: 1, duration: 0.5 }}
            className="h-12 flex-1 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30"
         >
            <span className="text-primary-foreground font-bold">Да!</span>
         </motion.div>
      </div>

      {/* Floating Checkmark */}
      <motion.div
         initial={{ opacity: 0, scale: 0, y: 10 }}
         animate={{ opacity: 1, scale: 1, y: -20 }}
         transition={{ delay: 1.5, type: "spring" }}
         className="absolute -top-4 -right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-zinc-900"
      >
         <Check className="text-white w-6 h-6" strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
};

const Step2Chat = () => {
  const messages = [
    { text: "Привет, Антон! Мы с тобой сметчились на этой неделе, когда удобно созвониться?", isMe: false, delay: 0.5 },
    { text: "Привет, Макс! Рад знакомству 🤝 Давай в четверг в 19?", isMe: true, delay: 2.0 },
    { text: "Отлично, давай! До встречи 👌", isMe: false, delay: 3.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-xs bg-background rounded-3xl shadow-xl border border-border/50 overflow-hidden flex flex-col h-[320px]"
    >
       {/* Chat Header */}
       <div className="bg-primary/10 p-4 flex items-center gap-3 border-b border-border/50">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
             <Users className="w-4 h-4 text-primary" />
          </div>
          <div>
             <div className="font-bold text-sm">Макс</div>
             <div className="text-xs text-green-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Online
             </div>
          </div>
       </div>

       {/* Messages */}
       <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50 dark:bg-zinc-900/50">
          {messages.map((msg, i) => (
             <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.isMe ? 20 : -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: msg.delay }}
                className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
             >
                <div 
                   className={`max-w-[85%] p-3 rounded-2xl text-xs sm:text-sm shadow-sm ${
                      msg.isMe 
                         ? "bg-primary text-primary-foreground rounded-br-none" 
                         : "bg-white dark:bg-zinc-800 border border-border/50 rounded-bl-none"
                   }`}
                >
                   {msg.text}
                </div>
             </motion.div>
          ))}
       </div>

       {/* Input Area Placeholder */}
       <div className="p-3 border-t border-border/50 bg-background flex gap-2">
          <div className="flex-1 h-8 bg-muted rounded-full" />
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
             <Send className="w-4 h-4 text-primary-foreground" />
          </div>
       </div>
    </motion.div>
  );
};

const Step3Rematch = () => {
  const [showFound, setShowFound] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFound(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full max-w-xs h-[250px] bg-background rounded-3xl shadow-xl border border-border/50 flex flex-col items-center justify-center p-6 text-center"
    >
      <motion.div
         animate={{ rotate: 360 }}
         transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         className="mb-4"
      >
         <RefreshCcw className="w-12 h-12 text-primary/50" />
      </motion.div>
      
      <h4 className="font-bold mb-2">Поиск пары...</h4>
      
      <div className="relative w-full h-16 mt-4">
         <AnimatePresence mode="wait">
            {!showFound ? (
               <motion.div
                  key="searching"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center gap-3 bg-muted/30 rounded-xl"
               >
                  <div className="w-8 h-8 rounded-full bg-gray-300" />
                  <span className="text-sm text-muted-foreground">Иван (нет ответа)</span>
               </motion.div>
            ) : (
               <motion.div
                  key="found"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex items-center justify-center gap-3 bg-green-500/10 border border-green-500/20 rounded-xl z-10"
               >
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">A</div>
                  <span className="text-sm font-bold text-green-700">Найдена пара!</span>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </motion.div>
  );
};

 const Step4Rating = () => {
   return (
     <motion.div
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       exit={{ opacity: 0, scale: 0.9 }}
       className="w-full max-w-xs bg-background rounded-3xl shadow-xl border border-border/50 p-6 flex flex-col items-center"
     >
       <h4 className="font-bold text-lg mb-6">Как прошла встреча?</h4>
       
       <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map((star, i) => (
             <motion.div
                key={star}
                initial={{ color: "#E2E8F0", scale: 1 }} // slate-200
                animate={{ color: "#FACC15", scale: [1, 1.2, 1] }} // yellow-400
                transition={{ delay: i * 0.2 + 0.5, duration: 0.3 }}
             >
                <Star className="w-8 h-8 fill-current" />
             </motion.div>
          ))}
       </div>

       <motion.div
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="w-full bg-primary/10 rounded-full h-2 mb-2 overflow-hidden"
       >
          <div className="h-full bg-primary w-full animate-pulse" />
       </motion.div>
       <motion.p 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ delay: 2.2 }}
         className="text-xs text-primary font-medium"
      >
         Алгоритм подбора улучшен
      </motion.p>
     </motion.div>
   );
 };
