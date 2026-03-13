import { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Mic, Sparkles, ArrowRight, Play } from 'lucide-react';
import { SiOpenai, SiAnthropic, SiGoogle } from 'react-icons/si';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onNavigate: (page: string) => void;
  onOpenWaitlist: () => void;
}

const prompts = [
  {
    original: "hey team just wanted to give you all a heads up about the meeting tomorrow we need to discuss the quarterly results and plan for next sprint",
    enhanced: "Hey team! Just wanted to give you a heads up about tomorrow's meeting - we'll be discussing the quarterly results and planning for the next sprint.",
    context: "Slack Message",
  },
  {
    original: "dear sir or madam i am writing to follow up on our previous conversation regarding the partnership opportunity i think theres a lot of potential here",
    enhanced: "Dear Sir/Madam,\n\nI'm writing to follow up on our previous conversation regarding the partnership opportunity. I believe there's significant potential here.",
    context: "Email Draft",
  },
  {
    original: "so basically the bug happens when the user clicks submit without filling in the required fields and then the form just hangs and doesnt show any error",
    enhanced: "The bug occurs when a user clicks Submit without completing the required fields - the form hangs and no error message is displayed.",
    context: "Bug Report",
  },
  {
    original: "patient presents with recurring headaches over the past two weeks mostly in the frontal region worse in the morning and improving throughout the day",
    enhanced: "Patient presents with recurring frontal headaches over the past two weeks, worse in the morning with gradual improvement throughout the day.",
    context: "Medical Note",
  },
  {
    original: "the main takeaway from todays lecture is that machine learning models need diverse training data otherwise they develop biases that affect predictions",
    enhanced: "Key takeaway: Machine learning models require diverse training data. Without it, they develop biases that negatively impact prediction accuracy.",
    context: "Study Notes",
  },
  {
    original: "hi wanted to let you know that the delivery is going to be about thirty minutes late because of traffic really sorry about the inconvenience",
    enhanced: "Hi! Just wanted to let you know that the delivery will be approximately 30 minutes late due to traffic. Apologies for the inconvenience.",
    context: "Customer Message",
  },
  {
    original: "we need to refactor the authentication module because right now its tightly coupled with the user service and that makes testing really difficult",
    enhanced: "We need to refactor the authentication module - it's currently tightly coupled with the user service, which makes testing significantly more difficult.",
    context: "Technical Discussion",
  },
  {
    original: "thanks everyone for attending the workshop today i hope you found the session on productivity useful and please fill out the feedback form",
    enhanced: "Thank you all for attending today's workshop! I hope you found the productivity session valuable. Please take a moment to fill out the feedback form.",
    context: "Event Follow-up",
  },
];

function useTypewriter(text: string, speed = 30, startDelay = 0) {
  const [displayed, setDisplayed] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setIsDone(false);
    let i = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const startTimeout = setTimeout(() => {
      const type = () => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
          // Vary speed slightly for natural feel
          const variance = Math.random() * 20 - 10;
          timeout = setTimeout(type, speed + variance);
        } else {
          setIsDone(true);
        }
      };
      type();
    }, startDelay);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, speed, startDelay]);

  return { displayed, isDone };
}

export function Hero({ onNavigate, onOpenWaitlist }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'typing-original' | 'enhancing' | 'showing-enhanced' | 'transitioning'>('typing-original');

  const current = prompts[currentIndex];

  const { displayed: typedOriginal, isDone: originalDone } = useTypewriter(
    phase === 'typing-original' || phase === 'enhancing' || phase === 'showing-enhanced'
      ? current.original
      : '',
    25,
    phase === 'typing-original' ? 400 : 0
  );

  const { displayed: typedEnhanced, isDone: enhancedDone } = useTypewriter(
    phase === 'showing-enhanced' ? current.enhanced : '',
    20,
    200
  );

  // Phase transitions
  useEffect(() => {
    if (phase === 'typing-original' && originalDone) {
      const timer = setTimeout(() => setPhase('enhancing'), 600);
      return () => clearTimeout(timer);
    }
  }, [phase, originalDone]);

  useEffect(() => {
    if (phase === 'enhancing') {
      const timer = setTimeout(() => setPhase('showing-enhanced'), 1200);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'showing-enhanced' && enhancedDone) {
      const timer = setTimeout(() => setPhase('transitioning'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, enhancedDone]);

  useEffect(() => {
    if (phase === 'transitioning') {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % prompts.length);
        setPhase('typing-original');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const goToPrompt = useCallback((index: number) => {
    if (index === currentIndex) return;
    setPhase('transitioning');
    setTimeout(() => {
      setCurrentIndex(index);
      setPhase('typing-original');
    }, 300);
  }, [currentIndex]);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 pt-24 pb-20">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute top-60 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Announcement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 px-4 py-2 text-sm">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Voice to Text • Coming Soon
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-slate-900 via-orange-600 to-slate-900 dark:from-white dark:via-orange-500 dark:to-white bg-clip-text text-transparent leading-tight"
          >
            Voice to Text,
            <br />
            Perfected by AI
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-center text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto"
          >
            Transform your voice into clear, polished writing instantly.
            Context-aware AI enhancement for every app you use.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white text-lg px-8 py-6 shadow-lg shadow-orange-500/30"
              onClick={onOpenWaitlist}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Join Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => document.getElementById('live-demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Live Demo Animation */}
          <motion.div
            id="live-demo"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 p-6">
              {/* Browser Chrome */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-slate-800 rounded-full px-4 py-1"
                  >
                    <span className="text-xs text-slate-400 font-medium">{current.context}</span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Demo Content */}
              <div className="bg-slate-800 rounded-lg p-6 space-y-4 min-h-[220px]">
                {/* Recording indicator */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center shrink-0">
                    <Mic className={`w-5 h-5 text-orange-500 ${phase === 'typing-original' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${
                        phase === 'typing-original' ? 'bg-green-500 animate-pulse' :
                        phase === 'enhancing' ? 'bg-orange-500 animate-pulse' :
                        'bg-blue-500'
                      }`} />
                      <span className="text-sm text-slate-400">
                        {phase === 'typing-original' ? 'Listening...' :
                         phase === 'enhancing' ? 'Enhancing with AI...' :
                         phase === 'showing-enhanced' ? 'Enhanced' :
                         'Processing...'}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      {phase === 'typing-original' && (
                        <motion.div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${(typedOriginal.length / current.original.length) * 100}%` }}
                          transition={{ duration: 0.1 }}
                        />
                      )}
                      {phase === 'enhancing' && (
                        <motion.div
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                          animate={{ width: ['0%', '100%'] }}
                          transition={{ duration: 1, ease: 'easeInOut' }}
                        />
                      )}
                      {(phase === 'showing-enhanced' || phase === 'transitioning') && (
                        <div className="h-full w-full bg-gradient-to-r from-blue-500 to-blue-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Transcription panels */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${currentIndex}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: phase === 'transitioning' ? 0 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    {/* Original transcription */}
                    <div className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-slate-300 text-sm min-h-[40px] whitespace-pre-wrap">
                        {typedOriginal}
                        {phase === 'typing-original' && !originalDone && (
                          <span className="inline-block w-0.5 h-4 bg-slate-300 ml-0.5 animate-pulse align-middle" />
                        )}
                      </p>
                      <span className="text-xs text-slate-500 mt-1 block">Original transcription</span>
                    </div>

                    {/* AI Enhanced */}
                    {(phase === 'enhancing' || phase === 'showing-enhanced') && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gradient-to-r from-orange-600/20 to-orange-500/20 border border-orange-500/30 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className={`w-4 h-4 text-orange-500 ${phase === 'enhancing' ? 'animate-spin' : ''}`} />
                          <span className="text-xs text-orange-500 font-medium">
                            {phase === 'enhancing' ? 'AI Processing...' : 'AI Enhanced'}
                          </span>
                        </div>
                        <p className="text-white text-sm min-h-[40px] whitespace-pre-wrap">
                          {phase === 'enhancing' ? (
                            <span className="inline-flex gap-1">
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          ) : (
                            <>
                              {typedEnhanced}
                              {!enhancedDone && (
                                <span className="inline-block w-0.5 h-4 bg-orange-400 ml-0.5 animate-pulse align-middle" />
                              )}
                            </>
                          )}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Prompt navigation dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {prompts.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPrompt(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-6 bg-orange-500'
                        : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-slate-500 mb-5">Powered by world-class AI</p>
            <div className="flex items-center justify-center gap-10 flex-wrap">
              {[
                { name: 'OpenAI', Icon: SiOpenai, color: '#10A37F' },
                { name: 'Anthropic', Icon: SiAnthropic, color: '#D4A27F' },
                { name: 'Google AI', Icon: SiGoogle, color: '#4285F4' },
              ].map((provider) => (
                <div key={provider.name} className="flex items-center gap-2.5">
                  <provider.Icon style={{ color: provider.color, width: 20, height: 20 }} />
                  <span className="text-lg font-semibold text-slate-400 dark:text-slate-500">
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
