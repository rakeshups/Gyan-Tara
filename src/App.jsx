import { useState, useRef, useEffect, useCallback } from "react";

// ════════════════════════════════════════════
//  GROQ API KEY — Vercel Environment Variable
// ════════════════════════════════════════════
const GROQ_API_KEY = import.meta.env.VITE_GROQ_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// ════════════════════════════════════════════
//  SUBJECTS DATA
// ════════════════════════════════════════════
const SUBJECTS = {
  comm: {
    label: "COMMUNICATION",
    title: "Communication Skills",
    titleNp: "कुराकानी सीप",
    color: "#FF6B6B",
    gradient: "linear-gradient(135deg,#FF6B6B,#FF8E53)",
    emoji: "🗣️",
    badge: "🔥 HOT",
    progress: 65,
    lessons: [
      { name: "How to Introduce Yourself", desc: "आफूलाई परिचय दिने तरिका", icon: "👋", type: "tutor", topic: "Teach me how to introduce myself in English and Nepali. I am 8-12 years old. Make it fun, simple, and give me 3 example sentences I can use. Use emojis!" },
      { name: "Listening Skills", desc: "राम्ररी सुन्ने सीप", icon: "👂", type: "tutor", topic: "Teach me about good listening skills for children. Give tips, a short story example, and explain in simple English with Nepali words. Use emojis!" },
      { name: "Confidence: Speak Up!", desc: "आत्मविश्वासले बोल्नुस्", icon: "🎤", type: "tutor", topic: "How can I speak with confidence? I am a child aged 8-12. Give me 5 fun tips to speak up bravely in class and with friends. Use emojis and simple words." },
      { name: "Body Language Basics", desc: "शरीर भाषाको महत्त्व", icon: "🤝", type: "tutor", topic: "Explain body language for kids aged 8-12. What does good posture mean? How to make eye contact? Give 3 simple tips with examples. Use emojis!" },
      { name: "Quiz: Communication!", desc: "अफ्नो ज्ञान जाँच्नुस्", icon: "❓", type: "quiz", topic: "comm" },
    ],
  },
  money: {
    label: "MONEY SKILLS",
    title: "Money Management",
    titleNp: "पैसाको ज्ञान",
    color: "#00AEEF",
    gradient: "linear-gradient(135deg,#00AEEF,#0081CF)",
    emoji: "💰",
    badge: "💰 NEW",
    progress: 40,
    lessons: [
      { name: "What is Money?", desc: "पैसा के हो?", icon: "💵", type: "tutor", topic: "Explain what money is to a 8-12 year old child. Include: why we need money, how people earn it, the difference between needs and wants. Use simple words, emojis, and a Nepali context example." },
      { name: "Saving vs Spending", desc: "बचत र खर्चको फरक", icon: "🏦", type: "tutor", topic: "Teach me the difference between saving and spending money, for a child aged 8-12. Give a fun example with pocket money. Explain the 50-30-20 rule in simple words." },
      { name: "Making a Piggy Bank Plan", desc: "बचत योजना बनाउने", icon: "🐷", type: "tutor", topic: "Help me make a simple saving plan with my pocket money. I am 8-12 years old. Teach me how to set a saving goal, track spending, and reward myself. Make it fun with emojis!" },
      { name: "Good Habits with Money", desc: "पैसाको राम्रा बानी", icon: "✅", type: "tutor", topic: "What are 5 good money habits for kids aged 8-12? Explain each one with a real-life example from Nepal. Use simple English." },
      { name: "Quiz: Money Wise!", desc: "पैसाको ज्ञान जाँच्नुस्", icon: "❓", type: "quiz", topic: "money" },
    ],
  },
  personality: {
    label: "PERSONALITY",
    title: "Personality Development",
    titleNp: "व्यक्तित्व विकास",
    color: "#3DBF6E",
    gradient: "linear-gradient(135deg,#3DBF6E,#2AAA5A)",
    emoji: "🌟",
    badge: "",
    progress: 50,
    lessons: [
      { name: "What Makes You Special?", desc: "तपाई किन खास हुनुहुन्छ?", icon: "✨", type: "tutor", topic: "Help a 8-12 year old child understand what makes them special and unique. Talk about talents, personality traits, and self-confidence. Give a fun activity to discover their strengths. Use emojis!" },
      { name: "Kindness & Empathy", desc: "दयालु र सहानुभूति", icon: "❤️", type: "tutor", topic: "Teach kindness and empathy to a child aged 8-12. What does it mean to be kind? Give 3 real-life examples and a short story. Explain why being kind makes YOU happy too. Use emojis!" },
      { name: "Making Good Friends", desc: "राम्रा साथी बनाउने", icon: "👫", type: "tutor", topic: "How to make good friends? Teach a 8-12 year old about friendship. What makes a good friend? Give 5 tips and explain what to do if a friend is mean. Simple English with emojis." },
      { name: "Handling Emotions", desc: "भावनाहरू सम्हाल्ने", icon: "😊", type: "tutor", topic: "Teach a 8-12 year old how to handle emotions like anger, sadness, and fear in a healthy way. Give 3 breathing exercises and 3 positive thinking tips. Use emojis and simple words." },
      { name: "Quiz: Be Your Best!", desc: "व्यक्तित्व जाँच्नुस्", icon: "❓", type: "quiz", topic: "personality" },
    ],
  },
  time: {
    label: "TIME MANAGEMENT",
    title: "Time Management",
    titleNp: "समय व्यवस्थापन",
    color: "#FFB800",
    gradient: "linear-gradient(135deg,#FFB800,#FF8C00)",
    emoji: "⏰",
    badge: "",
    progress: 25,
    lessons: [
      { name: "Why Does Time Matter?", desc: "समय किन महत्त्वपूर्ण छ?", icon: "⏱️", type: "tutor", topic: "Explain why time management is important for children aged 8-12. Use a fun story or analogy. Give 3 reasons why managing time makes life better. Simple English with emojis!" },
      { name: "Making a Daily Schedule", desc: "दैनिक तालिका बनाउने", icon: "📅", type: "tutor", topic: "Help me create a simple daily schedule for a school child aged 8-12. Include time for school, homework, play, reading, and sleep. Give a sample timetable with tips. Use emojis!" },
      { name: "Stop Wasting Time!", desc: "समय बर्बाद नगर्नुस्", icon: "🚫", type: "tutor", topic: "What are 5 common time wasters for kids, and how to stop them? Explain for a 8-12 year old. Include: too much screen time, procrastination, and distraction. Give simple solutions. Use emojis!" },
      { name: "The Pomodoro for Kids", desc: "पोमोडोरो प्रविधि", icon: "🍅", type: "tutor", topic: "Explain the Pomodoro technique for kids aged 8-12 in super simple terms. How does 25 mins study + 5 mins break help? Give a step-by-step guide with emojis!" },
      { name: "Quiz: Time Hero!", desc: "समय सीप जाँच्नुस्", icon: "❓", type: "quiz", topic: "time" },
    ],
  },
  english: {
    label: "ENGLISH SPEAKING",
    title: "English Speaking",
    titleNp: "अङ्ग्रेजी बोल्ने",
    color: "#8B5CF6",
    gradient: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
    emoji: "🇬🇧",
    badge: "⭐ TOP",
    progress: 70,
    lessons: [
      { name: "Everyday English Phrases", desc: "दैनिक अङ्ग्रेजी वाक्यहरू", icon: "💬", type: "tutor", topic: "Teach a 8-12 year old Nepali child 10 must-know everyday English phrases with pronunciation tips and Nepali meaning. Make it fun with emojis and practice sentences!" },
      { name: "Telling a Story in English", desc: "अङ्ग्रेजीमा कथा सुनाउने", icon: "📖", type: "tutor", topic: "Teach me how to tell a simple story in English. I am 8-12 years old and learning English. Give me a story structure, 5 connecting words, and a sample short story. Use emojis!" },
      { name: "English for School", desc: "विद्यालयको अङ्ग्रेजी", icon: "🏫", type: "tutor", topic: "Teach useful English phrases for school for a 8-12 year old. Include: asking questions in class, talking to teachers, and speaking with classmates. Give 10 examples with Nepali meaning." },
      { name: "Pronunciation Practice", desc: "उच्चारण अभ्यास", icon: "🔊", type: "tutor", topic: "Help me improve my English pronunciation. I am 8-12 years old from Nepal. Give me 5 common pronunciation mistakes Nepali kids make, and how to fix them. Give examples and tongue twisters!" },
      { name: "Quiz: English Star!", desc: "अङ्ग्रेजी जाँच्नुस्", icon: "❓", type: "quiz", topic: "english" },
    ],
  },
  gk: {
    label: "LIFE SKILLS",
    title: "General Knowledge",
    titleNp: "जीवन कौशल",
    color: "#F472B6",
    gradient: "linear-gradient(135deg,#F472B6,#EC4899)",
    emoji: "🌍",
    badge: "",
    progress: 30,
    lessons: [
      { name: "Nepal: Our Beautiful Country", desc: "हाम्रो सुन्दर नेपाल", icon: "🇳🇵", type: "tutor", topic: "Teach a 8-12 year old Nepali child interesting facts about Nepal — geography, culture, famous people, Mount Everest, and things to be proud of. Make it fun with emojis and 5 amazing facts!" },
      { name: "Staying Safe Online", desc: "इन्टरनेटमा सुरक्षित रहने", icon: "🔐", type: "tutor", topic: "Teach internet safety to a 8-12 year old child. What are 5 important rules for staying safe online? Cover: passwords, strangers online, cyberbullying, and screen time. Simple English with emojis!" },
      { name: "Healthy Habits for Kids", desc: "स्वस्थ बानी र आदतहरू", icon: "🥗", type: "tutor", topic: "Teach healthy habits for a 8-12 year old child. Cover: food, sleep, exercise, and mental health. Give 6 simple tips they can start today. Use emojis and real examples from Nepal!" },
      { name: "Goal Setting for Kids", desc: "लक्ष्य निर्धारण", icon: "🎯", type: "tutor", topic: "Teach goal setting to a 8-12 year old child. What is a goal? How to set a SMART goal? Give 3 examples of goals a child might have. Make it fun with emojis!" },
      { name: "Quiz: Life Champion!", desc: "जीवन ज्ञान जाँच्नुस्", icon: "❓", type: "quiz", topic: "gk" },
    ],
  },
};

const QUIZZES = {
  comm: [
    { q: "What is the FIRST thing you should do when meeting someone new?", opts: ["Look away", "Smile and say Hello! 👋", "Run away", "Stay quiet"], ans: 1 },
    { q: "Good listening means...", opts: ["Talking a lot", "Looking at your phone", "Paying full attention to the speaker ✅", "Thinking about something else"], ans: 2 },
    { q: "कुराकानीमा सबैभन्दा महत्त्वपूर्ण कुरा के हो?", opts: ["Shouting loud", "Being confident & clear 💪", "Using big words", "Talking fast"], ans: 1 },
    { q: "Body language includes:", opts: ["The words you say", "Your facial expressions and posture 🙂", "The language of the body organ", "None of above"], ans: 1 },
  ],
  money: [
    { q: "What is the difference between a NEED and a WANT?", opts: ["They are the same", "Needs are must-haves (food/shelter), wants are extra ✅", "Wants are more important", "Neither matters"], ans: 1 },
    { q: "If you get Rs. 100 pocket money, how much should you SAVE?", opts: ["Rs. 10", "Rs. 20 ✅", "Rs. 50", "Rs. 100"], ans: 1 },
    { q: "पैसा कहाँ राख्नु राम्रो हुन्छ?", opts: ["Under the pillow", "Spend it all", "In a piggy bank or bank 🏦", "Give to friends"], ans: 2 },
    { q: "Earning money means:", opts: ["Getting it for free", "Working or creating value to get paid 💪", "Stealing", "Finding it on ground"], ans: 1 },
  ],
  personality: [
    { q: "Empathy means:", opts: ["Feeling sorry for yourself", "Understanding and sharing others' feelings ❤️", "Being selfish", "Ignoring others"], ans: 1 },
    { q: "A good friend...", opts: ["Always agrees with you", "Supports and is honest with you 👫", "Ignores you when busy", "Talks about you behind your back"], ans: 1 },
    { q: "जब तिमीलाई रिस उठ्छ (When you feel angry), what is BEST?", opts: ["Shout at everyone", "Take deep breaths and calm down 🧘", "Break something", "Cry all day"], ans: 1 },
    { q: "What makes YOU special?", opts: ["Nothing", "Your unique talents, thoughts and heart ✨", "Money", "Looks only"], ans: 1 },
  ],
  time: [
    { q: "A daily schedule helps you:", opts: ["Waste time", "Use time wisely and reduce stress ✅", "Sleep more", "Miss school"], ans: 1 },
    { q: "Pomodoro technique means:", opts: ["25 min work + 5 min break 🍅", "Study all night", "Play all day", "No schedule"], ans: 0 },
    { q: "Procrastination means:", opts: ["Working fast", "Delaying tasks you need to do 😴", "Playing sports", "Reading books"], ans: 1 },
    { q: "Best time to do homework:", opts: ["After midnight", "Right after school while fresh ✅", "Never", "Only on weekends"], ans: 1 },
  ],
  english: [
    { q: "How do you say 'मेरो नाम' in English?", opts: ["My place is", "My name is ✅", "I am from", "My age is"], ans: 1 },
    { q: "Which sentence is CORRECT?", opts: ["I is happy", "She are going", "He is my friend ✅", "They was there"], ans: 2 },
    { q: "'Thank you' को नेपाली अर्थ के हो?", opts: ["माफ गर्नुस्", "शुभ प्रभात", "धन्यवाद ✅", "नमस्ते"], ans: 2 },
    { q: "To 'introduce yourself' means:", opts: ["Introduce your pet", "Tell others who you are ✅", "Introduce food", "Nothing"], ans: 1 },
  ],
  gk: [
    { q: "नेपालको राजधानी के हो? (Capital of Nepal?)", opts: ["Pokhara", "Butwal", "Kathmandu 🏔️", "Biratnagar"], ans: 2 },
    { q: "Staying safe online means:", opts: ["Share your password with friends", "Post your address online", "Never share personal info with strangers 🔐", "Click all links"], ans: 2 },
    { q: "A healthy sleep for children is:", opts: ["4 hours", "6 hours", "8-10 hours ✅", "2 hours"], ans: 2 },
    { q: "A SMART goal is:", opts: ["Very expensive", "Specific, Measurable, Achievable, Relevant, Time-bound ✅", "About being smart in studies only", "A goal you forget"], ans: 1 },
  ],
};

// ════ STYLES ════════════════════════════════
const S = {
  app: { minHeight: "100vh", background: "#FFFDF5", fontFamily: "'Nunito', sans-serif", color: "#1A1A2E", paddingBottom: 76, maxWidth: 480, margin: "0 auto", position: "relative" },
  topbar: { background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 100%)", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,.3)" },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: "rgba(255,255,255,.97)", borderTop: "1.5px solid rgba(0,0,0,.08)", display: "flex", zIndex: 100, boxShadow: "0 -4px 20px rgba(0,0,0,.08)", borderRadius: "24px 24px 0 0", backdropFilter: "blur(10px)" },
};

// ════ SPINNER ════════════════════════════════
function Spinner({ color = "#8B5CF6" }) {
  return (
    <span style={{ display: "inline-block", width: 16, height: 16, border: `2px solid ${color}33`, borderTop: `2px solid ${color}`, borderRadius: "50%", animation: "spin .6s linear infinite" }} />
  );
}

// ════ TOP BAR ════════════════════════════════
function TopBar({ points }) {
  return (
    <div style={S.topbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#FFB800,#FF6B6B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌟</div>
        <div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#fff", letterSpacing: .5 }}>GyanTara</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: .5 }}>ज्ञान तारा • Learn & Grow</div>
        </div>
      </div>
      <div style={{ background: "linear-gradient(135deg,#FFB800,#FF8C00)", color: "#fff", fontWeight: 800, fontSize: 13, padding: "5px 12px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
        ⭐ {points}
      </div>
    </div>
  );
}

// ════ BOTTOM NAV ════════════════════════════
function BottomNav({ activeTab, onChange }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "learn", icon: "📚", label: "Learn" },
    { id: "tutor", icon: "🤖", label: "AI Tutor" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];
  return (
    <div style={S.bottomNav}>
      {tabs.map((t) => (
        <button key={t.id} onClick={() => onChange(t.id)}
          style={{ flex: 1, border: "none", background: "transparent", padding: "10px 4px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all .2s", borderBottom: activeTab === t.id ? "2.5px solid #00AEEF" : "2.5px solid transparent", margin: 4, borderRadius: 14 }}>
          <span style={{ fontSize: activeTab === t.id ? 22 : 20, opacity: activeTab === t.id ? 1 : .55, transition: "font-size .2s" }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: activeTab === t.id ? 800 : 600, color: activeTab === t.id ? "#00AEEF" : "#6B7280", letterSpacing: .3 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ════ DASHBOARD ═════════════════════════════
function DashboardView({ onOpenSubject, onOpenTutor, onOpenLesson }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1A1A2E 0%,#16213E 60%,#0F3460 100%)", padding: "20px 16px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -20, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,184,0,.08)" }} />
        <div style={{ position: "absolute", bottom: -20, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(0,174,239,.08)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>🇳🇵 नमस्ते / Hello</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 26, color: "#fff", lineHeight: 1.2, marginBottom: 6 }}>Ready to Learn Today? 👋</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>Aaja ke liye taiyaar? / आजको लागि तयार?</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, background: "rgba(255,255,255,.1)", borderRadius: 12, padding: "10px 14px" }}>
            <span style={{ fontSize: 20 }}>🔥</span>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>Learning Streak / सिक्ने सिलसिला</span>
            <span style={{ fontFamily: "'Fredoka One',cursive", fontSize: 20, color: "#FFB800", marginLeft: "auto" }}>7 Days</span>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div style={{ padding: "16px 16px 8px", fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E", display: "flex", alignItems: "center", gap: 6 }}>⚡ Today's Challenge</div>
      <div onClick={() => onOpenLesson("comm", 0)}
        style={{ margin: "0 16px 16px", background: "linear-gradient(135deg,#1A1A2E,#0F3460)", borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,.2)" }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FFB800,#FF6B6B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>🎤</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 9, fontWeight: 800, color: "#FFB800", letterSpacing: 1, textTransform: "uppercase", marginBottom: 3 }}>Daily Challenge • आजको चुनौती</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#fff", marginBottom: 2 }}>Introduce Yourself in English!</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontWeight: 600 }}>+50 ⭐ • 5 minutes • कमाउनुस् अंक</div>
        </div>
        <span style={{ color: "rgba(255,255,255,.4)", fontSize: 20 }}>›</span>
      </div>

      {/* Subjects Grid */}
      <div style={{ padding: "0 16px 8px", fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E" }}>📚 Subjects / विषयहरू</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, padding: "0 16px 20px" }}>
        {Object.entries(SUBJECTS).map(([key, s]) => (
          <div key={key} onClick={() => onOpenSubject(key)}
            style={{ background: s.gradient, borderRadius: 18, padding: 16, cursor: "pointer", transition: "transform .2s,box-shadow .2s", position: "relative", overflow: "hidden", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: "0 4px 14px rgba(0,0,0,.15)" }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            {s.badge && <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,.25)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 20 }}>{s.badge}</div>}
            <div style={{ fontSize: 30, marginBottom: 8 }}>{s.emoji}</div>
            <div>
              <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#fff", lineHeight: 1.2 }}>{s.title}</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,.75)", fontWeight: 700, marginTop: 2 }}>{s.titleNp}</div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "rgba(255,255,255,.25)", borderRadius: "0 0 18px 18px" }}>
              <div style={{ height: "100%", width: `${s.progress}%`, background: "rgba(255,255,255,.8)", borderRadius: "0 0 18px 18px", transition: "width .6s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════ LESSONS VIEW ═══════════════════════════
function LessonsView({ subjectKey, onBack, onStartLesson }) {
  const s = SUBJECTS[subjectKey];
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#16213E)", padding: 16, display: "flex", alignItems: "center", gap: 12, borderRadius: "0 0 20px 20px" }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>‹</button>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: .5, textTransform: "uppercase" }}>{s.label}</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#fff" }}>{s.title}</div>
        </div>
      </div>
      <div style={{ padding: 14 }}>
        {s.lessons.map((l, i) => (
          <div key={i} onClick={() => onStartLesson(subjectKey, i)}
            style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: "1.5px solid rgba(0,0,0,.06)", transition: "all .2s", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = s.color; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "rgba(0,0,0,.06)"; }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, color: "#fff" }}>{l.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#1A1A2E", marginBottom: 2 }}>{l.name}</div>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>{l.desc}</div>
            </div>
            <div style={{ fontSize: 16 }}>{i < 3 ? "✅" : "🔓"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════ CHAT / AI TUTOR VIEW ══════════════════
function ChatView({ subjectKey, lessonIdx, onBack, onAddPoints }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const chatRef = useRef(null);

  const lesson = subjectKey && lessonIdx !== null ? SUBJECTS[subjectKey]?.lessons[lessonIdx] : null;
  const color = subjectKey ? SUBJECTS[subjectKey]?.color : "#8B5CF6";

  const SYSTEM_PROMPT = `You are Gyan Guru, a fun, encouraging, bilingual AI tutor for Nepali children aged 8-12. 
Always respond in a mix of simple English and Nepali when helpful. 
Use lots of emojis 🌟, short sentences, bullet points, and examples from Nepal context. 
Never use complex vocabulary. Always end with an encouraging message or a question to keep the child engaged.
${lesson ? `Current lesson: ${lesson.name}` : "Help the child learn anything they ask."}`;

  useEffect(() => {
    const welcome = "नमस्ते! 🙏 Hello! I am Gyan Guru, your fun AI teacher!\n\n" +
      (lesson ? `Let's learn about: **${lesson.name}** 🌟\n\nAsk me anything or tap a quick button below! ✨` : "Ask me anything about Communication, Money, English, Time Management, and more! 🌟");
    setMessages([{ role: "bot", text: welcome }]);
    if (lesson) {
      setTimeout(() => callAI(lesson.topic, []), 500);
    }
  }, []);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, isLoading]);

  const callAI = async (userMsg, history) => {
    setIsLoading(true);
    const newHistory = [...history, { role: "user", content: userMsg }];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: newHistory.slice(-10),
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const reply = data.reply || "Sorry, try again! 🙏";
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setChatHistory([...newHistory, { role: "assistant", content: reply }]);
      onAddPoints(10);
    } catch (e) {
      console.error("callAI failed:", e);
      setMessages((prev) => [...prev, { role: "bot", text: "Oops! Connection problem 😅 Please try again!\n\nसम्पर्क समस्या भयो!" }]);
    }
    setIsLoading(false);
  };

  const sendMsg = (text) => {
    if (!text.trim() || isLoading) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    callAI(text, chatHistory);
  };

  const quickBtns = lesson
    ? ["Explain simply 🙏", "Give an example 📝", "Make it a story 📖", "Quiz me! ❓", "Explain in Nepali 🇳🇵"]
    : ["Nepal facts 🇳🇵", "Teach me English 🇬🇧", "Money tips 💰", "Confidence tips 🌟", "Fun fact! 🎉"];

  const formatText = (text) =>
    text.split("\n").map((line, i) => (
      <span key={i}>{line.replace(/\*\*(.*?)\*\*/g, "$1")}<br /></span>
    ));

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 136px)" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${color},${color}cc)`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, borderRadius: "0 0 20px 20px" }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.15)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>‹</button>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, border: "2px solid rgba(255,255,255,.4)" }}>🤖</div>
        <div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#fff" }}>Gyan Guru AI</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} /> Online — Ready!
          </div>
        </div>
      </div>

      {/* Quick buttons */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 14px 4px", scrollbarWidth: "none", flexShrink: 0 }}>
        {quickBtns.map((q) => (
          <button key={q} onClick={() => sendMsg(q)}
            style={{ whiteSpace: "nowrap", background: "#f1f5f9", border: "1.5px solid rgba(0,0,0,.08)", borderRadius: 20, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#1A1A2E", cursor: "pointer", fontFamily: "'Nunito',sans-serif", transition: "all .2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = color; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#1A1A2E"; }}>
            {q}
          </button>
        ))}
      </div>

      {/* Chat messages */}
      <div ref={chatRef} style={{ flex: 1, overflowY: "auto", padding: "10px 14px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-end", flexDirection: m.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, marginBottom: 2, background: m.role === "user" ? "linear-gradient(135deg,#FF6B6B,#FF8E53)" : `linear-gradient(135deg,${color},${color}cc)` }}>
              {m.role === "user" ? "🧒" : "🤖"}
            </div>
            <div style={{ maxWidth: "78%", padding: "10px 14px", borderRadius: 18, fontSize: 13, fontWeight: 600, lineHeight: 1.5, background: m.role === "user" ? `linear-gradient(135deg,${color},${color}cc)` : "#fff", color: m.role === "user" ? "#fff" : "#1A1A2E", border: m.role === "bot" ? "1.5px solid rgba(0,0,0,.08)" : "none", borderBottomLeftRadius: m.role === "bot" ? 4 : 18, borderBottomRightRadius: m.role === "user" ? 4 : 18 }}>
              {formatText(m.text)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}cc)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🤖</div>
            <div style={{ background: "#fff", border: "1.5px solid rgba(0,0,0,.08)", borderRadius: 18, borderBottomLeftRadius: 4, padding: "12px 16px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map((j) => (
                <span key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: "#6B7280", display: "inline-block", animation: `bounce .9s ${j * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: "10px 14px 14px", display: "flex", gap: 8, alignItems: "center", background: "#fff", borderTop: "1px solid rgba(0,0,0,.07)", flexShrink: 0 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMsg(input)}
          placeholder="Ask me anything... / कुनै पनि प्रश्न सोध्नुस्!"
          style={{ flex: 1, border: "1.5px solid rgba(0,0,0,.1)", borderRadius: 24, padding: "10px 14px", fontSize: 13, fontFamily: "'Nunito',sans-serif", outline: "none", background: "#f8fafc" }} />
        <button onClick={() => sendMsg(input)} disabled={isLoading}
          style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg,${color},${color}bb)`, border: "none", color: "#fff", fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, opacity: isLoading ? .6 : 1 }}>
          ➤
        </button>
      </div>
    </div>
  );
}

// ════ QUIZ VIEW ══════════════════════════════
function QuizView({ subjectKey, onBack, onAddPoints }) {
  const qs = QUIZZES[subjectKey] || QUIZZES.comm;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [done, setDone] = useState(false);
  const color = SUBJECTS[subjectKey]?.color || "#8B5CF6";

  const answer = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    if (i === qs[idx].ans) { setScore((s) => s + 1); onAddPoints(20); }
    setTimeout(() => {
      if (idx + 1 >= qs.length) setDone(true);
      else { setIdx((x) => x + 1); setChosen(null); }
    }, 1200);
  };

  if (done) {
    const pct = Math.round((score / qs.length) * 100);
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <div style={{ background: "linear-gradient(135deg,#1A1A2E,#16213E)", padding: "24px 20px", borderRadius: 20, marginBottom: 20, color: "#fff" }}>
          <button onClick={onBack} style={{ background: "rgba(255,255,255,.1)", border: "none", color: "#fff", borderRadius: 12, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontFamily: "'Nunito',sans-serif", marginBottom: 16, display: "block" }}>← Back</button>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "⭐" : "💪"}</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 28, color, marginBottom: 6 }}>{score}/{qs.length} Correct!</div>
          <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>{pct}%</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>
            {pct >= 80 ? "🌟 Excellent! तपाईं सुपर स्मार्ट हुनुहुन्छ!" : pct >= 60 ? "👍 Good job! राम्रो प्रयास!" : "💪 Keep practicing! अभ्यास गर्दै जानुस्!"}
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg,#FFB800,#FF8C00)`, color: "#fff", borderRadius: 20, padding: "10px 20px", fontWeight: 800, fontSize: 15, display: "inline-block", marginBottom: 20 }}>+{score * 20} ⭐ Points Earned!</div>
        <br />
        <button onClick={onBack} style={{ background: color, color: "#fff", border: "none", borderRadius: 14, padding: "12px 24px", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "'Nunito',sans-serif" }}>📚 Back to Lessons</button>
      </div>
    );
  }

  const q = qs[idx];
  const pct = Math.round((idx / qs.length) * 100);
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#16213E)", padding: 16, display: "flex", alignItems: "center", gap: 12, borderRadius: "0 0 20px 20px" }}>
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.1)", border: "none", color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 700, letterSpacing: .5, textTransform: "uppercase" }}>QUIZ TIME • क्विज</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 18, color: "#fff" }}>{SUBJECTS[subjectKey]?.title} Quiz!</div>
        </div>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ background: "#f1f5f9", borderRadius: 20, height: 8, marginBottom: 16, overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: 20, background: `linear-gradient(90deg,${color},#8B5CF6)`, width: `${pct}%`, transition: "width .5s ease" }} />
        </div>
        <div style={{ background: "#fff", borderRadius: 18, padding: 18, marginBottom: 14, border: "1.5px solid rgba(0,0,0,.07)", boxShadow: "0 3px 10px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 10, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: .5, marginBottom: 8 }}>Question {idx + 1} of {qs.length}</div>
          <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 16, color: "#1A1A2E", lineHeight: 1.4 }}>{q.q}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {q.opts.map((opt, i) => {
            let bg = "#fff", border = "2px solid rgba(0,0,0,.1)", textCol = "#1A1A2E";
            if (chosen !== null) {
              if (i === q.ans) { bg = "#f0fdf4"; border = "2px solid #3DBF6E"; textCol = "#166534"; }
              else if (i === chosen && chosen !== q.ans) { bg = "#fff5f5"; border = "2px solid #FF6B6B"; textCol = "#991b1b"; }
            }
            return (
              <button key={i} onClick={() => answer(i)}
                style={{ background: bg, border, borderRadius: 14, padding: "12px 16px", fontWeight: 700, fontSize: 13, color: textCol, cursor: "pointer", transition: "all .2s", textAlign: "left", fontFamily: "'Nunito',sans-serif", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{"ABCD"[i]}</div>
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ════ PROFILE VIEW ═══════════════════════════
function ProfileView({ points }) {
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef(null);

  const loadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg,#1A1A2E,#0F3460)", padding: "24px 16px 20px", textAlign: "center", borderRadius: "0 0 28px 28px" }}>
        <div onClick={() => fileRef.current?.click()}
          style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#00AEEF,#8B5CF6)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, border: "3px solid rgba(255,255,255,.3)", position: "relative", overflow: "hidden", cursor: "pointer" }}>
          {photo ? <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> : "🧒"}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.3)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: ".2s", borderRadius: "50%", fontSize: 20 }}
            onMouseEnter={e => e.currentTarget.style.opacity = 1}
            onMouseLeave={e => e.currentTarget.style.opacity = 0}>📸</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={loadPhoto} style={{ display: "none" }} />
        <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 22, color: "#fff", marginBottom: 3 }}>Aarav & Priya</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", fontWeight: 700 }}>Grade 4–5 • Nepal 🇳🇵</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
          {["🔥 7-day streak", "📚 6 subjects", `⭐ ${points} pts`].map((b) => (
            <div key={b} style={{ background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700, color: "#fff" }}>{b}</div>
          ))}
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "rgba(255,255,255,.5)", fontWeight: 600 }}>📸 Tap photo to change / फोटो परिवर्तन गर्न tap गर्नुस्</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, padding: 16 }}>
        {[{ num: "12", label: "Lessons Done", color: "#FF6B6B" }, { num: "85%", label: "Quiz Score", color: "#00AEEF" }, { num: `${points}`, label: "⭐ Points", color: "#FFB800" }].map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: 14, textAlign: "center", border: "1.5px solid rgba(0,0,0,.06)", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 24, color: s.color, marginBottom: 3 }}>{s.num}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "#6B7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 16px 8px", fontFamily: "'Fredoka One',cursive", fontSize: 17, color: "#1A1A2E" }}>🏆 Achievements</div>
      <div style={{ padding: "0 16px 24px" }}>
        {[
          { icon: "🌟", bg: "#FFF9C4", name: "Star Communicator", desc: "Completed 5 speaking lessons", pts: "+100⭐", unlocked: true },
          { icon: "💰", bg: "#E0F7FA", name: "Money Wise Kid", desc: "Learned saving basics", pts: "+80⭐", unlocked: true },
          { icon: "⏰", bg: "#F3E5F5", name: "Time Master", desc: "Made first weekly plan", pts: "+60⭐", unlocked: true },
          { icon: "🔒", bg: "#f1f5f9", name: "English Champion", desc: "Complete 10 English lessons to unlock", pts: "+150⭐", unlocked: false },
        ].map((a) => (
          <div key={a.name} style={{ background: "#fff", borderRadius: 14, padding: "12px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12, border: "1.5px solid rgba(0,0,0,.06)", boxShadow: "0 2px 8px rgba(0,0,0,.04)", opacity: a.unlocked ? 1 : .5 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 13, color: "#1A1A2E", marginBottom: 2 }}>{a.name}</div>
              <div style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>{a.desc}</div>
            </div>
            <div style={{ fontFamily: "'Fredoka One',cursive", fontSize: 15, color: "#FFB800" }}>{a.pts}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ════ MAIN APP ═══════════════════════════════
export default function App() {
  const [tab, setTab] = useState("home");
  const [activeSubject, setActiveSubject] = useState(null);
  const [activeLessonIdx, setActiveLessonIdx] = useState(null);
  const [activeView, setActiveView] = useState("home"); // home | lessons | chat | quiz | profile
  const [points, setPoints] = useState(240);

  const addPoints = useCallback((n) => setPoints((p) => p + n), []);

  const openSubject = (key) => { setActiveSubject(key); setActiveView("lessons"); setTab("learn"); };
  const openLesson = (subjectKey, idx) => {
    setActiveSubject(subjectKey);
    setActiveLessonIdx(idx);
    const lesson = SUBJECTS[subjectKey]?.lessons[idx];
    if (lesson?.type === "quiz") setActiveView("quiz");
    else setActiveView("chat");
  };
  const goHome = () => { setActiveView("home"); setTab("home"); };
  const goLessons = () => setActiveView("lessons");

  const handleTabChange = (t) => {
    setTab(t);
    if (t === "home") { setActiveView("home"); }
    else if (t === "learn") { setActiveView("lessons"); if (!activeSubject) setActiveSubject(null); }
    else if (t === "tutor") { setActiveSubject(null); setActiveLessonIdx(null); setActiveView("chat"); }
    else if (t === "profile") setActiveView("profile");
  };

  return (
    <div style={S.app}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-6px); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }
      `}</style>

      <TopBar points={points} />

      <div style={{ overflowY: "auto" }}>
        {activeView === "home" && (
          <DashboardView
            onOpenSubject={openSubject}
            onOpenTutor={() => handleTabChange("tutor")}
            onOpenLesson={(subjectKey, idx) => openLesson(subjectKey, idx)}
          />
        )}
        {activeView === "lessons" && activeSubject && (
          <LessonsView subjectKey={activeSubject} onBack={goHome} onStartLesson={openLesson} />
        )}
        {activeView === "lessons" && !activeSubject && (
          <div style={{ padding: 14 }}>
            {Object.entries(SUBJECTS).map(([key, s]) => (
              <div key={key} onClick={() => openSubject(key)}
                style={{ background: "#fff", borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", border: "1.5px solid rgba(0,0,0,.06)", boxShadow: "0 2px 8px rgba(0,0,0,.05)", transition: "all .2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateX(4px)"; e.currentTarget.style.borderColor = s.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "rgba(0,0,0,.06)"; }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{s.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: "#1A1A2E" }}>{s.title}</div>
                  <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>{s.titleNp} • {s.lessons.length} lessons</div>
                </div>
                <span style={{ fontSize: 18, color: "#ccc" }}>›</span>
              </div>
            ))}
          </div>
        )}
        {activeView === "chat" && (
          <ChatView subjectKey={activeSubject} lessonIdx={activeLessonIdx} onBack={activeSubject ? goLessons : goHome} onAddPoints={addPoints} />
        )}
        {activeView === "quiz" && (
          <QuizView subjectKey={activeSubject} onBack={goLessons} onAddPoints={addPoints} />
        )}
        {activeView === "profile" && <ProfileView points={points} />}
      </div>

      <BottomNav activeTab={tab} onChange={handleTabChange} />
    </div>
  );
}
