"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Camera,
  Image as ImageIcon,
  Film,
  Star,
  Pencil,
  Trash2,
  Plus,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Maximize2,
  Minimize2,
  Calendar,
  MapPin,
  Wine,
  Plane,
  Coffee,
  PartyPopper,
  Heart,
  Home,
  Save,
  Zap,
  Loader2,
} from "lucide-react";

const THEMES = {
  midnight: {
    name: "Midnight Dream",
    bg: "bg-[#04060e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.18),rgba(4,6,14,0.95))]",
    textPrimary: "text-slate-100",
    textMuted: "text-slate-400",
    accent: "bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 hover:from-fuchsia-500 hover:to-cyan-400 text-white",
    accentText: "text-fuchsia-400",
    border: "border-indigo-500/20",
    cardBg: "bg-slate-900/70 backdrop-blur-xl",
    heroOverlay: "from-[#04060e] via-[#04060e]/50 to-transparent",
  },
};

export default function AllMemories() {
  const { data: session } = useSession();

  // All memory data stored and managed in MongoDB
  const [dbMemories, setDbMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingHomeId, setTogglingHomeId] = useState(null);

  // Edit Mode toggle: hidden by default
  const [isEditMode, setIsEditMode] = useState(false);

  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isFullView, setIsFullView] = useState(false);
  const [loadedImageKey, setLoadedImageKey] = useState("");
  const [errorImageKey, setErrorImageKey] = useState("");

  const currentImageKey = selectedImage?.imageUrl || "";
  const isLightboxImgLoading = Boolean(selectedImage && loadedImageKey !== currentImageKey);
  const lightboxImgError = Boolean(selectedImage && errorImageKey === currentImageKey);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSlideManagerOpen, setIsSlideManagerOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    category: "dates",
    desc: "",
    imageUrl: "",
    isBanner: false,
    showOnHome: true,
  });

  const [editFormData, setEditFormData] = useState({
    id: "",
    title: "",
    date: "",
    location: "",
    category: "dates",
    desc: "",
    imageUrl: "",
    isBanner: false,
    showOnHome: true,
  });

  // Default theme is Midnight Dream and default card layout is Cyber Glow
  const activeTheme = "midnight";

  // ── Role Authorization Check ──────────────────────────────────────────────
  const userRole = session?.user?.role || "User";
  const canManageMemory = ["rayhan", "afrin"].includes(userRole.toLowerCase());

  // ── Fetch from MongoDB ──────────────────────────────────────────────────────
  const fetchMemories = useCallback(async () => {
    try {
      const res = await fetch("/api/memories");
      const data = await res.json();
      if (data.success) {
        setDbMemories(data.memories || []);
      }
    } catch (err) {
      console.error("Failed to load memories from DB", err);
      toast.error("Could not load memories from database.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    async function load() {
      try {
        const res = await fetch("/api/memories");
        const data = await res.json();
        if (!ignore && data?.success) {
          setDbMemories(data.memories || []);
        }
      } catch (err) {
        console.error("Failed to load memories from DB", err);
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // All memories come from MongoDB
  const allMemories = dbMemories;
  const bannerImages = allMemories.filter((m) => m.isBanner);

  // ── Slideshow state ─────────────────────────────────────────────────────────
  const [currentSlide, setCurrentSlide] = useState(0);
  const activeSlideIndex = bannerImages.length > 0 ? (currentSlide % bannerImages.length) : 0;

  useEffect(() => {
    if (bannerImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const handlePrevSlide = () => {
    if (bannerImages.length <= 1) return;
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  const handleNextSlide = () => {
    if (bannerImages.length <= 1) return;
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  // ── Filter logic for gallery ────────────────────────────────────────────────
  const filteredGallery = allMemories.filter((item) => {
    if (activeFilter === "banner") return Boolean(item.isBanner);
    if (activeFilter === "home") return item.showOnHome !== false;
    if (activeFilter === "all") return !item.isBanner;
    return item.category === activeFilter && !item.isBanner;
  });

  // ── Lightbox Navigation & Full View Mode ────────────────────────────────────
  const currentPhotoList = filteredGallery.length > 0 ? filteredGallery : allMemories;
  const currentPhotoIndex = selectedImage
    ? currentPhotoList.findIndex((m) => (m.id || m._id) === (selectedImage.id || selectedImage._id))
    : -1;

  const handlePrevPicture = useCallback((e) => {
    if (e) e.stopPropagation();
    if (currentPhotoList.length <= 1) return;
    const nextIdx = (currentPhotoIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
    setSelectedImage(currentPhotoList[nextIdx]);
  }, [currentPhotoIndex, currentPhotoList]);

  const handleNextPicture = useCallback((e) => {
    if (e) e.stopPropagation();
    if (currentPhotoList.length <= 1) return;
    const nextIdx = (currentPhotoIndex + 1) % currentPhotoList.length;
    setSelectedImage(currentPhotoList[nextIdx]);
  }, [currentPhotoIndex, currentPhotoList]);

  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrevPicture();
      if (e.key === "ArrowRight") handleNextPicture();
      if (e.key === "f" || e.key === "F") setIsFullView((prev) => !prev);
      if (e.key === "Escape") {
        if (isFullView) setIsFullView(false);
        else {
          setSelectedImage(null);
          setIsFullView(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImage, isFullView, handlePrevPicture, handleNextPicture]);

  // ── Add Memory ─────────────────────────────────────────────────────────────
  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!formData.title?.trim()) return;
    if (!canManageMemory) {
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
        toast.success("Memory saved to MongoDB!");
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
          showOnHome: true,
        });
      } else {
        toast.error(data.error || "Failed to save memory.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Open Edit Modal ────────────────────────────────────────────────────────
  const handleOpenEdit = (memory) => {
    setEditFormData({
      id: memory.id || memory._id,
      title: memory.title || "",
      date: memory.date || "",
      location: memory.location || "",
      category: memory.category || "dates",
      desc: memory.desc || "",
      imageUrl: memory.imageUrl || "",
      isBanner: Boolean(memory.isBanner),
      showOnHome: memory.showOnHome !== false,
    });
    setIsEditModalOpen(true);
  };

  // ── Update / Modify Memory ─────────────────────────────────────────────────
  const handleUpdateMemory = async (e) => {
    e.preventDefault();
    if (!editFormData.title?.trim()) return;
    if (!canManageMemory) {
      toast.error("Only Rayhan and Afrin can modify memories.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/memories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Memory updated successfully!");
        setDbMemories((prev) =>
          prev.map((m) =>
            (m.id || m._id) === editFormData.id
              ? data.memory
              : m
          )
        );
        if ((selectedImage?.id || selectedImage?._id) === editFormData.id) {
          setSelectedImage(data.memory);
        }
        setIsEditModalOpen(false);
      } else {
        toast.error(data.error || "Failed to update memory.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Quick Toggle Homepage Visibility ───────────────────────────────────────
  const handleToggleHome = async (memory) => {
    if (!canManageMemory) {
      toast.error("Only Rayhan and Afrin can configure homepage memories.");
      return;
    }

    const memoryId = memory.id || memory._id;
    const newStatus = memory.showOnHome === false;

    setTogglingHomeId(memoryId);

    // Optimistic UI update
    setDbMemories((prev) =>
      prev.map((m) =>
        (m.id || m._id) === memoryId
          ? { ...m, showOnHome: newStatus }
          : m
      )
    );

    try {
      const res = await fetch("/api/memories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: memoryId,
          showOnHome: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          newStatus
            ? "Memory will show on Homepage!"
            : "Memory removed from Homepage selection."
        );
      } else {
        toast.error(data.error || "Failed to update homepage status.");
        fetchMemories();
      }
    } catch {
      toast.error("Network error updating status.");
      fetchMemories();
    } finally {
      setTogglingHomeId(null);
    }
  };

  // ── Quick Toggle Slideshow Banner ──────────────────────────────────────────
  const handleToggleBanner = async (memory) => {
    if (!canManageMemory) {
      toast.error("Only Rayhan and Afrin can configure slideshow banners.");
      return;
    }

    const memoryId = memory.id || memory._id;
    const newStatus = !memory.isBanner;

    // Optimistic UI update
    setDbMemories((prev) =>
      prev.map((m) =>
        (m.id || m._id) === memoryId
          ? { ...m, isBanner: newStatus }
          : m
      )
    );

    try {
      const res = await fetch("/api/memories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: memoryId,
          isBanner: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          newStatus
            ? "Memory added to top slideshow banner!"
            : "Memory removed from top slideshow."
        );
      } else {
        toast.error(data.error || "Failed to update slideshow banner status.");
        fetchMemories();
      }
    } catch {
      toast.error("Network error updating banner.");
      fetchMemories();
    } finally {
      setTogglingHomeId(null);
    }
  };

  // ── Delete Memory ──────────────────────────────────────────────────────────
  const handleDeleteMemory = async (memory) => {
    if (!canManageMemory) {
      toast.error("Only Rayhan and Afrin can delete memories.");
      return;
    }

    const memoryId = memory.id || memory._id;
    if (!confirm(`Remove "${memory.title}" from the scrapbook?`)) return;

    setDeletingId(memoryId);
    try {
      const res = await fetch("/api/memories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memoryId }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Memory removed.");
        setDbMemories((prev) => prev.filter((m) => (m.id || m._id) !== memoryId));
        if ((selectedImage?.id || selectedImage?._id) === memoryId) setSelectedImage(null);
      } else {
        toast.error(data.error || "Could not delete.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const colors = THEMES[activeTheme] || THEMES.midnight;

  // ── Action Buttons on Cards (Only rendered when isEditMode is true) ────────
  const CardActions = ({ item }) => {
    if (!canManageMemory || !isEditMode) return null;
    const isDeleting = deletingId === (item.id || item._id);
    const isToggling = togglingHomeId === (item.id || item._id);
    const isOnHome = item.showOnHome !== false;
    const isBanner = Boolean(item.isBanner);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="absolute top-3 right-3 z-20 flex items-center gap-1.5 backdrop-blur-md bg-black/60 p-1 rounded-full border border-white/10 shadow-xl"
      >
        {/* Toggle Slideshow Banner Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleBanner(item);
          }}
          className={`w-7 h-7 rounded-full text-xs flex items-center justify-center transition-all ${
            isBanner
              ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.6)]"
              : "bg-white/10 text-white/70 hover:text-white hover:bg-white/20"
          }`}
          title={isBanner ? "In Slideshow Banner (Click to remove)" : "Click to feature in Top Slideshow Banner"}
        >
          <Film size={12} />
        </motion.button>

        {/* Toggle Homepage Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleHome(item);
          }}
          disabled={isToggling}
          className={`w-7 h-7 rounded-full text-xs flex items-center justify-center transition-all ${
            isOnHome
              ? "bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
              : "bg-white/10 text-white/70 hover:text-white hover:bg-white/20"
          }`}
          title={isOnHome ? "Featured on Homepage (Click to hide)" : "Click to show on Homepage"}
        >
          <Star size={12} className={isOnHome ? "fill-white text-white" : ""} />
        </motion.button>

        {/* Edit Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleOpenEdit(item);
          }}
          className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs flex items-center justify-center shadow-lg transition-all"
          title="Edit memory"
        >
          <Pencil size={12} />
        </motion.button>

        {/* Delete Button */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteMemory(item);
          }}
          disabled={isDeleting}
          className="w-7 h-7 rounded-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs flex items-center justify-center shadow-lg transition-all"
          title="Remove memory"
        >
          {isDeleting ? "…" : <Trash2 size={12} />}
        </motion.button>
      </motion.div>
    );
  };

  const CardBadges = ({ item }) => (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
      {item.isBanner && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-[0_0_12px_rgba(244,63,94,0.5)] border border-rose-400/30">
          <Film size={9} /> Banner
        </span>
      )}
      {item.showOnHome !== false && (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest bg-cyan-600 text-white rounded-full shadow-[0_0_12px_rgba(6,182,212,0.5)] border border-cyan-400/50 font-mono font-bold">
          <Star size={9} className="fill-white text-white" /> Home
        </span>
      )}
    </div>
  );

  // ── Cyber Glow Card Renderer ───────────────────────────────────────────────
  const renderCard = (item) => {
    const memoryKey = item.id || item._id;

    return (
      <motion.div
        key={memoryKey}
        layout
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ y: -6, scale: 1.015 }}
        onClick={() => setSelectedImage(item)}
        className="group relative rounded-3xl overflow-hidden cursor-pointer bg-slate-950/80 border border-fuchsia-500/20 hover:border-fuchsia-500/80 shadow-[0_0_20px_rgba(217,70,239,0.08)] hover:shadow-[0_0_35px_rgba(217,70,239,0.3)] transition-all duration-500 h-[22rem] flex flex-col justify-end p-5 text-left"
      >
        <CardActions item={item} />
        <CardBadges item={item} />

        {/* Background Image with Loading Shimmer Fallback & Zoom on Hover */}
        <div className="absolute inset-0 overflow-hidden bg-[#070b19]">
          {/* Shimmer Placeholder while loading */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#070b19] via-indigo-950/40 to-slate-900 animate-pulse flex items-center justify-center pointer-events-none">
            <ImageIcon className="text-indigo-500/20 w-10 h-10" />
          </div>

          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-85 transition-all duration-700 group-hover:scale-110 relative z-[1]"
          />
          {/* Cyber Neon Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-[2]" />
          <div className="absolute inset-0 bg-radial-at-c from-transparent via-transparent to-black/60 z-[2]" />
        </div>

        {/* Ambient Corner Glow Effect on Hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 pointer-events-none" />

        {/* Card Content */}
        <div className="relative z-10 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[8px] font-extrabold uppercase tracking-widest text-fuchsia-300 bg-fuchsia-950/80 border border-fuchsia-500/30 backdrop-blur-md rounded-full shadow-[0_0_10px_rgba(217,70,239,0.2)]">
              <Zap size={9} className="text-cyan-400" />
              {item.category}
            </span>
          </div>

          <h3 className="font-serif text-xl font-bold text-white leading-tight group-hover:text-fuchsia-200 transition-colors drop-shadow-md">
            {item.title}
          </h3>

          {item.desc && (
            <p className="text-slate-300/90 text-xs line-clamp-2 leading-relaxed">
              {item.desc}
            </p>
          )}

          <div className="pt-2.5 flex items-center justify-between text-[10px] font-mono font-medium text-fuchsia-300/90 uppercase tracking-wider border-t border-fuchsia-500/20">
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={11} className="text-cyan-400" /> {item.date}
            </span>
            <span className="inline-flex items-center gap-1.5 truncate max-w-[50%]">
              <MapPin size={11} className="text-fuchsia-400 shrink-0" />
              <span className="truncate">{item.location || "CYBER OASIS"}</span>
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const scrollToVault = () => {
    document.getElementById("memory-vault")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className={`min-h-screen pb-28 font-sans scroll-smooth text-slate-100 ${colors.bg}`}>

      {/* 1. HERO SLIDESHOW BANNER WITH FRAMER MOTION TRANSITIONS & MOBILE RESPONSIVENESS */}
      <div className="relative w-full h-[58vh] min-h-[440px] sm:h-[70vh] lg:h-[82vh] overflow-hidden bg-slate-950">
        {bannerImages.length > 0 ? (
          <AnimatePresence mode="wait">
            {bannerImages.map((slide, index) => {
              if (index !== activeSlideIndex) return null;
              return (
                <motion.div
                  key={slide.id || slide._id || index}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover object-center"
                  />
                  {/* Multi-layered responsive gradient overlays for crisp readability on all screens */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04060e] via-[#04060e]/60 to-transparent sm:via-[#04060e]/35" />
                  <div className="absolute inset-0 bg-radial-at-t from-transparent via-[#04060e]/20 to-[#04060e]/90 pointer-events-none" />

                  {/* Responsive Info Overlay with Staggered Smooth Animations */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-10 md:p-14 lg:p-16 text-center sm:text-left text-white max-w-7xl mx-auto z-10">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                      className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-3"
                    >
                      {slide.showOnHome !== false && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest bg-cyan-600 text-white rounded-full font-mono border border-cyan-400/50 shadow-[0_0_12px_rgba(6,182,212,0.6)]">
                          <Star size={10} className="fill-white text-white" /> Home
                        </span>
                      )}
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.55, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="font-serif text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-2 sm:mb-3 drop-shadow-xl text-white break-words"
                    >
                      {slide.title}
                    </motion.h2>

                    {slide.desc && (
                      <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.32, ease: "easeOut" }}
                        className="text-slate-200 text-xs sm:text-sm md:text-base max-w-2xl font-medium leading-relaxed drop-shadow-md line-clamp-2 sm:line-clamp-3 md:line-clamp-none mx-auto sm:mx-0"
                      >
                        {slide.desc}
                      </motion.p>
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.42, ease: "easeOut" }}
                      className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold tracking-wider text-fuchsia-300 uppercase font-mono"
                    >
                      <span className="inline-flex items-center gap-1 sm:gap-1.5">
                        <MapPin size={12} className="text-cyan-400" /> {slide.location || "Earth"}
                      </span>
                      <span className="text-slate-500">•</span>
                      <span className="inline-flex items-center gap-1 sm:gap-1.5">
                        <Calendar size={12} className="text-fuchsia-400" /> {slide.date}
                      </span>
                    </motion.div>

                    {/* Direct Action Controls on Current Slide in Edit Mode */}
                    {canManageMemory && isEditMode && (
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.48 }}
                        className="mt-4 sm:mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-2"
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleOpenEdit(slide)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-cyan-600/90 hover:bg-cyan-500 text-white backdrop-blur-md transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={13} />
                          Edit Slide
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleBanner(slide)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-slate-900/90 hover:bg-slate-800 text-fuchsia-200 hover:text-white backdrop-blur-md border border-fuchsia-500/30 transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                        >
                          <X size={13} />
                          Remove
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteMemory(slide)}
                          className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold bg-rose-600/90 hover:bg-rose-500 text-white backdrop-blur-md transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={13} />
                          Delete
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <div className="h-full w-full relative flex flex-col items-center justify-center text-center p-6 text-white bg-[#04060e] overflow-hidden">
            {/* Ambient Animated Cyber Background Shimmers */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#04060e] via-indigo-950/40 to-slate-900 animate-pulse pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

            {/* Glowing Cyber Spinner Loader & Skeleton Bars */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-fuchsia-600/30 via-indigo-600/20 to-cyan-500/30 border border-fuchsia-500/40 animate-pulse flex items-center justify-center shadow-[0_0_35px_rgba(217,70,239,0.35)]">
                  <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400 animate-spin" />
                </div>
                <div className="absolute -inset-1.5 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-2xl blur-lg opacity-40 animate-pulse pointer-events-none" />
              </div>

              {/* Skeleton Placeholder Bars */}
              <div className="flex flex-col items-center gap-2.5 max-w-sm w-full px-4">
                <div className="h-4 w-28 sm:w-36 rounded-full bg-gradient-to-r from-fuchsia-500/30 to-cyan-500/30 border border-fuchsia-400/20 animate-pulse" />
                <div className="h-6 sm:h-8 w-48 sm:w-64 rounded-xl bg-slate-800/80 animate-pulse" />
                <div className="h-3 w-36 sm:w-44 rounded-full bg-slate-800/60 animate-pulse" />
              </div>

              <span className="text-xs font-mono font-bold text-slate-300 tracking-widest uppercase mt-4 flex items-center gap-2 animate-pulse">
                <Sparkles size={12} className="text-cyan-400" />
                Loading Cover Memories…
              </span>
            </div>
          </div>
        )}

        {/* Top Slideshow Header Bar: Edit Mode Tools */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
          {canManageMemory && (
            <>
              {/* Management buttons: only appear when Edit Mode is active */}
              {isEditMode && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSlideManagerOpen(!isSlideManagerOpen)}
                    className="px-3.5 py-2 rounded-full text-xs font-bold bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                    title="Reorder & manage banner slides"
                  >
                    <Film size={13} />
                    <span className="hidden sm:inline">Slides Tray</span> ({bannerImages.length})
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, isBanner: true }));
                      setIsAddModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span className="hidden sm:inline">Add Slide</span>
                  </motion.button>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* Next / Previous Slide Arrows (Responsive sizing & touch-friendly) */}
        {bannerImages.length > 1 && (
          <>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.85)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevSlide}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/15 shadow-xl cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.85)" }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNextSlide}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/60 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/15 shadow-xl cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight size={18} />
            </motion.button>
          </>
        )}
      </div>

      {/* SLIDESHOW TOP MANAGEMENT TRAY (Framer Motion Drawer) */}
      <AnimatePresence>
        {isSlideManagerOpen && isEditMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="bg-[#070b19] border-b border-indigo-500/20 text-white p-4 sm:p-6 shadow-2xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <Film size={20} className="text-fuchsia-400" />
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      Slideshow Manager ({bannerImages.length} Slides)
                    </h3>
                    <p className="text-xs text-slate-400">
                      Click any slide to view, modify its details, or remove it from the top banner
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData((prev) => ({ ...prev, isBanner: true }));
                      setIsAddModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(217,70,239,0.3)]"
                  >
                    <Plus size={13} /> New Slide
                  </motion.button>
                  <button
                    onClick={() => setIsSlideManagerOpen(false)}
                    className="text-slate-400 hover:text-white p-1 cursor-pointer"
                    aria-label="Close manager"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Filmstrip / Thumbnail Row */}
              <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin">
                {bannerImages.map((slide, idx) => (
                  <motion.div
                    key={slide.id || slide._id || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`flex-shrink-0 w-56 sm:w-64 rounded-2xl bg-slate-950/90 border transition-all p-2.5 relative group ${
                      idx === activeSlideIndex
                        ? "border-fuchsia-500 ring-2 ring-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                        : "border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div
                      onClick={() => setCurrentSlide(idx)}
                      className="h-28 w-full rounded-xl overflow-hidden relative cursor-pointer bg-slate-900"
                    >
                      <img
                        src={slide.imageUrl}
                        alt={slide.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-extrabold bg-black/70 backdrop-blur-sm text-white font-mono">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Title & Date */}
                    <div className="pt-2 px-1 text-left">
                      <h4 className="font-semibold text-xs text-white truncate" title={slide.title}>
                        {slide.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                        {slide.location} • {slide.date}
                      </p>
                    </div>

                    {/* Slide action buttons */}
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleOpenEdit(slide)}
                        className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold bg-cyan-600/80 hover:bg-cyan-500 text-white flex items-center justify-center gap-1 transition-all"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleToggleBanner(slide)}
                        className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold bg-slate-800 hover:bg-rose-950 text-rose-300 hover:text-rose-200 border border-rose-900/40 flex items-center justify-center gap-1 transition-all"
                        title="Remove from banner"
                      >
                        <X size={11} /> Remove
                      </button>
                      <button
                        onClick={() => handleDeleteMemory(slide)}
                        className="p-1 rounded-lg text-[10px] font-bold bg-rose-600/80 hover:bg-rose-700 text-white transition-all flex items-center justify-center"
                        title="Delete completely"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}

                {bannerImages.length === 0 && (
                  <div className="py-8 text-center w-full text-slate-400 text-xs">
                    No slideshow images found. Click &quot;New Slide&quot; above or toggle the banner button on any memory card below.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. GALLERY HEADER & FILTERS */}
      <div id="memory-vault" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-24 mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-fuchsia-400 font-serif italic text-lg font-semibold block mb-2 tracking-wide">
            The Vault
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold tracking-tight mb-2 text-white">
            All Our Beautiful Moments
          </h2>

          {/* MongoDB count indicator */}
          {!isLoading && dbMemories.length > 0 && (
            <p className="text-xs font-semibold text-cyan-400 mb-6 inline-flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-500/30 px-3.5 py-1 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Sparkles size={12} className="text-cyan-300" />
              {dbMemories.length} memories stored securely in MongoDB ({bannerImages.length} in Top Slideshow, {dbMemories.filter(m => m.showOnHome !== false).length} on Homepage)
            </p>
          )}
          {isLoading && (
            <p className="text-xs text-slate-400 mb-6 animate-pulse">Loading memories from the vault…</p>
          )}
        </motion.div>

        {/* Filter & Add Memory Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center items-center flex-wrap gap-2.5 mb-10"
        >
          {[
            { id: "all", label: "All Vault", icon: ImageIcon },
            { id: "banner", label: `Slideshow (${bannerImages.length})`, icon: Film },
            { id: "home", label: "On Homepage", icon: Home },
            { id: "dates", label: "Date Nights", icon: Wine },
            { id: "trips", label: "Adventures", icon: Plane },
            { id: "cozy", label: "Cozy Days", icon: Coffee },
            { id: "celebrations", label: "Celebrations", icon: PartyPopper },
          ].map((filter) => {
            const FilterIcon = filter.icon;
            const isActive = activeFilter === filter.id;
            return (
              <motion.button
                key={filter.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-fuchsia-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)] border border-fuchsia-400/40"
                    : "bg-slate-950/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500/40 backdrop-blur-md"
                }`}
              >
                <FilterIcon size={14} className={isActive ? "text-cyan-200" : "text-fuchsia-400"} />
                <span>{filter.label}</span>
              </motion.button>
            );
          })}

          {canManageMemory && (
            <div className="flex items-center gap-2 ml-1">
              {/* Gallery Edit Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 shadow-md cursor-pointer ${
                  isEditMode
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.7)]"
                    : "bg-slate-950 hover:bg-slate-900 text-white border border-indigo-500/30"
                }`}
              >
                {isEditMode ? <Check size={14} className="text-white" /> : <Pencil size={14} />}
                <span>{isEditMode ? "Done Editing" : "Edit Memories"}</span>
              </motion.button>

              {/* Pin New Memory: only appears when Edit Mode is active */}
              <AnimatePresence>
                {isEditMode && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setFormData({
                        title: "",
                        date: "",
                        location: "",
                        category: "dates",
                        desc: "",
                        imageUrl: "",
                        isBanner: activeFilter === "banner",
                        showOnHome: true,
                      });
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-500 hover:to-rose-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)] flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Pin New Memory</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* 3. DYNAMIC SCRAPBOOK GRID WITH FRAMER MOTION ANIMATIONS */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-3xl bg-slate-900/60 border border-indigo-500/10 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredGallery.map((item) => renderCard(item))}
            </AnimatePresence>

            {filteredGallery.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="col-span-full py-20 text-center bg-slate-950/70 border border-dashed border-indigo-500/30 rounded-3xl p-8"
              >
                <Sparkles size={36} className="text-fuchsia-400 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-white text-xl">No memories found in this filter</h3>
                <p className="text-slate-400 text-sm mt-1">
                  Try switching categories or toggle Edit Mode to add a new memory!
                </p>
                {canManageMemory && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setIsEditMode(true);
                      setFormData((prev) => ({
                        ...prev,
                        isBanner: activeFilter === "banner",
                      }));
                      setIsAddModalOpen(true);
                    }}
                    className="mt-5 px-5 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <Plus size={14} /> Pin the First One
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      {/* 4. LIGHTBOX DETAIL MODAL WITH FULL VIEW MODE & PICTURE NAVIGATION */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/95 backdrop-blur-2xl"
            onClick={() => {
              setSelectedImage(null);
              setIsFullView(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className={`w-full bg-[#070b19] border border-fuchsia-500/30 rounded-2xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_0_60px_rgba(217,70,239,0.3)] transition-all duration-300 ${
                isFullView
                  ? "max-w-[98vw] h-[95vh] max-h-[96vh] flex flex-col relative"
                  : "max-w-5xl flex flex-col md:flex-row max-h-[92vh]"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left/Main: Responsive Image Container with Picture Navigation */}
              <div
                className={`bg-slate-950 relative flex items-center justify-center overflow-hidden transition-all duration-300 ${
                  isFullView
                    ? "w-full h-full flex-1 p-3 sm:p-8"
                    : "w-full md:w-3/5 lg:w-2/3 min-h-[38vh] sm:min-h-[48vh] md:min-h-[520px] p-3 sm:p-6"
                }`}
              >
                {/* Ambient Blurred Backdrop */}
                <img
                  src={selectedImage.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                {/* Top Overlay Toolbar on Image */}
                <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                  {/* Photo Counter Badge */}
                  {currentPhotoList.length > 0 && currentPhotoIndex !== -1 && (
                    <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-slate-200 border border-white/15 shadow-lg">
                      <ImageIcon size={11} className="text-cyan-400" />
                      <span>
                        Photo {currentPhotoIndex + 1} of {currentPhotoList.length}
                      </span>
                    </div>
                  )}

                  {/* Top Action Controls */}
                  <div className="pointer-events-auto flex items-center gap-2">
                    {/* Full View Mode Toggle Button */}
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => setIsFullView(!isFullView)}
                      className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-black/70 hover:bg-black/90 text-white border border-indigo-500/30 backdrop-blur-md transition-all shadow-xl flex items-center gap-1.5 cursor-pointer hover:border-fuchsia-500/50"
                      title={isFullView ? "Exit Full View mode" : "Enter Full View mode (Press F)"}
                    >
                      {isFullView ? <Minimize2 size={13} className="text-cyan-400" /> : <Maximize2 size={13} className="text-fuchsia-400" />}
                      <span className="hidden sm:inline">{isFullView ? "Exit Full View" : "Full View"}</span>
                    </motion.button>

                    {/* Close Button on Mobile or in Full View Mode */}
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setIsFullView(false);
                      }}
                      className={`bg-black/70 hover:bg-black text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-white/15 cursor-pointer ${
                        isFullView ? "flex" : "md:hidden flex"
                      }`}
                      title="Close viewer (Esc)"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Fallback Shimmer & Spinner Loader until image finishes loading */}
                {isLightboxImgLoading && !lightboxImgError && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-600/30 via-indigo-600/20 to-cyan-500/30 border border-fuchsia-500/40 animate-pulse flex items-center justify-center shadow-[0_0_30px_rgba(217,70,239,0.3)]">
                        <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
                      </div>
                      <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-cyan-400 rounded-2xl blur-lg opacity-40 animate-pulse pointer-events-none" />
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-300 mt-4 tracking-wider animate-pulse flex items-center gap-2">
                      <Sparkles size={12} className="text-cyan-400" />
                      Loading memory…
                    </span>
                  </div>
                )}

                {/* Error Fallback when image fails to load */}
                {lightboxImgError && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90">
                    <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-3 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                      <ImageIcon size={28} />
                    </div>
                    <p className="font-serif font-bold text-white text-base">Image Unavailable</p>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">The image could not be loaded. Please verify the image link.</p>
                  </div>
                )}

                {/* Main Contained Responsive Image with Cross-fade on change */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage.id || selectedImage._id || selectedImage.imageUrl}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: isLightboxImgLoading ? 0 : 1, scale: isLightboxImgLoading ? 0.97 : 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    onLoad={() => setLoadedImageKey(currentImageKey)}
                    onError={() => setErrorImageKey(currentImageKey)}
                    className={`w-auto h-auto max-w-full object-contain rounded-xl sm:rounded-2xl shadow-2xl relative z-10 border border-white/10 ${
                      isFullView
                        ? "max-h-[80vh] sm:max-h-[82vh]"
                        : "max-h-[36vh] sm:max-h-[46vh] md:max-h-[72vh]"
                    }`}
                  />
                </AnimatePresence>

                {/* Previous Picture Button */}
                {currentPhotoList.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.15, x: -2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handlePrevPicture}
                    className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 shadow-2xl cursor-pointer"
                    title="Previous picture (←)"
                    aria-label="Previous picture"
                  >
                    <ChevronLeft size={22} className="text-white" />
                  </motion.button>
                )}

                {/* Next Picture Button */}
                {currentPhotoList.length > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.15, x: 2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNextPicture}
                    className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-black/95 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20 shadow-2xl cursor-pointer"
                    title="Next picture (→)"
                    aria-label="Next picture"
                  >
                    <ChevronRight size={22} className="text-white" />
                  </motion.button>
                )}

                {/* Floating Bottom Info Pill in Full View Mode */}
                {isFullView && (
                  <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                    <div className="pointer-events-auto bg-black/80 backdrop-blur-md border border-fuchsia-500/30 px-4 py-2 rounded-2xl shadow-xl max-w-xl text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold uppercase text-fuchsia-300 px-2 py-0.5 rounded-md bg-fuchsia-950/80 border border-fuchsia-500/30">
                          {selectedImage.category}
                        </span>
                        <h4 className="font-serif font-bold text-white text-sm sm:text-base truncate">
                          {selectedImage.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-slate-300 truncate mt-0.5 font-mono">
                        {selectedImage.date} {selectedImage.location ? `• ${selectedImage.location}` : ""}
                      </p>
                    </div>

                    <div className="pointer-events-auto flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsFullView(false)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-600/90 hover:bg-cyan-500 text-white backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 cursor-pointer font-mono"
                      >
                        <Sparkles size={12} />
                        View Story Details
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Story Details Column (Visible in Normal Mode) */}
              {!isFullView && (
                <div className="w-full md:w-2/5 lg:w-1/3 p-6 sm:p-10 flex flex-col justify-between bg-[#070b19] relative overflow-y-auto text-left max-h-[50vh] md:max-h-none">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setIsFullView(false);
                    }}
                    className="absolute top-6 right-6 text-slate-400 hover:text-fuchsia-400 w-8 h-8 rounded-full flex items-center justify-center transition-all hidden md:flex font-bold cursor-pointer"
                    title="Close viewer"
                  >
                    <X size={18} />
                  </button>

                  <div className="space-y-6 mt-2 md:mt-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-fuchsia-950/80 text-fuchsia-300 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-fuchsia-500/30 font-mono">
                          <Sparkles size={11} className="text-cyan-400" /> {selectedImage.category}
                        </span>
                        {selectedImage.isBanner && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-950/80 text-rose-300 text-[9px] font-extrabold uppercase tracking-widest rounded-full border border-rose-500/30 font-mono">
                            <Film size={10} /> Slideshow
                          </span>
                        )}
                        {selectedImage.showOnHome !== false && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-950/80 text-cyan-300 text-[9px] font-extrabold uppercase tracking-widest rounded-full border border-cyan-500/30 font-mono">
                            <Star size={10} className="fill-cyan-400" /> Homepage
                          </span>
                        )}
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                        {selectedImage.title}
                      </h3>
                      <p className="text-xs font-mono font-bold text-fuchsia-300/80 uppercase tracking-widest mt-2 inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-cyan-400" /> {selectedImage.date}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-indigo-500/20">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2 font-mono">
                        The Story
                      </span>
                      <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium italic">
                        &ldquo;{selectedImage.desc || "A timeless moment captured forever in our memory vault."}&rdquo;
                      </p>
                    </div>

                    {selectedImage.addedBy && (
                      <div className="pt-4 border-t border-indigo-500/20">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1 font-mono">
                          Pinned by
                        </span>
                        <p className="text-xs font-semibold text-slate-300">
                          {selectedImage.addedBy}
                          {selectedImage.addedByRole && (
                            <span className="ml-2 text-fuchsia-400">({selectedImage.addedByRole})</span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-indigo-500/20 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                      <span className="inline-flex items-center gap-1 text-fuchsia-400">
                        <Heart size={12} className="text-rose-500 fill-rose-500" /> Pinned with love
                      </span>
                      {selectedImage.location && (
                        <span className="inline-flex items-center gap-1 text-cyan-300">
                          <MapPin size={11} /> {selectedImage.location}
                        </span>
                      )}
                    </div>

                    {/* Quick navigation hint */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                      <span>Use ← / → keys to navigate</span>
                      <span>Press F for full view</span>
                    </div>

                    {/* Edit & Delete Controls inside lightbox for Rayhan / Afrin (Only when Edit Mode is active) */}
                    {canManageMemory && isEditMode && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => {
                            handleOpenEdit(selectedImage);
                          }}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-cyan-400 hover:bg-cyan-950/50 border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Pencil size={13} /> Edit Memory
                        </button>
                        <button
                          onClick={() => handleDeleteMemory(selectedImage)}
                          disabled={deletingId === (selectedImage.id || selectedImage._id)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/50 border border-rose-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 size={13} /> {deletingId === (selectedImage.id || selectedImage._id) ? "Removing…" : "Remove"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. ADD MEMORY MODAL (Animated with Framer Motion) */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="w-full max-w-lg bg-[#070b19] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(217,70,239,0.2)] p-6 sm:p-8 space-y-6 text-white border border-fuchsia-500/30 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-indigo-500/20 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Camera size={22} className="text-fuchsia-400" />
                    Pin a New Memory
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Save a moment forever in Rayhan &amp; Afrin&apos;s scrapbook
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddMemory} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Memory Title <span className="text-fuchsia-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sunset Coffee at Dhanmondi Lake"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. August 02, 2026"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 text-sm"
                    >
                      <option value="dates">Date Night</option>
                      <option value="trips">Adventure / Trip</option>
                      <option value="cozy">Cozy Moment</option>
                      <option value="celebrations">Celebration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Uttara Lake Park"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://i.ibb.co/... or any image link"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Memory Story / Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write a sweet memory description..."
                    value={formData.desc}
                    onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/40 focus:border-fuchsia-500 text-sm"
                  />
                </div>

                <div className="space-y-2.5 pt-1 border-t border-indigo-500/20">
                  {/* Banner toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.isBanner}
                      onChange={(e) => setFormData({ ...formData, isBanner: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-fuchsia-500"
                    />
                    <span className="text-xs font-bold text-slate-300 inline-flex items-center gap-1.5">
                      <Film size={14} className="text-fuchsia-400" />
                      Feature in Top Slideshow Banner?
                    </span>
                  </label>

                  {/* Homepage Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formData.showOnHome}
                      onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-cyan-400"
                    />
                    <span className="text-xs font-bold text-slate-300 inline-flex items-center gap-1.5">
                      <Home size={14} className="text-cyan-400" />
                      Feature on Homepage Memories section?
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(217,70,239,0.35)] transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Memory
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. EDIT / MODIFY MEMORY MODAL (Animated with Framer Motion) */}
      <AnimatePresence>
        {isEditModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl"
            onClick={() => setIsEditModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="w-full max-w-lg bg-[#070b19] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 sm:p-8 space-y-6 text-white border border-cyan-500/30 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-indigo-500/20 pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
                    <Pencil size={20} className="text-cyan-400" />
                    Edit Memory Details
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Update memory images, titles, locations, slideshow banner, and homepage display
                  </p>
                </div>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleUpdateMemory} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Memory Title <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={editFormData.category}
                      onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 text-sm"
                    >
                      <option value="dates">Date Night</option>
                      <option value="trips">Adventure / Trip</option>
                      <option value="cozy">Cozy Moment</option>
                      <option value="celebrations">Celebration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editFormData.imageUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 text-sm"
                  />
                  {editFormData.imageUrl && (
                    <div className="mt-2 h-24 w-full rounded-lg overflow-hidden bg-slate-900 border border-indigo-500/20">
                      <img
                        src={editFormData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Memory Story / Description
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.desc}
                    onChange={(e) => setEditFormData({ ...editFormData, desc: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-indigo-500/30 bg-slate-950/70 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 text-sm"
                  />
                </div>

                <div className="space-y-2.5 pt-1 border-t border-indigo-500/20">
                  {/* Banner toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editFormData.isBanner}
                      onChange={(e) => setEditFormData({ ...editFormData, isBanner: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-fuchsia-500"
                    />
                    <span className="text-xs font-bold text-slate-300 inline-flex items-center gap-1.5">
                      <Film size={14} className="text-fuchsia-400" />
                      Feature in Top Slideshow Banner?
                    </span>
                  </label>

                  {/* Homepage Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editFormData.showOnHome}
                      onChange={(e) => setEditFormData({ ...editFormData, showOnHome: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 accent-cyan-400"
                    />
                    <span className="text-xs font-bold text-slate-300 inline-flex items-center gap-1.5">
                      <Home size={14} className="text-cyan-400" />
                      Feature on Homepage Memories section?
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)] transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full" />
                        Updating…
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Changes
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}