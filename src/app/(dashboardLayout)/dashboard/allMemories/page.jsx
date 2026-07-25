"use client"
import React, { useState, useEffect } from 'react';

const ALL_MEMORIES = [
  // --- BANNER IMAGES (Used for the Top Slideshow) ---
  {
    id: 1,
    isBanner: true,
    title: "The Nature Calls",
    date: "May 14, 2026",
    location: "Ramna Park",
    category: "trips",
    desc: "After college, we went to Ramna Park together. 🌳❤️ We took a break from our busy day, walked through the peaceful paths, simply enjoyed each other's company.",
    imageUrl: "https://i.ibb.co.com/60ZhcHZW/IMG-20260514-134231.jpg",
  },
  {
    id: 2,
    isBanner: true,
    title: "The First K***",
    date: "May 18, 2026",
    location: "Toggi Fun World",
    category: "trips",
    desc: "Toggi Fun World. 🎠❤️ A day filled with laughter, adventure, and so many firsts together—memories we'll never forget.",
    imageUrl: "https://i.ibb.co.com/NvzPGkb/IMG-20260518-144846.jpg",
  },
  {
    id: 3,
    isBanner: true,
    title: "Our First Game",
    date: "May, 2026",
    location: "Chillox, Dhanmondi",
    category: "dates",
    desc: "Chillox, Dhanmondi. ❤️ Our first game of UNO, shared food, shared books, and countless smiles. Sometimes the simplest moments become the most unforgettable memories.",
    imageUrl: "https://i.ibb.co.com/kgp6gYRd/20260511-123515-1.jpg",
  },
  {
    id: 4,
    isBanner: true,
    title: "Spicy Food 🌶️",
    date: "June 13, 2026",
    location: "Mohammadpur",
    category: "dates",
    desc: "A spicy date at Oro Restaurant, Mohammadpur. 🌶️❤️ Good food, great company, and another beautiful memory together.",
    imageUrl: "https://i.ibb.co.com/VrD5PKw/20260613-140455.jpg",
  },
  {
    id: 5,
    isBanner: true,
    title: "Movie Theater",
    date: "May 05, 2026",
    location: "Bashundhara City",
    category: "dates",
    desc: "We went to Star Cineplex at Bashundhara City to watch a movie together. It was our first movie date, and it made the day really special.",
    imageUrl: "https://i.ibb.co.com/QjHy6Z1p/IMG-20260505-122313.jpg",
  },


  // --- GALLERY IMAGES (Mixed Aspect Ratios for Masonry Look) ---
  {
    id: 6,
    isBanner: false,
    gridSpan: "col-span-1 md:col-span-2 row-span-2",
    title: "Rainy Afternoon Cafe",
    date: "June 15, 2024",
    category: "dates",
    location: "The Local Grind",
    desc: "Where it all started. The rain was pouring and we shared a single blueberry muffin.",
    imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 7,
    isBanner: false,
    gridSpan: "col-span-1 row-span-1",
    title: "First Anniversary",
    date: "June 15, 2025",
    category: "celebrations",
    location: "La Piazza Ristorante",
    desc: "Dressed up and ate way too much pasta.",
    imageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    isBanner: false,
    gridSpan: "col-span-1 row-span-2",
    title: "Messy Baking Night",
    date: "Oct 12, 2025",
    category: "cozy",
    location: "Our Kitchen",
    desc: "The chocolate soufflé collapsed entirely, but we laughed so hard it didn't matter.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    isBanner: false,
    gridSpan: "col-span-1 md:col-span-2 row-span-1",
    title: "Road Trip Horizons",
    date: "March 22, 2025",
    category: "trips",
    location: "Pacific Coast Highway",
    desc: "Driving with the windows down, music blasting, entirely disconnected from the world.",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 10,
    isBanner: false,
    gridSpan: "col-span-1 row-span-1",
    title: "Coffee Dates",
    date: "Every Sunday",
    category: "cozy",
    location: "Corner Bakery Cafe",
    desc: "Our favorite weekend ritual. Double lattes and planning the week.",
    imageUrl: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    isBanner: false,
    gridSpan: "col-span-1 row-span-1",
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
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  
  const [activeTheme, setActiveTheme] = useState("rose");
  const [cardStyle, setCardStyle] = useState("polaroid"); // "polaroid", "minimal", "ticket", "neon"
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // Slideshow State
  const bannerImages = ALL_MEMORIES.filter(m => m.isBanner);
  const galleryImages = ALL_MEMORIES.filter(m => !m.isBanner);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slideshow logic
  useEffect(() => {
    if (bannerImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000); // Change slide every 5 seconds
    
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  // Filter Logic for Grid Gallery
  const filteredGallery = galleryImages.filter(item => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  const colors = THEMES[activeTheme];

  const renderCard = (item) => {
    const isSpecialGrid = item.gridSpan && item.gridSpan !== 'col-span-1 row-span-1';
    
    // 1. POLAROID STYLE
    if (cardStyle === "polaroid") {
      return (
        <div 
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className={`relative p-4 pb-7 rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer group flex flex-col justify-between transform hover:scale-[1.02] border ${colors.border} ${colors.cardBg}`}
        >
          {/* Aesthetic Tape Header */}
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

    // 2. MINIMAL GLASS CARD STYLE
    if (cardStyle === "minimal") {
      return (
        <div 
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className={`relative rounded-3xl overflow-hidden group cursor-pointer border ${colors.border} ${colors.cardBg} shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col justify-between`}
        >
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

    // 3. RETRO TICKET STYLE
    if (cardStyle === "ticket") {
      return (
        <div 
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className={`relative rounded-2xl overflow-hidden group cursor-pointer border-2 ${colors.border} ${colors.cardBg} shadow-md hover:shadow-xl transition-all duration-500 flex flex-col justify-between`}
        >
          {/* Ticket Scalloped Notches */}
          <div className="absolute top-1/2 -left-3 w-6 h-6 rounded-full bg-slate-50 border-r-2 border-slate-200 z-10" />
          <div className="absolute top-1/2 -right-3 w-6 h-6 rounded-full bg-slate-50 border-l-2 border-slate-200 z-10" />

          <div className="w-full h-36 overflow-hidden">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale-20"
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

    // 4. NEON / CYBER GLOW STYLE
    if (cardStyle === "neon") {
      return (
        <div 
          key={item.id}
          onClick={() => setSelectedImage(item)}
          className="relative rounded-2xl overflow-hidden group cursor-pointer bg-slate-950 border border-fuchsia-500/30 hover:border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.05)] hover:shadow-[0_0_20px_rgba(217,70,239,0.25)] transition-all duration-500 h-80 flex flex-col justify-end p-5 text-left"
        >
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
            <p className="text-slate-300 text-xs line-clamp-2">
              {item.desc}
            </p>
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
            {/* Image */}
            <img 
              src={slide.imageUrl} 
              alt={slide.title}
              className="w-full h-full object-cover object-center"
            />
            {/* Dark Gradient Overlay for text readability */}
            <div className={`absolute inset-0 bg-gradient-to-t ${colors.heroOverlay}`} />
            
            {/* Slide Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 md:p-16 text-center sm:text-left text-white max-w-7xl mx-auto">
              <span className="inline-block px-3 py-1 mb-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest bg-rose-500/80 backdrop-blur-sm rounded-full">
                Featured Memory ✨
              </span>
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

        {/* Slideshow Dots Indicators */}
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

      {/* STYLE STUDIO DRAWER PANEL */}
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
        <h2 className={`text-3xl sm:text-4xl font-serif font-extrabold tracking-tight mb-6 ${colors.textPrimary}`}>
          All Our Beautiful Moments
        </h2>
        
        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {[
            { id: "all", label: "Everything", icon: "📸" },
            { id: "dates", label: "Date Nights", icon: "🍷" },
            { id: "trips", label: "Adventures", icon: "✈️" },
            { id: "cozy", label: "Cozy Days", icon: "☕" }
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
        </div>

        {/* 3. DYNAMIC SCRAPBOOK GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => renderCard(item))}

          {/* Empty State if filter returns nothing */}
          {filteredGallery.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
              <span className="text-4xl block mb-3">👻</span>
              <h3 className="font-serif font-bold text-slate-800 text-lg">No memories found</h3>
              <p className="text-slate-500 text-sm">Looks like we need to go on more {activeFilter} dates!</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. LIGHTBOX MODAL (When an image is clicked) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)} // Click background to close
        >
          {/* Modal Content */}
          <div 
            className="w-full max-w-5xl bg-white rounded-2xl sm:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking card
          >
            {/* Left: Huge Image */}
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

            {/* Right: Memory Details */}
            <div className="w-full md:w-2/5 lg:w-1/3 p-6 sm:p-10 flex flex-col justify-between bg-white relative">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-rose-500 w-8 h-8 rounded-full flex items-center justify-center transition-all hidden md:flex font-bold"
              >
                ✕
              </button>

              <div className="space-y-6 mt-4 md:mt-8">
                <div>
                  <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-rose-100 mb-4">
                    {selectedImage.category} 🌸
                  </span>
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
              </div>

              {/* Decorative Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Pinned with love ❤️</span>
                {selectedImage.location && <span>📍 {selectedImage.location}</span>}
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}