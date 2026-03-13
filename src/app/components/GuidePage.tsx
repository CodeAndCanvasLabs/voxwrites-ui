'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Mic,
  Terminal,
  Keyboard,
  Sparkles,
  Zap,
  Globe,
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  Book,
  Palette,
  Languages,
  FileText,
  Users,
  Download,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GuideSection {
  id: string;
  title: string;
  icon: typeof Mic;
  color: string;
  items: GuideItem[];
}

interface GuideItem {
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const guideSections: GuideSection[] = [
  // ─── VOICE RECORDING ─────────────────────────────────────────────────
  {
    id: 'voice-recording',
    title: 'Voice Recording',
    icon: Mic,
    color: 'from-red-500 to-rose-500',
    items: [
      { label: 'Start/Stop Recording', description: 'Press Cmd+Shift+U to toggle recording. The mic turns red when active. Click the floating widget or use the extension popup to start.', badge: 'Cmd+Shift+U', badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { label: 'Universal Input Support', description: 'Works on input fields, textareas, contenteditable elements, Google Docs, Gmail compose, and WYSIWYG editors across 150+ web apps.' },
      { label: 'Auto-Stop', description: 'Recording auto-stops after a configurable inactivity timeout to save resources. Adjust the timeout in extension settings.' },
      { label: 'Floating Widget', description: 'A bottom-right mic button appears on all pages. Color states: orange (idle/ready), red with pulse (recording), purple with pulse (AI command mode).' },
      { label: 'Real-Time Transcription', description: 'See your words appear in real time as you speak. Interim results show in gray, finalized text in white. Text is inserted at the cursor position.' },
      { label: 'Tab Capture for Meetings', description: 'Capture audio from the current browser tab (e.g., Google Meet, Zoom web) for live transcription. Start from the extension popup Record tab.' },
    ],
  },
  // ─── VOICE COMMANDS ───────────────────────────────────────────────────
  {
    id: 'voice-commands',
    title: 'Voice Commands',
    icon: MessageSquare,
    color: 'from-blue-500 to-cyan-500',
    items: [
      { label: '"period" / "full stop"', description: 'Inserts a period (.) and capitalizes the next word automatically.', badge: 'Punctuation' },
      { label: '"comma"', description: 'Inserts a comma (,) with proper spacing.', badge: 'Punctuation' },
      { label: '"question mark"', description: 'Inserts a question mark (?) and capitalizes the next word.', badge: 'Punctuation' },
      { label: '"exclamation mark"', description: 'Inserts an exclamation mark (!) and capitalizes the next word.', badge: 'Punctuation' },
      { label: '"colon" / "semicolon"', description: 'Inserts a colon (:) or semicolon (;) with proper spacing.', badge: 'Punctuation' },
      { label: '"dash" / "hyphen"', description: 'Inserts an em dash (\u2014) or hyphen (-) depending on context.', badge: 'Punctuation' },
      { label: '"ellipsis" / "dot dot dot"', description: 'Inserts an ellipsis (\u2026) character.', badge: 'Punctuation' },
      { label: '"open quote" / "close quote"', description: 'Inserts opening (\u201C) or closing (\u201D) quotation marks.', badge: 'Punctuation' },
      { label: '"new line" / "new paragraph"', description: 'Inserts a single line break or double line break for paragraph spacing.', badge: 'Formatting' },
      { label: '"bullet point" / "next bullet"', description: 'Inserts a bullet (\u2022) list item on a new line.', badge: 'Formatting' },
      { label: '"first point" / "point one"', description: 'Starts a numbered list. Subsequent "second point", "third point" continue the numbering.', badge: 'Formatting' },
      { label: '"scratch that" / "delete that"', description: 'Deletes the last sentence you dictated. Useful when you misspeak or change your mind.', badge: 'Editing' },
      { label: '"undo that" / "undo last"', description: 'Undoes the last text action, restoring the previous state.', badge: 'Editing' },
      { label: '"delete word"', description: 'Deletes the last word only, letting you correct individual words mid-sentence.', badge: 'Editing' },
      { label: '"clear all"', description: 'Removes all text in the current input field. Use with caution.', badge: 'Editing' },
      { label: '"select all"', description: 'Selects all text in the focused field, ready for replacement or AI commands.', badge: 'Editing' },
    ],
  },
  // ─── AI COMMANDS ──────────────────────────────────────────────────────
  {
    id: 'ai-commands',
    title: 'AI Commands',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-500',
    items: [
      { label: 'AI Command Mode', description: 'Press Cmd+Shift+X to enter command mode (mic turns purple). Speak a natural-language instruction and AI transforms the selected or current text.', badge: 'Cmd+Shift+X', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
      { label: '"summarize this"', description: 'AI generates a concise summary of the selected or current text, preserving key points.', badge: 'Voice' },
      { label: '"rewrite this"', description: 'AI rewrites the text with improved clarity and flow while keeping the original meaning.', badge: 'Voice' },
      { label: '"fix this"', description: 'AI corrects grammar, spelling, and punctuation errors without changing your tone.', badge: 'Voice' },
      { label: '"shorten this"', description: 'AI condenses the text to be more concise while retaining essential information.', badge: 'Voice' },
      { label: '"expand this"', description: 'AI elaborates on the text with more detail, examples, or supporting points.', badge: 'Voice' },
      { label: '"make this formal" / "make this casual"', description: 'AI adjusts the tone. "Formal" for professional contexts, "casual" for friendly communication.', badge: 'Voice' },
      { label: '"translate this to [language]"', description: 'AI translates the text into any of 100+ supported languages. Say "translate to French" or "translate to Japanese".', badge: 'Voice' },
      { label: '"explain this"', description: 'AI explains complex text in simpler, more accessible language.', badge: 'Voice' },
      { label: '"summarize this page"', description: 'AI reads the entire web page content and generates a structured summary. Works on articles, docs, and blog posts.', badge: 'Voice' },
    ],
  },
  // ─── SNIPPETS & COMMANDS ──────────────────────────────────────────────
  {
    id: 'snippets',
    title: 'Snippets & Commands',
    icon: Zap,
    color: 'from-orange-500 to-amber-500',
    items: [
      { label: 'What Are Snippets?', description: 'Snippets are voice-triggered shortcuts. Say a trigger phrase while recording and VoxWrites automatically performs the linked action \u2014 insert text, run an AI command, or open a URL.' },
      { label: 'Insert Text Snippets', description: 'Say a trigger phrase to insert saved text. Example: Say "my signature" to insert your full email signature, or "my address" for your mailing address.', badge: 'Text' },
      { label: 'AI Command Snippets', description: 'Say a trigger phrase to run an AI instruction on current text. Example: "fix grammar" corrects your text, "make professional" adjusts tone.', badge: 'AI' },
      { label: 'URL Command Snippets', description: 'Say a trigger phrase to open a URL in a new tab. Example: "open github" opens github.com, "open calendar" opens Google Calendar.', badge: 'URL' },
      { label: 'Create & Manage', description: 'Create, edit, delete, and toggle snippets from the Snippets page in the web dashboard or the Tools tab in the extension popup.' },
      { label: 'Usage Tracking', description: 'VoxWrites tracks how many times each snippet is used so you can see which shortcuts save you the most time.' },
      { label: 'Auto-Sync', description: 'Snippets sync from the server on login and are cached locally for fast access. Changes made in the dashboard update in the extension within 5 minutes.' },
      { label: 'Use Cases', description: 'Email signatures, canned responses, code boilerplate, frequently used addresses/phone numbers, common AI transformations, quick links to tools you use daily.' },
    ],
  },
  // ─── PERSONAL DICTIONARY ──────────────────────────────────────────────
  {
    id: 'dictionary',
    title: 'Personal Dictionary',
    icon: Book,
    color: 'from-emerald-500 to-teal-500',
    items: [
      { label: 'What Is the Dictionary?', description: 'Teach VoxWrites words it frequently misrecognizes. Add specialized vocabulary with phonetic hints so speech recognition auto-corrects to the right spelling every time.' },
      { label: 'Phonetic Hints', description: 'Add comma-separated pronunciations that speech engines might hear. For example, the word "Kubernetes" might be misheard as "cooper net ease" or "kuber net ease". Adding these as hints enables auto-correction.', badge: 'Core' },
      { label: 'Categories', description: 'Organize words into categories: Names (people/places), Technical (programming/software), Medical (healthcare terms), Legal (law/contract terms), or Custom (your own category).', badge: '5 Types' },
      { label: 'Case Sensitivity', description: 'Toggle case-sensitive matching for words where casing matters \u2014 like acronyms (API, AWS) or proper nouns (iPhone, GitHub).', badge: 'Option' },
      { label: 'Usage Tracking', description: 'See how many times each dictionary entry has auto-corrected a transcription so you can measure its impact.' },
      { label: 'Search & Filter', description: 'Quickly find entries by word name or phonetic hints. Filter the list by category to manage large dictionaries.' },
      { label: 'Manage Anywhere', description: 'Add and manage words from the Dictionary page in the web dashboard, or from the Tools > Dictionary tab in the Chrome extension popup.' },
      { label: 'Use Case: Developers', description: 'Add framework names (React, Kubernetes, PostgreSQL), library names (lodash, axios), and programming terms (boolean, asynchronous) that speech engines commonly misspell.' },
      { label: 'Use Case: Medical', description: 'Add drug names (amoxicillin, metformin), conditions (fibromyalgia, hypothyroidism), and anatomical terms that are specialized vocabulary.' },
      { label: 'Use Case: Business', description: 'Add company names, product names, industry jargon, acronyms (EBITDA, KPI, SaaS), and client names that are unique to your work.' },
    ],
  },
  // ─── STYLES & PRESETS ─────────────────────────────────────────────────
  {
    id: 'styles',
    title: 'Styles & Presets',
    icon: Palette,
    color: 'from-pink-500 to-rose-500',
    items: [
      { label: 'What Are Styles?', description: 'Styles are reusable formatting templates that transform your raw dictated text into polished, context-specific output. Select a style and your text is automatically formatted to match.' },
      { label: 'Built-In Templates', description: 'VoxWrites ships with ready-to-use styles for common scenarios \u2014 professional emails, meeting notes, social media posts, code comments, and more.' },
      { label: 'Custom Styles', description: 'Create your own styles with a template (using {{text}} as the placeholder), category, tone, and custom AI instructions for fine-tuned formatting.', badge: 'Create' },
      { label: 'Template Variable', description: 'Use {{text}} in your template to mark where the dictated text gets inserted. Everything around it becomes the formatting wrapper. Example: "Dear Team,\\n\\n{{text}}\\n\\nBest regards"', badge: '{{text}}' },
      { label: 'AI Instructions', description: 'Add optional AI instructions to constrain output. Examples: "Keep under 280 characters", "Use bullet points", "Add relevant hashtags", "Maintain formal tone throughout".', badge: 'AI' },
      { label: 'Categories', description: 'Organize styles into categories: Email, Social Media, Code, Writing, Business, or General. Filter by category to find the right style quickly.' },
      { label: 'Tone Control', description: 'Each style can specify a tone (professional, casual, friendly, technical, etc.) that guides AI enhancement to match the desired voice.' },
      { label: 'One-Click Apply', description: 'Select a style in the extension, and it auto-applies to every transcription. In the dashboard, use "Try It" to preview how text looks with any style.' },
      { label: 'Usage Tracking', description: 'Track how many times each style has been used. Identify your most valuable styles and refine them over time.' },
      { label: 'Use Case: Email', description: 'Create styles for different email types \u2014 "Client Follow-Up" (formal, with greeting/closing), "Team Update" (brief, bullet points), "Cold Outreach" (compelling, concise).' },
      { label: 'Use Case: Social Media', description: 'Create platform-specific styles \u2014 "Tweet" (280 char limit, hashtags), "LinkedIn Post" (professional, structured), "Instagram Caption" (casual, emoji-friendly).' },
      { label: 'Use Case: Development', description: 'Create styles for code docs \u2014 "JSDoc Comment", "README Section", "Git Commit Message", "Pull Request Description" with appropriate formatting conventions.' },
    ],
  },
  // ─── TRANSLATION ──────────────────────────────────────────────────────
  {
    id: 'translation',
    title: 'Translation',
    icon: Languages,
    color: 'from-sky-500 to-blue-500',
    items: [
      { label: 'What Is Translation?', description: 'Translate any text between 100+ languages powered by AI. Works with dictated text, pasted content, or typed input. Available in the web dashboard and Chrome extension.' },
      { label: '100+ Languages', description: 'Supports major world languages including English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, Portuguese, Russian, and many more.', badge: '100+' },
      { label: 'Auto-Detect Source', description: 'VoxWrites automatically detects the source language so you can just paste text and select a target language without manually specifying the input language.', badge: 'Auto' },
      { label: 'Swap Languages', description: 'One-click swap button to reverse source and target languages \u2014 useful for back-and-forth translation between two languages.' },
      { label: 'Searchable Language Picker', description: 'Type to search through the full language list. Both the source and target language dropdowns support filtering by name.' },
      { label: 'Preserve Formatting', description: 'Toggle the option to maintain line breaks, paragraphs, and structural formatting in your translated output.' },
      { label: 'Voice Input', description: 'Click the mic button to dictate text for translation instead of typing. Speak in your language and get instant translation to the target.' },
      { label: 'Copy Result', description: 'One-click copy the translated text to clipboard for pasting into emails, documents, or messages.' },
      { label: 'Extension Integration', description: 'Enable translation in the extension settings, pick a target language, and every transcription can be automatically translated before insertion.' },
      { label: 'Use Case: Global Teams', description: 'Translate emails, Slack messages, and documents when working with international colleagues. Dictate in your native language and send in theirs.' },
      { label: 'Use Case: Content Localization', description: 'Translate blog posts, marketing copy, product descriptions, and social media content to reach audiences in multiple languages.' },
      { label: 'Use Case: Language Learning', description: 'Practice writing in a foreign language and translate to check accuracy, or translate reference materials for study.' },
    ],
  },
  // ─── MEETING SUMMARIZATION ────────────────────────────────────────────
  {
    id: 'meeting-summarization',
    title: 'Meeting Summarization',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    items: [
      { label: 'What Is Meeting Summarization?', description: 'Paste or dictate a meeting transcript and AI generates a structured summary with key points, action items, decisions, and participants. Available in the Translate page and Chrome extension.' },
      { label: 'Summary Formats', description: 'Choose from 4 output modes: Standard (balanced overview), Brief (2-3 sentence executive summary), Detailed (comprehensive coverage), or Action Items Focus (task-oriented).', badge: '4 Modes' },
      { label: 'Key Points Extraction', description: 'AI identifies and lists the most important topics discussed in the meeting as a clear bullet-point list.' },
      { label: 'Action Items', description: 'AI extracts specific tasks with assignees and deadlines when mentioned. Perfect for creating follow-up to-do lists after a meeting.', badge: 'Tasks' },
      { label: 'Decisions Made', description: 'AI identifies and lists key decisions that were made during the meeting, so the team has a clear record of what was agreed upon.' },
      { label: 'Participant Detection', description: 'AI detects and lists participant names mentioned in the transcript for attendance tracking.' },
      { label: 'Tab Capture Integration', description: 'Use the extension\'s tab capture to record audio from Google Meet, Zoom web, or Teams directly. Then summarize the transcript with one click.', badge: 'Extension' },
      { label: 'Copy & Export', description: 'Copy the full formatted summary to clipboard with one click. Summary includes headers, bullet points, and structured sections ready for sharing.' },
      { label: 'Use Case: Stand-Ups', description: 'Record your daily stand-up and get a brief summary of what each person committed to. Share with the team channel.' },
      { label: 'Use Case: Client Calls', description: 'Capture client meetings and extract action items and decisions. Never miss a follow-up or lose track of what was agreed.' },
      { label: 'Use Case: All-Hands', description: 'Summarize long company meetings into digestible key points for employees who couldn\'t attend.' },
      { label: 'Use Case: Interviews', description: 'Record and summarize candidate interviews. Extract key responses and evaluation points for hiring decisions.' },
    ],
  },
  // ─── TEXT PROCESSING ──────────────────────────────────────────────────
  {
    id: 'text-processing',
    title: 'Text Processing',
    icon: Terminal,
    color: 'from-green-500 to-emerald-500',
    items: [
      { label: 'Auto-Capitalization', description: 'Automatically capitalizes the first letter of sentences, after punctuation (.!?), after newlines, and always capitalizes "I". Works in real time as you dictate.', badge: 'Auto' },
      { label: 'Smart Punctuation Spacing', description: 'Removes accidental spaces before punctuation (.!?) and ensures proper spacing after. Your text reads naturally without manual fixing.', badge: 'Auto' },
      { label: 'Filler Word Removal', description: 'Automatically strips filler words: "um", "uh", "er", "you know", "I mean", "basically", "actually", "literally", "kind of", "sort of". Your text sounds polished.', badge: 'Auto' },
      { label: 'Auto List Formatting', description: 'Say "first point" and it becomes "1.", "second point" becomes "2.", and so on. Automatic numbered list creation from natural speech.', badge: 'Auto' },
      { label: 'Grammar Correction', description: 'AI-powered grammar and spelling correction runs automatically on your transcription. Powered by GPT-4o-mini or Claude 3 Haiku for fast, accurate results.', badge: 'AI' },
      { label: 'Dictionary Auto-Correction', description: 'Your Personal Dictionary entries are applied automatically. Misrecognized words are replaced with the correct spelling before text is inserted.', badge: 'Auto' },
      { label: 'Context-Aware Enhancement', description: 'AI enhancement considers the detected app type. Email text gets professional formatting, code comments get technical formatting, chat gets casual tone.', badge: 'AI' },
    ],
  },
  // ─── EXPORT & BACKUP ─────────────────────────────────────────────────
  {
    id: 'export',
    title: 'Export & Backup',
    icon: Download,
    color: 'from-amber-500 to-yellow-500',
    items: [
      { label: 'What Is Export?', description: 'Download your entire transcription history in multiple file formats for backup, sharing, analysis, or importing into other tools.' },
      { label: 'CSV Export', description: 'Spreadsheet format with columns: Date, Original Text, Enhanced Text, App Type, App Name, Language, Word Count, Tone. Open in Excel, Google Sheets, or any data tool.', badge: 'CSV' },
      { label: 'Markdown Export', description: 'Clean, readable document format with timestamps and metadata. Perfect for importing into Notion, Obsidian, or any Markdown-compatible note app.', badge: 'MD' },
      { label: 'PDF Export', description: 'Professionally formatted PDF document with title, timestamps, app info, and word counts. Ready for sharing, printing, or archival.', badge: 'PDF' },
      { label: 'DOCX Export', description: 'Microsoft Word format for editing and sharing. Compatible with Google Docs, LibreOffice, and all major word processors.', badge: 'DOCX' },
      { label: 'Filter Before Export', description: 'Export all transcriptions or filter by app type (only Gmail, only Google Docs, etc.) to create focused exports.' },
      { label: 'Automatic File Naming', description: 'Files are named with the current date (e.g., VoxWrites_export_20250214.csv) for easy organization.' },
      { label: 'Full Unicode Support', description: 'All exports handle international characters, emoji, and special symbols correctly across all formats.' },
      { label: 'Use Case: Backup', description: 'Regularly export your transcription archive to CSV or DOCX for safekeeping outside the cloud.' },
      { label: 'Use Case: Reporting', description: 'Export a week or month of transcriptions to analyze productivity, word counts, and app usage patterns.' },
      { label: 'Use Case: Knowledge Base', description: 'Export transcriptions as Markdown and import into Notion, Obsidian, or a wiki to build a searchable knowledge base of dictated content.' },
    ],
  },
  // ─── WEB DASHBOARD ────────────────────────────────────────────────────
  {
    id: 'dashboard-features',
    title: 'Web Dashboard Features',
    icon: LayoutDashboard,
    color: 'from-indigo-500 to-blue-500',
    items: [
      { label: 'Dashboard Home', description: 'Stats cards showing words today, this week, and remaining quota. App usage breakdown chart and real-time recent transcriptions feed.' },
      { label: 'Playground', description: 'Paste or type text, then enhance with AI. Select app context and tone. Includes mic button for dictation and snippet selector for quick insertions.' },
      { label: 'History', description: 'Full transcription history with pagination, search, filter by app type, copy, delete, and export to CSV, Markdown, PDF, or DOCX.' },
      { label: 'Snippets', description: 'Create, edit, delete, and toggle voice-triggered snippets. Three types: text insertion, AI command, and URL opener. Search and filter by category with usage counts.' },
      { label: 'Dictionary', description: 'Manage your Personal Dictionary of custom vocabulary. Add words with phonetic hints, categories, and descriptions. See usage counts for each entry.' },
      { label: 'Styles', description: 'Browse built-in styles and create custom formatting presets. Preview with "Try It" mode. Organize by category (email, social, code, writing, business).' },
      { label: 'Translate', description: 'Two-tab page: Translate tab for text translation between 100+ languages, and Meeting Notes tab for AI-powered meeting summarization with structured output.' },
      { label: 'Prompts', description: 'View and edit AI enhancement prompts per app type (email, chat, docs, code). Custom prompts override defaults with a one-click reset option.' },
      { label: 'Settings', description: 'Profile management, notification preferences, privacy controls (local processing, 2FA), billing info, and team management.' },
      { label: 'Guide (This Page)', description: 'Comprehensive searchable reference for every VoxWrites feature, command, shortcut, and integration \u2014 all in one place.' },
    ],
  },
  // ─── APP DETECTION ────────────────────────────────────────────────────
  {
    id: 'app-detection',
    title: 'App Detection',
    icon: Globe,
    color: 'from-teal-500 to-cyan-500',
    items: [
      { label: '150+ Apps Supported', description: 'Auto-detects Gmail, Google Docs, Slack, Discord, Notion, LinkedIn, Twitter/X, GitHub, Reddit, Trello, Jira, and 140+ more web applications.' },
      { label: 'Context-Aware AI', description: 'AI uses the detected app context for smarter formatting \u2014 email tone for Gmail, code style for GitHub, casual tone for Discord, professional for LinkedIn.' },
      { label: 'Google Docs Integration', description: 'Text insertion via ClipboardEvent paste simulation for canvas-rendered documents. AI commands work seamlessly with Google Docs content.' },
      { label: 'Gmail Integration', description: 'Extracts email thread body for AI context. Reply-aware with subject extraction, so AI enhancement matches the conversation tone and topic.' },
      { label: 'Auto vs. Manual', description: 'Toggle auto-detection on/off in settings. When off, manually select the app type from the dropdown to control AI context.' },
      { label: 'Per-Tab Detection', description: 'Each browser tab detects its app independently. Switch between Gmail and Google Docs tabs and VoxWrites adapts automatically.' },
    ],
  },
  // ─── KEYBOARD SHORTCUTS ───────────────────────────────────────────────
  {
    id: 'keyboard-shortcuts',
    title: 'Keyboard Shortcuts',
    icon: Keyboard,
    color: 'from-slate-500 to-zinc-500',
    items: [
      { label: 'Cmd+Shift+U', description: 'Toggle recording in regular mode. Start and stop voice-to-text transcription. Text is inserted at your cursor position in the active input field.', badge: 'Recording', badgeColor: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      { label: 'Cmd+Shift+X', description: 'Activate AI Command Mode. Speak a natural-language instruction to transform selected or current text. Mic turns purple to indicate command mode.', badge: 'AI Mode', badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    ],
  },
  // ─── CHROME EXTENSION ─────────────────────────────────────────────────
  {
    id: 'extension',
    title: 'Chrome Extension',
    icon: FileText,
    color: 'from-orange-500 to-red-500',
    items: [
      { label: 'Extension Popup', description: 'A compact control center accessible from the Chrome toolbar. Five tabs: Record (voice controls), Tools (Snippets/Dictionary/Styles), History, Notes, and Account.' },
      { label: 'Record Tab', description: 'Start/stop recording, view live transcription, select app type, adjust tone, and enable AI enhancement. Also includes tab capture for meeting recording.' },
      { label: 'Tools Tab', description: 'Three sub-tabs for managing Snippets, Dictionary, and Styles directly from the extension without opening the web dashboard.' },
      { label: 'History Tab', description: 'View recent transcriptions, copy text, and review past dictations. Syncs with the web dashboard history.' },
      { label: 'Notes Tab', description: 'Quick Flow Notes for capturing ideas during dictation. Notes are stored locally and accessible across recording sessions.' },
      { label: 'Account Tab', description: 'View your profile, usage stats, and subscription info. Login/logout and manage your VoxWrites account.' },
      { label: 'Settings', description: 'Configure language, tone, auto-detection, enhancement mode, translation toggle with target language, and other preferences from the Account tab.' },
      { label: 'Style Selection', description: 'Select an active style from the Tools > Styles tab. The selected style is automatically applied to every transcription during AI enhancement.' },
      { label: 'Translation Toggle', description: 'Enable automatic translation in settings. Choose a target language from the searchable dropdown and all transcriptions are translated before insertion.' },
    ],
  },
];

export function GuidePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(guideSections.map((s) => s.id))
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(guideSections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const filteredSections = searchQuery
    ? guideSections
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (item.badge && item.badge.toLowerCase().includes(searchQuery.toLowerCase()))
          ),
        }))
        .filter((section) =>
          section.items.length > 0 ||
          section.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
    : guideSections;

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-slate-50 dark:bg-[#161926] px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Feature Guide</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Everything you can do with VoxWrites
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-xs text-slate-500 hover:text-orange-600 transition-colors px-2 py-1"
            >
              Expand All
            </button>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <button
              onClick={collapseAll}
              className="text-xs text-slate-500 hover:text-orange-600 transition-colors px-2 py-1"
            >
              Collapse All
            </button>
          </div>
        </div>

        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search features, commands, shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
      </div>

      {/* Sections */}
      <div className="px-6 pb-6 space-y-4">
        {filteredSections.length === 0 ? (
          <Card className="p-12 text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-lg font-medium mb-2">No matches found</h3>
            <p className="text-slate-500">
              Try adjusting your search query
            </p>
          </Card>
        ) : (
          filteredSections.map((section, sectionIndex) => {
            const isExpanded = expandedSections.has(section.id);
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${section.color} flex items-center justify-center`}
                      >
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">{section.title}</h3>
                        <p className="text-xs text-slate-500">
                          {section.items.length} item{section.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  {/* Section Content */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                            {section.items.map((item, index) => (
                              <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
                              >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <p className="font-medium text-sm">{item.label}</p>
                                  {item.badge && (
                                    <Badge
                                      className={`text-xs flex-shrink-0 ${
                                        item.badgeColor || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                                      }`}
                                    >
                                      {item.badge}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                  {item.description}
                                </p>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
