"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Heart,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  Music,
  Plus,
  X,
  Check,
  PenLine,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Smile,
  Map,
  Cake,
  Star,
  Quote,
  ShieldCheck,
  Flame,
  Coffee,
  Compass,
  PhoneCall,
  Users,
  Sun,
} from "lucide-react";

const CHAPTERS = [
  {
    id: 1,
    number: "01",
    tag: "The Dream & The Salam",
    title: "A Locked Profile, An Afternoon Nap & Destiny",
    date: "Jan 14, 2026 • 2:30 PM & 4:18 PM",
    quote: "“Sometimes, the most beautiful journeys begin in the most unexpected ways.”",
    description:
      "It was January 14, 2026, around 2:30 PM. I was lying on my bed, getting ready for an afternoon nap, scrolling through Facebook when my eyes stopped at a tiny locked profile picture of Afrin Yesmin. I sent a friend request and slept. In my sleep, I dreamed of messaging her 'Assalamu Alaikum' and receiving 'Wa Alaikum Assalam'. At 4:18 PM I woke up and sent that exact message—and she replied just as in my dream.",
    highlights: ["Facebook Suggestion", "The Vivid Dream", "4:18 PM First Greeting"],
    icon: Flame,
    color: "from-[#640D14] to-[#C1121F]",
  },
  {
    id: 2,
    number: "02",
    tag: "Morning Whispers",
    title: "7:00 AM First Phone Call & The Sweetest Routine",
    date: "Jan 17, 2026 • 7:00 AM",
    quote: "“I would wake up every day—not because of an alarm, but because I couldn't wait to hear her voice.”",
    description:
      "Afrin was taking her third-year final examinations in Dhaka, sharing a room with her mother. Phone calls were difficult during the day, so she gently suggested mornings. On January 17, 2026, at 7:00 AM, we had our very first phone call. Those quiet morning moments while her mother made breakfast became our sacred daily habit.",
    highlights: ["First Phone Call", "7:00 AM Habit", "Dhaka Exam Days"],
    icon: PhoneCall,
    color: "from-[#4A0E17] to-[#800F2F]",
  },
  {
    id: 3,
    number: "03",
    tag: "Family Blessings",
    title: "Bridging Hearts & Sharing Our Secret",
    date: "July 31 – August 19, 2026",
    quote: "“Seeing the person I love meet someone from my family felt like another beautiful step forward.”",
    description:
      "When my elder sister returned from Germany, excitement filled our home. On July 31, I told my family about Afrin and our relationship. On August 8, Afrin met my sister for the first time. Soon after, on August 19, Afrin told her mother about me. Our love expanded to embrace the warmth and blessings of family.",
    highlights: ["July 31 Family News", "August 8 Sister Meeting", "August 19 Afrin's Mother"],
    icon: Users,
    color: "from-[#7A0015] to-[#C1121F]",
  },
  {
    id: 4,
    number: "04",
    tag: "Faith & Sabr",
    title: "One Day at a Time, Holding On Patiently",
    date: "Our Days Today",
    quote: "“No distance, no obstacle, and no passage of time will ever be able to keep us apart.”",
    description:
      "We are taking things one day at a time, holding on tightly to each other, and waiting patiently for the day when Allah, in His perfect timing, brings us together in a way written for us. We have steadfast faith in Allah's divine wisdom and in our sacred journey.",
    highlights: ["Unbreakable Bond", "Patience & Sabr", "Unwavering Trust"],
    icon: Sun,
    color: "from-[#590D22] to-[#A4133C]",
  },
  {
    id: 5,
    number: "05",
    tag: "Halal Destiny",
    title: "A Blessed Future In Allah's Perfect Timing",
    date: "Always & Forever",
    quote: "“May Allah bless our relationship, protect us from every hardship, and unite us in a beautiful and halal way. Ameen. 🤍”",
    description:
      "Until that written day arrives, we keep waiting, keep praying, and keep walking this path hand in hand. Our highest hope and prayer is for Allah to bless our bond, safeguard our hearts from every difficulty, and unite RayHan & Afrin in an eternal, halal marriage.",
    highlights: ["Eternal Halal Union", "Prayers & Duas", "Ameen 🤍"],
    icon: Compass,
    color: "from-[#1D3557] to-[#C1121F]",
  },
];

const PROMISES = [
  {
    id: 1,
    title: "To Trust in Allah's Perfect Timing",
    text: "To remain patient with Sabr and Shukr, knowing that what is written by Allah for us will never miss us.",
    icon: Star,
  },
  {
    id: 2,
    title: "To Wake Up Excited For Your Voice",
    text: "To never take our morning talks and quiet daily routines for granted, cherishing your gentle warmth every day.",
    icon: Heart,
  },
  {
    id: 3,
    title: "To Stand Strong Through Every Obstacle",
    text: "To hold onto each other through every distance, season, and challenge, protecting our love with unwavering loyalty.",
    icon: ShieldCheck,
  },
  {
    id: 4,
    title: "To Pray For Our Halal Union Daily",
    text: "To keep asking Allah in every prayer to bless our path, protect us from all harm, and unite us in a beautiful halal marriage.",
    icon: Sparkles,
  },
];

const FILTERS = [
  { key: "all", label: "All Milestones", icon: Sparkles },
  { key: "firsts", label: "The Firsts", icon: Heart },
  { key: "celebrations", label: "Family & Steps", icon: Cake },
  { key: "daily", label: "Faith & Days", icon: Smile },
];

const ICON_MAP = {
  heart: Heart,
  map: Map,
  cake: Cake,
  smile: Smile,
  sparkles: Sparkles,
  star: Star,
  music: Music,
};

const CATEGORY_STYLES = {
  firsts: {
    node: "from-[#640D14] to-[#C1121F]",
    badge: "border-[#C1121F]/40 bg-[#C1121F]/15 text-[#ffd5d9]",
  },
  trips: {
    node: "from-[#1D3557] to-[#457B9D]",
    badge: "border-[#457B9D]/40 bg-[#457B9D]/15 text-[#A8DADC]",
  },
  celebrations: {
    node: "from-[#7A0015] to-[#E7B98A]",
    badge: "border-[#E7B98A]/40 bg-[#E7B98A]/15 text-[#E7B98A]",
  },
  daily: {
    node: "from-[#4A0E17] to-[#708090]",
    badge: "border-white/20 bg-white/[0.06] text-[#B5B5B5]",
  },
};

const INITIAL_MILESTONES = [
  {
    id: 1,
    date: "Jan 14, 2026 • 2:30 PM",
    title: "The Locked Profile & The Unexpected Dream",
    category: "firsts",
    desc: "Saw Afrin's profile picture in Facebook suggestions, sent a request, and took an afternoon nap with a vivid dream of exchanging 'Assalamu Alaikum'.",
    icon: "heart",
  },
  {
    id: 2,
    date: "Jan 14, 2026 • 4:18 PM",
    title: "First 'Assalamu Alaikum' & 11 PM Chat",
    category: "firsts",
    desc: "Woke up with an unshakeable urge to text. Sent 'Assalamu Alaikum' on Messenger at 4:18 PM, and she replied exactly as in the dream. Talked again at 11 PM.",
    icon: "sparkles",
  },
  {
    id: 3,
    date: "Jan 17, 2026 • 7:00 AM",
    title: "Our Very First Morning Phone Call",
    category: "firsts",
    desc: "Afrin suggested mornings while her mother made breakfast during 3rd-year exams in Dhaka. 7:00 AM calls became the sweetest start to every day.",
    icon: "smile",
  },
  {
    id: 4,
    date: "Jul 31, 2026",
    title: "RayHan Shares Our Relationship with Family",
    category: "celebrations",
    desc: "My elder sister returned from Germany with joyful energy. I gathered courage and told my whole family about Afrin.",
    icon: "cake",
  },
  {
    id: 5,
    date: "Aug 08, 2026",
    title: "Afrin Meets RayHan's Elder Sister",
    category: "celebrations",
    desc: "A simple, unforgettable meeting that brought our lives closer and took another heartfelt step forward.",
    icon: "heart",
  },
  {
    id: 6,
    date: "Aug 19, 2026",
    title: "Afrin Tells Her Mother About RayHan",
    category: "celebrations",
    desc: "Afrin confided in her mother about our relationship, weaving our families into the foundation of our love story.",
    icon: "sparkles",
  },
  {
    id: 7,
    date: "Present Days",
    title: "Walking in Faith, Sabr & Halal Prayers",
    category: "daily",
    desc: "Taking things one day at a time, holding onto each other, and trusting Allah's perfect timing to unite us in a beautiful halal way. Ameen. 🤍",
    icon: "star",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export default function OurStoryPageClient({
  partner1 = "RayHan",
  partner2 = "Afrin",
  anniversaryDate = "2026-01-14T16:18:00",
}) {
  const shouldReduceMotion = useReducedMotion();
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [daysTogether, setDaysTogether] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "firsts",
    desc: "",
    icon: "heart",
  });
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("rayhan_afrin_story_milestones");
      if (saved) {
        setMilestones(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load milestones from localStorage", err);
    }
  }, []);

  useEffect(() => {
    const calculateDays = () => {
      const anniversary = new Date(anniversaryDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - anniversary.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    };

    calculateDays();
    const interval = window.setInterval(calculateDays, 60000);
    return () => window.clearInterval(interval);
  }, [anniversaryDate]);

  const filteredMilestones = useMemo(() => {
    if (activeFilter === "all") return milestones;
    return milestones.filter((item) => item.category === activeFilter);
  }, [activeFilter, milestones]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMilestone = (e) => {
    e.preventDefault();

    const newMilestone = {
      id: Date.now(),
      date: formData.date || "Special Memory",
      title: formData.title,
      category: formData.category,
      desc: formData.desc,
      icon: formData.icon || "heart",
    };

    const updated = [newMilestone, ...milestones];
    setMilestones(updated);

    try {
      localStorage.setItem("rayhan_afrin_story_milestones", JSON.stringify(updated));
    } catch (err) {
      console.error("Failed to save milestone", err);
    }

    setFormSuccess(true);
    setFormData({
      title: "",
      date: "",
      category: "firsts",
      desc: "",
      icon: "heart",
    });

    window.setTimeout(() => {
      setIsModalOpen(false);
      setFormSuccess(false);
    }, 1400);
  };

  const ambientHearts = useMemo(
    () => [
      { top: "8%", left: "6%", size: 18, delay: 0, duration: 8 },
      { top: "18%", left: "90%", size: 15, delay: 1.2, duration: 9 },
      { top: "45%", left: "4%", size: 14, delay: 0.6, duration: 10 },
      { top: "60%", left: "92%", size: 20, delay: 2, duration: 11 },
      { top: "85%", left: "10%", size: 16, delay: 1.5, duration: 9 },
    ],
    []
  );

  const currentChapter = CHAPTERS[selectedChapter];
  const ChapterIcon = currentChapter.icon;

  return (
    <div className="relative overflow-hidden px-4 sm:px-6 lg:px-8 text-white">
      {/* Background ambient radial gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(193,18,31,0.22),transparent_35%),radial-gradient(circle_at_85%_25%,rgba(231,185,138,0.12),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(122,0,21,0.26),transparent_40%),linear-gradient(180deg,#050505_0%,#090505_50%,#050505_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.9)_100%)]"
      />

      {/* Floating hearts */}
      {!shouldReduceMotion &&
        ambientHearts.map((heart) => (
          <motion.div
            key={`${heart.top}-${heart.left}`}
            aria-hidden="true"
            className="pointer-events-none absolute text-[#E7B98A]/12 blur-[0.3px]"
            style={{ top: heart.top, left: heart.left }}
            animate={{ y: [-6, -30, -6], opacity: [0.08, 0.32, 0.08] }}
            transition={{
              repeat: Infinity,
              duration: heart.duration,
              delay: heart.delay,
              ease: "easeInOut",
            }}
          >
            <Heart size={heart.size} fill="currentColor" />
          </motion.div>
        ))}

      <div className="relative z-10 mx-auto max-w-6xl space-y-24 pt-8">
        {/* ================= HERO STORY SECTION ================= */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E7B98A]/25 bg-[#111111]/80 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#E7B98A] shadow-[0_12px_34px_rgba(0,0,0,0.45)] backdrop-blur-[20px]">
            <Sparkles size={14} className="text-[#D4AF37]" />
            The True Chronicle of Our Love
          </div>

          <h1 className="font-playfair text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Written Long Before We Knew <br />
            <span className="bg-[linear-gradient(180deg,#ffb4b4,#ff4d6d,#b3002d)] bg-clip-text italic text-transparent drop-shadow-[0_0_34px_rgba(193,18,31,0.32)]">
              Our Journey Had Begun
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-[#B5B5B5] sm:text-base md:text-lg">
            Dedicated to the heartfelt journey of{" "}
            <strong className="font-semibold text-white">{partner1}</strong> &{" "}
            <strong className="font-semibold text-white">{partner2}</strong>. Began on January 14, 2026 with a locked profile, a dream of peace, and faith in Allah's perfect timing.
          </p>

          {/* Couple Avatars & Quick Counters */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 rounded-full border border-white/[0.08] bg-[rgba(20,20,20,0.75)] px-5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.4)] backdrop-blur-[20px]">
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#E7B98A]/60">
                <Image
                  src="/rayhan-avatar.png"
                  alt={partner1}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
              <span className="font-playfair text-sm font-bold text-white">{partner1}</span>
              <Heart size={14} className="text-[#C1121F]" fill="currentColor" />
              <span className="font-playfair text-sm font-bold text-white">{partner2}</span>
              <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#E7B98A]/60">
                <Image
                  src="/afrin-avatar.png"
                  alt={partner2}
                  fill
                  className="object-cover"
                  sizes="36px"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#E7B98A]/25 bg-black/40 px-5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-[20px]">
              <Calendar size={15} className="text-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#E7B98A]">
                Since Jan 14, 2026 • {daysTogether} Days of Love
              </span>
            </div>
          </div>
        </motion.div>

        {/* ================= COMPLETE WRITTEN STORY (PARCHMENT MANUSCRIPT) ================= */}
        <motion.section
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[36px] border border-[#E7B98A]/20 bg-[linear-gradient(145deg,rgba(25,12,16,0.85),rgba(15,10,12,0.95))] p-6 sm:p-12 lg:p-16 shadow-[0_30px_90px_rgba(0,0,0,0.65),0_0_60px_rgba(193,18,31,0.18)] backdrop-blur-2xl"
        >
          {/* Ambient Glows & Watermark */}
          <div className="absolute right-0 top-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-[#C1121F]/15 blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 -ml-20 -mb-20 h-72 w-72 rounded-full bg-[#E7B98A]/10 blur-3xl pointer-events-none" />
          <Quote className="absolute right-8 top-8 text-white/[0.03] w-36 h-36 pointer-events-none" />

          <div className="relative z-10 space-y-10">
            <div className="border-b border-white/[0.08] pb-6 text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-[0.26em] text-[#D4AF37]">
                In RayHan's Own Words
              </span>
              <h2 className="font-playfair text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Our Love Story
              </h2>
              <p className="font-playfair text-sm sm:text-base italic text-[#E7B98A]">
                "Sometimes, the most beautiful journeys begin in the most unexpected ways."
              </p>
            </div>

            {/* Story Text Body */}
            <div className="space-y-6 text-sm sm:text-base md:text-lg leading-relaxed text-[#D6D6D6] font-normal">
              <p>
                It was <strong className="text-white font-semibold">January 14, 2026, around 2:30 PM</strong>. I was lying on my bed, getting ready to take an afternoon nap. As I casually scrolled through Facebook, my eyes suddenly stopped at the profile picture of a beautiful girl who appeared in my Friend Suggestions.
              </p>

              <p className="font-playfair text-xl sm:text-2xl font-bold text-[#ffd5d9] italic border-l-2 border-[#E7B98A] pl-4 py-1 bg-black/25 rounded-r-2xl">
                Her name was Afrin Yesmin.
              </p>

              <p>
                Her profile was locked, so I couldn't see much—only her tiny profile picture. Yet, for some reason, I couldn't stop looking at it. Without thinking too much, I sent her a friend request and went to sleep.
              </p>

              <div className="rounded-2xl border border-white/[0.08] bg-black/40 p-5 sm:p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E7B98A] flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#D4AF37]" /> The Unusual Dream
                </span>
                <p className="italic text-[#ffd5d9] leading-relaxed">
                  A little while later, I had the most unusual dream. In my dream, I sent Afrin a message saying, <span className="font-semibold text-white">"Assalamu Alaikum."</span> She replied, <span className="font-semibold text-white">"Wa Alaikum Assalam."</span> I remember feeling incredibly happy. We exchanged a few more messages, and everything felt so real.
                </p>
              </div>

              <p>
                Then, suddenly, I woke up. It was only a dream. But the feeling it left behind was impossible to ignore. I couldn't stay calm. I felt an overwhelming urge to talk to her—as if that dream was somehow telling me that I needed to reach out.
              </p>

              <p>
                After struggling with my thoughts for a while, I decided to stop overthinking it. At exactly <strong className="text-white font-semibold">4:18 PM</strong>, I opened Facebook Messenger and sent her the same greeting:
              </p>

              <div className="text-center py-2">
                <span className="inline-block rounded-full border border-[#E7B98A]/30 bg-[linear-gradient(135deg,rgba(100,13,20,0.6),rgba(193,18,31,0.3))] px-6 py-2.5 font-playfair text-lg sm:text-xl font-bold text-white shadow-[0_0_24px_rgba(193,18,31,0.25)]">
                  "Assalamu Alaikum."
                </span>
              </div>

              <p>
                To my surprise, she replied exactly as she had in my dream. It felt unreal. We exchanged a few messages that afternoon, and later that night, around 11:00 PM, we talked again. From that day onward, our conversations slowly became a part of our everyday lives.
              </p>

              <p>
                At that time, Afrin was taking her third-year final examinations. Her mother was staying with her in Dhaka, and they shared the same room. Because of that, it wasn't easy for us to talk over the phone. One day, when I asked if we could have a call, she gently suggested that mornings would be better.
              </p>

              <p className="rounded-2xl border-l-2 border-[#ff4d6d] bg-black/30 p-4 sm:p-5 italic text-white">
                So, on <strong className="font-bold text-[#E7B98A]">January 17, 2026, at 7:00 AM</strong>, we had our very first phone call. That morning became the beginning of a beautiful habit. From then on, I would wake up every day—not because of an alarm, but because I couldn't wait to hear her voice. While her mother was busy preparing breakfast, those quiet morning moments became our little time together.
              </p>

              <p>
                Looking back today, it still amazes me how everything began—with a simple Facebook friend suggestion, a tiny profile picture, an unexpected dream, and a simple greeting of peace.
              </p>

              <p className="font-playfair text-lg sm:text-xl italic text-[#ffd5d9] text-center py-2">
                “Sometimes, the most beautiful journeys begin in the most unexpected ways. And perhaps, some stories are written long before we even realize that they have begun.”
              </p>

              <div className="border-t border-white/[0.08] pt-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] block">
                  Bringing Our Families Closer
                </span>
                <p>
                  And then came the days that brought us closer to our families... My elder sister had come home from Germany, and because of her arrival, there was a different kind of happiness and excitement in our home.
                </p>
                <p>
                  On <strong className="text-white font-semibold">July 31</strong>, I finally told my family about Afrin and our relationship. Through that moment, everyone in my family came to know about us. Then, on <strong className="text-white font-semibold">August 8</strong>, Afrin met my sister for the first time. It was a simple meeting, but for me, it meant so much. Seeing the person I love meet someone from my family felt like another beautiful step forward in our journey.
                </p>
                <p>
                  Then, on <strong className="text-white font-semibold">August 19</strong>, Afrin told her mother about me and about our relationship.
                </p>
              </div>

              {/* Dua & Faith Closing Card */}
              <div className="mt-8 rounded-[28px] border border-[#E7B98A]/35 bg-[linear-gradient(135deg,rgba(100,13,20,0.7),rgba(20,20,20,0.95))] p-6 sm:p-8 text-center space-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_35px_rgba(193,18,31,0.2)]">
                <Heart size={28} className="mx-auto text-[#ff4d6d] drop-shadow-[0_0_16px_rgba(193,18,31,0.7)]" fill="currentColor" />
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-white">
                  Our Faith & Humble Prayer
                </h3>
                <p className="text-sm sm:text-base text-[#ffd5d9] leading-relaxed">
                  And for now, this is how our days are going. We are taking things one day at a time, holding on to each other, and waiting patiently for the day when Allah, in His perfect timing, brings us together in a way that is written for us.
                </p>
                <p className="text-sm sm:text-base text-[#D6D6D6] leading-relaxed">
                  We don't know exactly when that day will come. But we have faith. Faith in Allah's plan, faith in our journey, and faith that if we are truly meant for each other, no distance, no obstacle, and no passage of time will ever be able to keep us apart.
                </p>
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[#E7B98A]">
                  Until then, we will keep waiting, keep praying, and keep walking this journey together.
                </p>
                <div className="pt-2">
                  <p className="font-playfair text-lg sm:text-xl font-bold italic text-white bg-black/40 py-3 px-6 rounded-2xl border border-white/10">
                    "May Allah bless our relationship, protect us from every hardship, and, if it is best for us, unite us in a beautiful and halal way. Ameen. 🤍"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ================= CHAPTERS OF US (NARRATIVE STORYBOOK) ================= */}
        <motion.section
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-8"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              Interactive Storybook
            </span>
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
              The Chapters of Us
            </h2>
            <p className="text-sm text-[#B5B5B5]">
              Flip through the defining chapters of RayHan & Afrin's true love story.
            </p>
          </div>

          {/* Chapter Selector Tabs */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 pt-2 scrollbar-none">
            {CHAPTERS.map((ch, idx) => {
              const isSelected = selectedChapter === idx;
              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => setSelectedChapter(idx)}
                  className={`group relative flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${
                    isSelected
                      ? "border-[#E7B98A]/50 bg-[linear-gradient(135deg,#640D14,#C1121F)] text-white shadow-[0_8px_30px_rgba(193,18,31,0.35)]"
                      : "border-white/[0.08] bg-[rgba(20,20,20,0.7)] text-[#B5B5B5] hover:border-[#E7B98A]/30 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <span className={`text-[10px] font-extrabold ${isSelected ? "text-[#ffd5d9]" : "text-[#D4AF37]"}`}>
                    {ch.number}
                  </span>
                  <span>{ch.tag}</span>
                </button>
              );
            })}
          </div>

          {/* Active Chapter Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentChapter.id}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.55),0_0_48px_rgba(193,18,31,0.18)] backdrop-blur-[20px]"
            >
              <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#C1121F]/15 blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
                <div className="space-y-6 lg:col-span-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#D4AF37]">
                      Chapter {currentChapter.number} • {currentChapter.tag}
                    </span>
                    <span className="text-xs font-semibold text-[#B5B5B5]">
                      {currentChapter.date}
                    </span>
                  </div>

                  <h3 className="font-playfair text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                    {currentChapter.title}
                  </h3>

                  <blockquote className="rounded-2xl border-l-2 border-[#E7B98A] bg-black/30 p-4 font-playfair text-base italic text-[#ffd5d9] sm:text-lg">
                    {currentChapter.quote}
                  </blockquote>

                  <p className="text-sm font-normal leading-relaxed text-[#B5B5B5] sm:text-base">
                    {currentChapter.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {currentChapter.highlights.map((hl) => (
                      <span
                        key={hl}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-black/40 px-3 py-1 text-[11px] font-semibold text-[#E7B98A]"
                      >
                        <Sparkles size={11} className="text-[#D4AF37]" />
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center lg:col-span-4">
                  <div className="relative flex flex-col items-center justify-center rounded-[28px] border border-white/[0.08] bg-[#111111]/90 p-8 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div
                      className={`grid h-20 w-20 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br ${currentChapter.color} text-white shadow-[0_0_34px_rgba(193,18,31,0.4)]`}
                    >
                      <ChapterIcon size={36} />
                    </div>
                    <span className="mt-4 font-playfair text-xl font-bold text-white">
                      Chapter {currentChapter.number}
                    </span>
                    <span className="text-xs font-semibold text-[#E7B98A] mt-1">
                      {currentChapter.tag}
                    </span>
                    <div className="mt-6 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedChapter((prev) => (prev > 0 ? prev - 1 : CHAPTERS.length - 1))}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/40 text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#E7B98A]"
                        aria-label="Previous chapter"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <span className="text-xs font-bold text-[#B5B5B5]">
                        {selectedChapter + 1} / {CHAPTERS.length}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedChapter((prev) => (prev < CHAPTERS.length - 1 ? prev + 1 : 0))}
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-black/40 text-white transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#E7B98A]"
                        aria-label="Next chapter"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* ================= INTERACTIVE TIMELINE SECTION ================= */}
        <motion.section
          id="timeline"
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          <div className="text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#E7B98A]">
              Our Memory Road
            </span>
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
              Love Journey Milestones
            </h2>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-[#B5B5B5]">
              Every defining step and sacred milestone from 2026 to our blessed days today.
            </p>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.26)] outline-none transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 active:scale-[0.98]"
              >
                <Plus size={16} className="transition-transform duration-300 group-hover:rotate-90" />
                Add New Milestone
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((f) => {
              const FilterIcon = f.icon;
              const isActive = activeFilter === f.key;

              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${
                    isActive
                      ? "border-[#E7B98A]/50 bg-[#C1121F]/25 text-white shadow-[0_0_24px_rgba(193,18,31,0.25)]"
                      : "border-white/[0.08] bg-[#111111]/70 text-[#B5B5B5] hover:border-[#E7B98A]/30 hover:bg-white/[0.05] hover:text-white"
                  }`}
                  aria-pressed={isActive}
                >
                  <FilterIcon size={14} className={isActive ? "text-[#E7B98A]" : "text-[#D4AF37]"} />
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Timeline Nodes */}
          <div className="relative mx-auto max-w-3xl ml-4 sm:ml-auto border-l border-white/10 pl-8 space-y-10 sm:pl-12">
            <AnimatePresence mode="popLayout">
              {filteredMilestones.length === 0 ? (
                <motion.p
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-sm text-[#B5B5B5] py-8"
                >
                  No milestones found in this category yet.
                </motion.p>
              ) : (
                filteredMilestones.map((milestone) => {
                  const style = CATEGORY_STYLES[milestone.category] || CATEGORY_STYLES.firsts;
                  const Icon = ICON_MAP[milestone.icon] || Heart;

                  return (
                    <motion.div
                      key={milestone.id}
                      layout
                      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                      className="group relative"
                    >
                      <div
                        className={`absolute -left-[41px] top-2 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-gradient-to-br ${style.node} text-white shadow-[0_0_26px_rgba(193,18,31,0.28)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_34px_rgba(193,18,31,0.5)] sm:-left-[61px] sm:h-11 sm:w-11`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.12)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_50px_rgba(193,18,31,0.22)]">
                        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                          <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#E7B98A]">
                            {milestone.date}
                          </span>
                          <span
                            className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] sm:self-auto ${style.badge}`}
                          >
                            {milestone.category}
                          </span>
                        </div>

                        <h3 className="mb-2 font-playfair text-xl font-bold leading-snug text-white">
                          {milestone.title}
                        </h3>

                        <p className="text-sm font-medium leading-relaxed text-[#B5B5B5]">
                          {milestone.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ================= SACRED PROMISES SECTION ================= */}
        <motion.section
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={fadeUp}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-10"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-[#D4AF37]">
              Written In Stone & Heart
            </span>
            <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">
              Our Sacred Promises
            </h2>
            <p className="text-sm text-[#B5B5B5]">
              The vows and prayerful promises that keep our love pure, loyal, and eternal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROMISES.map((promise) => {
              const PromiseIcon = promise.icon;
              return (
                <div
                  key={promise.id}
                  className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.12)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:border-[#E7B98A]/30 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_50px_rgba(193,18,31,0.22)]"
                >
                  <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-2xl border border-[#D4AF37]/30 bg-[linear-gradient(135deg,#640D14,#C1121F)] text-white shadow-[0_0_24px_rgba(193,18,31,0.3)]">
                    <PromiseIcon size={22} className="text-[#ffd5d9]" />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-white mb-2">
                    {promise.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#B5B5B5]">
                    {promise.text}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* ================= CALL TO ACTION SECTION ================= */}
        <motion.div
          initial={shouldReduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] border border-[#E7B98A]/20 bg-[linear-gradient(135deg,rgba(100,13,20,0.7),rgba(20,20,20,0.9))] p-8 sm:p-12 text-center shadow-[0_24px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(193,18,31,0.25)] backdrop-blur-[20px]"
        >
          <div className="space-y-4 max-w-2xl mx-auto">
            <Heart size={32} className="mx-auto text-[#ff4d6d] drop-shadow-[0_0_20px_rgba(193,18,31,0.6)]" fill="currentColor" />
            <h3 className="font-playfair text-2xl sm:text-4xl font-bold text-white">
              Walking Hand in Hand Towards Forever
            </h3>
            <p className="text-sm sm:text-base text-[#ffd5d9] leading-relaxed">
              Explore our cherished gallery of memories or leave a heartfelt prayer and secret note for RayHan & Afrin.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/activities"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.3)] outline-none transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(193,18,31,0.5)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
              >
                <Sparkles size={16} className="text-[#D4AF37]" />
                Explore Couple Activities
              </Link>
              <Link
                href="/#memories"
                className="group inline-flex items-center gap-2 rounded-full border border-[#E7B98A]/40 bg-black/40 px-8 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] outline-none backdrop-blur-[20px] transition-all duration-300 hover:bg-white/[0.06] hover:border-[#D4AF37]/70 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
              >
                <Heart size={16} className="text-[#C1121F]" fill="currentColor" />
                View Memories Gallery
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= ADD MILESTONE MODAL ================= */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#111111]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_44px_rgba(193,18,31,0.16)] backdrop-blur-[20px] sm:p-8"
              role="dialog"
              aria-modal="true"
              aria-label="Add a love milestone"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 top-4 rounded-full border border-white/[0.08] bg-black/30 p-2 text-[#B5B5B5] outline-none transition-all duration-300 hover:border-[#E7B98A]/35 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>

              {formSuccess ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.18)] motion-safe:animate-pulse">
                    <Check size={30} />
                  </div>
                  <h3 className="font-playfair text-xl font-bold text-white">Memory Pinned</h3>
                  <p className="text-xs leading-relaxed text-[#B5B5B5]">
                    Your beautiful milestone has been woven into our story timeline.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleAddMilestone} className="space-y-4">
                  <div className="pb-2 text-center">
                    <h3 className="font-playfair text-xl font-bold text-white">Add a Love Milestone</h3>
                    <p className="text-xs text-[#B5B5B5]">
                      Archive another unforgettable moment in our shared journey.
                    </p>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                      Milestone Title
                    </span>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., Special Family Gathering..."
                      required
                      className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                    />
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                        Date of Event
                      </span>
                      <input
                        type="text"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        placeholder="E.g., Jan 14, 2026"
                        required
                        className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                        Category
                      </span>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-3 py-3 text-sm font-medium text-white outline-none transition-all duration-300 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                      >
                        <option value="firsts">The Firsts</option>
                        <option value="celebrations">Family & Steps</option>
                        <option value="daily">Faith & Days</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                      Choose an Icon
                    </span>
                    <div className="flex justify-between gap-2 rounded-2xl border border-white/[0.08] bg-black/30 p-2">
                      {["heart", "sparkles", "star", "map", "cake", "smile"].map((iconKey) => {
                        const Icon = ICON_MAP[iconKey] || Heart;
                        const isSelected = formData.icon === iconKey;

                        return (
                          <button
                            key={iconKey}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, icon: iconKey }))}
                            className={`grid h-10 w-10 place-items-center rounded-xl border outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${
                              isSelected
                                ? "border-[#E7B98A]/50 bg-[#E7B98A]/15 text-[#E7B98A] shadow-[0_0_20px_rgba(231,185,138,0.2)]"
                                : "border-transparent text-[#B5B5B5] hover:bg-white/[0.05] hover:text-white"
                            }`}
                            aria-label={iconKey}
                            aria-pressed={isSelected}
                          >
                            <Icon size={18} />
                          </button>
                        );
                      })}
                    </div>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
                      Tell the Story
                    </span>
                    <textarea
                      name="desc"
                      value={formData.desc}
                      onChange={handleInputChange}
                      placeholder="What made this moment so special? Record your cozy memories here..."
                      rows={3}
                      required
                      className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                    />
                  </label>

                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.24)] outline-none transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
                  >
                    <PenLine size={16} className="transition-transform duration-300 group-hover:-rotate-6" />
                    Pin to Timeline
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
