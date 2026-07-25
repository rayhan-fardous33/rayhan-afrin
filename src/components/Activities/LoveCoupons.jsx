"use client"
import React, { useState, useEffect } from 'react';

const DEFAULT_COUPONS = [
  {
    id: 1,
    title: "Cozy Breakfast in Bed 🥞",
    description: "Redeem this for a fresh morning stack of pancakes or eggs, made by your favorite chef and delivered right to your pillow.",
    category: "food",
    status: "available", // "available", "claimed"
    color: "from-amber-100 to-amber-50 border-amber-300 text-amber-900",
    stampColor: "text-amber-600 border-amber-500",
    emoji: "🍳"
  },
  {
    id: 2,
    title: "Movie Night Choice Pass 🎬",
    description: "No arguments, no endless scrolling! You get total and absolute control of the TV remote, movie choice, and popcorn flavor tonight.",
    category: "cozy",
    status: "available",
    color: "from-purple-100 to-purple-50 border-purple-300 text-purple-900",
    stampColor: "text-purple-600 border-purple-500",
    emoji: "🍿"
  },
  {
    id: 3,
    title: "Deep Back Massage 💆‍♀️",
    description: "Entitles the bearer to a relaxing, stress-melting 30-minute massage with lavender oil and soothing music.",
    category: "pamper",
    status: "claimed",
    redeemedDate: "July 1, 2026",
    color: "from-rose-100 to-rose-50 border-rose-300 text-rose-900",
    stampColor: "text-rose-600 border-rose-500",
    emoji: "🌸"
  },
  {
    id: 4,
    title: "Spontaneous Ice Cream Run 🍦",
    description: "No matter how late it is or what we are doing, redeem this to immediately drop everything and drive to get double-scoop ice creams.",
    category: "food",
    status: "available",
    color: "from-sky-100 to-sky-50 border-sky-300 text-sky-900",
    stampColor: "text-sky-600 border-sky-500",
    emoji: "🍧"
  },
  {
    id: 5,
    title: "A 'Yes Day' (Within Reason) 👍",
    description: "Alex has to say yes to whatever fun plans, shopping, or silly challenges you propose for the next 4 hours!",
    category: "adventure",
    status: "available",
    color: "from-emerald-100 to-emerald-50 border-emerald-300 text-emerald-900",
    stampColor: "text-emerald-600 border-emerald-500",
    emoji: "✨"
  }
];

export default function LoveCoupons() {
  const [coupons, setCoupons] = useState(() => {
    // Attempt local storage sync
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('couple_love_coupons');
      return saved ? JSON.parse(saved) : DEFAULT_COUPONS;
    }
    return DEFAULT_COUPONS;
  });

  const [activeTab, setActiveTab] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("cozy");
  const [newEmoji, setNewEmoji] = useState("🎁");

  useEffect(() => {
    localStorage.setItem('couple_love_coupons', JSON.stringify(coupons));
  }, [coupons]);

  const handleClaimCoupon = (id) => {
    const today = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    setCoupons(prev =>
      prev.map(coupon => {
        if (coupon.id === id) {
          return {
            ...coupon,
            status: coupon.status === "available" ? "claimed" : "available",
            redeemedDate: coupon.status === "available" ? today : null
          };
        }
        return coupon;
      })
    );
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const themeColors = {
      food: "from-amber-100 to-amber-50 border-amber-300 text-amber-900",
      cozy: "from-purple-100 to-purple-50 border-purple-300 text-purple-900",
      pamper: "from-rose-100 to-rose-50 border-rose-300 text-rose-900",
      adventure: "from-emerald-100 to-emerald-50 border-emerald-300 text-emerald-900"
    };

    const themeStamps = {
      food: "text-amber-600 border-amber-500",
      cozy: "text-purple-600 border-purple-500",
      pamper: "text-rose-600 border-rose-500",
      adventure: "text-emerald-600 border-emerald-500"
    };

    const newCoupon = {
      id: Date.now(),
      title: newTitle,
      description: newDesc,
      category: newCategory,
      status: "available",
      color: themeColors[newCategory] || themeColors.cozy,
      stampColor: themeStamps[newCategory] || themeStamps.cozy,
      emoji: newEmoji
    };

    setCoupons(prev => [newCoupon, ...prev]);
    setNewTitle("");
    setNewDesc("");
    setShowAddModal(false);
  };

  const handleDeleteCoupon = (id) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const filteredCoupons = coupons.filter(c => {
    if (activeTab === "all") return true;
    if (activeTab === "claimed") return c.status === "claimed";
    return c.category === activeTab;
  });

  return (
    <section id="coupons" className="relative py-24 bg-rose-50/10 px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Soft Ambient Aesthetics */}
      <div className="absolute top-1/4 -right-32 w-80 h-80 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* Section Header */}
        <div className="space-y-4 mb-16">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Love Voucher Book
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Our Digital Love Coupons
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Surprise her by gifting custom, redeemable vouchers! When she's having a busy day or wants a cozy night, she can tear one off to claim her treat.
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group"
          >
            <span>🎟️</span> Gift a Custom Coupon
          </button>
        </div>

        {/* Filter Navigation */}
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap mb-14">
          {[
            { key: "all", label: "All Coupons", icon: "📋" },
            { key: "claimed", label: "Used Stamps", icon: "🏷️" },
            { key: "cozy", label: "Cozy Pass", icon: "🍿" },
            { key: "food", label: "Tasty Bites", icon: "🍕" },
            { key: "pamper", label: "Pampering", icon: "💆‍♀️" },
            { key: "adventure", label: "Adventures", icon: "✈️" }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveTab(filter.key)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
                activeTab === filter.key
                  ? "bg-rose-500 text-white border-rose-500 shadow-rose-200"
                  : "bg-white hover:bg-rose-50 text-slate-600 border-slate-100 hover:text-rose-600"
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {}
        {/* Coupons Tear-Off Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {filteredCoupons.map((coupon) => {
            const isClaimed = coupon.status === "claimed";

            return (
              <div
                key={coupon.id}
                className={`relative bg-linear-to-br ${coupon.color} border-2 rounded-3xl p-6 flex flex-col justify-between min-h-62.5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group`}
              >
                {/* Visual Coupon Tear-Off scalloped dots line at the bottom */}
                <div className="absolute bottom-16 left-0 right-0 h-0.5 border-t border-dashed border-black/10 flex justify-between px-1">
                  {/* Left & Right scalloped punchholes */}
                  <div className="absolute -left-3 -top-1.75 w-6 h-6 rounded-full bg-white border border-slate-200/50" />
                  <div className="absolute -right-3 -top-1.75 w-6 h-6 rounded-full bg-white border border-slate-200/50" />
                </div>

                {/* Top Half of Coupon */}
                <div className="space-y-3 pb-8 text-left">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl filter drop-shadow-sm">{coupon.emoji}</span>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                      NO. {coupon.id.toString().slice(-4)}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg leading-tight">
                    {coupon.title}
                  </h3>
                  <p className="text-xs leading-relaxed opacity-85 font-medium">
                    {coupon.description}
                  </p>
                </div>

                {/* Used Stamp Overlay */}
                {isClaimed && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none rotate-6 scale-110 z-10 animate-fade-in">
                    <div className={`border-4 ${coupon.stampColor} font-serif font-bold text-sm tracking-wider uppercase px-4 py-1.5 rounded-xl border-dashed bg-white/90 shadow-md`}>
                      Claimed &amp; Loved 💖
                      <span className="block text-[8px] font-sans font-bold text-center mt-0.5 tracking-tight">
                        {coupon.redeemedDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Bottom Tear-Off Activation Trigger */}
                <div className="pt-4 flex items-center justify-between min-h-12">
                  <button
                    onClick={() => handleClaimCoupon(coupon.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm ${
                      isClaimed
                        ? "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    }`}
                  >
                    {isClaimed ? "↩️ Re-add to Book" : "🎟️ Tear & Redeem!"}
                  </button>

                  <button
                    onClick={() => handleDeleteCoupon(coupon.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-black/5 transition-opacity text-slate-400 hover:text-rose-600 text-xs"
                    title="Delete Voucher"
                  >
                    ✕ Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {}
      {/* MODAL: CREATE CUSTOM COUPON */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-slate-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddCoupon} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">Add a New Love Coupon</h3>
                <p className="text-xs text-slate-500">Design a custom gift card that your girlfriend can claim anytime!</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Voucher Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Back Scratch Session 💆‍♂️"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Gift Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 text-slate-700 font-medium"
                  >
                    <option value="cozy">🎥 Cozy Night</option>
                    <option value="food">🍕 Foodie</option>
                    <option value="pamper">💆‍♀️ Pampering</option>
                    <option value="adventure">✈️ Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Pick an Emoji
                  </label>
                  <select
                    value={newEmoji}
                    onChange={(e) => setNewEmoji(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 text-slate-700 font-medium"
                  >
                    <option value="🥞">🥞 Pancakes</option>
                    <option value="🍿">🍿 Movie</option>
                    <option value="💆‍♀️">💆‍♀️ Massage</option>
                    <option value="🍦">🍦 Ice Cream</option>
                    <option value="🍷">🍷 Date Night</option>
                    <option value="🎁">🎁 Surprise Gift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Voucher Terms &amp; Backstory
                </label>
                <textarea
                  placeholder="Explain how she can redeem it and what special items are included!"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                🎟️ Insert Coupon in Book
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}