"use client";

import React, { useState, useMemo } from "react";
import {
  Camera,
  ImageIcon,
  Wine,
  Plane,
  Home,
  PartyPopper,
  Heart,
  MapPin,
  X,
  Pin
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const DEFAULT_MEMORIES = [
  {
    id: 4,
    title: "Messy Baking Night",
    date: "October 12, 2025",
    location: "Our Cozy Kitchen",
    category: "cozy",
    desc: "Attempted to bake a chocolate souffle from scratch. It completely collapsed, and we ended up eating gooey hot chocolate cake directly out of the ramekins.",
    imageUrl: "https://i.ibb.co.com/x8Pcw7CN/IMG-20260514-134638.jpg",
    rotation: "rotate-1",
  },
  {
    id: 5,
    title: "Golden Hour Stroll",
    date: "April 22, 2025",
    location: "Ocean Breeze Pier",
    category: "dates",
    desc: "The warm breeze in your hair, the ocean tide washing over our bare feet, and a sunset that dyed the world pink. Times like this feel infinite.",
    imageUrl: "https://i.ibb.co.com/r29NfgCv/IMG-20260703-100811.jpg",
    rotation: "-rotate-3",
  },
  {
    id: 6,
    title: "Wandering Kyoto Streets",
    date: "November 08, 2025",
    location: "Kyoto, Japan",
    category: "trips",
    desc: "Getting blissfully lost in narrow wooden alleyways, eating matcha soft serve in the autumn cold, and wishing this adventure would never have to end.",
    imageUrl: "https://i.ibb.co.com/d0Jm9K6N/20260505-102703.jpg",
    rotation: "rotate-2",
  },
];

const FILTERS = [
  { key: "all", label: "All Polaroids", icon: ImageIcon },
  { key: "dates", label: "Date Nights", icon: Wine },
  { key: "trips", label: "Our Trips", icon: Plane },
  { key: "cozy", label: "Cozy Days", icon: Home },
  { key: "celebrations", label: "Celebrations", icon: PartyPopper },
];

const FALLBACK_IMAGES = {
  dates: "https://i.ibb.co.com/ynSbjZxD/3.jpg",
  trips: "https://i.ibb.co.com/fGx0tJXK/Ry-Hn-20260302-141530-Vivid-Color-by-Ry-Hn.jpg",
  cozy: "https://i.ibb.co.com/R1SP5PD/IMG-20260518-151523.jpg",
  nature: "https://i.ibb.co.com/x8Pcw7CN/IMG-20260514-134638.jpg",
  celebrations: "https://i.ibb.co.com/Kcxcr6WV/20260511-123515.jpg",
  books: "https://i.ibb.co.com/r29NfgCv/IMG-20260703-100811.jpg",
  movies: "https://i.ibb.co.com/d0Jm9K6N/20260505-102703.jpg",
  hands: "https://i.ibb.co.com/bM1gWz3r/IMG-20260613-144916.jpg",
  fhaaa: "https://i.ibb.co.com/xt6nX7m7/Ry-Hn-20260613-113942-Vivid-Color-by-Ry-Hn.jpg",
};

const CATEGORY_LABELS = {
  dates: "Date Night",
  trips: "Trip Adventure",
  cozy: "Cozy Day",
  celebrations: "Celebration",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Memories() {
  const [memories, setMemories] = useState(DEFAULT_MEMORIES);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    category: "dates",
    desc: "",
    imageUrl: "",
  });

  const shouldReduceMotion = useReducedMotion();

  const filteredMemories = useMemo(() => {
    if (activeFilter === "all") return memories;
    return memories.filter((item) => item.category === activeFilter);
  }, [activeFilter, memories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMemory = (e) => {
    e.preventDefault();

    const finalImage = formData.imageUrl.trim() || FALLBACK_IMAGES[formData.category] || FALLBACK_IMAGES.dates;
    const rotations = ["-rotate-3", "-rotate-2", "-rotate-1", "rotate-1", "rotate-2", "rotate-3"];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const newMemory = {
      id: Date.now(),
      title: formData.title,
      date: formData.date || "Today",
      location: formData.location || "Somewhere Beautiful",
      category: formData.category,
      desc: formData.desc,
      imageUrl: finalImage,
      rotation: randomRotation,
    };

    setMemories((prev) => [newMemory, ...prev]);
    setIsAddModalOpen(false);
    setFormData({
      title: "",
      date: "",
      location: "",
      category: "dates",
      desc: "",
      imageUrl: "",
    });
  };

  return (
    <section id="memories" className="relative overflow-hidden bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8">
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.1 }}
        className="relative z-10 mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} className="mb-14 text-center">
          <h2 className="font-playfair text-3xl font-bold tracking-normal text-white sm:text-4xl">
            Captured Moments
          </h2>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="group mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.24)] outline-none transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
          >
            <Camera size={16} className="transition-transform duration-300 group-hover:-rotate-6" />
            Pin a New Memory
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-14 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${
                  isActive
                    ? "border-[#E7B98A]/35 bg-[#C1121F]/20 text-white shadow-[0_0_28px_rgba(193,18,31,0.22)]"
                    : "border-white/[0.08] bg-[#111111]/65 text-[#B5B5B5] hover:border-[#E7B98A]/30 hover:bg-white/[0.05] hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                <Icon size={14} className={isActive ? "text-[#E7B98A]" : "text-[#D4AF37]"} />
                {filter.label}
              </button>
            );
          })}
        </motion.div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredMemories.length === 0 ? (
              <motion.div
                key="empty"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="col-span-full rounded-[28px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-8 py-16 text-center shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.15)] backdrop-blur-[20px]"
              >
                <Heart className="mx-auto mb-3 text-[#E7B98A]" size={38} fill="currentColor" />
                <p className="text-sm font-semibold text-[#B5B5B5]">No polaroids found in this category.</p>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-[#E7B98A] underline-offset-4 hover:text-white hover:underline"
                >
                  Let's pin the first one
                </button>
              </motion.div>
            ) : (
              filteredMemories.map((memory) => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  shouldReduceMotion={shouldReduceMotion}
                  onSelect={() => setSelectedMemory(memory)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <MemoryDetailModal
        memory={selectedMemory}
        shouldReduceMotion={shouldReduceMotion}
        onClose={() => setSelectedMemory(null)}
      />

      <AddMemoryModal
        isOpen={isAddModalOpen}
        formData={formData}
        shouldReduceMotion={shouldReduceMotion}
        onClose={() => setIsAddModalOpen(false)}
        onChange={handleInputChange}
        onSubmit={handleAddMemory}
      />
    </section>
  );
}

function MemoryCard({ memory, shouldReduceMotion, onSelect }) {
  return (
    <motion.button
      type="button"
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
      whileHover={shouldReduceMotion ? undefined : { y: -8, rotate: 0, scale: 1.03 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onSelect}
      className={`group flex min-h-full cursor-pointer flex-col justify-between rounded-[22px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-4 pb-7 text-left shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.15)] backdrop-blur-[20px] outline-none transition-shadow duration-300 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_50px_rgba(193,18,31,0.24)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${memory.rotation}`}
    >
      <div className="relative w-full">
        <div className="absolute -top-6 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rotate-1 border border-[#E7B98A]/10 bg-[#E7B98A]/20 opacity-80 shadow-[0_6px_18px_rgba(0,0,0,0.22)]" />

        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#111111]">
          <img
            src={memory.imageUrl}
            alt={memory.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.82)_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-x-0 bottom-0 flex translate-y-3 items-center gap-1.5 p-4 text-xs font-bold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <MapPin size={14} className="text-[#E7B98A]" />
            {memory.location}
          </div>
        </div>
      </div>

      <div className="px-1 pt-5 text-center w-full">
        <h4 className="font-playfair text-base font-bold italic leading-tight text-white transition-colors duration-300 group-hover:text-[#E7B98A]">
          {memory.title}
        </h4>
        <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#B5B5B5]">
          {memory.date}
        </p>
      </div>
    </motion.button>
  );
}

function MemoryDetailModal({ memory, shouldReduceMotion, onClose }) {
  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-lg w-full rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-white/10"
            >
              <X size={18} />
            </button>
            <img
              src={memory.imageUrl}
              alt={memory.title}
              className="w-full rounded-2xl aspect-video object-cover mb-4"
            />
            <div className="flex items-center justify-between text-xs text-[#B5B5B5] mb-2 font-mono">
              <span>{memory.date}</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-[#E7B98A]" />
                {memory.location}
              </span>
            </div>
            <h3 className="font-playfair text-2xl font-bold mb-3 text-white">{memory.title}</h3>
            <p className="text-sm leading-relaxed text-[#B5B5B5]">{memory.desc}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AddMemoryModal({ isOpen, formData, shouldReduceMotion, onClose, onChange, onSubmit }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-white/[0.08] bg-[#111111]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.65),0_0_44px_rgba(193,18,31,0.18)] backdrop-blur-[20px] sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label="Pin a scrapbook memory"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-white/[0.08] bg-black/30 p-2 text-[#B5B5B5] outline-none transition-all duration-300 hover:border-[#E7B98A]/35 hover:text-white focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="pb-2 text-center">
                <h3 className="font-playfair text-xl font-bold text-white">Pin a Scrapbook Memory</h3>
                <p className="text-xs text-[#B5B5B5]">
                  Seal another precious memory on our live polaroid board.
                </p>
              </div>

              <FormField label="Polaroid Title">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={onChange}
                  placeholder="E.g., Messy Baking Night..."
                  required
                  className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                />
              </FormField>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Date of Event">
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={onChange}
                    placeholder="E.g., Oct 12, 2025"
                    required
                    className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                  />
                </FormField>

                <FormField label="Location">
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={onChange}
                    placeholder="E.g., Our Kitchen"
                    required
                    className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                  />
                </FormField>
              </div>

              <FormField label="Image URL (Optional)">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={onChange}
                  placeholder="Leave blank for an aesthetic default romantic photo..."
                  className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                />
              </FormField>

              <FormField label="Category">
                <select
                  name="category"
                  value={formData.category}
                  onChange={onChange}
                  className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm font-medium text-white outline-none transition-all duration-300 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                >
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Tell the Story">
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={onChange}
                  placeholder="Record the details... What made this sunset or late night talk unforgettable?"
                  rows={3}
                  required
                  className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                />
              </FormField>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.24)] outline-none transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70"
              >
                <Pin size={16} className="transition-transform duration-300 group-hover:-rotate-12" />
                Pin Polaroid
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]">
        {label}
      </span>
      {children}
    </label>
  );
}