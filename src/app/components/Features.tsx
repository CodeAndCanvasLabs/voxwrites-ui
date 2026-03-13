import { Card } from './ui/card';
import { motion } from 'motion/react';
import {
  Mic,
  Sparkles,
  Globe,
  Zap,
  Shield,
  Wand2,
  Brain,
  Languages,
  Clock,
  Target,
  TrendingUp,
  Users,
  BookOpen,
  Palette,
  ArrowRightLeft,
  FileText,
  Eraser,
  Command,
} from 'lucide-react';

const features = [
  {
    icon: Mic,
    title: 'Real-time Transcription',
    description: 'See your words appear instantly as you speak with live preview. No delays, no waiting.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: Sparkles,
    title: 'AI Text Enhancement',
    description: 'GPT-4 powered grammar correction, filler word removal, and professional formatting.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Smart App Detection',
    description: 'Automatically adapts tone for Gmail, Slack, Notion, LinkedIn, Twitter, and 150+ apps.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Languages,
    title: '100+ Languages & Translation',
    description: 'Speak in one language, output in another. Auto-detect source with real-time translation.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: Zap,
    title: '3x Faster Than Typing',
    description: 'Average speaking speed: 150 WPM. Average typing: 40 WPM. Do the math.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Works on Any Website',
    description: 'Gmail, Google Docs, Notion, Slack, Discord, Twitter, LinkedIn - everywhere.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: BookOpen,
    title: 'Personal Dictionary',
    description: 'Teach VoxWrites your names, technical jargon, and custom spellings for perfect accuracy.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Palette,
    title: 'Styles & Presets',
    description: 'Apply writing styles instantly - professional emails, casual chat, academic papers, and more.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: Command,
    title: 'AI Command Mode',
    description: 'Say "rewrite this", "summarize", or "make formal" - voice-powered AI editing.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: Eraser,
    title: 'Course Correction',
    description: 'Say "no wait I mean" or "actually I meant" - VoxWrites fixes it mid-sentence.',
    gradient: 'from-rose-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Email Context Aware',
    description: 'Reads email threads to craft contextually relevant replies automatically.',
    gradient: 'from-slate-500 to-slate-700',
  },
  {
    icon: Clock,
    title: 'Voice Commands',
    description: 'Say "period", "new line", "scratch that", "bullet point" - hands-free editing.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: ArrowRightLeft,
    title: 'Voice Snippets',
    description: 'Trigger saved text, AI commands, or URLs with custom voice phrases.',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    icon: FileText,
    title: 'Meeting Notes',
    description: 'Paste transcripts and get AI-powered summaries with key points and action items.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Target,
    title: 'Custom AI Prompts',
    description: 'Create your own enhancement templates for specific use cases and app types.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: Wand2,
    title: 'One-Click Tone Switch',
    description: 'Professional, casual, formal, friendly, technical - change tone instantly.',
    gradient: 'from-fuchsia-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Usage Analytics',
    description: 'Track words transcribed, per-app breakdown, time saved, and productivity metrics.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Users,
    title: 'Export & History',
    description: 'Search, filter, and export all transcriptions as CSV, Markdown, PDF, or DOCX.',
    gradient: 'from-purple-500 to-violet-500',
  },
];

export function Features({ standalone = false }: { standalone?: boolean }) {
  return (
    <div className={`py-20 bg-slate-50 dark:bg-[#1a1d2e] ${standalone ? 'pt-28' : ''}`} id="features">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {' '}write faster
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Powerful features designed for modern productivity
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 dark:border-slate-800 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
