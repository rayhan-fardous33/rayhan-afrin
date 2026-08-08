"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

// ─── STATIC "SEED" MEMORIES (always shown alongside dynamic DB memories) ────
const STATIC_MEMORIES = [
  // --- BANNER IMAGES (Used for the Top Slideshow) ---
  {
    id: "static_1",
    isStatic: true,
    isBanner: true,
    title: "The Nature Calls",
    date: "May 14, 2026",
    location: "Ramna Park",
    category: "trips",
    desc: "After college, we went to Ramna Park together. 🌳❤️ We took a break from our busy day, walked through the peaceful paths, simply enjoyed each other's company.",
    imageUrl: "https://i.ibb.co.com/60ZhcHZW/IMG-20260514-134231.jpg",
  },
  {
    id: "static_2",
    isStatic: true,
    isBanner: true,
    title: "The First K***",
    date: "May 18, 2026",
    location: "Toggi Fun World",
    category: "trips",
    desc: "Toggi Fun World. 🎠❤️ A day filled with laughter, adventure, and so many firsts together—memories we'll never forget.",
    imageUrl: "https://i.ibb.co.com/NvzPGkb/IMG-20260518-144846.jpg",
  },
  {
    id: "static_3",
    isStatic: true,
    isBanner: true,
    title: "Our First Game",
    date: "May, 2026",
    location: "Chillox, Dhanmondi",
    category: "dates",
    desc: "Chillox, Dhanmondi. ❤️ Our first game of UNO, shared food, shared books, and countless smiles. Sometimes the simplest moments become the most unforgettable memories.",
    imageUrl: "https://i.ibb.co.com/kgp6gYRd/20260511-123515-1.jpg",
  },
  {
    id: "static_4",
    isStatic: true,
    isBanner: true,
    title: "Spicy Food 🌶️",
    date: "June 13, 2026",
    location: "Mohammadpur",
    category: "dates",
    desc: "A spicy date at Oro Restaurant, Mohammadpur. 🌶️❤️ Good food, great company, and another beautiful memory together.",
    imageUrl: "https://i.ibb.co.com/VrD5PKw/20260613-140455.jpg",
  },
  {
    id: "static_5",
    isStatic: true,
    isBanner: true,
    title: "Movie Theater",
    date: "May 05, 2026",
    location: "Bashundhara City",
    category: "dates",
    desc: "We went to Star Cineplex at Bashundhara City to watch a movie together. It was our first movie date, and it made the day really special.",
    imageUrl: "https://i.ibb.co.com/QjHy6Z1p/IMG-20260505-122313.jpg",
  },

  // --- GALLERY IMAGES ---
  {
    id: "static_6",
    isStatic: true,
    isBanner: false,
    title: "Rainy Afternoon Cafe",
    date: "June 15, 2024",
    category: "dates",
    location: "The Local Grind",
    desc: "Where it all started. The rain was pouring and we shared a single blueberry muffin.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "static_7",
    isStatic: true,
    isBanner: false,
    title: "First Anniversary",
    date: "June 15, 2025",
    category: "celebrations",
    location: "La Piazza Ristorante",
    desc: "Dressed up and ate way too much pasta.",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "static_8",
    isStatic: true,
    isBanner: false,
    title: "Messy Baking Night",
    date: "Oct 12, 2025",
    category: "cozy",
    location: "Our Kitchen",
    desc: "The chocolate soufflé collapsed entirely, but we laughed so hard it didn't matter.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "static_9",
    isStatic: true,
    isBanner: false,
    title: "Road Trip Horizons",
    date: "March 22, 2025",
    category: "trips",
    location: "Pacific Coast Highway",
    desc: "Driving with the windows down, music blasting, entirely disconnected from the world.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "static_10",
    isStatic: true,
    isBanner: false,
    title: "Coffee Dates",
    date: "Every Sunday",
    category: "cozy",
    location: "Corner Bakery Cafe",
    desc: "Our favorite weekend ritual. Double lattes and planning the week.",
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "static_11",
    isStatic: true,
    isBanner: false,
    title: "Midnight Picnic",
    date: "Aug 10, 2025",
    category: "dates",
    location: "Central Park Hill",
    desc: "Bought cheap wine and laid out a blanket in the park at midnight.",
    imageUrl: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?auto=format&fit=crop&w=600&q=80",
  }
];

const THEMES = {
  rose: {
    bg: "bg-gradient-to-b from-rose-50 via-slate-50 to-rose-50/20",
    textPrimary: "text-slate-900",
    textMuted: "text-slate-500",
    accent: "bg-rose-500 hover:bg-rose-600",
    accentText: "text-rose-500",
    border: "border-rose-100",
    cardBg: "bg-white",
    heroOverlay: "from-slate-950/80 via-slate-900/30 to-transparent",
    studioBtn: "bg-rose-500 text-white"
  },
  midnight: {
    bg: "bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950",
    textPrimary: "text-slate-100",
    textMuted: "text-slate-400",
    accent: "bg-amber-400 hover:bg-amber-500 text-slate-950",
    accentText: "text-amber-400",
    border: "border-slate-800",
    cardBg: "bg-slate-900/60 backdrop-blur-md",
    heroOverlay: "from-slate-950 via-slate-950/40 to-transparent",
    studioBtn: "bg-amber-400 text-slate-950"
  },
  forest: {
    bg: "bg-gradient-to-b from-stone-100 via-emerald-50/20 to-stone-200/50",
    textPrimary: "text-stone-900",
    textMuted: "text-stone-500",
    accent: "bg-emerald-700 hover:bg-emerald-800 text-white",
    accentText: "text-emerald-700",
    border: "border-emerald-100",
    cardBg: "bg-stone-50/80 backdrop-blur-md",
    heroOverlay: "from-stone-950/80 via-stone-900/30 to-transparent",
    studioBtn: "bg-emerald-700 text-white"
  },
  vintage: {
    bg: "bg-gradient-to-b from-amber-50/60 via-amber-100/20 to-amber-50/40",
    textPrimary: "text-amber-950",
    textMuted: "text-amber-800/60",
    accent: "bg-amber-800 hover:bg-amber-900 text-white",
    accentText: "text-amber-800",
    border: "border-amber-200/60",
    cardBg: "bg-amber-50/40 border-amber-200/60",
    heroOverlay: "from-amber-950/80 via-amber-950/30 to-transparent",
    studioBtn: "bg-amber-800 text-white"
  }
};

export default function AllMemories() {
  const { data: session } = useSession();

  // Merged list: dynamic DB memories + static seed memories
  const [dbMemories, setDbMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    category: "dates",
    desc: "",
    imageUrl: "",
    isBanner: false,
  });

  const [activeTheme, setActiveTheme] = useState("rose");
  const [cardStyle, setCardStyle] = useState("polaroid");
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // ── Derived role check ──────────────────────────────────────────────────────
  const userRole = session?.user?.role || "User";
  const canAddMemory = userRole === "Rayhan" || userRole === "Afrin";

  // ── Fetch from MongoDB ──────────────────────────────────────────────────────
  const fetchMemories = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/memories");
      const data = await res.json();
      if (data.success) {
        setDbMemories(data.memories || []);
      }
    } catch (err) {
      console.error("Failed to load memories from DB", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // ── Combined list: DB first (newest), then static ──────────────────────────
  const allMemories = [...dbMemories, ...STATIC_MEMORIES];

  const bannerImages = allMemories.filter((m) => m.isBanner);
  const galleryImages = allMemories.filter((m) => !m.isBanner);

  // ── Slideshow state ─────────────────────────────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (bannerImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  // ── Filter logic for gallery ────────────────────────────────────────────────
  const filteredGallery = galleryImages.filter((item) =>
    activeFilter === "all" ? true : item.category === activeFilter
  );

  // ── Add Memory ─────────────────────────────────────────────────────────────
  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!formData.title) return;
    if (!canAddMemory) {
      toast.error("Only Rayhan and Afrin can add memories.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/memories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("✨ Memory pinned to the scrapbook!");
        setDbMemories((prev) => [data.memory, ...prev]);
        setIsAddModalOpen(false);
        setFormData({
          title: "",
          date: "",
          location: "",
          category: "dates",
          desc: "",
          imageUrl: "",
          isBanner: false,
        });
      } else {
        toast.error(data.error || "Failed to save memory.");
      }
    } catch (err) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Delete Memory ──────────────────────────────────────────────────────────
  const handleDeleteMemory = async (memory) => {
    if (!canAddMemory) {
      toast.error("Only Rayhan and Afrin can delete memories.");
      return;
    }
    if (memory.isStatic) {
      toast.info("Original memories cannot be removed. 🔒");
      return;
    }

    if (!confirm(`Remove "${memory.title}" from the scrapbook?`)) return;

    setDeletingId(memory.id);
    try {
      const res = await fetch("/api/memories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memory.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Memory removed.");
        setDbMemories((prev) => prev.filter((m) => m.id !== memory.id));
        if (selectedImage?.id === memory.id) setSelectedImage(null);
      } else {
        toast.error(data.error || "Could not delete.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const colors = THEMES[activeTheme];

  // ── Card Renderers ─────────────────────────────────────────────────────────
  const renderCard = (item) => {
    const isDeleting = deletingId === item.id;

    const DeleteBtn = () =>
      canAddMemory && !item.isStatic ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteMemory(item);
          }}
          disabled={isDeleting}
          className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-rose-600/80 hover:bg-rose-700 text-white text-xs flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100"
          title="Remove memory"
        >
          {isDeleting ? "…" : "✕"}
        </button>
      ) : null;

    const DynamicBadge = () =>
      !item.isStatic ? (
        <span className="absolute top-2 left-2 z-20 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest bg-emerald-500 text-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-all">
          New
        </span>
      ) : null;

    if (cardStyle === "polaroid") {
      return (
        <div
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className={`relative p-4 pb-7 rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col justify-between transform hover:scale-[1.02] border ${colors.border} ${colors.cardBg}`}
        >
          <DeleteBtn />
          <DynamicBadge />
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-amber-200/40 border border-amber-300/10 rotate-1 mix-blend-multiply opacity-80 z-10" />

          <div className="w-full aspect-[4/3] rounded-sm overflow-hidden bg-slate-50 relative">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>

          <div className="pt-4 text-center px-1">
            <h3 className="font-serif italic font-bold text-slate-800 text-base leading-tight">
              {item.title}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              <span>📅 {item.date}</span>
              <span>•</span>
              <span>📍 {item.location || "Somewhere Perfect"}</span>
            </div>
          </div>
        </div>
      );
    }

    if (cardStyle === "minimal") {
      return (
        <div
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className={`relative rounded-3xl overflow-hidden group cursor-pointer border ${colors.border} ${colors.cardBg} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between`}
        >
          <DeleteBtn />
          <DynamicBadge />
          <div className="w-full h-48 overflow-hidden relative">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur-md rounded-full text-slate-800 shadow-sm">
              {item.category}
            </span>
          </div>

          <div className="p-5 text-left">
            <h3 className={`font-sans font-bold text-lg leading-tight ${colors.textPrimary}`}>
              {item.title}
            </h3>
            <p className={`text-xs mt-1.5 leading-relaxed truncate ${colors.textMuted}`}>
              {item.desc}
            </p>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100/10 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>📅 {item.date}</span>
              <span>📍 {item.location || "Cozy Spot"}</span>
            </div>
          </div>
        </div>
      );
    }

    if (cardStyle === "ticket") {
      return (
        <div
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className={`relative rounded-2xl overflow-hidden group cursor-pointer border-2 ${colors.border} ${colors.cardBg} shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between`}
        >
          <DeleteBtn />
          <DynamicBadge />
          <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-50 border-r-2 border-slate-200 z-10" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-50 border-l-2 border-slate-200 z-10" />

          <div className="w-full h-36 overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          <div className="p-4 pt-5 text-left flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-[9px] font-mono font-extrabold text-rose-500 uppercase tracking-widest">
                <span>BOARDING PASS</span>
                <span>★ {item.category}</span>
              </div>
              <h3 className={`font-mono text-base font-bold mt-1.5 leading-snug uppercase ${colors.textPrimary}`}>
                {item.title}
              </h3>
            </div>

            <div className="mt-6 pt-3 border-t border-dashed border-slate-300/50 flex justify-between items-center text-[10px] font-mono font-semibold text-slate-400 uppercase">
              <div>
                <span className="block text-[8px] opacity-60">DATE</span>
                <span>{item.date}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] opacity-60">DESTINATION</span>
                <span>{item.location || "GATE LOVE"}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (cardStyle === "neon") {
      return (
        <div
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className="relative rounded-2xl overflow-hidden group cursor-pointer bg-slate-950 border border-fuchsia-500/30 hover:border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.05)] hover:shadow-[0_0_20px_rgba(217,70,239,0.25)] transition-all duration-500 h-80 flex flex-col justify-end p-5 text-left"
        >
          <DeleteBtn />
          <DynamicBadge />
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

          <div className="relative z-10 space-y-2">
            <span className="inline-block px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-950/80 border border-fuchsia-500/30 rounded-full">
              {item.category}
            </span>
            <h3 className="font-sans text-lg font-black text-white leading-tight uppercase tracking-wide">
              {item.title}
            </h3>
            <p className="text-slate-300 text-xs line-clamp-2">{item.desc}</p>
            <div className="pt-2 flex items-center justify-between text-[9px] font-mono font-bold text-fuchsia-300 uppercase tracking-widest border-t border-fuchsia-500/20">
              <span>📅 {item.date}</span>
              <span>📍 {item.location || "GRID"}</span>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <section className={`min-h-screen pb-24 font-sans transition-colors duration-500 ${colors.bg}`}>

      {/* 1. HERO SLIDESHOW BANNER */}
      <div className="relative w-full h-[50vh] sm:h-[65vh] lg:h-[75vh] overflow-hidden bg-slate-900">
        {bannerImages.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${colors.heroOverlay}`} />

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 md:p-16 text-center sm:text-left text-white max-w-7xl mx-auto">
              <span className="inline-block px-3 py-1 mb-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-rose-500/80 backdrop-blur-sm rounded-full">
                Featured Memory ✨
              </span>
              {!slide.isStatic && (
                <span className="ml-2 inline-block px-2 py-1 mb-3 text-[9px] font-bold uppercase tracking-widest bg-emerald-500/80 backdrop-blur-sm rounded-full">
                  ✦ New
                </span>
              )}
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-3">
                {slide.title}
              </h2>
              <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-medium leading-relaxed hidden sm:block">
                {slide.desc}
              </p>
              <div className="mt-4 flex items-center justify-center sm:justify-start gap-4 text-xs font-semibold tracking-wider text-rose-200 uppercase">
                <span>📍 {slide.location}</span>
                <span>•</span>
                <span>📅 {slide.date}</span>
              </div>
            </div>
          </div>
        ))}

        {/* Slideshow Dots */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2 bg-rose-500'
                  : 'w-2 h-2 bg-white/50 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* FLOATING STYLE STUDIO TOGGLER */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsStudioOpen(!isStudioOpen)}
          className={`px-5 py-3 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 ${colors.studioBtn}`}
        >
          🎨 Style Studio
        </button>
      </div>

      {/* STYLE STUDIO DRAWER */}
      {isStudioOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end animate-fade-in" onClick={() => setIsStudioOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between text-left animate-slide-in overflow-y-auto"
          >
            <div className="space-y-8">
              <div className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">Style Studio</h3>
                  <p className="text-xs text-slate-500 mt-1">Customize your scrapbook aesthetics</p>
                </div>
                <button onClick={() => setIsStudioOpen(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
              </div>

              {/* Theme Picker */}
              <div className="space-y-3">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Aesthetic Color Palette
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "rose", label: "Soft Rose 🌸", class: "bg-rose-50 text-rose-900 border-rose-200" },
                    { id: "midnight", label: "Midnight Dream 🌙", class: "bg-slate-950 text-slate-200 border-slate-800" },
                    { id: "forest", label: "Sage Forest 🌿", class: "bg-emerald-50 text-emerald-900 border-emerald-100" },
                    { id: "vintage", label: "Warm Coffee ☕", class: "bg-amber-50 text-amber-950 border-amber-200" }
                  ].map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => setActiveTheme(theme.id)}
                      className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${theme.class} ${
                        activeTheme === theme.id ? "ring-2 ring-rose-500 ring-offset-2 scale-102" : "opacity-80 hover:opacity-100"
                      }`}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Card Style Picker */}
              <div className="space-y-3">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Scrapbook Card Layout
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "polaroid", label: "Polaroid Captions 🖼️" },
                    { id: "minimal", label: "Glassmorphism 💎" },
                    { id: "ticket", label: "Travel Tickets 🎟️" },
                    { id: "neon", label: "Cyber Glow ⚡" }
                  ].map(style => (
                    <button
                      key={style.id}
                      onClick={() => setCardStyle(style.id)}
                      className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                        cardStyle === style.id
                          ? "bg-slate-900 text-white border-slate-900 scale-102"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t mt-8">
              <button
                onClick={() => setIsStudioOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all"
              >
                Apply Style Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. GALLERY HEADER & FILTERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-10 text-center">
        <span className="text-rose-500 font-serif italic text-lg font-semibold block mb-2">
          The Vault
        </span>
        <h2 className={`text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-2 ${colors.textPrimary}`}>
          All Our Beautiful Moments
        </h2>

        {/* DB count indicator */}
        {!isLoading && dbMemories.length > 0 && (
          <p className="text-xs font-semibold text-emerald-600 mb-4">
            ✦ {dbMemories.length} new {dbMemories.length === 1 ? "memory" : "memories"} added by Rayhan & Afrin
          </p>
        )}
        {isLoading && (
          <p className="text-xs text-slate-400 mb-4 animate-pulse">Loading memories from the vault…</p>
        )}

        {/* Filter & Add Memory Buttons */}
        <div className="flex justify-center items-center flex-wrap gap-3 mb-10">
          {[
            { id: "all", label: "Everything", icon: "📸" },
            { id: "dates", label: "Date Nights", icon: "🍷" },
            { id: "trips", label: "Adventures", icon: "✈️" },
            { id: "cozy", label: "Cozy Days", icon: "☕" },
            { id: "celebrations", label: "Celebrations", icon: "🎉" },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm border ${
                activeFilter === filter.id
                  ? "bg-slate-900 text-white border-slate-900 shadow-slate-300"
                  : "bg-white hover:bg-rose-50 text-slate-600 border-slate-200 hover:text-rose-600 hover:border-rose-200"
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}

          {canAddMemory && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-md bg-rose-600 hover:bg-rose-700 text-white border border-rose-500 cursor-pointer active:scale-95"
            >
              <span>✨</span>
              <span>Pin New Memory</span>
            </button>
          )}
        </div>

        {/* 3. DYNAMIC SCRAPBOOK GRID */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((item) => renderCard(item))}

            {filteredGallery.length === 0 && (
              <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                <span className="text-4xl block mb-3">👻</span>
                <h3 className="font-serif font-bold text-slate-800 text-lg">No memories found</h3>
                <p className="text-slate-500 text-sm">
                  Looks like we need to go on more {activeFilter} adventures!
                </p>
                {canAddMemory && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-all"
                  >
                    ✨ Pin the First One
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Image */}
            <div className="w-full md:w-3/5 lg:w-2/3 bg-slate-100 relative h-[40vh] md:h-[70vh]">
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all md:hidden"
              >
                ✕
              </button>
            </div>

            {/* Right: Details */}
            <div className="w-full md:w-2/5 lg:w-1/3 p-6 sm:p-10 flex flex-col justify-between bg-white relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 w-8 h-8 rounded-full flex items-center justify-center transition-all hidden md:flex font-bold"
              >
                ✕
              </button>

              <div className="space-y-6 mt-4 md:mt-8">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-rose-100">
                      {selectedImage.category} 🌸
                    </span>
                    {!selectedImage.isStatic && (
                      <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[9px] font-extrabold uppercase tracking-widest rounded-full border border-emerald-100">
                        ✦ New Memory
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-3xl font-extrabold text-slate-900 leading-tight">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">
                    📅 {selectedImage.date}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
                    The Story
                  </span>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium italic">
                    "{selectedImage.desc}"
                  </p>
                </div>

                {/* Added by info for dynamic memories */}
                {selectedImage.addedBy && (
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                      Pinned by
                    </span>
                    <p className="text-xs font-semibold text-slate-600">
                      {selectedImage.addedBy}
                      {selectedImage.addedByRole && (
                        <span className="ml-2 text-rose-500">({selectedImage.addedByRole})</span>
                      )}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Pinned with love ❤️</span>
                {selectedImage.location && <span>📍 {selectedImage.location}</span>}
              </div>

              {/* Delete from lightbox */}
              {canAddMemory && !selectedImage.isStatic && (
                <button
                  onClick={() => handleDeleteMemory(selectedImage)}
                  disabled={deletingId === selectedImage.id}
                  className="mt-3 w-full py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
                >
                  {deletingId === selectedImage.id ? "Removing…" : "🗑 Remove Memory"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. ADD MEMORY MODAL */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 text-slate-900 border border-rose-100 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-rose-100 pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <span>📸</span> Pin a New Memory
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Save a moment forever in Rayhan & Afrin's scrapbook
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-rose-600 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Memory Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sunset Coffee at Dhanmondi Lake"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. August 02, 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm bg-white"
                  >
                    <option value="dates">🍷 Date Night</option>
                    <option value="trips">✈️ Adventure / Trip</option>
                    <option value="cozy">☕ Cozy Moment</option>
                    <option value="celebrations">🎉 Celebration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uttara Lake Park"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://i.ibb.co/... or any image link"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Memory Story / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Write a sweet memory description..."
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 text-sm"
                />
              </div>

              {/* Banner toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isBanner}
                  onChange={(e) => setFormData({ ...formData, isBanner: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 accent-rose-500"
                />
                <span className="text-xs font-bold text-slate-600">
                  Feature in slideshow banner? 🌟
                </span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                      Saving…
                    </>
                  ) : (
                    "Save Memory ❤️"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}