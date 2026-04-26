import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";

// ══════════════════════════════════════════════
// LANGUAGE CONTEXT
// ══════════════════════════════════════════════
const LangContext = createContext({ lang: "en", setLang: () => {} });
const useLang = () => useContext(LangContext);

// Translation helper
const t = (enText, npText, lang) => lang === "np" ? npText : enText;

// ══════════════════════════════════════════════
// GAME DATA - 10+ LEVELS PER SUBJECT
// ══════════════════════════════════════════════
const LEVELS_DATA = {
  comm: {
    title: "Communication Skills",
    titleNp: "कुराकानी सीप",
    emoji: "🗣️",
    color: "#FF6B6B",
    gradient: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
    bgGlow: "rgba(255,107,107,0.3)",
    levels: [
      { id: 1, name: "First Hello!", nameNp: "पहिलो नमस्ते!", icon: "👋", xp: 30, type: "lesson", stars: 3, description: "Learn how to greet someone for the first time" },
      { id: 2, name: "Listen Up!", nameNp: "ध्यानले सुन्नुस्!", icon: "👂", xp: 40, type: "lesson", stars: 3, description: "Master the art of active listening" },
      { id: 3, name: "Body Talk", nameNp: "शरीर भाषा", icon: "🤝", xp: 50, type: "quiz", stars: 3, description: "Understand body language basics" },
      { id: 4, name: "Speak Brave!", nameNp: "साहसले बोल्नुस्!", icon: "🎤", xp: 60, type: "lesson", stars: 3, description: "Build your confidence to speak up" },
      { id: 5, name: "Eye Contact", nameNp: "आँखा मिलाउनुस्", icon: "👁️", xp: 70, type: "challenge", stars: 3, description: "Practice making good eye contact" },
      { id: 6, name: "Storyteller", nameNp: "कथावाचक", icon: "📖", xp: 80, type: "lesson", stars: 3, description: "Tell amazing stories to friends" },
      { id: 7, name: "Ask Questions!", nameNp: "प्रश्न सोध्नुस्!", icon: "❓", xp: 90, type: "quiz", stars: 3, description: "Learn the power of asking good questions" },
      { id: 8, name: "Compliment Pro", nameNp: "तारिफ दिनुस्", icon: "🌟", xp: 100, type: "lesson", stars: 3, description: "Give and receive compliments gracefully" },
      { id: 9, name: "Handle Conflict", nameNp: "झगडा मिलाउनुस्", icon: "🕊️", xp: 110, type: "challenge", stars: 3, description: "Solve disagreements peacefully" },
      { id: 10, name: "Public Speaker!", nameNp: "सार्वजनिक वक्ता!", icon: "🏆", xp: 150, type: "boss", stars: 3, description: "BOSS LEVEL - Deliver a speech!", isBoss: true },
      { id: 11, name: "Interview Skills", nameNp: "अन्तर्वार्ता सीप", icon: "💼", xp: 120, type: "lesson", stars: 3, description: "Ace any interview or presentation" },
      { id: 12, name: "Master Communicator", nameNp: "संचार गुरु", icon: "👑", xp: 200, type: "boss", stars: 3, description: "FINAL BOSS - Become Communication Champion!", isBoss: true, isFinal: true },
    ]
  },
  money: {
    title: "Money Management",
    titleNp: "पैसाको ज्ञान",
    emoji: "💰",
    color: "#00AEEF",
    gradient: "linear-gradient(135deg,#00AEEF,#0081CF)",
    bgGlow: "rgba(0,174,239,0.3)",
    levels: [
      { id: 1, name: "What is Money?", nameNp: "पैसा के हो?", icon: "💵", xp: 30, type: "lesson", stars: 3, description: "Discover why money matters" },
      { id: 2, name: "Needs vs Wants", nameNp: "आवश्यकता र इच्छा", icon: "🛒", xp: 40, type: "quiz", stars: 3, description: "Learn the difference between needs and wants" },
      { id: 3, name: "Piggy Bank Hero", nameNp: "बचत नायक", icon: "🐷", xp: 50, type: "lesson", stars: 3, description: "Start saving your pocket money" },
      { id: 4, name: "Spend Wisely", nameNp: "बुद्धिमानीले खर्च", icon: "🛍️", xp: 60, type: "challenge", stars: 3, description: "Make smart spending decisions" },
      { id: 5, name: "Goal Saver", nameNp: "लक्ष्य बचत", icon: "🎯", xp: 70, type: "lesson", stars: 3, description: "Save for something you really want" },
      { id: 6, name: "50-30-20 Rule", nameNp: "५०-३०-२० नियम", icon: "📊", xp: 80, type: "quiz", stars: 3, description: "Learn the golden rule of money" },
      { id: 7, name: "Good Habits", nameNp: "राम्रा बानीहरू", icon: "✅", xp: 90, type: "lesson", stars: 3, description: "Build 5 powerful money habits" },
      { id: 8, name: "Earn It!", nameNp: "कमाउनुस्!", icon: "💪", xp: 100, type: "challenge", stars: 3, description: "Discover ways kids can earn money" },
      { id: 9, name: "Give Back", nameNp: "दान गर्नुस्", icon: "❤️", xp: 110, type: "lesson", stars: 3, description: "Learn the joy of giving" },
      { id: 10, name: "Budget Boss!", nameNp: "बजेट मालिक!", icon: "🏆", xp: 150, type: "boss", stars: 3, description: "BOSS LEVEL - Make a real budget!", isBoss: true },
      { id: 11, name: "Investment Intro", nameNp: "लगानी परिचय", icon: "📈", xp: 130, type: "lesson", stars: 3, description: "What does money growing mean?" },
      { id: 12, name: "Money Wizard", nameNp: "पैसा जादूगर", icon: "👑", xp: 200, type: "boss", stars: 3, description: "FINAL BOSS - Become Money Champion!", isBoss: true, isFinal: true },
    ]
  },
  personality: {
    title: "Personality Dev",
    titleNp: "व्यक्तित्व विकास",
    emoji: "🌟",
    color: "#3DBF6E",
    gradient: "linear-gradient(135deg,#3DBF6E,#2AAA5A)",
    bgGlow: "rgba(61,191,110,0.3)",
    levels: [
      { id: 1, name: "You Are Special!", nameNp: "तपाईं खास हुनुहुन्छ!", icon: "✨", xp: 30, type: "lesson", stars: 3, description: "Discover what makes you unique" },
      { id: 2, name: "Be Kind", nameNp: "दयालु बन्नुस्", icon: "❤️", xp: 40, type: "challenge", stars: 3, description: "Practice 3 acts of kindness today" },
      { id: 3, name: "Good Friends", nameNp: "राम्रा साथी", icon: "👫", xp: 50, type: "lesson", stars: 3, description: "How to make and keep great friends" },
      { id: 4, name: "Handle Feelings", nameNp: "भावना सम्हाल्नुस्", icon: "😊", xp: 60, type: "quiz", stars: 3, description: "Manage anger, sadness, and fear" },
      { id: 5, name: "Empathy Power", nameNp: "सहानुभूति शक्ति", icon: "🫂", xp: 70, type: "lesson", stars: 3, description: "Understand and care for others" },
      { id: 6, name: "Confidence Boost", nameNp: "आत्मविश्वास वृद्धि", icon: "💪", xp: 80, type: "challenge", stars: 3, description: "Build unshakeable confidence" },
      { id: 7, name: "Say Sorry", nameNp: "माफी माग्नुस्", icon: "🙏", xp: 90, type: "lesson", stars: 3, description: "Learn the power of apologizing" },
      { id: 8, name: "Be Grateful", nameNp: "कृतज्ञ बन्नुस्", icon: "🌸", xp: 100, type: "quiz", stars: 3, description: "Practice gratitude every day" },
      { id: 9, name: "Growth Mindset", nameNp: "वृद्धि मानसिकता", icon: "🧠", xp: 110, type: "lesson", stars: 3, description: "Turn failures into lessons" },
      { id: 10, name: "Leader Power!", nameNp: "नेतृत्व शक्ति!", icon: "🏆", xp: 150, type: "boss", stars: 3, description: "BOSS LEVEL - Show real leadership!", isBoss: true },
      { id: 11, name: "Help Others", nameNp: "अरूलाई मदत", icon: "🤲", xp: 120, type: "lesson", stars: 3, description: "Be a helper in your community" },
      { id: 12, name: "Super You!", nameNp: "सुपर तपाईं!", icon: "👑", xp: 200, type: "boss", stars: 3, description: "FINAL BOSS - Become Your Best Self!", isBoss: true, isFinal: true },
    ]
  },
  time: {
    title: "Time Management",
    titleNp: "समय व्यवस्थापन",
    emoji: "⏰",
    color: "#FFB800",
    gradient: "linear-gradient(135deg,#FFB800,#FF8C00)",
    bgGlow: "rgba(255,184,0,0.3)",
    levels: [
      { id: 1, name: "Time is Gold!", nameNp: "समय सुन हो!", icon: "⏱️", xp: 30, type: "lesson", stars: 3, description: "Why every minute matters" },
      { id: 2, name: "Morning Routine", nameNp: "बिहानको दिनचर्या", icon: "🌅", xp: 40, type: "challenge", stars: 3, description: "Create an awesome morning routine" },
      { id: 3, name: "Stop Wasting!", nameNp: "बर्बाद नगर्नुस्!", icon: "🚫", xp: 50, type: "quiz", stars: 3, description: "Identify and stop time wasters" },
      { id: 4, name: "Daily Schedule", nameNp: "दैनिक तालिका", icon: "📅", xp: 60, type: "lesson", stars: 3, description: "Build your perfect daily plan" },
      { id: 5, name: "Pomodoro Kid", nameNp: "पोमोडोरो बालक", icon: "🍅", xp: 70, type: "challenge", stars: 3, description: "25 min work + 5 min break method" },
      { id: 6, name: "Priority List", nameNp: "प्राथमिकता सूची", icon: "📋", xp: 80, type: "lesson", stars: 3, description: "Do important things first" },
      { id: 7, name: "No Procrastination", nameNp: "ढिलाइ नगर्नुस्", icon: "⚡", xp: 90, type: "quiz", stars: 3, description: "Stop delaying, start doing!" },
      { id: 8, name: "Weekend Warrior", nameNp: "सप्ताहन्त योद्धा", icon: "🎮", xp: 100, type: "lesson", stars: 3, description: "Balance fun and study on weekends" },
      { id: 9, name: "Sleep Schedule", nameNp: "सुत्ने तालिका", icon: "😴", xp: 110, type: "challenge", stars: 3, description: "8-10 hours sleep for kids" },
      { id: 10, name: "Time Master!", nameNp: "समय मालिक!", icon: "🏆", xp: 150, type: "boss", stars: 3, description: "BOSS LEVEL - Plan a full week!", isBoss: true },
      { id: 11, name: "Habit Tracker", nameNp: "बानी ट्र्याकर", icon: "📊", xp: 120, type: "lesson", stars: 3, description: "Track your daily habits" },
      { id: 12, name: "Time Champion", nameNp: "समय च्याम्पियन", icon: "👑", xp: 200, type: "boss", stars: 3, description: "FINAL BOSS - Master of Time!", isBoss: true, isFinal: true },
    ]
  },
  english: {
    title: "English Speaking",
    titleNp: "अङ्ग्रेजी बोल्ने",
    emoji: "🇬🇧",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
    bgGlow: "rgba(139,92,246,0.3)",
    levels: [
      { id: 1, name: "ABC Basics", nameNp: "ABC आधार", icon: "🔤", xp: 30, type: "lesson", stars: 3, description: "Foundation of English letters" },
      { id: 2, name: "Greetings!", nameNp: "अभिवादन!", icon: "👋", xp: 40, type: "quiz", stars: 3, description: "Hello, Good morning, Thank you!" },
      { id: 3, name: "My Family", nameNp: "मेरो परिवार", icon: "👨‍👩‍👧‍👦", xp: 50, type: "lesson", stars: 3, description: "Talk about your family in English" },
      { id: 4, name: "School Words", nameNp: "विद्यालय शब्द", icon: "🏫", xp: 60, type: "quiz", stars: 3, description: "Essential school vocabulary" },
      { id: 5, name: "Colors & Shapes", nameNp: "रंग र आकार", icon: "🎨", xp: 70, type: "challenge", stars: 3, description: "Learn colors and shapes in English" },
      { id: 6, name: "Tell A Story", nameNp: "कथा सुनाउनुस्", icon: "📖", xp: 80, type: "lesson", stars: 3, description: "Tell a story using simple English" },
      { id: 7, name: "Pronunciation", nameNp: "उच्चारण", icon: "🔊", xp: 90, type: "challenge", stars: 3, description: "Speak English clearly and confidently" },
      { id: 8, name: "Writing Skills", nameNp: "लेखन सीप", icon: "✏️", xp: 100, type: "lesson", stars: 3, description: "Write short English sentences" },
      { id: 9, name: "Conversation", nameNp: "कुराकानी", icon: "💬", xp: 110, type: "challenge", stars: 3, description: "Have a full English conversation" },
      { id: 10, name: "English Star!", nameNp: "अङ्ग्रेजी तारा!", icon: "🏆", xp: 150, type: "boss", stars: 3, description: "BOSS LEVEL - Full English speech!", isBoss: true },
      { id: 11, name: "Advanced Phrases", nameNp: "उन्नत वाक्यांश", icon: "🎓", xp: 120, type: "lesson", stars: 3, description: "Impress everyone with your English" },
      { id: 12, name: "English Champion", nameNp: "अङ्ग्रेजी च्याम्पियन", icon: "👑", xp: 200, type: "boss", stars: 3, description: "FINAL BOSS - English Master!", isBoss: true, isFinal: true },
    ]
  },
  gk: {
    title: "General Knowledge",
    titleNp: "जीवन कौशल",
    emoji: "🌍",
    color: "#F472B6",
    gradient: "linear-gradient(135deg,#F472B6,#EC4899)",
    bgGlow: "rgba(244,114,182,0.3)",
    levels: [
      { id: 1, name: "Beautiful Nepal", nameNp: "सुन्दर नेपाल", icon: "🇳🇵", xp: 30, type: "lesson", stars: 3, description: "Amazing facts about our country" },
      { id: 2, name: "Safe Online", nameNp: "अनलाइन सुरक्षित", icon: "🔐", xp: 40, type: "quiz", stars: 3, description: "5 rules to stay safe on internet" },
      { id: 3, name: "Healthy Body", nameNp: "स्वस्थ शरीर", icon: "🥗", xp: 50, type: "challenge", stars: 3, description: "Food and exercise for growing kids" },
      { id: 4, name: "Set Goals!", nameNp: "लक्ष्य राख्नुस्!", icon: "🎯", xp: 60, type: "lesson", stars: 3, description: "SMART goal setting for kids" },
      { id: 5, name: "Nepal Geography", nameNp: "नेपाल भूगोल", icon: "🏔️", xp: 70, type: "quiz", stars: 3, description: "Mountains, rivers, and cities" },
      { id: 6, name: "World Wonders", nameNp: "विश्व आश्चर्य", icon: "🌐", xp: 80, type: "lesson", stars: 3, description: "7 wonders of the world" },
      { id: 7, name: "Science Fun!", nameNp: "विज्ञान मनोरञ्जन!", icon: "🔬", xp: 90, type: "challenge", stars: 3, description: "Cool science facts for kids" },
      { id: 8, name: "Festivals!", nameNp: "चाडपर्वहरू!", icon: "🎉", xp: 100, type: "lesson", stars: 3, description: "Nepal's wonderful festivals" },
      { id: 9, name: "Environment", nameNp: "वातावरण", icon: "🌱", xp: 110, type: "quiz", stars: 3, description: "Protect our beautiful planet" },
      { id: 10, name: "GK Hero!", nameNp: "GK नायक!", icon: "🏆", xp: 150, type: "boss", stars: 3, description: "BOSS LEVEL - GK Mega Quiz!", isBoss: true },
      { id: 11, name: "Current Events", nameNp: "वर्तमान घटनाहरू", icon: "📰", xp: 120, type: "lesson", stars: 3, description: "Know what's happening around you" },
      { id: 12, name: "Life Champion", nameNp: "जीवन च्याम्पियन", icon: "👑", xp: 200, type: "boss", stars: 3, description: "FINAL BOSS - Life Skills Master!", isBoss: true, isFinal: true },
    ]
  }
};

// Mini game quiz questions per subject
const MINI_QUIZZES = {
  comm: [
    { q: "When meeting someone new, what should you do FIRST?", opts: ["Look away 😶", "Smile & say Hello! 👋", "Run away 🏃", "Stay quiet 🤫"], ans: 1, emoji: "🗣️" },
    { q: "Good listening means...", opts: ["Talk a lot 🗣️", "Look at phone 📱", "Pay full attention ✅", "Think of food 🍕"], ans: 2, emoji: "👂" },
    { q: "Body language includes:", opts: ["Words you say 💬", "Facial expressions 😊", "Singing songs 🎵", "Running fast 🏃"], ans: 1, emoji: "🤝" },
    { q: "To speak confidently, you should:", opts: ["Whisper always 🤫", "Look down 👇", "Speak clearly & smile 😊", "Never talk 🚫"], ans: 2, emoji: "💪" },
  ],
  money: [
    { q: "What is the difference between NEED and WANT?", opts: ["Same thing", "Need = must-have ✅", "Want is more important", "Neither matters"], ans: 1, emoji: "💰" },
    { q: "Rs. 100 pocket money - how much to SAVE?", opts: ["Rs. 10 💰", "Rs. 20 ✅", "Rs. 0 ❌", "All Rs. 100"], ans: 1, emoji: "🐷" },
    { q: "Best place to keep savings:", opts: ["Under pillow 🛏️", "Spend it all 🛍️", "Piggy bank / bank 🏦", "Give to friends"], ans: 2, emoji: "🏦" },
    { q: "The 50-30-20 rule means:", opts: ["School scores 📊", "Budget split 💰✅", "Time for sleep 😴", "Food portions 🍱"], ans: 1, emoji: "📊" },
  ],
  personality: [
    { q: "Empathy means:", opts: ["Being selfish 😠", "Understand others' feelings ❤️", "Ignoring people 🙄", "Crying always 😭"], ans: 1, emoji: "🌟" },
    { q: "A good friend...", opts: ["Is always mean", "Supports & is honest 👫", "Ignores you", "Copies everything"], ans: 1, emoji: "👫" },
    { q: "When you feel angry, BEST thing to do:", opts: ["Shout at all! 😤", "Deep breaths 🧘✅", "Break things 💥", "Eat lots of food 🍕"], ans: 1, emoji: "😊" },
    { q: "Growth mindset means:", opts: ["Never making mistakes", "Learning from mistakes ✅", "Being perfect", "Giving up fast"], ans: 1, emoji: "🧠" },
  ],
  time: [
    { q: "Pomodoro technique is:", opts: ["25 min work + 5 min break 🍅✅", "Study all night 😴", "Play all day 🎮", "No schedule"], ans: 0, emoji: "⏰" },
    { q: "Procrastination means:", opts: ["Working fast ⚡", "Delaying tasks 😴✅", "Playing sports 🏃", "Reading books 📚"], ans: 1, emoji: "🚫" },
    { q: "Best time to do homework:", opts: ["After midnight 🌙", "Right after school ✅", "Never 🚫", "Only weekends"], ans: 1, emoji: "📚" },
    { q: "A good daily schedule helps you:", opts: ["Waste time ⏳", "Be organized ✅", "Skip school 🏫", "Sleep more 😴"], ans: 1, emoji: "📅" },
  ],
  english: [
    { q: "How do you say 'मेरो नाम' in English?", opts: ["My place is 🏠", "My name is ✅", "I am from 🗺️", "My age is 🎂"], ans: 1, emoji: "🇬🇧" },
    { q: "Which sentence is CORRECT?", opts: ["I is happy 😅", "She are going 🙄", "He is my friend ✅", "They was there"], ans: 2, emoji: "✏️" },
    { q: "'Thank you' को नेपाली अर्थ:", opts: ["माफ गर्नुस् 🙏", "शुभ प्रभात 🌅", "धन्यवाद ✅", "नमस्ते 👋"], ans: 2, emoji: "🙏" },
    { q: "'Introduce yourself' means:", opts: ["Show your pet 🐕", "Tell who you are ✅", "Introduce food 🍕", "Nothing 🤷"], ans: 1, emoji: "💬" },
  ],
  gk: [
    { q: "नेपालको राजधानी? (Capital of Nepal?)", opts: ["Pokhara 🌊", "Butwal 🏙️", "Kathmandu 🏔️ ✅", "Biratnagar"], ans: 2, emoji: "🇳🇵" },
    { q: "Staying safe online means:", opts: ["Share password 🔑", "Post your address 🏠", "Never share personal info ✅", "Click all links 🖱️"], ans: 2, emoji: "🔐" },
    { q: "Healthy sleep for children is:", opts: ["4 hours 😴", "6 hours 🌙", "8-10 hours ✅", "2 hours only"], ans: 2, emoji: "😴" },
    { q: "Mount Everest is in:", opts: ["China only 🇨🇳", "India 🇮🇳", "Nepal 🇳🇵 ✅", "Pakistan"], ans: 2, emoji: "🏔️" },
  ],
};

// ══════════════════════════════════════════════
// CHILD-SAFE AI TUTOR (using Anthropic API)
// ══════════════════════════════════════════════
const CHILD_SAFE_SYSTEM_PROMPT = `You are Gyan Guru, a friendly AI teacher ONLY for children aged 6-14 years old.

STRICT RULES - NEVER BREAK THESE:
1. ONLY answer questions about: school subjects, learning, Nepal, nature, animals, sports, games, creativity, friendship, kindness, health for kids, general knowledge for children.
2. NEVER discuss: adult topics, romance, violence, scary content, weapons, drugs, politics, religion debates, inappropriate relationships, anything not suitable for children.
3. If ANY adult/inappropriate topic is asked, respond ONLY with: "🚫 यो प्रश्न बच्चाहरूको लागि उपयुक्त छैन! | This question is not for children! Let's talk about something fun to learn! 🌟"
4. ALWAYS respond in a mix of simple English and Nepali.
5. Use LOTS of emojis 🌟🎉✨ to make learning fun!
6. Keep responses SHORT (3-5 sentences max) and SIMPLE for kids.
7. Always end with an encouraging question to keep the child learning.
8. Address the child warmly as "friend" or "साथी".

You make learning FUN and SAFE for children! 🎓🌈`;

// ══════════════════════════════════════════════
// REWARD SYSTEM
// ══════════════════════════════════════════════
const BADGES = [
  { id: "first_win", icon: "🌟", name: "First Star!", condition: (xp) => xp >= 30 },
  { id: "explorer", icon: "🗺️", name: "Explorer", condition: (xp) => xp >= 100 },
  { id: "learner", icon: "📚", name: "Super Learner", condition: (xp) => xp >= 300 },
  { id: "champion", icon: "🏆", name: "Champion", condition: (xp) => xp >= 500 },
  { id: "legend", icon: "👑", name: "Legend", condition: (xp) => xp >= 1000 },
];

// ══════════════════════════════════════════════
// ANIMATIONS CSS
// ══════════════════════════════════════════════
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

@keyframes pop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
@keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-6px); } 75% { transform: translateX(6px); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-8px); } }
@keyframes glow { 0%,100% { box-shadow: 0 0 10px rgba(255,184,0,0.5); } 50% { box-shadow: 0 0 25px rgba(255,184,0,0.9); } }
@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes starBurst { 0% { transform: scale(0) rotate(0deg); opacity: 1; } 100% { transform: scale(2) rotate(180deg); opacity: 0; } }
@keyframes confetti { 0% { transform: translateY(-20px) rotate(0deg); opacity: 1; } 100% { transform: translateY(80px) rotate(360deg); opacity: 0; } }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }

* { box-sizing: border-box; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 4px; }

.card-hover { transition: transform 0.2s, box-shadow 0.2s; }
.card-hover:hover { transform: translateY(-4px) scale(1.02); }
.card-hover:active { transform: scale(0.97); }

.btn-bounce:active { animation: bounce 0.4s; }
.pop-in { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.slide-up { animation: slideUp 0.35s ease-out; }
.floating { animation: float 3s ease-in-out infinite; }
.pulsing { animation: pulse 2s ease-in-out infinite; }

.shimmer-text {
  background: linear-gradient(90deg, #FFB800, #FF6B6B, #8B5CF6, #00AEEF, #FFB800);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

.boss-glow { animation: glow 1.5s ease-in-out infinite; }

.level-locked { opacity: 0.45; filter: grayscale(0.7); }
.level-completed { opacity: 1; }
`;

// ══════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("home"); // home | subject | level | quiz | tutor | profile
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeLevel, setActiveLevel] = useState(null);
  const [totalXP, setTotalXP] = useState(240);
  const [completedLevels, setCompletedLevels] = useState({ comm: [1,2], money: [1], personality: [1], time: [], english: [1,2,3], gk: [1] });
  const [showReward, setShowReward] = useState(null); // {xp, message}
  const [tab, setTab] = useState("home");
  const [streakDays, setStreakDays] = useState(7);
  const [lang, setLang] = useState("en"); // "en" | "np"

  const addXP = useCallback((amount) => {
    setTotalXP(p => p + amount);
    setShowReward({ xp: amount, message: amount >= 150 ? "🏆 BOSS DEFEATED!" : amount >= 100 ? "⭐ AMAZING!" : "🌟 GREAT JOB!" });
    setTimeout(() => setShowReward(null), 2500);
  }, []);

  const completeLevel = useCallback((subjectKey, levelId, xp) => {
    setCompletedLevels(prev => ({
      ...prev,
      [subjectKey]: [...new Set([...(prev[subjectKey] || []), levelId])]
    }));
    addXP(xp);
  }, [addXP]);

  const handleTabChange = (t) => {
    setTab(t);
    if (t === "home") setView("home");
    else if (t === "learn") setView("subjects");
    else if (t === "tutor") setView("tutor");
    else if (t === "profile") setView("profile");
  };

  const playerLevel = Math.floor(totalXP / 200) + 1;
  const xpForNextLevel = playerLevel * 200;
  const xpProgress = ((totalXP % 200) / 200) * 100;

  return (
    <LangContext.Provider value={{ lang, setLang }}>
    <div style={{ minHeight: "100vh", background: "#0F0F1E", fontFamily: "'Nunito',sans-serif", color: "#fff", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 76, overflow: "hidden" }}>
      <style>{CSS}</style>

      {/* XP Reward Popup */}
      {showReward && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 999, textAlign: "center", pointerEvents: "none" }} className="pop-in">
          <div style={{ background: "linear-gradient(135deg,#FFB800,#FF6B6B)", borderRadius: 24, padding: "20px 36px", boxShadow: "0 20px 60px rgba(255,184,0,0.5)" }}>
            <div style={{ fontSize: 48, marginBottom: 4 }}>🎉</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color: "#fff" }}>{showReward.message}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginTop: 4 }}>+{showReward.xp} XP ✨</div>
          </div>
        </div>
      )}

      {/* TOP BAR */}
      <TopBar totalXP={totalXP} playerLevel={playerLevel} xpProgress={xpProgress} xpForNextLevel={xpForNextLevel} streakDays={streakDays} />

      {/* VIEWS */}
      <div style={{ overflowY: "auto", height: "calc(100vh - 136px)" }}>
        {view === "home" && <HomeView totalXP={totalXP} playerLevel={playerLevel} streakDays={streakDays} completedLevels={completedLevels} onOpenSubject={(key) => { setActiveSubject(key); setView("subject"); setTab("learn"); }} onOpenTutor={() => { setTab("tutor"); setView("tutor"); }} />}
        {view === "subjects" && <SubjectsView onOpenSubject={(key) => { setActiveSubject(key); setView("subject"); }} completedLevels={completedLevels} />}
        {view === "subject" && activeSubject && <SubjectMapView subjectKey={activeSubject} completedLevels={completedLevels[activeSubject] || []} onBack={() => { setView("home"); setTab("home"); }} onPlayLevel={(level) => { setActiveLevel(level); setView("quiz"); }} totalXP={totalXP} />}
        {view === "quiz" && activeLevel && activeSubject && <GameLevelView subjectKey={activeSubject} level={activeLevel} onBack={() => setView("subject")} onComplete={(xp) => { completeLevel(activeSubject, activeLevel.id, xp); setView("subject"); }} />}
        {view === "tutor" && <SafeAITutorView onBack={() => { setView("home"); setTab("home"); }} />}
        {view === "profile" && <ProfileView totalXP={totalXP} playerLevel={playerLevel} completedLevels={completedLevels} streakDays={streakDays} />}
      </div>

      {/* BOTTOM NAV */}
      <BottomNav activeTab={tab} onChange={handleTabChange} />
    </div>
    </LangContext.Provider>
  );
}

// ══════════════════════════════════════════════
// TOP BAR (with Language Toggle)
// ══════════════════════════════════════════════
function TopBar({ totalXP, playerLevel, xpProgress, xpForNextLevel, streakDays }) {
  const { lang, setLang } = useLang();
  return (
    <div style={{ background: "linear-gradient(180deg,#1A1A3E 0%,#0F0F1E 100%)", padding: "12px 16px 10px", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF6B6B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, border: "2px solid rgba(255,255,255,0.2)" }} className="floating">🌟</div>
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, letterSpacing: 0.5 }} className="shimmer-text">GyanTara</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>ज्ञान तारा • Learn & Grow</div>
          </div>
        </div>
        {/* Right side: streak + xp + LANGUAGE TOGGLE */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <div style={{ background: "rgba(255,184,0,0.15)", border: "1px solid rgba(255,184,0,0.4)", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12 }}>🔥</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FFB800" }}>{streakDays}d</span>
          </div>
          <div style={{ background: "rgba(255,184,0,0.15)", border: "1px solid rgba(255,184,0,0.4)", borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 12 }}>⭐</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#FFB800" }}>{totalXP} XP</span>
          </div>
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "np" : "en")}
            style={{
              background: lang === "np" ? "linear-gradient(135deg,#FF6B6B,#FFB800)" : "linear-gradient(135deg,#8B5CF6,#00AEEF)",
              border: "none", borderRadius: 20, padding: "4px 10px",
              display: "flex", alignItems: "center", gap: 4,
              cursor: "pointer", transition: "all 0.25s", boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
            }}
            title="Switch Language / भाषा बदल्नुस्"
          >
            <span style={{ fontSize: 13 }}>{lang === "en" ? "🇳🇵" : "🇬🇧"}</span>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>{lang === "en" ? "NP" : "EN"}</span>
          </button>
        </div>
      </div>
      {/* XP bar */}
      <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 10, height: 6, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${xpProgress}%`, background: "linear-gradient(90deg,#FFB800,#FF6B6B)", borderRadius: 10, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>Level {playerLevel}</span>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>{totalXP}/{xpForNextLevel} XP</span>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// HOME VIEW (Redesigned + Bilingual)
// ══════════════════════════════════════════════
function HomeView({ totalXP, playerLevel, streakDays, completedLevels, onOpenSubject, onOpenTutor }) {
  const { lang } = useLang();
  const totalCompleted = Object.values(completedLevels).reduce((a, arr) => a + arr.length, 0);

  const greetings = lang === "np"
    ? ["नमस्ते च्याम्पियन! 👋", "आज के सिक्ने? 🌟", "तयार हुनुहुन्छ? ⚔️"]
    : ["Hello Champion! 👋", "Ready to Learn? 🌟", "Let's Play! ⚔️"];
  const greeting = greetings[Math.floor(Date.now() / 10000) % 3];

  return (
    <div className="slide-up">
      {/* ── Hero Banner ── */}
      <div style={{ background: "linear-gradient(135deg,#1A1A3E 0%,#0F3460 60%,#16213E 100%)", padding: "22px 16px 28px", position: "relative", overflow: "hidden" }}>
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,184,0,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.08)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 20, left: "50%", width: 80, height: 80, borderRadius: "50%", background: "rgba(0,174,239,0.05)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          {/* Flag + greeting */}
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🇳🇵</span>
            <span>{lang === "np" ? "नमस्ते / Hello" : "नमस्ते / Hello"}</span>
          </div>

          {/* Big headline */}
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, lineHeight: 1.2, marginBottom: 6 }}>
            {lang === "np" ? "आज के सिक्ने?" : "Ready to Level Up?"} <span style={{ fontSize: 28 }}>🚀</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 18 }}>
            {lang === "np" ? "खेलेर सिक्नुस् • मजाले पढ्नुस्!" : "Learn by playing • Have fun growing!"}
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {[
              { icon: "🔥", val: `${streakDays}`, label: lang === "np" ? "दिन" : "Days", sub: lang === "np" ? "स्ट्रीक" : "Streak" },
              { icon: "⭐", val: `${totalXP}`, label: "XP", sub: lang === "np" ? "कमाएको" : "Earned" },
              { icon: "🎯", val: `${totalCompleted}`, label: lang === "np" ? "तह" : "Levels", sub: lang === "np" ? "सकियो" : "Done" },
              { icon: "👑", val: `${playerLevel}`, label: lang === "np" ? "लेभल" : "Level", sub: lang === "np" ? "खेलाडी" : "Player" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "10px 6px", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ fontSize: 16, marginBottom: 2 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#FFB800" }}>{s.val}</div>
                <div style={{ fontSize: 8, color: "rgba(255,255,255,0.5)", fontWeight: 700 }}>{s.label}</div>
                <div style={{ fontSize: 7, color: "rgba(255,255,255,0.3)", fontWeight: 600 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Daily Challenge ── */}
      <div style={{ padding: "16px 16px 6px", fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
        <span>⚡</span>
        <span>{lang === "np" ? "आजको चुनौती" : "Daily Challenge"}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, marginLeft: 2 }}>{lang === "np" ? "• आजको मिशन" : "• Today's Mission"}</span>
      </div>
      <div onClick={() => onOpenSubject("comm")} style={{ margin: "0 16px 18px", background: "linear-gradient(135deg,#FF6B6B,#8B5CF6)", borderRadius: 20, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 8px 30px rgba(255,107,107,0.3)" }} className="card-hover btn-bounce">
        <div style={{ width: 54, height: 54, borderRadius: 16, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, flexShrink: 0 }} className="floating">🎤</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 3 }}>
            {lang === "np" ? "आजको मिशन" : "Daily Mission"}
          </div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, marginBottom: 3 }}>
            {lang === "np" ? "साहसले बोल्नुस्! 🗣️" : "Speak Up Challenge! 🗣️"}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, padding: "2px 8px", fontSize: 10, fontWeight: 700 }}>+50 XP</span>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
              {lang === "np" ? "५ मिनेट • अभी खेल्नुस्!" : "5 minutes • Play now!"}
            </span>
          </div>
        </div>
        <span style={{ fontSize: 22, opacity: 0.6 }}>›</span>
      </div>

      {/* ── Subject Cards ── */}
      <div style={{ padding: "0 16px 8px", fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
        <span>🎮</span>
        <span>{lang === "np" ? "विषय छान्नुस्" : "Choose Your Adventure"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "8px 16px 16px" }}>
        {Object.entries(LEVELS_DATA).map(([key, s]) => {
          const done = (completedLevels[key] || []).length;
          const total = s.levels.length;
          const pct = Math.round((done / total) * 100);
          return (
            <div key={key} onClick={() => onOpenSubject(key)} style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))", borderRadius: 20, padding: 14, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden", minHeight: 120 }} className="card-hover btn-bounce">
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: s.gradient, borderRadius: "20px 20px 0 0" }} />
              <div style={{ fontSize: 32, marginBottom: 8 }} className="floating">{s.emoji}</div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 13, lineHeight: 1.2, marginBottom: 2 }}>
                {lang === "np" ? s.titleNp : s.title}
              </div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.45)", fontWeight: 700, marginBottom: 10 }}>
                {lang === "np" ? s.title : s.titleNp}
              </div>
              {/* Progress */}
              <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 10, height: 5, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: s.gradient, borderRadius: 10, transition: "width 0.6s" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>
                  {done}/{total} {lang === "np" ? "तह" : "levels"}
                </span>
                <span style={{ fontSize: 9, fontWeight: 800, color: pct === 100 ? "#4ade80" : "rgba(255,255,255,0.4)" }}>{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── AI Tutor Button ── */}
      <div style={{ padding: "0 16px 24px" }}>
        <div onClick={onOpenTutor} style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.2),rgba(0,174,239,0.2))", border: "1px solid rgba(139,92,246,0.4)", borderRadius: 20, padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14 }} className="card-hover btn-bounce">
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#00AEEF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }} className="pulsing">🤖</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, marginBottom: 3 }}>Gyan Guru AI Tutor</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>
              {lang === "np" ? "कुनै पनि सोध्नुस्! 🔒 बच्चाहरूको लागि सुरक्षित" : "Ask me anything! 🔒 Safe for kids"}
            </div>
          </div>
          <span style={{ fontSize: 20, opacity: 0.5 }}>›</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// SUBJECTS VIEW
// ══════════════════════════════════════════════
function SubjectsView({ onOpenSubject, completedLevels }) {
  const { lang } = useLang();
  return (
    <div className="slide-up" style={{ padding: 14 }}>
      <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, marginBottom: 14, textAlign: "center" }}>
        🎮 {lang === "np" ? "सबै यात्राहरू" : "All Adventures"}
      </div>
      {Object.entries(LEVELS_DATA).map(([key, s]) => {
        const done = (completedLevels[key] || []).length;
        const total = s.levels.length;
        return (
          <div key={key} onClick={() => onOpenSubject(key)} style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))", borderRadius: 18, padding: 14, marginBottom: 12, cursor: "pointer", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 14 }} className="card-hover btn-bounce">
            <div style={{ width: 52, height: 52, borderRadius: 14, background: s.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>{s.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, marginBottom: 2 }}>{lang === "np" ? s.titleNp : s.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 700, marginBottom: 6 }}>
                {done}/{total} {lang === "np" ? "तह" : "levels"} • {lang === "np" ? s.title : s.titleNp}
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, height: 6, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round((done/total)*100)}%`, background: s.gradient, transition: "width 0.6s" }} />
              </div>
            </div>
            <span style={{ fontSize: 18, opacity: 0.4 }}>›</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════
// SUBJECT MAP VIEW (Level select - like a game map)
// ══════════════════════════════════════════════
function SubjectMapView({ subjectKey, completedLevels, onBack, onPlayLevel }) {
  const s = LEVELS_DATA[subjectKey];
  const { lang } = useLang();
  
  return (
    <div className="slide-up">
      {/* Header */}
      <div style={{ background: s.gradient, padding: "14px 16px 20px", borderRadius: "0 0 28px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 12, padding: "6px 14px", cursor: "pointer", fontWeight: 700, fontSize: 12, fontFamily: "'Nunito',sans-serif", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          ← {lang === "np" ? "पछाडि" : "Back"}
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 40 }} className="floating">{s.emoji}</div>
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#fff" }}>{lang === "np" ? s.titleNp : s.title}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 700 }}>
              {lang === "np" ? s.title : s.titleNp} • {completedLevels.length}/{s.levels.length} {lang === "np" ? "तह सकियो" : "levels done"}
            </div>
          </div>
        </div>
      </div>

      {/* Level Map */}
      <div style={{ padding: "16px 16px 24px" }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 14, marginBottom: 14, color: "rgba(255,255,255,0.7)", textAlign: "center" }}>
          🗺️ {lang === "np" ? "तपाईंको यात्रा नक्शा" : "Your Adventure Map"}
        </div>
        {s.levels.map((level, i) => {
          const isDone = completedLevels.includes(level.id);
          const isUnlocked = level.id === 1 || completedLevels.includes(level.id - 1);
          const isLocked = !isUnlocked;

          return (
            <div key={level.id} style={{ marginBottom: 10 }}>
              {/* Connector line */}
              {i > 0 && (
                <div style={{ width: 2, height: 12, background: isDone ? s.color : "rgba(255,255,255,0.1)", margin: "0 auto -2px", borderRadius: 2, marginLeft: level.isBoss ? "50%" : i % 2 === 0 ? "30%" : "70%" }} />
              )}
              <div
                onClick={() => !isLocked && onPlayLevel(level)}
                style={{
                  background: isDone ? `linear-gradient(135deg,${s.color}33,${s.color}11)` : level.isBoss ? "linear-gradient(135deg,rgba(255,184,0,0.15),rgba(255,107,107,0.1))" : "rgba(255,255,255,0.05)",
                  border: isDone ? `2px solid ${s.color}` : level.isBoss ? "2px solid rgba(255,184,0,0.5)" : isLocked ? "2px solid rgba(255,255,255,0.06)" : "2px solid rgba(255,255,255,0.15)",
                  borderRadius: level.isBoss ? 20 : 16,
                  padding: level.isBoss ? "14px 18px" : "12px 16px",
                  cursor: isLocked ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  marginLeft: level.isBoss ? 0 : i % 2 === 0 ? 0 : 30,
                  marginRight: level.isBoss ? 0 : i % 2 === 0 ? 30 : 0,
                  transition: "all 0.2s",
                  boxShadow: isDone ? `0 4px 15px ${s.bgGlow || "rgba(0,0,0,0.3)"}` : level.isBoss ? "0 4px 20px rgba(255,184,0,0.2)" : "none",
                }}
                className={`${isLocked ? "level-locked" : "card-hover btn-bounce"} ${level.isBoss ? "boss-glow" : ""}`}
              >
                {/* Level icon */}
                <div style={{ width: level.isBoss ? 52 : 44, height: level.isBoss ? 52 : 44, borderRadius: level.isBoss ? 14 : 12, background: isDone ? s.gradient : level.isBoss ? "linear-gradient(135deg,#FFB800,#FF6B6B)" : "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: level.isBoss ? 26 : 22, flexShrink: 0, border: level.isBoss ? "2px solid rgba(255,255,255,0.3)" : "none" }}>
                  {isLocked ? "🔒" : isDone ? "✅" : level.icon}
                </div>

                {/* Level info */}
                <div style={{ flex: 1 }}>
                  {level.isBoss && <div style={{ fontSize: 9, fontWeight: 800, color: "#FFB800", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>⚔️ {lang === "np" ? "बस लेभल" : "BOSS LEVEL"}</div>}
                  <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: level.isBoss ? 15 : 13, color: isLocked ? "rgba(255,255,255,0.3)" : "#fff", marginBottom: 2 }}>
                    {lang === "np" ? level.nameNp : level.name}
                  </div>
                  <div style={{ fontSize: 10, color: isLocked ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: 4 }}>
                    {lang === "np" ? level.name : level.nameNp}
                  </div>
                  {!isLocked && (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontSize: 9, color: isDone ? "#4ade80" : "#FFB800", fontWeight: 800 }}>
                        {isDone ? `✅ ${lang === "np" ? "सकियो!" : "Done!"}` : `+${level.xp} XP`}
                      </span>
                      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)" }}>•</span>
                      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.35)", fontWeight: 700 }}>
                        {level.type === "boss" ? "⚔️ Boss Fight" : level.type === "quiz" ? "❓ Quiz" : level.type === "challenge" ? "🎯 Challenge" : "📖 Lesson"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stars */}
                {isDone && (
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1,2,3].map(n => <span key={n} style={{ fontSize: 14 }}>⭐</span>)}
                  </div>
                )}
                {!isLocked && !isDone && (
                  <div style={{ background: s.gradient, borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap" }}>
                    {level.isBoss ? `⚔️ ${lang === "np" ? "लड!" : "Fight!"}` : `▶ ${lang === "np" ? "खेल" : "Play"}`}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// GAME LEVEL VIEW (Mini game with quiz + lesson)
// ══════════════════════════════════════════════
function GameLevelView({ subjectKey, level, onBack, onComplete }) {
  const s = LEVELS_DATA[subjectKey];
  const { lang } = useLang();
  const questions = MINI_QUIZZES[subjectKey] || MINI_QUIZZES.comm;
  const [phase, setPhase] = useState("intro"); // intro | question | result | complete
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [combo, setCombo] = useState(0);
  const [showBonus, setShowBonus] = useState(null);

  const currentQ = questions[qIdx % questions.length];

  const handleAnswer = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    const correct = i === currentQ.ans;
    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      setScore(s => s + 1);
      if (newCombo >= 2) setShowBonus(`🔥 ${newCombo}x COMBO!`);
    } else {
      setCombo(0);
      setHearts(h => Math.max(0, h - 1));
      setShowBonus("❌ Wrong!");
    }
    setTimeout(() => {
      setShowBonus(null);
      if (qIdx + 1 >= 4 || hearts <= 1 && !correct) {
        setPhase("complete");
      } else {
        setChosen(null);
        setQIdx(x => x + 1);
      }
    }, 1200);
  };

  const earnedXP = Math.round(level.xp * (score / 4) + (score === 4 ? level.xp * 0.5 : 0));

  if (phase === "intro") {
    return (
      <div style={{ padding: 20, textAlign: "center" }} className="pop-in">
        <div style={{ background: s.gradient, borderRadius: 28, padding: "28px 20px", marginBottom: 20, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ fontSize: 64, marginBottom: 12 }} className="floating">{level.icon}</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: "#fff", marginBottom: 6 }}>{lang === "np" ? level.nameNp : level.name}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600, marginBottom: 16 }}>{level.description}</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
            {[
              { icon: "❤️", val: lang === "np" ? "३ जीवन" : "3 Lives", label: "lives" },
              { icon: "⭐", val: `${level.xp} XP`, label: "max xp" },
              { icon: "❓", val: lang === "np" ? "४ सवाल" : "4 Questions", label: "questions" }
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 16 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 12, color: "#fff" }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
        {level.isBoss && (
          <div style={{ background: "rgba(255,184,0,0.1)", border: "2px solid rgba(255,184,0,0.4)", borderRadius: 16, padding: 14, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#FFB800", marginBottom: 4 }}>⚔️ {lang === "np" ? "बस लडाई!" : "BOSS BATTLE!"}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              {lang === "np" ? "यो कठिन चुनौती हो! सही जवाफ दिएर बस जित्नुस्! 💪" : "This is a tough challenge! Answer correctly to defeat the boss! 💪"}
            </div>
          </div>
        )}
        <button onClick={() => setPhase("question")} style={{ background: s.gradient, color: "#fff", border: "none", borderRadius: 20, padding: "14px 36px", fontFamily: "'Fredoka One',cursive", fontSize: 18, cursor: "pointer", boxShadow: `0 8px 25px ${s.bgGlow}`, width: "100%" }} className="btn-bounce">
          {level.isBoss ? `⚔️ ${lang === "np" ? "बस लडाई सुरु!" : "Start Boss Battle!"}` : `▶ ${lang === "np" ? "तह सुरु!" : "Start Level!"}`}
        </button>
        <button onClick={onBack} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", borderRadius: 16, padding: "10px 24px", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "'Nunito',sans-serif", marginTop: 10, width: "100%" }}>
          ← {lang === "np" ? "नक्शामा फर्कनुस्" : "Back to Map"}
        </button>
      </div>
    );
  }

  if (phase === "complete") {
    const pct = Math.round((score / 4) * 100);
    const stars = score >= 4 ? 3 : score >= 3 ? 2 : 1;
    return (
      <div style={{ padding: 20, textAlign: "center" }} className="pop-in">
        <div style={{ background: pct >= 75 ? "linear-gradient(135deg,#3DBF6E,#00AEEF)" : "linear-gradient(135deg,#FFB800,#FF8C00)", borderRadius: 28, padding: "28px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{pct >= 100 ? "🏆" : pct >= 75 ? "⭐" : "💪"}</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#fff", marginBottom: 4 }}>
            {pct >= 100
              ? (lang === "np" ? "एकदम सही! 🎉" : "PERFECT! 🎉")
              : pct >= 75
              ? (lang === "np" ? "शाबास! 🌟" : "GREAT JOB! 🌟")
              : (lang === "np" ? "जारी राख्नुस्! 💪" : "KEEP GOING! 💪")}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
            {[1,2,3].map(n => <span key={n} style={{ fontSize: 28, opacity: n <= stars ? 1 : 0.3 }}>⭐</span>)}
          </div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#fff" }}>
            {score}/4 {lang === "np" ? "सही!" : "correct!"}
          </div>
        </div>
        <div style={{ background: "rgba(255,184,0,0.15)", border: "2px solid rgba(255,184,0,0.4)", borderRadius: 20, padding: "12px 20px", marginBottom: 20, display: "inline-block" }}>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#FFB800" }}>+{earnedXP > 0 ? earnedXP : 10} XP Earned! ⭐</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onComplete(earnedXP > 0 ? earnedXP : 10)} style={{ flex: 1, background: s.gradient, color: "#fff", border: "none", borderRadius: 16, padding: "14px", fontFamily: "'Fredoka One',cursive", fontSize: 16, cursor: "pointer" }} className="btn-bounce">
            ✅ {lang === "np" ? "इनाम लिनुस्!" : "Claim Reward!"}
          </button>
          <button onClick={() => { setPhase("intro"); setQIdx(0); setScore(0); setHearts(3); setCombo(0); setChosen(null); }} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 16, padding: "14px", fontFamily: "'Fredoka One',cursive", fontSize: 16, cursor: "pointer" }}>
            🔄 {lang === "np" ? "फेरि प्रयास" : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-up">
      {/* Game Header */}
      <div style={{ background: s.gradient, padding: "12px 16px", borderRadius: "0 0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 10, padding: "5px 10px", cursor: "pointer", fontWeight: 700, fontFamily: "'Nunito',sans-serif", fontSize: 12 }}>✕</button>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#fff" }}>Q {qIdx + 1} / 4</div>
          <div style={{ display: "flex", gap: 3 }}>
            {[1,2,3].map(n => <span key={n} style={{ fontSize: 18, opacity: n <= hearts ? 1 : 0.25 }}>❤️</span>)}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.25)", borderRadius: 10, height: 8, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${(qIdx / 4) * 100}%`, background: "rgba(255,255,255,0.8)", borderRadius: 10, transition: "width 0.5s" }} />
        </div>
        {combo >= 2 && <div style={{ textAlign: "center", fontFamily: "'Fredoka One',cursive", fontSize: 12, color: "#fff", marginTop: 4 }}>🔥 {combo}x Combo!</div>}
      </div>

      {/* Bonus popup */}
      {showBonus && (
        <div style={{ textAlign: "center", padding: "8px 0", fontFamily: "'Fredoka One',cursive", fontSize: 18, color: showBonus.includes("❌") ? "#FF6B6B" : "#FFB800" }} className="pop-in">
          {showBonus}
        </div>
      )}

      <div style={{ padding: 16 }}>
        {/* Question */}
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 18, marginBottom: 14, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>{currentQ.emoji}</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, lineHeight: 1.4, color: "#fff" }}>{currentQ.q}</div>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {currentQ.opts.map((opt, i) => {
            let bg = "rgba(255,255,255,0.05)";
            let border = "1.5px solid rgba(255,255,255,0.12)";
            let textCol = "#fff";
            if (chosen !== null) {
              if (i === currentQ.ans) { bg = "rgba(61,191,110,0.25)"; border = "2px solid #3DBF6E"; textCol = "#4ade80"; }
              else if (i === chosen && chosen !== currentQ.ans) { bg = "rgba(255,107,107,0.2)"; border = "2px solid #FF6B6B"; textCol = "#FF6B6B"; }
            }
            return (
              <button key={i} onClick={() => handleAnswer(i)} style={{ background: bg, border, borderRadius: 16, padding: "13px 16px", fontWeight: 700, fontSize: 13, color: textCol, cursor: chosen !== null ? "default" : "pointer", transition: "all 0.2s", textAlign: "left", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 12 }} className={chosen === null ? "card-hover" : ""}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0, color: textCol }}>{"ABCD"[i]}</div>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Score display */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, padding: "10px 14px", background: "rgba(255,255,255,0.04)", borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)" }}>Score: {score}/4</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#FFB800" }}>Max XP: +{level.xp}</span>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// SAFE AI TUTOR VIEW
// ══════════════════════════════════════════════
function SafeAITutorView({ onBack }) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "नमस्ते साथी! 🙏 Hello friend!\n\nI am Gyan Guru — your safe AI teacher! 🤖✨\n\nI can help you with:\n📚 School subjects\n🇳🇵 Nepal facts\n🌍 General knowledge\n🎯 Fun learning games\n\nAsk me ANYTHING! / कुनै पनि सोध्नुस्! 🌟" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  const sendMsg = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-8).map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: CHILD_SAFE_SYSTEM_PROMPT,
          messages: [...history, { role: "user", content: userMsg }],
        })
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || "Oops! Try again! 😅";
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "bot", text: "Connection problem 😅 Please try again!\nसम्पर्क समस्या भयो!" }]);
    }
    setLoading(false);
  };

  const quickTopics = ["🇳🇵 Nepal facts", "📐 Math help", "🦁 Animals", "🌍 World GK", "🎯 Learning tips", "😊 Be kind"];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 136px)" }} className="slide-up">
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#8B5CF6,#00AEEF)", padding: "14px 16px", borderRadius: "0 0 20px 20px", flexShrink: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 10, padding: "5px 12px", cursor: "pointer", fontWeight: 700, fontSize: 11, fontFamily: "'Nunito',sans-serif", marginBottom: 8 }}>← Back</button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "2px solid rgba(255,255,255,0.4)" }} className="pulsing">🤖</div>
          <div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#fff" }}>Gyan Guru AI</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              🔒 Safe for kids • बच्चाहरूको लागि सुरक्षित
            </div>
          </div>
        </div>
      </div>

      {/* Quick topics */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 14px 4px", scrollbarWidth: "none", flexShrink: 0 }}>
        {quickTopics.map(t => (
          <button key={t} onClick={() => sendMsg(t)} style={{ whiteSpace: "nowrap", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.8)", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#8B5CF6"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}>
            {t}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: m.role === "user" ? "linear-gradient(135deg,#FF6B6B,#FFB800)" : "linear-gradient(135deg,#8B5CF6,#00AEEF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
              {m.role === "user" ? "🧒" : "🤖"}
            </div>
            <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: 18, fontSize: 12, fontWeight: 600, lineHeight: 1.5, background: m.role === "user" ? "linear-gradient(135deg,#8B5CF6,#00AEEF)" : "rgba(255,255,255,0.08)", color: "#fff", border: m.role === "bot" ? "1px solid rgba(255,255,255,0.1)" : "none", borderBottomLeftRadius: m.role === "bot" ? 4 : 18, borderBottomRightRadius: m.role === "user" ? 4 : 18, whiteSpace: "pre-wrap" }}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#00AEEF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4 }}>
              {[0,1,2].map(j => <span key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "#8B5CF6", display: "inline-block", animation: `bounce 0.9s ${j * 0.2}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px 14px", display: "flex", gap: 8, alignItems: "center", background: "rgba(255,255,255,0.03)", borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg(input)}
          placeholder="Ask me! / कुनै पनि सोध्नुस्! 🌟"
          style={{ flex: 1, border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 24, padding: "10px 14px", fontSize: 12, fontFamily: "'Nunito',sans-serif", outline: "none", background: "rgba(255,255,255,0.07)", color: "#fff" }} />
        <button onClick={() => sendMsg(input)} disabled={loading} style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,#8B5CF6,#00AEEF)", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: loading ? 0.6 : 1 }}>➤</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// PROFILE VIEW
// ══════════════════════════════════════════════
function ProfileView({ totalXP, playerLevel, completedLevels, streakDays }) {
  const { lang } = useLang();
  const totalDone = Object.values(completedLevels).reduce((a, arr) => a + arr.length, 0);
  const unlockedBadges = BADGES.filter(b => b.condition(totalXP));

  return (
    <div className="slide-up">
      {/* Profile Header */}
      <div style={{ background: "linear-gradient(135deg,#1A1A3E,#0F3460)", padding: "24px 16px 20px", textAlign: "center", borderRadius: "0 0 28px 28px" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF6B6B)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, border: "3px solid rgba(255,255,255,0.3)" }} className="floating">🧒</div>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, marginBottom: 2 }}>Aarav & Priya</div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 700, marginBottom: 14 }}>Grade 4–5 • Nepal 🇳🇵</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          {[
            { icon: "🔥", val: `${streakDays} ${lang === "np" ? "दिन स्ट्रीक" : "Day Streak"}`, col: "#FF6B6B" },
            { icon: "⭐", val: `${totalXP} XP`, col: "#FFB800" },
            { icon: "👑", val: `${lang === "np" ? "लेभल" : "Level"} ${playerLevel}`, col: "#8B5CF6" }
          ].map(b => (
            <div key={b.val} style={{ background: "rgba(255,255,255,0.1)", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: b.col, border: `1px solid ${b.col}44` }}>
              {b.icon} {b.val}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: 16 }}>
        {[
          { num: totalDone, label: lang === "np" ? "तह सकियो" : "Levels Done", icon: "🎮", col: "#FF6B6B" },
          { num: `${Math.round((totalDone / 72) * 100)}%`, label: lang === "np" ? "पूरा भयो" : "Complete", icon: "📊", col: "#00AEEF" },
          { num: `${totalXP}`, label: lang === "np" ? "कुल XP" : "Total XP", icon: "⭐", col: "#FFB800" }
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: s.col }}>{s.num}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badges */}
      <div style={{ padding: "0 16px 8px" }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
          🏅 {lang === "np" ? "ब्याज कमाएको" : "Badges Earned"}
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {BADGES.map(badge => {
            const unlocked = badge.condition(totalXP);
            return (
              <div key={badge.id} style={{ background: unlocked ? "rgba(255,184,0,0.15)" : "rgba(255,255,255,0.04)", border: unlocked ? "2px solid rgba(255,184,0,0.5)" : "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "10px 14px", textAlign: "center", opacity: unlocked ? 1 : 0.4, minWidth: 80 }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>{unlocked ? badge.icon : "🔒"}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: unlocked ? "#FFB800" : "rgba(255,255,255,0.3)" }}>{badge.name}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject Progress */}
      <div style={{ padding: "14px 16px 24px" }}>
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, marginBottom: 12 }}>
          📈 {lang === "np" ? "विषय प्रगति" : "Subject Progress"}
        </div>
        {Object.entries(LEVELS_DATA).map(([key, s]) => {
          const done = (completedLevels[key] || []).length;
          const total = s.levels.length;
          const pct = Math.round((done / total) * 100);
          return (
            <div key={key} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "10px 14px", marginBottom: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18 }}>{s.emoji}</span>
                  <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 13, color: "#fff" }}>{lang === "np" ? s.titleNp : s.title}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>{done}/{total}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 8, height: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: s.gradient, borderRadius: 8, transition: "width 0.6s" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// BOTTOM NAV
// ══════════════════════════════════════════════
function BottomNav({ activeTab, onChange }) {
  const { lang } = useLang();
  const tabs = [
    { id: "home", icon: "🏠", label: lang === "np" ? "घर" : "Home" },
    { id: "learn", icon: "🎮", label: lang === "np" ? "खेल" : "Play" },
    { id: "tutor", icon: "🤖", label: lang === "np" ? "शिक्षक" : "AI Tutor" },
    { id: "profile", icon: "👤", label: lang === "np" ? "प्रोफाइल" : "Profile" },
  ];
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(15,15,30,0.97)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", zIndex: 100, backdropFilter: "blur(20px)", borderRadius: "24px 24px 0 0" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{ flex: 1, border: "none", background: "transparent", padding: "10px 4px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div style={{ width: 40, height: 32, borderRadius: 14, background: activeTab === t.id ? "linear-gradient(135deg,#FFB800,#FF6B6B)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            <span style={{ fontSize: activeTab === t.id ? 20 : 18, opacity: activeTab === t.id ? 1 : 0.45, transition: "all 0.2s" }}>{t.icon}</span>
          </div>
          <span style={{ fontSize: 9, fontWeight: activeTab === t.id ? 800 : 600, color: activeTab === t.id ? "#FFB800" : "rgba(255,255,255,0.35)", letterSpacing: 0.3 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
