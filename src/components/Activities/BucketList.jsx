"use client"
import React, { useState } from 'react';

const DEFAULT_BUCKET_ITEMS = [
  {
    id: 1,
    task: "Watch the Northern Lights in Iceland 🌌",
    category: "travel",
    done: false,
    targetDate: "Winter 2027",
    notes: "Renting a glass dome cabin so we can watch them from bed!"
  },
  {
    id: 2,
    task: "Bake a chocolate soufflé from scratch 🍫",
    category: "food",
    done: true,
    targetDate: "Completed! Oct 2025",
    notes: "It collapsed the first time, but the second attempt was pure heaven."
  },
  {
    id: 3,
    task: "Build a blanket fort movie marathon cozy spot 🎪",
    category: "cozy",
    done: true,
    targetDate: "Completed! Dec 2024",
    notes: "Used every pillow in the house. Watched Ghibli films all night."
  },
  {
    id: 4,
    task: "Learn to salsa dance together 💃🕺",
    category: "growth",
    done: false,
    targetDate: "Summer 2026",
    notes: "Sign up for that weekend workshop down the street."
  },
  {
    id: 5,
    task: "Go on a spontaneous midnight road trip 🚗",
    category: "travel",
    done: false,
    targetDate: "Sometime soon!",
    notes: "No maps allowed, just driving until we find a 24-hour diner."
  },
  {
    id: 6,
    task: "Plant a tiny herb garden on our windowsill 🌱",
    category: "cozy",
    done: true,
    targetDate: "Completed! Apr 2025",
    notes: "Our basil plant is named 'Sir Fluff'. We use it for homemade pizza!"
  }
];

export default function BucketList() {
  const [items, setItems] = useState(DEFAULT_BUCKET_ITEMS);
  const [activeFilter, setActiveFilter] = useState("all");
  const [formData, setFormData] = useState({
    task: "",
    category: "travel",
    targetDate: "",
    notes: ""
  });

  const totalItems = items.length;
  const completedItems = items.filter(item => item.done).length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!formData.task.trim()) return;

    const newItem = {
      id: Date.now(),
      task: formData.task,
      category: formData.category,
      done: false,
      targetDate: formData.targetDate || "Dreaming of it!",
      notes: formData.notes || "No special notes added yet."
    };

    setItems(prev => [...prev, newItem]);
    setFormData({
      task: "",
      category: "travel",
      targetDate: "",
      notes: ""
    });
  };

  const handleToggleItem = (id) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  // Filter logic
  const filteredItems = items.filter(item => {
    if (activeFilter === "all") return true;
    return item.category === activeFilter;
  });

  return (
    <section id="bucketlist" className="relative py-24 bg-rose-50/10 px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Background soft blurs */}
      <div className="absolute top-1/4 -right-24 w-80 h-80 bg-rose-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-amber-50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {}
        <div className="text-center space-y-4 mb-16">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Adventures Awaiting
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Our Shared Bucket List
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            A combined checklist of wild travel plans, cozy ideas, and milestone goals we promise to experience hand-in-hand.
          </p>
        </div>

        {}
        <div className="max-w-xl mx-auto bg-white border border-rose-100/40 p-6 rounded-3xl shadow-sm mb-12">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block">
              Adventure Progress
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/30">
              {completedItems} of {totalItems} Accomplished ({completionPercentage}%)
            </span>
          </div>
          
          {/* Dynamic Progress Bar */}
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/20">
            <div 
              className="h-full bg-linear-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Categories Filtering Toggles */}
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap mb-10">
          {[
            { key: "all", label: "All Hopes", icon: "🌌" },
            { key: "travel", label: "Wanderlust", icon: "✈️" },
            { key: "food", label: "Tasty Bites", icon: "🍕" },
            { key: "cozy", label: "Cozy Days", icon: "🏡" },
            { key: "growth", label: "Growing Together", icon: "🌱" }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border ${
                activeFilter === filter.key
                  ? "bg-rose-500 text-white border-rose-500 shadow-rose-200"
                  : "bg-white hover:bg-rose-50 text-slate-600 border-slate-100 hover:text-rose-600"
              }`}
            >
              <span>{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Grid Split: Adding form left side, active cards list right side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-start">
          
          {}
          <div className="lg:col-span-4 bg-white border border-rose-100/50 p-6 sm:p-8 rounded-3xl shadow-sm text-left">
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-lg font-bold text-slate-900">Pin a New Dream</h3>
                <p className="text-xs text-slate-400">Add another wild dream to our combined list!</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  The Adventure / Goal
                </label>
                <input
                  type="text"
                  name="task"
                  value={formData.task}
                  onChange={handleInputChange}
                  placeholder="E.g., Skydiving together..."
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all font-medium text-slate-700"
                  >
                    <option value="travel">✈️ Travel</option>
                    <option value="food">🍕 Food</option>
                    <option value="cozy">🏡 Cozy</option>
                    <option value="growth">🌱 Growth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Target Date
                  </label>
                  <input
                    type="text"
                    name="targetDate"
                    value={formData.targetDate}
                    onChange={handleInputChange}
                    placeholder="E.g., Winter 2026"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Cozy Notes / Prep Ideas
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="E.g., Who will book tickets, special details..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-all text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2"
              >
                📝 Log Dream Adventure
              </button>
            </form>
          </div>

          {}
          <div className="lg:col-span-8 space-y-4 max-h-145 overflow-y-auto pr-2">
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-rose-100/50 p-8">
                <span className="text-4xl block mb-2">🎈</span>
                <p className="text-sm font-semibold text-slate-500">No items in this category yet.</p>
                <p className="text-xs text-slate-400 mt-1">Get creative and log your first one using the creator form!</p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-5 shadow-sm transition-all duration-300 relative group flex items-start gap-4 text-left ${
                    item.done
                      ? "bg-emerald-50/20 border-emerald-100/60"
                      : "bg-white hover:bg-rose-50/5 border-slate-100/80 hover:border-rose-100"
                  }`}
                >
                  {/* Complete Circle Toggler Checkbox */}
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    className={`shrink-0 w-6.5 h-6.5 rounded-full flex items-center justify-center border transition-all text-sm font-extrabold focus:outline-none ${
                      item.done
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white hover:bg-rose-50 border-slate-200 text-rose-500 hover:text-rose-600 scale-100 hover:scale-110"
                    }`}
                    title={item.done ? "Mark as pending" : "Mark as completed!"}
                  >
                    {item.done ? "✓" : "❤️"}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h4 className={`font-serif font-bold text-base sm:text-lg leading-tight transition-colors ${
                        item.done ? "line-through text-slate-400" : "text-slate-800"
                      }`}>
                        {item.task}
                      </h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 self-start sm:self-auto bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                        🗓️ {item.targetDate}
                      </span>
                    </div>

                    <p className={`text-xs leading-relaxed transition-colors ${
                      item.done ? "text-slate-400/80" : "text-slate-500"
                    }`}>
                      {item.notes}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-[9px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100/40">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Delete Card Button on Hover */}
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-all text-xs"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </section>
  );
}