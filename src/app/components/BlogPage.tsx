'use client';

import { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, Calendar, User, Clock, Tag } from 'lucide-react';
import { motion } from 'motion/react';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 'best-speech-to-text-chrome-extensions-2026',
    title: '10 Best Speech-to-Text Chrome Extensions in 2026 (Tested & Compared)',
    date: 'February 20, 2026',
    author: 'Sarah Chen',
    excerpt: 'We tested every major speech-to-text Chrome extension available in 2026. Here are the top 10 ranked by accuracy, speed, and features.',
    readTime: '9 min read',
    tags: ['Speech to Text', 'Chrome Extension', 'Comparison'],
    content: `Looking for the best speech-to-text Chrome extension? With dozens of options in the Chrome Web Store, choosing the right voice typing tool can be overwhelming. We installed and tested every popular option so you don't have to.

## Why Use a Speech-to-Text Chrome Extension?

A speech-to-text Chrome extension lets you dictate text directly into any website - Gmail, Google Docs, Slack, LinkedIn, and more. Instead of switching between apps, you speak naturally and your words appear wherever your cursor is. The best extensions go beyond basic transcription with AI-powered formatting, punctuation, and context awareness.

## Our Testing Methodology

We evaluated each speech-to-text Chrome extension on five criteria:

- **Accuracy** - How well it transcribes natural speech with varied accents
- **Speed** - Latency between speaking and text appearing
- **App support** - Number of websites and web apps where it works reliably
- **AI features** - Smart formatting, punctuation, tone adjustment, and commands
- **Privacy** - Whether audio is processed locally or sent to external servers

## The Top 10 Speech-to-Text Chrome Extensions

### 1. VoxWrites - Best Overall

VoxWrites stands out with its context-aware AI that adapts formatting based on where you're typing. It detects over 150 apps and adjusts punctuation, capitalization, and tone automatically. AI command mode lets you say "rewrite this professionally" or "summarize this" hands-free. Supports 40+ languages with real-time transcription.

**Best for:** Professionals who write across multiple platforms daily.

### 2. Google Voice Typing (Built-in)

Chrome's built-in voice typing works in Google Docs but lacks support for other websites. Accuracy is solid for English but formatting is minimal - you get raw text without smart punctuation.

**Best for:** Occasional use in Google Docs only.

### 3. Voice In

A popular free option with basic dictation across websites. Supports multiple languages but lacks AI enhancement features. Custom voice commands are available in the paid version.

**Best for:** Budget-conscious users who need simple dictation.

### 4. Speechnotes

Originally a standalone web app, Speechnotes now offers a Chrome extension. Good accuracy with auto-punctuation. Limited to basic text fields - struggles with complex web apps like Notion.

**Best for:** Simple note-taking and drafting.

### 5. Dictanote

Combines voice typing with a built-in notepad. The Chrome extension lets you dictate and organize notes. Supports 50+ languages but AI features are limited compared to VoxWrites.

**Best for:** Students and researchers who need organized voice notes.

### 6. Notta Web Clipper

Primarily a meeting transcription tool, Notta's extension captures audio from browser tabs. Better for recording meetings than real-time dictation into text fields.

**Best for:** Meeting transcription and note-taking.

### 7. Otter.ai Chrome Extension

Otter's extension focuses on meeting and conversation transcription. Excellent for recording lectures and interviews but not designed for typing into web forms.

**Best for:** Meeting transcription with speaker identification.

### 8. Speechify

Known for text-to-speech, Speechify also offers speech-to-text capabilities. The Chrome extension works across many sites but accuracy lags behind dedicated dictation tools.

**Best for:** Users who want both text-to-speech and speech-to-text in one tool.

### 9. Voicy

A lightweight speech-to-text extension with clean UI. Supports basic dictation with decent accuracy but lacks AI-powered features like tone adjustment or context awareness.

**Best for:** Minimalists who want simple, no-frills voice typing.

### 10. TalkType

An emerging speech-to-text Chrome extension with AI integration. Still in early development but shows promise with its GPT-powered formatting.

**Best for:** Early adopters willing to try newer tools.

## Which Speech-to-Text Chrome Extension Should You Choose?

For professionals who write extensively across Gmail, Slack, Google Docs, and other platforms, **VoxWrites** offers the most complete package with AI commands, context-aware formatting, and 150+ app support. If you only need occasional voice typing in Google Docs, the built-in Google Voice Typing works fine. For budget options, Voice In provides solid basic functionality.

The key differentiator in 2026 is AI integration - the best speech-to-text extensions don't just transcribe, they understand context and help you write better.`,
  },
  {
    id: 'google-docs-voice-typing-guide-2026',
    title: 'Google Docs Voice Typing: Complete Guide + 5 Better Alternatives (2026)',
    date: 'February 18, 2026',
    author: 'Michael Rodriguez',
    excerpt: 'Master Google Docs voice typing with our step-by-step guide, then discover 5 alternatives that offer more features and better accuracy.',
    readTime: '8 min read',
    tags: ['Google Docs', 'Voice Typing', 'Guide'],
    content: `Google Docs voice typing is one of the most searched voice features on the internet - and for good reason. It's free, built into every Google Docs document, and works without installing anything. But it has significant limitations that send many users searching for alternatives.

## How to Use Google Docs Voice Typing

### Step 1: Open Google Docs

Navigate to docs.google.com and open any document. Voice typing only works in Google Docs - not Google Sheets, Slides, or other Google Workspace apps.

### Step 2: Enable Voice Typing

Go to **Tools > Voice typing** or press **Ctrl+Shift+S** (Windows) or **Cmd+Shift+S** (Mac). A microphone icon appears on the left side of your document.

### Step 3: Start Dictating

Click the microphone icon - it turns red when active. Speak clearly and at a natural pace. Google Docs voice typing will transcribe your words in real-time.

### Step 4: Use Voice Commands

Google Docs supports basic voice commands for formatting:

- "Period" / "Comma" / "Question mark" - inserts punctuation
- "New line" / "New paragraph" - creates line breaks
- "Select all" / "Copy" / "Paste" - basic editing commands
- "Bold" / "Italics" / "Underline" - text formatting

## Limitations of Google Docs Voice Typing

While Google Docs voice typing is a great starting point, it has notable limitations:

- **Only works in Google Docs** - won't work in Gmail, Sheets, or any other website
- **No AI enhancement** - you get raw transcription without smart formatting
- **Limited voice commands** - basic punctuation and formatting only
- **No context awareness** - doesn't adapt formatting based on what you're writing
- **Requires Chrome** - doesn't work in Firefox, Safari, or other browsers
- **No offline support** - requires an active internet connection
- **No custom vocabulary** - can't add industry-specific terms or jargon

## 5 Better Alternatives to Google Docs Voice Typing

### 1. VoxWrites (Best for Multi-Platform Voice Typing)

Unlike Google Docs voice typing, VoxWrites works on any website - Gmail, Slack, Notion, LinkedIn, WhatsApp Web, and 150+ more apps. Its AI enhancement automatically formats your speech with proper punctuation, capitalization, and tone. The AI command mode lets you say "rewrite this professionally" to instantly polish your text.

**Why switch:** Works everywhere, not just Google Docs. AI makes your first draft nearly final.

### 2. Dragon NaturallySpeaking (Best for Desktop Apps)

The industry standard for professional dictation. Extremely accurate with custom vocabulary support. However, it's a desktop application, not a browser extension, and carries a premium price tag.

**Why consider:** Unmatched accuracy for specialized vocabularies (medical, legal).

### 3. Windows Speech Recognition (Best Free Desktop Option)

Built into Windows 11 with solid accuracy. Works across all Windows applications but lacks AI enhancement and web-specific features. Press **Win+H** to activate.

**Why consider:** Free, works across all Windows apps, no installation needed.

### 4. Apple Dictation (Best for Mac Users)

Built into macOS with on-device processing for privacy. Works across all Mac applications. Good accuracy but limited formatting commands and no AI features.

**Why consider:** Excellent privacy with on-device processing on Apple Silicon.

### 5. Whisper-Based Tools (Best for Accuracy)

OpenAI's Whisper model powers several speech-to-text tools with near-human accuracy. Tools like MacWhisper and Whisper Transcription offer offline processing. However, they typically transcribe audio files rather than real-time dictation.

**Why consider:** State-of-the-art accuracy for transcribing recordings.

## Google Docs Voice Typing vs. VoxWrites: Feature Comparison

- **Supported apps**: Google Docs only vs. 150+ websites
- **AI enhancement**: None vs. Context-aware formatting and rewriting
- **Voice commands**: Basic punctuation vs. Full AI commands ("summarize", "translate", "make professional")
- **Languages**: 100+ vs. 40+ with AI enhancement in all
- **Custom snippets**: Not available vs. Voice-activated text shortcuts
- **Privacy options**: Cloud-only vs. Local processing available
- **Price**: Free vs. Free tier + paid plans with more features

## The Bottom Line

Google Docs voice typing is a solid free tool if you only write in Google Docs. But if you need voice typing across Gmail, Slack, Notion, WhatsApp Web, and other platforms, a dedicated speech-to-text Chrome extension like VoxWrites delivers a significantly better experience with AI-powered formatting and commands.`,
  },
  {
    id: 'free-speech-to-text-tools-online-2026',
    title: '7 Best Free Speech-to-Text Tools Online in 2026 (No Download Required)',
    date: 'February 16, 2026',
    author: 'Emily Thompson',
    excerpt: 'Need speech-to-text for free? These 7 online tools let you convert voice to text instantly in your browser - no software downloads needed.',
    readTime: '7 min read',
    tags: ['Speech to Text', 'Free Tools', 'Online'],
    content: `Whether you're a student transcribing lectures, a professional drafting emails, or anyone who types slower than they think, free speech-to-text tools can dramatically speed up your workflow. The best part? Modern tools work entirely in your browser - no downloads, no installations, no sign-ups required for basic use.

## What Makes a Good Free Speech-to-Text Tool?

Before diving into our picks, here's what we evaluated:

- **Accuracy** - Correct transcription of natural speech
- **No hidden costs** - Genuinely free, not a 5-minute trial
- **Browser-based** - Works without downloading software
- **Ease of use** - Start dictating within seconds
- **Language support** - Multiple languages and accents

## The 7 Best Free Speech-to-Text Tools Online

### 1. VoxWrites Free Tier - Best Free Speech-to-Text Overall

VoxWrites's free tier gives you 1,000 words per day of voice-to-text transcription with AI enhancement. Unlike basic tools that just transcribe, VoxWrites adds smart punctuation, fixes grammar, and formats text based on context. The Chrome extension works across 150+ websites.

**Free includes:** 1,000 words/day, 50 AI enhancements/day, all voice commands, snippet support.

### 2. Google Docs Voice Typing - Best for Google Docs Users

Completely free with no daily limits. Built into Google Docs with support for 100+ languages. The trade-off is it only works inside Google Docs documents - you can't use it in Gmail, Slack, or other websites.

**Free includes:** Unlimited dictation in Google Docs, basic voice commands.

### 3. Speechnotes.co - Best Free Web App

A clean, distraction-free web app for voice typing. Open the website, click the microphone, and start talking. Supports auto-punctuation and lets you export text as a file. No account needed.

**Free includes:** Unlimited dictation on their website, export to text file.

### 4. TalkTyper - Best for Quick Transcriptions

A simple web-based speech-to-text tool. Paste your transcription into any app after dictating. Offers alternative transcription suggestions when accuracy is uncertain. No frills but reliable.

**Free includes:** Unlimited basic transcription in the browser.

### 5. Windows 11 Voice Typing - Best Free Desktop Option

Press **Win+H** on any Windows 11 computer to activate voice typing. Works across all applications, not just the browser. Includes auto-punctuation and basic voice commands.

**Free includes:** Unlimited dictation across all Windows apps, auto-punctuation.

### 6. Apple Dictation - Best Free Option for Mac

Press the **Fn** key twice on any Mac to start dictating. Works across all macOS applications with on-device processing for privacy. Supports multiple languages with automatic language detection.

**Free includes:** Unlimited on-device dictation across all Mac apps.

### 7. Dictation.io - Best Minimalist Free Tool

An online speech-to-text notepad that works in Chrome. Clean interface with support for voice commands like "new paragraph" and "comma." Export options include text, email, and tweet.

**Free includes:** Unlimited browser-based dictation, multiple export options.

## Free Speech-to-Text Comparison Table

- **VoxWrites Free**: 1,000 words/day, works on 150+ sites, AI enhancement included
- **Google Voice Typing**: Unlimited, Google Docs only, no AI
- **Speechnotes.co**: Unlimited on their site, web app only, basic auto-punctuation
- **Windows Voice Typing**: Unlimited, Windows apps only, basic commands
- **Apple Dictation**: Unlimited, Mac apps only, on-device processing

## Tips for Getting the Best Results with Free Speech-to-Text

1. **Use a decent microphone** - Even a basic headset dramatically improves accuracy over laptop microphones
2. **Speak naturally** - Don't over-enunciate or speak too slowly; modern tools understand natural speech
3. **Minimize background noise** - Close windows, mute notifications, and find a quiet spot
4. **Say punctuation** - Most tools support "period," "comma," "question mark" as voice commands
5. **Edit after dictating** - Dictate your full thought first, then go back to edit. Stopping to correct mid-sentence breaks your flow.

## Which Free Speech-to-Text Tool Should You Use?

If you need speech-to-text across multiple websites with AI-powered formatting, start with **VoxWrites's free tier**. For Google Docs-only use, the built-in voice typing is hard to beat. And if you want a simple web notepad for quick dictation, **Speechnotes.co** gets the job done with zero friction.

The era of paying hundreds of dollars for decent speech-to-text software is over. These free tools prove that high-quality voice typing is accessible to everyone in 2026.`,
  },
  {
    id: 'voice-dictation-for-writers-2026',
    title: 'Voice Dictation for Writers: How to Write 3x Faster with AI Speech-to-Text',
    date: 'February 14, 2026',
    author: 'David Kim',
    excerpt: 'Professional writers are switching to voice dictation to triple their output. Learn the techniques, tools, and workflows that make it work.',
    readTime: '8 min read',
    tags: ['Writing', 'Dictation', 'Productivity'],
    content: `The average person types at 40 words per minute. The average person speaks at 130 words per minute. That's not just a speed difference - it's a paradigm shift for anyone who writes for a living. Voice dictation software has evolved from a frustrating novelty to an essential writing tool, and in 2026, AI makes the transition easier than ever.

## Why Writers Are Switching to Voice Dictation

### Speed: 3x More Words Per Hour

The math is straightforward. At 40 WPM typing, you produce about 2,400 words per hour (accounting for thinking time and corrections). With voice dictation at 130 WPM, experienced dictators produce 5,000-7,000 words per hour. That's first-draft speed - editing comes later.

### Reduced Physical Strain

Repetitive strain injuries (RSI), carpal tunnel syndrome, and back pain are occupational hazards for writers. Voice dictation eliminates thousands of daily keystrokes. Many writers report that switching to voice dictation resolved chronic wrist and shoulder pain.

### Better First Drafts

When you type, your inner editor activates. You pause, delete, rephrase. When you speak, thoughts flow more naturally. Voice dictation often produces more authentic, conversational prose - especially valuable for blog posts, emails, and social media content.

## Setting Up Your Voice Dictation Workflow

### Equipment You Need

- **Microphone**: A USB headset ($30-50) or desktop condenser mic ($50-100). Avoid relying on built-in laptop microphones.
- **Quiet environment**: Background noise is the biggest accuracy killer. Close doors, use a noise-canceling mic, or dictate during quiet hours.
- **Speech-to-text tool**: VoxWrites (browser-based), Dragon NaturallySpeaking (desktop), or Apple Dictation (Mac).

### The Two-Pass Method

The most effective voice dictation workflow for writers uses two passes:

1. **Pass 1 - Dictation**: Speak your entire draft without stopping to edit. Focus on getting ideas out. Say punctuation as you go ("period", "comma", "new paragraph").
2. **Pass 2 - AI Polish**: Use AI commands to refine. "Fix grammar and punctuation," "make this more concise," or "adjust tone to professional."

This separates creation from editing, which is how the most productive writers work regardless of input method.

### Voice Commands Every Writer Should Know

- **"New paragraph"** - starts a fresh paragraph
- **"Period" / "Comma" / "Question mark"** - inserts punctuation
- **"Delete last sentence"** - removes the previous sentence
- **"Read that back"** - some tools read your text aloud for review
- **"Scratch that"** - deletes the last phrase

## AI Enhancement: The Game Changer for Voice Dictation

Raw voice dictation produces rough text. AI enhancement transforms it into polished prose. Here's how modern tools like VoxWrites use AI:

### Automatic Formatting

AI analyzes your dictated text and applies proper formatting - paragraph breaks, capitalization, punctuation, and even heading suggestions for longer content.

### Tone Adjustment

Say "make this professional" and AI rewrites your casual dictation into formal business language. Or "make this conversational" to loosen up stiff prose. This eliminates the most time-consuming part of editing.

### Context-Aware Styling

When dictating an email in Gmail, AI formats differently than when you're writing in Google Docs or posting on LinkedIn. Context-aware tools understand where you're writing and adapt accordingly.

## Common Voice Dictation Mistakes (and How to Avoid Them)

1. **Stopping to correct errors** - Don't. Keep dictating and fix later. Stopping breaks your creative flow.
2. **Speaking too slowly** - Natural pace produces better results than careful, slow dictation. Modern AI handles natural speech.
3. **Forgetting punctuation** - Practice saying "period" and "comma" naturally. It becomes second nature within a week.
4. **Poor microphone setup** - Position your mic 2-6 inches from your mouth, slightly to the side to avoid breath pops.
5. **Not using AI commands** - Voice dictation without AI polish is only half the solution. Always use AI to refine your first draft.

## Voice Dictation Productivity by the Numbers

- **Blog posts**: 1,500-word post in 15-20 minutes (vs. 45-60 minutes typing)
- **Emails**: Average email drafted in 30 seconds (vs. 2-3 minutes typing)
- **Reports**: 5,000-word report rough draft in under an hour
- **Social media**: 10 LinkedIn posts drafted in 15 minutes

## Getting Started Today

Start small. Use voice dictation for low-stakes writing - quick emails, Slack messages, personal notes. Within a week, you'll build the muscle memory for punctuation commands and develop your dictation style. Then gradually expand to longer-form content.

The writers who produce the most in 2026 aren't typing faster - they're talking. Voice dictation with AI enhancement isn't just a productivity hack; it's becoming the standard workflow for professional writers.`,
  },
  {
    id: 'how-to-use-voice-typing-chrome-2026',
    title: 'How to Use Voice Typing in Chrome: Step-by-Step Guide for Any Website (2026)',
    date: 'February 12, 2026',
    author: 'Sarah Chen',
    excerpt: 'Learn how to set up and use voice typing in Chrome on any website - Gmail, Slack, Notion, and more. Works on Windows, Mac, and Chromebook.',
    readTime: '6 min read',
    tags: ['Voice Typing', 'Chrome', 'Tutorial'],
    content: `Voice typing in Chrome lets you speak instead of type on any website. Whether you're composing emails in Gmail, chatting in Slack, or writing documents in Notion, you can dictate text hands-free. This guide covers every method available in 2026, from built-in options to powerful extensions.

## Method 1: Chrome's Built-in Voice Typing (Google Docs Only)

Chrome has native voice typing, but it only works inside Google Docs.

### How to activate:

1. Open a document in Google Docs
2. Go to **Tools > Voice typing** (or press **Ctrl+Shift+S** / **Cmd+Shift+S**)
3. Click the microphone icon that appears
4. Start speaking

### Limitations:

- Only works in Google Docs - not Gmail, Slack, or any other site
- No AI formatting or enhancement
- Requires internet connection

## Method 2: VoxWrites Chrome Extension (Any Website)

For voice typing that works on any website in Chrome, install a speech-to-text extension. VoxWrites is the most comprehensive option.

### Setup (2 minutes):

1. Visit the Chrome Web Store and search for "VoxWrites"
2. Click **Add to Chrome** and confirm the installation
3. Click the VoxWrites icon in your toolbar and sign in
4. Grant microphone permission when prompted

### How to use voice typing with VoxWrites:

1. Click into any text field on any website
2. Press **Cmd+Shift+U** (Mac) or **Ctrl+Shift+U** (Windows) to start recording
3. Speak naturally - text appears in real-time
4. Press the shortcut again to stop recording

### Supported websites include:

- **Email**: Gmail, Outlook, Yahoo Mail, ProtonMail
- **Chat**: Slack, Discord, Microsoft Teams, WhatsApp Web
- **Documents**: Google Docs, Notion, Coda, Confluence
- **Social**: LinkedIn, Twitter/X, Facebook, Reddit
- **CRM**: Salesforce, HubSpot, Zendesk
- **Code**: GitHub, GitLab, VS Code Web

## Method 3: Operating System Dictation

Both Windows and macOS offer system-level voice typing that works in Chrome.

### Windows 11:

1. Press **Win+H** to activate voice typing
2. Speak into your microphone
3. Works in any text field in Chrome
4. Say "stop listening" to deactivate

### macOS:

1. Press **Fn** twice to start dictation
2. Speak naturally
3. Press **Fn** again to stop
4. Works in any text field in Chrome

## Voice Typing Tips for Better Accuracy in Chrome

### Microphone Setup

- Use a headset or external microphone for best results
- Position the mic 2-6 inches from your mouth
- Test in Chrome settings: **chrome://settings/content/microphone**

### Speaking Tips

- Speak at a natural pace - don't slow down artificially
- Pronounce punctuation: say "period," "comma," "question mark"
- Say "new line" or "new paragraph" for formatting
- Minimize background noise - close windows and doors

### Troubleshooting Common Issues

**Microphone not working:**
- Check Chrome permissions: click the lock icon in the address bar > Site settings > Microphone
- Ensure your mic is selected in Chrome: Settings > Privacy and security > Site settings > Microphone
- Try a different USB port or restart Chrome

**Poor accuracy:**
- Switch to a better microphone
- Reduce background noise
- Speak closer to the microphone
- Check your internet connection (most tools require cloud processing)

**Voice typing lag:**
- Close unnecessary Chrome tabs (each tab uses memory)
- Check internet speed - speech-to-text requires steady upload bandwidth
- Try disabling other extensions that might conflict

## Voice Typing vs. Traditional Typing: When to Use Each

**Use voice typing for:**
- Drafting emails and messages
- Writing long-form content (blogs, reports, documentation)
- Quick replies and chat messages
- When you have hand/wrist fatigue

**Use traditional typing for:**
- Code and technical syntax
- Quiet environments (libraries, open offices)
- Precise formatting with special characters
- When you need to think carefully about each word

## The Future of Voice Typing in Chrome

Voice typing in Chrome has evolved from a basic Google Docs feature to a powerful cross-platform capability. With AI-powered extensions like VoxWrites, your dictated text is automatically formatted, punctuated, and refined. As AI models continue to improve, expect even better accuracy, real-time translation, and seamless integration with every web application you use.`,
  },
  {
    id: 'VoxWrites-vs-voice-in-vs-voicy-comparison',
    title: 'VoxWrites vs. Voice In vs. Voicy: Which Speech-to-Text Chrome Extension Is Best?',
    date: 'February 9, 2026',
    author: 'Emily Thompson',
    excerpt: 'A head-to-head comparison of the three most popular speech-to-text AI Chrome extensions. We tested accuracy, features, and value to find the winner.',
    readTime: '8 min read',
    tags: ['Speech to Text AI', 'Comparison', 'Chrome Extension'],
    content: `Choosing between speech-to-text Chrome extensions can be confusing. The three most popular options in 2026 - VoxWrites, Voice In, and Voicy - each take a different approach to voice typing. We tested all three extensively to help you pick the right one.

## Overview: Three Different Approaches to Speech-to-Text AI

**VoxWrites** focuses on AI-powered context-aware transcription. It detects which app you're using and formats text accordingly, with built-in AI commands for rewriting and enhancing text.

**Voice In** takes a simpler approach: reliable dictation across websites with custom voice commands and multi-language support.

**Voicy** sits between the two, offering voice typing with some AI features at a budget-friendly price.

## Feature-by-Feature Comparison

### Accuracy

All three use modern speech recognition engines, but real-world accuracy varies based on how they handle punctuation and formatting.

- **VoxWrites**: AI post-processing catches and fixes recognition errors, adds smart punctuation, and formats based on context. Effective accuracy: 97-99%.
- **Voice In**: Relies on browser speech recognition. Raw accuracy is good (95-97%) but no AI correction layer.
- **Voicy**: Similar to Voice In for raw transcription. Some basic auto-punctuation. Effective accuracy: 95-97%.

### App Detection and Context Awareness

- **VoxWrites**: Detects 150+ apps and adjusts formatting. Writing in Gmail? It reads the email thread for context. In Slack? It keeps messages casual. In Google Docs? Full document formatting.
- **Voice In**: Basic site detection. Works across websites but doesn't adapt formatting based on the app.
- **Voicy**: No app detection. Same output regardless of where you're typing.

### AI Enhancement Features

- **VoxWrites**: Full AI command mode - "rewrite professionally," "summarize," "translate to French," "fix grammar." AI reads your current text and applies instructions. Uses GPT-4 and Claude for processing.
- **Voice In**: No AI enhancement. What you dictate is what you get. Custom voice commands can insert predefined text.
- **Voicy**: Basic AI formatting (auto-punctuation, capitalization). No advanced AI commands for rewriting or summarization.

### Language Support

- **VoxWrites**: 40+ languages with AI enhancement in all supported languages
- **Voice In**: 50+ languages for dictation
- **Voicy**: 30+ languages for basic dictation

### Custom Commands and Snippets

- **VoxWrites**: Voice-activated snippets with three types - text insertion, AI commands, and URL opening. Snippets sync across devices. Usage tracking for optimization.
- **Voice In**: Custom voice commands that map phrases to text. Useful but limited to text insertion only.
- **Voicy**: Basic custom commands available in paid plans.

### Privacy

- **VoxWrites**: Local processing option available. Audio is never stored. AI processing uses encrypted connections. Option to bring your own API key.
- **Voice In**: Uses browser's Web Speech API. Audio processed by Google's servers.
- **Voicy**: Cloud-based processing. Privacy policy covers data handling.

## Pricing Comparison

### Free Tiers

- **VoxWrites Free**: 1,000 words/day, 50 AI enhancements/day, all core features
- **Voice In Free**: Unlimited basic dictation, limited languages
- **Voicy Free**: Limited daily minutes, basic features

### Paid Plans

- **VoxWrites Pro**: $9.99/month - 100 AI enhancements/day, priority support, all languages
- **Voice In Plus**: $7.99/month - All languages, custom commands, no ads
- **Voicy Premium**: $5.99/month - Unlimited minutes, all languages, basic AI

## Real-World Testing Results

We dictated the same 500-word email draft using all three extensions and compared results:

### VoxWrites Result

Proper paragraph formatting, context-aware punctuation, professional tone automatically applied (detected we were in Gmail). Used AI command "make concise" to trim 15% without losing meaning. Final output: ready to send with minor tweaks.

### Voice In Result

Accurate transcription of spoken words. Needed manual punctuation and paragraph formatting. Professional enough but required 3-4 minutes of editing before sending.

### Voicy Result

Good basic transcription with auto-punctuation. Some formatting applied but inconsistent. Required 2-3 minutes of editing.

## Who Should Choose What?

### Choose VoxWrites if:

- You write across multiple platforms (Gmail, Slack, Docs, LinkedIn)
- You want AI to polish your dictation automatically
- You need voice commands for text transformation
- Context-aware formatting matters to you
- You want to bring your own AI API key

### Choose Voice In if:

- You need simple, reliable dictation without AI extras
- Budget is your primary concern
- You mainly need multi-language dictation
- You prefer minimal setup and configuration

### Choose Voicy if:

- You want a middle ground between features and price
- Basic AI formatting (punctuation, capitalization) is enough
- You're testing voice typing for the first time

## The Verdict

For professionals who rely on writing daily, **VoxWrites** delivers the best experience with its AI-powered enhancement and context awareness. The ability to dictate a rough thought and have AI polish it into a professional message saves more time than any speed improvement alone.

For users who want straightforward dictation without AI features, **Voice In** offers the best value with its generous free tier and reliable cross-site support.

**Voicy** is a solid budget option but sits in an awkward middle ground - more expensive than Voice In's free tier but less capable than VoxWrites's AI features.

In the speech-to-text AI space, the gap between "good transcription" and "intelligent writing assistant" is widening. Choose the tool that matches how you actually write.`,
  },
  {
    id: 'ai-voice-to-text-productivity-boost',
    title: '5 Ways AI Voice-to-Text Tools Boost Your Productivity (Write Emails 75% Faster)',
    date: 'February 7, 2026',
    author: 'Michael Rodriguez',
    excerpt: 'AI-powered voice-to-text converters do more than transcribe - they rewrite, format, and optimize your text. Here are 5 ways they save hours every week.',
    readTime: '6 min read',
    tags: ['Voice to Text', 'AI', 'Productivity'],
    content: `Voice-to-text converters have been around for decades, but AI has transformed them from frustrating tools that produce garbled text into intelligent writing assistants. In 2026, the best voice-to-text tools don't just convert speech to text - they understand what you're trying to say and help you say it better.

## 1. Write Emails 75% Faster with AI Formatting

The average professional spends 2.5 hours per day on email. A voice-to-text converter with AI cuts that dramatically.

**Without AI voice-to-text:**
You dictate: "hey john just wanted to follow up on our meeting from tuesday can you send me the q4 numbers when you get a chance thanks"
You get: "hey john just wanted to follow up on our meeting from tuesday can you send me the q4 numbers when you get a chance thanks"
Then you spend 2 minutes adding punctuation, capitalization, and formatting.

**With AI voice-to-text (VoxWrites):**
You dictate the same thing and get: "Hey John, just wanted to follow up on our meeting from Tuesday. Can you send me the Q4 numbers when you get a chance? Thanks!"
Ready to send. AI handled punctuation, capitalization, and formatting automatically.

Multiply this by 50+ emails per day and you save over an hour.

## 2. Draft Reports and Documents in Minutes

Long-form writing is where voice-to-text converters shine brightest. Speaking at 130 words per minute versus typing at 40 WPM means a 3,000-word report that takes 75 minutes to type can be dictated in 25 minutes.

But raw dictation produces rough text. AI makes the difference:

- **Auto-paragraphing** - AI detects topic changes and inserts paragraph breaks
- **Heading suggestions** - AI identifies sections and suggests headers
- **Tone consistency** - AI ensures professional tone throughout
- **Grammar correction** - AI fixes errors that voice recognition introduces

The result: a first draft that needs light editing instead of heavy rewriting.

## 3. Instant Text Transformation with Voice Commands

Modern AI voice-to-text tools include command modes that go beyond dictation. Instead of typing and then manually editing, you speak your intent:

- **"Summarize this email in three sentences"** - AI reads the email and creates a summary
- **"Translate this to Spanish"** - instant translation without switching apps
- **"Make this more formal"** - AI rewrites casual text in professional tone
- **"Shorten this by half"** - AI condenses without losing key information
- **"Convert to bullet points"** - AI restructures paragraphs into lists

These commands work on any text in any web application, turning your voice-to-text tool into a full text transformation engine.

## 4. Context-Aware Writing Across All Your Apps

A basic voice-to-text converter treats all text the same. An AI-powered converter understands context:

**In Gmail:** AI reads the email thread you're replying to. When you dictate a response, it matches the tone and addresses the specific questions asked.

**In Slack:** AI keeps your messages conversational and concise. It understands that Slack messages should be shorter and more casual than emails.

**In Google Docs:** AI applies document formatting - proper headings, paragraphs, and structure suitable for long-form content.

**In LinkedIn:** AI adjusts for professional networking tone - more polished than Slack, less formal than a business email.

This context awareness means less editing after dictation, regardless of where you're writing.

## 5. Custom Voice Shortcuts for Repetitive Tasks

How much time do you spend typing the same phrases? Your email signature. Your address. Meeting agenda templates. Project status update formats.

AI voice-to-text tools let you create custom voice shortcuts:

- Say **"my signature"** → inserts your full email signature
- Say **"status update"** → inserts your weekly status template
- Say **"meeting notes"** → inserts your meeting notes structure
- Say **"schedule call"** → inserts your calendar booking link

These snippets eliminate repetitive typing entirely. Users report saving 15-20 minutes per day on snippets alone.

## The Productivity Math

Here's how the time savings add up for a typical professional:

- **Emails**: 1 hour saved/day (faster drafting + AI formatting)
- **Documents**: 30 minutes saved/day (3x dictation speed + AI polish)
- **Text commands**: 15 minutes saved/day (instant rewrites, summaries, translations)
- **Snippets**: 15 minutes saved/day (eliminated repetitive typing)

**Total: 2 hours saved per day.** That's 10 hours per week or over 500 hours per year.

## Getting Started with AI Voice-to-Text

The barrier to entry is lower than ever. Install a Chrome extension like VoxWrites, spend 10 minutes learning the keyboard shortcuts and basic voice commands, and you'll see immediate productivity gains. The AI handles the learning curve - your first dictation is already formatted and polished.

Voice-to-text converters powered by AI aren't just about typing speed. They're about removing friction from the entire writing process - from first thought to final draft.`,
  },
  {
    id: 'voice-typing-whatsapp-slack-chat-apps-2026',
    title: 'How to Use Voice Typing on WhatsApp Web, Slack, and Any Chat App (2026 Guide)',
    date: 'February 4, 2026',
    author: 'David Kim',
    excerpt: 'Stop typing on WhatsApp Web, Slack, Discord, and Teams. This guide shows you how to use voice typing in every major chat app from your browser.',
    readTime: '7 min read',
    tags: ['Voice Typing', 'WhatsApp', 'Chat Apps'],
    content: `Typing messages on WhatsApp Web, Slack, and other chat apps is slow and interrupts your workflow. Voice typing lets you speak your messages naturally, and modern AI ensures they're properly formatted before sending. This guide covers how to set up voice typing for every major chat platform in your browser.

## Why Voice Typing in Chat Apps?

Chat apps are the backbone of modern communication. The average professional sends 200+ chat messages per day across platforms. At 15 seconds per typed message, that's 50 minutes of typing. Voice typing cuts this to under 15 minutes.

Beyond speed, voice typing helps when:

- Your hands are busy (eating, carrying things, taking notes)
- You're experiencing typing fatigue from a long day
- You think faster than you type and want to capture ideas quickly
- You're on a video call and need to send messages simultaneously

## Voice Typing on WhatsApp Web

WhatsApp Web doesn't have built-in voice typing (the mobile app has voice messages, but that's different from text typing). Here's how to add it:

### Method 1: VoxWrites Chrome Extension (Recommended)

1. Install VoxWrites from the Chrome Web Store
2. Open WhatsApp Web (web.whatsapp.com)
3. Click into any chat's message field
4. Press **Cmd+Shift+U** (Mac) or **Ctrl+Shift+U** (Windows)
5. Speak your message naturally
6. Press the shortcut again to stop - your message appears as formatted text
7. Hit Enter to send

VoxWrites detects WhatsApp Web automatically and keeps your messages conversational with proper punctuation.

### Method 2: System Voice Typing

- **Windows**: Press **Win+H**, dictate your message, press **Win+H** again
- **Mac**: Press **Fn** twice, dictate, press **Fn** to stop

System voice typing works but lacks AI formatting - you'll get raw text without smart punctuation.

## Voice Typing on Slack

Slack is where voice typing shines brightest for professionals. Quick replies, status updates, and channel messages are perfect for dictation.

### Setup with VoxWrites:

1. Open Slack in your browser (app.slack.com)
2. Click into any channel or DM message field
3. Press **Cmd+Shift+U** / **Ctrl+Shift+U** to start
4. Dictate your message
5. Press the shortcut to stop

### Pro Tips for Slack Voice Typing:

- VoxWrites keeps Slack messages concise and casual automatically
- Use AI commands: dictate your thought, then say "make this shorter" for quick channel updates
- Create snippets for common responses: "sounds good" → "Sounds good, thanks!"
- For code discussions, switch to typing - voice dictation and code don't mix well

## Voice Typing on Microsoft Teams

Teams is widely used in corporate environments where voice typing saves significant time.

### Setup:

1. Open Teams in Chrome (teams.microsoft.com)
2. Navigate to any chat or channel
3. Activate VoxWrites with the keyboard shortcut
4. Dictate your message
5. Stop recording and send

### Teams-Specific Tips:

- For meeting follow-ups, dictate "action items from today's meeting" and list them verbally
- Use formal tone for channels with leadership visibility
- VoxWrites's AI adjusts formality based on whether you're in a DM or a public channel

## Voice Typing on Discord

Discord's casual environment is perfect for voice typing - no need to worry about perfect grammar.

### How to Dictate in Discord:

1. Open Discord in Chrome (discord.com)
2. Click into any channel or DM
3. Start VoxWrites recording
4. Speak naturally - casual tone is fine
5. Stop and send

Discord's fast-paced environment means short messages. Voice typing is faster than typing for quick reactions and replies.

## Voice Typing in Other Chat Apps

The same approach works for any browser-based chat application:

- **Telegram Web** - Full voice typing support in message fields
- **Facebook Messenger** - Works in messenger.com
- **Google Chat** - Integrates seamlessly with Google Workspace
- **LinkedIn Messages** - Professional tone applied automatically
- **Twitter/X DMs** - Works for direct messages
- **Reddit Chat** - Voice typing in Reddit's chat interface

## Common Issues and Fixes

### "My mic isn't working in the chat app"

1. Click the lock icon in Chrome's address bar
2. Set Microphone to "Allow"
3. Refresh the page
4. Try again

### "Messages are too formal for chat"

If using system dictation, your text will sound stiff. Switch to VoxWrites, which detects chat apps and keeps tone casual. Or dictate naturally and use the AI command "make this casual."

### "Voice typing picks up background noise"

- Use a headset or directional microphone
- Mute your speaker output to avoid echo
- Close unused browser tabs (some play ambient sounds)
- Move to a quieter space or use a noise-canceling mic

### "Accidental sends"

Voice typing puts text in the message field - it doesn't auto-send. You always have a chance to review before pressing Enter. This is different from voice messages, which send the audio recording directly.

## Voice Typing vs. Voice Messages

Don't confuse voice typing with voice messages:

- **Voice typing** converts your speech to text. The recipient sees a text message.
- **Voice messages** send an audio recording. The recipient hears your voice.

Voice typing is better when recipients prefer reading (faster to consume), when you want to edit before sending, or when you're in a noisy environment where a voice message would have poor audio quality.

## Maximizing Chat Productivity with Voice Typing

1. **Batch your messages** - Dictate several replies in sequence during a dedicated "message time"
2. **Use snippets** - Create voice shortcuts for frequent replies ("on it", "will check", "meeting at three")
3. **AI polish** - Dictate a rough thought, then say "clean this up" before sending
4. **Switch apps fluently** - VoxWrites works across all chat apps, so you don't need to adjust your workflow per platform

Voice typing in chat apps isn't just about speed - it's about making digital communication as natural as a conversation. In 2026, there's no reason to type every message when you can simply speak.`,
  },
  {
    id: 'voice-to-text-productivity',
    title: 'How Voice-to-Text Is Revolutionizing Productivity in 2026',
    date: 'February 10, 2026',
    author: 'Sarah Chen',
    excerpt: 'Discover how modern voice-to-text technology is helping professionals write 3x faster while maintaining quality and accuracy.',
    readTime: '5 min read',
    tags: ['Productivity', 'Voice Tech'],
    content: `The way we interact with computers is evolving rapidly. In 2026, voice-to-text technology has reached a level of accuracy and contextual understanding that makes it a genuine productivity powerhouse.

## The Speed Advantage

Studies show that the average person types at about 40 words per minute, while speaking naturally occurs at 130-150 words per minute. That's a 3x improvement in raw throughput. But speed alone doesn't tell the full story.

Modern voice-to-text tools like VoxWrites go beyond simple transcription. They understand context - knowing whether you're writing an email, a Slack message, or a code comment - and format your speech accordingly.

## Context-Aware AI Enhancement

What sets 2026-era voice tools apart is AI integration. When you dictate an email reply, VoxWrites reads the original email thread, understands the context, and helps you craft a response that matches the tone and addresses the key points.

This means less editing after dictation. Your first draft is already polished, contextual, and ready to send.

## Real-World Impact

Our users report saving an average of 45 minutes per day by switching from typing to voice-first workflows. For professionals who write extensively - content creators, marketers, customer support teams - the time savings compound dramatically.

## Getting Started

The best approach is to start with low-stakes writing: quick messages, notes, and drafts. As you build confidence with voice commands and learn the shortcuts, you'll naturally expand to more complex documents.

Voice-to-text isn't just a convenience - it's becoming an essential productivity tool for the modern professional.`,
  },
  {
    id: 'ai-commands-guide',
    title: 'Mastering AI Commands: Transform Your Text with Your Voice',
    date: 'February 5, 2026',
    author: 'Michael Rodriguez',
    excerpt: 'Learn how to use VoxWrites\'s AI command mode to rewrite, summarize, translate, and transform text - all hands-free.',
    readTime: '7 min read',
    tags: ['AI', 'Tutorial'],
    content: `VoxWrites's AI Command Mode is one of its most powerful features. With a single keyboard shortcut, you can instruct AI to transform any text on your screen.

## How AI Command Mode Works

Press **Cmd+Shift+X** to activate command mode. Your microphone icon turns purple, indicating you're in command mode. Now, simply speak your instruction:

- "Rewrite this to be more professional"
- "Summarize this in three bullet points"
- "Translate this to Spanish"
- "Fix the grammar and spelling"

The AI reads the text in your current field, processes your instruction, and replaces the text with the result.

## Voice-Triggered Commands During Recording

You don't even need to switch modes for common operations. During regular recording (Cmd+Shift+U), you can say phrases like:

- **"Summarize this"** - AI summarizes what you've written
- **"Fix this"** - corrects grammar and spelling
- **"Make this formal"** - adjusts the tone
- **"Shorten this"** - condenses the text

## Advanced Use Cases

### Email Replies
When composing a reply in Gmail, VoxWrites reads the entire email thread. Say "write a polite decline" and the AI crafts a contextual response.

### Code Comments
In GitHub or VS Code, say "explain this function" and get a clear code comment generated from the selected code.

### Meeting Notes
After pasting rough meeting notes, say "organize these into action items" for instant structure.

## Tips for Best Results

1. **Be specific** - "Make this shorter" works, but "Condense this to 2 sentences" works better
2. **Use context** - The AI knows what app you're in, so leverage that
3. **Chain commands** - Dictate first, then use AI commands to polish

AI commands turn VoxWrites from a transcription tool into a full writing assistant.`,
  },
  {
    id: 'snippets-workflow',
    title: 'Build Your Perfect Workflow with Custom Snippets',
    date: 'January 28, 2026',
    author: 'Emily Thompson',
    excerpt: 'Set up voice-activated snippets and commands to automate repetitive tasks and supercharge your daily workflow.',
    readTime: '6 min read',
    tags: ['Workflow', 'Snippets'],
    content: `Repetitive typing is the enemy of productivity. VoxWrites's snippets feature lets you create voice-activated shortcuts that insert text, run AI commands, or open URLs - all triggered by a simple phrase.

## Types of Snippets

### Text Snippets
Map a trigger phrase to a block of text. Say the phrase during recording, and the text is inserted instantly.

**Examples:**
- "my email" → inserts your email address
- "my signature" → inserts your full email signature
- "meeting template" → inserts your standard meeting notes template

### AI Command Snippets
Map a trigger phrase to an AI instruction that processes your current text.

**Examples:**
- "fix grammar" → AI corrects grammar and spelling
- "make professional" → AI adjusts tone to professional
- "add bullet points" → AI reformats text as bullet points

### URL Command Snippets
Map a trigger phrase to open a URL in a new tab.

**Examples:**
- "open dashboard" → opens your VoxWrites dashboard
- "open calendar" → opens Google Calendar
- "open project" → opens your project management tool

## Setting Up Snippets

1. Navigate to the **Snippets** page in your dashboard
2. Click **New Snippet**
3. Enter your trigger phrase (what you'll say)
4. Choose the category (Snippet or Command)
5. Select the action type (Insert Text, AI Command, or Open URL)
6. Enter the content
7. Save and start using it immediately

## Pro Tips

- Keep trigger phrases **unique and distinct** - avoid phrases you'd say naturally
- Use **2-3 word phrases** for reliability (e.g., "my address" not just "address")
- Snippets sync automatically to your Chrome extension within 5 minutes
- Track usage counts to see which snippets you use most and optimize your workflow

Custom snippets transform VoxWrites from a tool you use into a tool that works the way you think.`,
  },
  {
    id: 'app-detection-deep-dive',
    title: 'How VoxWrites Detects 150+ Apps for Smarter Transcription',
    date: 'January 20, 2026',
    author: 'David Kim',
    excerpt: 'A deep dive into how VoxWrites\'s app detection works and why context-aware transcription produces better results.',
    readTime: '4 min read',
    tags: ['Technology', 'Features'],
    content: `When you activate VoxWrites in Gmail, it knows you're writing an email. In Slack, it knows you're chatting. In Google Docs, it knows you're writing a document. This context awareness is what makes VoxWrites's transcriptions so accurate and well-formatted.

## How App Detection Works

VoxWrites's Chrome extension analyzes the current tab's URL and DOM structure to identify which application you're using. We support over 150 apps across categories:

- **Email**: Gmail, Outlook, Yahoo Mail, ProtonMail
- **Chat**: Slack, Discord, Microsoft Teams, WhatsApp Web
- **Documents**: Google Docs, Notion, Coda, Confluence
- **Social**: LinkedIn, Twitter/X, Facebook, Reddit
- **Code**: GitHub, GitLab, VS Code Web, CodePen
- **CRM**: Salesforce, HubSpot, Zendesk
- And many more...

## Why Context Matters

The same spoken words should be formatted differently depending on where they're being used:

- **In Gmail**: "hey can you send me the report by friday thanks" → "Hey, can you send me the report by Friday? Thanks!"
- **In Slack**: "hey can you send me the report by friday thanks" → "Hey, can you send me the report by Friday? Thanks!"
- **In GitHub**: "fix the null pointer exception in the auth module" → formatted as a proper issue description with technical context

## Special Integrations

### Google Docs
VoxWrites handles Google Docs' unique canvas-based rendering. Text insertion uses clipboard event simulation, and AI commands work seamlessly despite the non-standard DOM.

### Gmail
When composing a reply, VoxWrites extracts the entire email thread - subject, sender, body - and passes it as context to the AI. This means AI commands like "write a reply" actually understand what you're replying to.

## The Result

Context-aware transcription means less editing, better formatting, and AI that actually understands what you're trying to accomplish. It's the difference between a basic speech-to-text tool and an intelligent writing assistant.`,
  },
  {
    id: 'privacy-local-processing',
    title: 'Your Privacy Matters: Local Processing and Data Control',
    date: 'January 12, 2026',
    author: 'Sarah Chen',
    excerpt: 'Learn about VoxWrites\'s privacy-first approach, including local processing options and how we handle your data.',
    readTime: '4 min read',
    tags: ['Privacy', 'Security'],
    content: `At VoxWrites, we believe your voice data and transcriptions are deeply personal. That's why we've built privacy controls that put you in charge of your data.

## Local Processing Option

For users who want maximum privacy, VoxWrites offers a local processing mode. When enabled:

- Voice recognition happens on your device using the Web Speech API
- No audio data is sent to external servers
- Transcriptions are processed locally before any AI enhancement

This is ideal for sensitive work environments, legal professionals, healthcare workers, and anyone who handles confidential information.

## What Data We Collect (and Don't)

**We collect:**
- Transcription text (for history and sync features)
- Usage statistics (word counts, app usage - anonymized)
- Account information (email, preferences)

**We never collect:**
- Raw audio recordings
- Keystrokes or passwords
- Screen content outside the active text field
- Browsing history

## Data Controls in Settings

In your dashboard Settings under Privacy, you can:

- **Toggle local processing** - keep everything on-device
- **Manage data collection** - choose what usage data to share
- **Enable 2FA** - add two-factor authentication for account security
- **Delete your account** - permanently remove all your data

## AI Processing

When AI enhancement is enabled, your text is sent to our API for processing. We use industry-standard encryption (TLS 1.3) and don't store your text after processing is complete. AI providers (OpenAI, Anthropic) process requests without retaining data per our agreements.

## Our Commitment

Privacy isn't a feature we bolt on - it's foundational to how we build VoxWrites. We're committed to transparency about data practices and giving you meaningful control over your information.`,
  },
  {
    id: 'whats-new-february-2026',
    title: 'What\'s New in VoxWrites - February 2026',
    date: 'February 1, 2026',
    author: 'Michael Rodriguez',
    excerpt: 'Playground improvements, export options, and enhanced voice commands - here\'s everything new this month.',
    readTime: '3 min read',
    tags: ['Updates', 'Changelog'],
    content: `We've been busy shipping improvements to VoxWrites. Here's what's new in February 2026.

## Playground Enhancements

The Playground now features:
- **Mic button** - click to dictate directly in the playground using Web Speech API
- **Snippet selector** - quickly insert saved snippets into your input text
- **Reset button** - clears text and stops microphone in one click
- Improved tone and context selectors for better AI enhancement

## Export Options in History

You can now export your transcription history in multiple formats:
- **CSV** - for spreadsheets and data analysis
- **Markdown** - for documentation and notes
- **PDF** - for formal records
- **DOCX** - for Word-compatible documents

## Enhanced Voice Commands

New voice selection commands let you transform text hands-free:
- "Explain this" - AI provides a simple explanation
- "Summarize this page" - AI summarizes the entire web page content
- Improved accuracy for all existing voice commands

## Snippets Usage Tracking

Every snippet now tracks its usage count, so you can see which shortcuts you use most and optimize your workflow accordingly.

## Coming Soon

We're working on team collaboration features, including shared snippets and team dashboards. Stay tuned for updates!

Thank you for being part of the VoxWrites community. Your feedback drives every improvement we make.`,
  },
];

export function BlogPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    return (
      <div>
        {/* Blog Detail View */}
        <div className="pt-24 pb-12 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto"
            >
              <Button
                variant="ghost"
                onClick={() => setSelectedPost(null)}
                className="mb-6 text-slate-600 hover:text-orange-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                {selectedPost.tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-slate-800 dark:text-slate-200">
                {selectedPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {selectedPost.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="py-12 bg-white dark:bg-[#161926]">
          <div className="container mx-auto px-4">
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-3xl mx-auto"
            >
              {selectedPost.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={index} className="text-2xl font-bold mt-10 mb-4 text-slate-800 dark:text-slate-200">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={index} className="text-xl font-semibold mt-8 mb-3 text-slate-800 dark:text-slate-200">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter((l) => l.startsWith('- '));
                  return (
                    <ul key={index} className="list-disc pl-6 my-5 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-base leading-relaxed text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: formatMarkdownInline(item.replace('- ', '')) }} />
                      ))}
                    </ul>
                  );
                }
                if (paragraph.startsWith('1. ')) {
                  const items = paragraph.split('\n').filter((l) => /^\d+\.\s/.test(l));
                  return (
                    <ol key={index} className="list-decimal pl-6 my-5 space-y-2">
                      {items.map((item, i) => (
                        <li key={i} className="text-base leading-relaxed text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: formatMarkdownInline(item.replace(/^\d+\.\s/, '')) }} />
                      ))}
                    </ol>
                  );
                }
                return (
                  <p key={index} className="text-base leading-relaxed mb-5 text-slate-600 dark:text-slate-400 [&_strong]:text-slate-800 dark:[&_strong]:text-slate-300" dangerouslySetInnerHTML={{ __html: formatMarkdownInline(paragraph) }} />
                );
              })}
            </motion.article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Blog Header */}
      <div className="pt-28 pb-20 bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >

            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Insights &
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                {' '}Updates
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Tips, tutorials, and news about voice-to-text productivity and AI-powered writing.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="py-16 bg-white dark:bg-[#161926]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {blogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className="h-full flex flex-col cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                  onClick={() => {
                    setSelectedPost(post);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {/* Gradient top bar */}
                  <div className="h-1.5 bg-gradient-to-r from-orange-600 to-orange-400 rounded-t-lg" />

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <h2 className="text-xl font-bold mb-3 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatMarkdownInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}
