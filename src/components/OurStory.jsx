"use client";

import React, { useState, useMemo } from "react";
import { 
  Plus, 
  X, 
  Check, 
  PenLine, 
  Sparkles, 
  Heart, 
  Map, 
  Cake, 
  Smile 
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// Configuration Arrays & Styles
const FILTERS = [
  { key: "all", label: "All Moments", icon: Sparkles },
  { key: "firsts", label: "The Firsts", icon: Heart },
  { key: "trips", label: "Our Trips", icon: Map },
  { key: "celebrations", label: "Celebrations", icon: Cake },
  { key: "daily", label: "Little Moments", icon: Smile },
];

const ICON_OPTIONS = [
  { key: "heart", label: "Heart", icon: Heart },
  { key: "map", label: "Map", icon: Map },
  { key: "cake", label: "Cake", icon: Cake },
  { key: "smile", label: "Smile", icon: Smile },
  { key: "sparkles", label: "Sparkles", icon: Sparkles },
];

const CATEGORY_STYLES = {
  firsts: { node: "from-[#640D14] to-[#C1121F]", color: "border-[#C1121F]/35 bg-[#C1121F]/10 text-white" },
  trips: { node: "from-[#1D3557] to-[#457B9D]", color: "border-[#457B9D]/35 bg-[#457B9D]/10 text-[#A8DADC]" },
  celebrations: { node: "from-[#1A4301] to-[#248232]", color: "border-[#248232]/35 bg-[#248232]/10 text-[#2EC4B6]" },
  daily: { node: "from-[#708090] to-[#7A0015]", color: "border-white/[0.08] bg-white/[0.04] text-[#B5B5B5]" },
};

const DEFAULT_MILESTONES = [
  {
    id: 1,
    date: "Jan 14, 2026 • 4:18 PM",
    title: "The Dream & The First 'Assalamu Alaikum'",
    category: "firsts",
    desc: "A locked Facebook profile, an afternoon nap dream, and a message sent at 4:18 PM that changed our destiny forever.",
    icon: "heart",
  },
  {
    id: 2,
    date: "Jan 17, 2026 • 7:00 AM",
    title: "Our Very First Morning Call",
    category: "firsts",
    desc: "While her mother was making breakfast in Dhaka during exams, 7:00 AM quiet moments became our cherished daily habit.",
    icon: "smile",
  },
  {
    id: 3,
    date: "Jul 31, 2026",
    title: "Sharing Our Story with My Family",
    category: "celebrations",
    desc: "When my elder sister returned home from Germany, I happily told my family about Afrin and our relationship.",
    icon: "sparkles",
  },
  {
    id: 4,
    date: "Aug 08, 2026",
    title: "Afrin Meets My Elder Sister",
    category: "firsts",
    desc: "A beautiful, meaningful meeting that felt like another unforgettable step forward in our lifelong journey together.",
    icon: "heart",
  },
  {
    id: 5,
    date: "Aug 19, 2026",
    title: "Afrin Tells Her Mother",
    category: "celebrations",
    desc: "Afrin opened her heart to her mother about us, bringing our families even closer into our shared world.",
    icon: "sparkles",
  },
  {
    id: 6,
    date: "Present Days",
    title: "Faith in Allah's Plan & Halal Forever",
    category: "daily",
    desc: "Taking things one day at a time, praying with unwavering faith for Allah to unite us in a beautiful and halal way. Ameen. 🤍",
    icon: "heart",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const getDateTime = (value) => {
  const dateTime = new Date(value).getTime();
  return Number.isNaN(dateTime) ? 0 : dateTime;
};

export default function OurStory() {
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "firsts",
    desc: "",
    icon: "heart",
  });
  const [formSuccess, setFormSuccess] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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
      date: formData.date || "Sometime Beautiful",
      title: formData.title,
      category: formData.category,
      desc: formData.desc,
      icon: formData.icon || "heart",
    };

    setMilestones((prev) => [newMilestone, ...prev].sort((a, b) => getDateTime(b.date) - getDateTime(a.date)));
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
    }, 1500);
  };

  return (
    <section
      id="story"
      className="relative overflow-hidden border-t border-white/[0.08] bg-[#050505] px-4 py-24 text-white sm:px-6 lg:px-8"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(193,18,31,0.20),transparent_30%),radial-gradient(circle_at_86%_58%,rgba(231,185,138,0.10),transparent_26%),radial-gradient(circle_at_48%_100%,rgba(122,0,21,0.28),transparent_36%)]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.36)_54%,rgba(0,0,0,0.86)_100%)]" />

      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        transition={{ staggerChildren: shouldReduceMotion ? 0 : 0.1 }}
        className="relative z-10 mx-auto max-w-4xl"
      >
        <motion.div variants={fadeUp} className="mb-14 space-y-4 text-center">
          <span className="block font-playfair text-lg font-semibold italic text-[#E7B98A]">
            Our Journey Timeline
          </span>
          <h2 className="font-playfair text-3xl font-bold tracking-normal text-white sm:text-4xl">
            How It All Began
          </h2>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[#B5B5B5] sm:text-base">
            Every moment with you is a favorite memory. Here are the turning points and sweet milestones in our life story.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-[linear-gradient(135deg,#640D14,#C1121F)] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_34px_rgba(193,18,31,0.24)] outline-none transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_12px_40px_rgba(193,18,31,0.45)] focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98]"
            >
              <Plus size={15} className="transition-transform duration-300 group-hover:rotate-90" />
              Add New Milestone
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-12 flex flex-wrap items-center justify-center gap-2 md:gap-3">
          {FILTERS.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeFilter === filter.key;

            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setActiveFilter(filter.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${
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

        {/* Repaired Timeline Wrapper Structure */}
        <div className="relative ml-4 border-l border-white/10 pl-8 space-y-10 sm:ml-6 sm:pl-12">
          <AnimatePresence mode="popLayout">
            {filteredMilestones.length === 0 ? (
              <motion.p 
                layout 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-sm text-[#B5B5B5]"
              >
                No milestones found in this category.
              </motion.p>
            ) : (
              filteredMilestones.map((milestone) => (
                <TimelineItem
                  key={milestone.id}
                  milestone={milestone}
                  shouldReduceMotion={shouldReduceMotion}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
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
                      Archive another turning point in your journey together.
                    </p>
                  </div>

                  <FormField label="Milestone Title">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E.g., Our First Concert together..."
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
                        onChange={handleInputChange}
                        placeholder="E.g., Nov 12, 2024"
                        required
                        className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                      />
                    </FormField>

                    <FormField label="Milestone Category">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full rounded-2xl border border-white/[0.08] bg-black/35 px-3 py-3 text-sm font-medium text-white outline-none transition-all duration-300 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                      >
                        <option value="firsts">The Firsts</option>
                        <option value="trips">Our Trips</option>
                        <option value="celebrations">Celebration</option>
                        <option value="daily">Little Moment</option>
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Choose an Icon">
                    <div className="flex justify-between gap-2 rounded-2xl border border-white/[0.08] bg-black/30 p-2">
                      {ICON_OPTIONS.map((option) => {
                        const Icon = option.icon;
                        const isSelected = formData.icon === option.key;

                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, icon: option.key }))}
                            className={`grid h-10 w-10 place-items-center rounded-xl border outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[#E7B98A]/70 ${
                              isSelected
                                ? "border-[#E7B98A]/45 bg-[#E7B98A]/10 text-[#E7B98A] shadow-[0_0_20px_rgba(231,185,138,0.16)]"
                                : "border-transparent text-[#B5B5B5] hover:bg-white/[0.05] hover:text-white"
                            }`}
                            aria-label={option.label}
                            aria-pressed={isSelected}
                          >
                            <Icon size={18} />
                          </button>
                        );
                      })}
                    </div>
                  </FormField>

                  <FormField label="Tell the Story">
                    <textarea
                      name="desc"
                      value={formData.desc}
                      onChange={handleInputChange}
                      placeholder="What made this moment so special? Record your cozy memories here..."
                      rows={3}
                      required
                      className="w-full resize-none rounded-2xl border border-white/[0.08] bg-black/35 px-4 py-3 text-sm leading-relaxed text-white outline-none transition-all duration-300 placeholder:text-[#B5B5B5]/60 focus:border-[#E7B98A]/50 focus:ring-2 focus:ring-[#E7B98A]/20"
                    />
                  </FormField>

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
    </section>
  );
}

function TimelineItem({ milestone, shouldReduceMotion }) {
  const style = CATEGORY_STYLES[milestone.category] || CATEGORY_STYLES.firsts;
  const Icon = ICON_OPTIONS.find((option) => option.key === milestone.icon)?.icon || Sparkles;

  return (
    <motion.div
      layout
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -18 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="group relative"
    >
      <div
        className={`absolute -left-[41px] top-1.5 grid h-9 w-9 place-items-center rounded-full border border-white/15 bg-gradient-to-br ${style.node} text-white shadow-[0_0_26px_rgba(193,18,31,0.28)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_34px_rgba(193,18,31,0.45)] sm:-left-[61px] sm:h-11 sm:w-11`}
      >
        <Icon size={18} />
      </div>

      <div className="rounded-[28px] border border-white/[0.08] bg-[rgba(20,20,20,0.75)] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45),0_0_40px_rgba(193,18,31,0.15)] backdrop-blur-[20px] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(0,0,0,0.55),0_0_50px_rgba(193,18,31,0.24)] sm:p-7">
        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <span className="block text-xs font-extrabold uppercase tracking-[0.18em] text-[#E7B98A]">
            {milestone.date}
          </span>
          <span className={`self-start rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] sm:self-auto ${style.color}`}>
            {milestone.category}
          </span>
        </div>

        <h3 className="mb-2 font-playfair text-lg font-bold leading-snug text-white sm:text-xl">
          {milestone.title}
        </h3>

        <p className="text-sm font-medium leading-relaxed text-[#B5B5B5]">{milestone.desc}</p>
      </div>
    </motion.div>
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