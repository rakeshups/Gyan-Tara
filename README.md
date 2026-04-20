# GyanTara – ज्ञान तारा 🌟

Fun Bilingual Education App for Kids (8-12 years) | Nepal 🇳🇵

## Subjects / विषयहरू
- 🗣️ Communication Skills
- 💰 Money Management  
- 🌟 Personality Development
- ⏰ Time Management
- 🇬🇧 English Speaking
- 🌍 General Knowledge & Life Skills

## Setup

### 1. Anthropic API Key set करें
`src/App.jsx` खोलें, line 7 पर:
```
const ANTHROPIC_API_KEY = "YOUR_ANTHROPIC_API_KEY_HERE";
```
यहाँ अपनी real API key डालें।

API key यहाँ से लें: https://console.anthropic.com

### 2. Local run करें
```bash
npm install
npm run dev
```

### 3. Build करें
```bash
npm run build
```

## Deploy to Vercel
1. GitHub पर push करें
2. vercel.com पर जाएं → New Project → GitHub repo select करें
3. Deploy!

## Tech Stack
- React 18 + Vite
- Anthropic Claude API (AI Tutor)
- CSS-in-JS (no external CSS framework)
- PWA ready
