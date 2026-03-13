# VoxWrites - App Features & Testing Guide

## Chrome Extension Features

### Voice Recording
- **Cmd+Shift+U** - Start/stop recording (mic turns red)
- Speak into any text field - text inserts at cursor in real-time
- Works on: input fields, textareas, contenteditable, Google Docs, Gmail, WYSIWYG editors
- Auto-stops after inactivity timeout (configurable in settings)

### AI Command Mode
- **Cmd+Shift+X** - Enter command mode (mic turns purple)
- Speak an instruction: "rewrite", "summarize", "make formal", "translate to Spanish"
- Extension reads current text from focused field, sends to AI, replaces with result
- Also triggered by voice: say "command summarize" during regular recording

### Text Processing (automatic, real-time)
- **Auto-capitalization** - first letter, after `.!?`, after newlines, always capitalizes "I"
- **Smart punctuation spacing** - removes space before `.!?`, adds space after
- **Filler word removal** - strips "um", "uh", "er", "you know", "i mean", "basically", "actually", "literally", "kind of", "sort of"
- **Auto list formatting** - "first point" -> `1.`, "second point" -> `2.`, etc.
- **Grammar correction** - via AI enhancement (GPT-4o-mini / Claude 3 Haiku)

### Voice Commands (say during recording)
| Say | Result |
|-----|--------|
| "period" / "full stop" | `.` |
| "comma" | `,` |
| "question mark" | `?` |
| "exclamation mark" | `!` |
| "colon" / "semicolon" | `:` / `;` |
| "dash" / "hyphen" | `-` / `-` |
| "ellipsis" / "dot dot dot" | `...` |
| "open quote" / "close quote" | `"` `"` |
| "open parenthesis" / "close parenthesis" | `(` `)` |
| "new line" / "new paragraph" | line break / double line break |
| "bullet point" / "next bullet" | bullet list item |
| "dash point" | dash list item |
| "first point" / "point one" | numbered list |
| "scratch that" / "delete that" / "never mind" | delete last sentence |
| "undo that" / "undo last" | undo |
| "delete word" / "delete last word" | delete last word |
| "clear all" | clear everything |
| "select all" | select all text |

### Voice Selection Commands (say during recording)
| Say | Result |
|-----|--------|
| "summarize this" | AI summarizes selected/current text |
| "rewrite this" | AI rewrites the text |
| "fix this" | AI fixes grammar and spelling |
| "shorten this" | AI makes it shorter |
| "expand this" | AI expands with more detail |
| "make this formal" / "make this casual" | AI changes tone |
| "translate this" / "translate this to [lang]" | AI translates |
| "explain this" | AI explains in simple terms |
| "summarize this page" / "what's on this page" | AI summarizes the web page |

### Snippets & Commands (voice-triggered)
- Say a trigger phrase during regular recording (`Cmd+Shift+U`) to activate
- **Snippet (Insert Text)** - say trigger -> inserts saved text (e.g., "my signature" -> full signature)
- **Command (AI)** - say trigger -> runs AI instruction on current text (e.g., "fix grammar" -> AI corrects text)
- **Command (URL)** - say trigger -> opens URL in new tab (e.g., "open github" -> opens github.com)
- Create/manage snippets in the web dashboard Snippets page
- Snippets sync from backend on login, cached for 5 minutes

### App Detection (150+ apps)
- Auto-detects: Gmail, Google Docs, Slack, Discord, Notion, LinkedIn, Twitter, GitHub, etc.
- Shows detected app badge in extension popup
- AI uses app context for smarter formatting (email tone for Gmail, code style for GitHub, etc.)

### Google Docs Integration
- Text insertion via ClipboardEvent paste simulation
- AI commands work (bypasses canvas-rendering)
- Reads text from Google Docs iframe for context

### Gmail Integration
- Extracts email thread body for AI context
- Reply-aware: knows when you're composing a reply
- Subject extraction for context

### Floating Widget
- Bottom-right mic button on all pages
- Only visible when logged in
- Click to start/stop recording
- Color states: orange (idle), red+pulse (recording), purple+pulse (command mode)

### Extension Popup Tabs
- **Record** - quick tone selection
- **Stats** - words today/week, remaining quota (from backend)
- **History** - past transcriptions
- **Settings** - language, AI toggle, filler removal, timeout, input mode
- **Prompts** - view/edit custom AI prompts per app type
- **Account** - user info, logout

---

## Web Dashboard Features

### Dashboard (Home)
- Stats cards: words today, this week, remaining quota
- App Usage breakdown with orange progress bars
- Recent transcriptions feed
- Upgrade to Pro CTA for free users

### Playground
- Paste or type text -> enhance with AI
- Select app context (email, chat, docs, code, etc.) and tone (professional, casual, etc.)
- **Mic button** (orange) - click to dictate via Web Speech API, turns red when listening
- **Snippet selector** (bookmark icon) - insert saved snippets into input
- Reset button clears text and stops mic

### History
- Full transcription history with pagination
- Search by text content
- Filter by app type
- Copy transcription text (one click)
- Delete transcriptions
- **Export**: CSV, Markdown, PDF, DOCX

### Snippets
- Create, edit, delete, toggle active/inactive
- Two categories: **Snippets** (insert text) and **Commands** (AI command, open URL)
- Search by name
- Filter by category (All Types / Snippets / Commands)
- Usage count tracking per snippet

### Prompts
- View/edit AI prompts per app type (email, chat, docs, code, etc.)
- Custom prompts override defaults
- Reset to default option

### Settings
- **Profile** - name, language, default tone
- **Notifications** - email preferences
- **Privacy** - local processing toggle, data collection, 2FA, account deletion
- **Billing** - current plan, upgrade
- **Team** - member management (future)

---

## Auth Flow
1. Register/login on web app
2. Auth token syncs to Chrome extension automatically
3. Extension popup and floating widget activate
4. All transcriptions tracked in backend with usage stats

## Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Cmd+Shift+U | Toggle recording (regular mode) |
| Cmd+Shift+X | AI Command Mode (speak instruction) |

## Language Support
- 46 languages configurable in extension settings

*Last Updated: February 12, 2026*
