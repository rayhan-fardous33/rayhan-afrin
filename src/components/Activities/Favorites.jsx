"use client"
import React, { useState } from 'react';

const DEFAULT_FAVORITES = [
  {
    id: 1,
    category: "Comfort Food",
    icon: "🍕",
    his: "Neapolitan Pizza",
    hers: "Spicy Salmon Sushi",
    compatibility: "We both love eating out on Fridays!",
    hearts: 14
  },
  {
    id: 2,
    category: "Love Language",
    icon: "💬",
    his: "Quality Time & Acts",
    hers: "Words of Affirmation",
    compatibility: "Perfect match: He does chores, she writes love notes!",
    hearts: 28
  },
  {
    id: 3,
    category: "Dream Getaway",
    icon: "✈️",
    his: "Misty Swiss Alps",
    hers: "Kyoto Autumn Streets",
    compatibility: "Let's just travel the whole world together.",
    hearts: 19
  },
  {
    id: 4,
    category: "Coffee Order",
    icon: "☕",
    his: "Double Iced Latte",
    hers: "Vanilla Cold Brew",
    compatibility: "Caffeine fueled lovers since day one.",
    hearts: 22
  },
  {
    id: 5,
    category: "Weekend Activity",
    icon: "🛋️",
    his: "Video Game Marathons",
    hers: "Reading Cozy Books",
    compatibility: "Perfect couch sharing partners.",
    hearts: 11
  },
  {
    id: 6,
    category: "Favorite Season",
    icon: "🍂",
    his: "Winter Snowdays",
    hers: "Autumn Colors",
    compatibility: "Cozy clothing and hot chocolate weather lovers.",
    hearts: 15
  }
];

export default function Favorites() {
  const [favorites, setFavorites] = useState(DEFAULT_FAVORITES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    icon: "⭐",
    his: "",
    hers: "",
    compatibility: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.his || !formData.hers) return;

    const newFavorite = {
      id: Date.now(),
      category: formData.category,
      icon: formData.icon || "⭐",
      his: formData.his,
      hers: formData.hers,
      compatibility: formData.compatibility || "Opposites attract, or matches made in heaven!",
      hearts: 0
    };

    setFavorites(prev => [...prev, newFavorite]);
    setIsModalOpen(false);
    setFormData({
      category: "",
      icon: "⭐",
      his: "",
      hers: "",
      compatibility: ""
    });
  };

  const handleLikeCategory = (id) => {
    setFavorites(prev =>
      prev.map(item =>
        item.id === id ? { ...item, hearts: item.hearts + 1 } : item
      )
    );
  };

  return (
    <section id="favorites" className="relative py-24 bg-white px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Aesthetic ambient blobs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-blue-50 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-pink-50 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {}
        <div className="text-center space-y-4 mb-16">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Side-by-Side Comparison
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Who Liked What Best?
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            We might have different styles, tastes, and favorites, but together we make the absolute perfect blend.
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            📊 Suggest a New Category
          </button>
        </div>

        {}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="bg-linear-to-tr from-white to-rose-50/10 border border-rose-100/40 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-rose-100 transition-all duration-300 relative group flex flex-col justify-between"
            >
              {/* Category Header with Icon */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl bg-rose-50 p-2 rounded-2xl border border-rose-100/50">
                    {item.icon}
                  </span>
                  <span className="font-serif font-extrabold text-slate-800 text-lg">
                    {item.category}
                  </span>
                </div>

                {/* Love Heart Tally Button */}
                <button
                  onClick={() => handleLikeCategory(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 transition-all text-xs font-bold border border-rose-100/40"
                  title="We agree on this category!"
                >
                  <span className="animate-pulse">❤️</span>
                  <span>{item.hearts}</span>
                </button>
              </div>

              {/* Boy vs Girl Choices Display */}
              <div className="grid grid-cols-2 gap-4 relative">
                {/* Divider Line */}
                <div className="absolute top-1/2 bottom-0 left-1/2 -translate-x-1/2 w-px bg-dashed bg-rose-100 h-10 hidden sm:block" />

                {/* Boy's Favorite (RayHan) */}
                <div className="bg-blue-50/20 hover:bg-blue-50/40 border border-blue-100/20 p-4 rounded-2xl text-center transition-all">
                  <span className="block text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-1.5">
                    🙋‍♂️ RayHan's Favorite
                  </span>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">
                    {item.his}
                  </p>
                </div>

                {/* Girl's Favorite (Afrin) */}
                <div className="bg-pink-50/20 hover:bg-pink-50/40 border border-pink-100/20 p-4 rounded-2xl text-center transition-all">
                  <span className="block text-[10px] font-extrabold text-pink-500 uppercase tracking-widest mb-1.5">
                    🙋‍♀️ Afrin's Favorite
                  </span>
                  <p className="font-semibold text-slate-800 text-sm sm:text-base">
                    {item.hers}
                  </p>
                </div>
              </div>

              {/* Synergy / Compatibility Note */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs italic text-slate-500 font-medium">
                  ✨ {item.compatibility}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="text-center pb-2">
                <h3 className="font-serif text-xl font-bold text-slate-950">Add a Comparison Category</h3>
                <p className="text-xs text-slate-500">Record how your favorites stack up side-by-side!</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="E.g., Sweet Dessert..."
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Icon Emoji
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium text-slate-700 text-center"
                  >
                    <option value="🍕">🍕</option>
                    <option value="💬">💬</option>
                    <option value="✈️">✈️</option>
                    <option value="☕">☕</option>
                    <option value="🛋️">🛋️</option>
                    <option value="🍂">🍂</option>
                    <option value="🎬">🎬</option>
                    <option value="🍫">🍫</option>
                    <option value="🧁">🧁</option>
                    <option value="🍦">🍦</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    RayHan's Favorite
                  </label>
                  <input
                    type="text"
                    name="his"
                    value={formData.his}
                    onChange={handleInputChange}
                    placeholder="E.g., Mint Choc..."
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Afrin's Favorite
                  </label>
                  <input
                    type="text"
                    name="hers"
                    value={formData.hers}
                    onChange={handleInputChange}
                    placeholder="E.g., Strawberry..."
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  How they compare (Compatibility Quote)
                </label>
                <input
                  type="text"
                  name="compatibility"
                  value={formData.compatibility}
                  onChange={handleInputChange}
                  placeholder="E.g., Both sweet but we share anyway!"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-100 hover:shadow-rose-200 transition-all text-xs uppercase tracking-wider"
              >
                📊 Add Category Comparison
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}