"use client"
import React, { useState } from 'react';

const DEFAULT_NOTES = [
  {
    id: 1,
    author: "RayHan",
    recipient: "Afrin",
    text: "Just wanted to remind you that you are my absolute favorite human. Thank you for making me laugh until my stomach hurts! Love you to the moon and back. 🌙❤️",
    date: "July 1, 2026",
    emoji: "💖",
    color: "bg-rose-100 border-rose-200 text-rose-800",
    rotation: "-rotate-2",
    likes: 12
  },
  {
    id: 2,
    author: "Afrin",
    recipient: "RayHan",
    text: "Good luck with your big presentation today! I know you've been working so hard and losing sleep over it. You are going to absolutely crush it, my rock! 💪✨",
    date: "June 28, 2026",
    emoji: "🍀",
    color: "bg-emerald-100 border-emerald-200 text-emerald-800",
    rotation: "rotate-3",
    likes: 8
  },
  {
    id: 3,
    author: "RayHan",
    recipient: "Afrin",
    text: "Can we please have another blanket fort movie night this weekend? I'll make the extra buttery popcorn and buy those chocolate-covered raisins you love. 🍿🎬",
    date: "June 25, 2026",
    emoji: "🧸",
    color: "bg-amber-100 border-amber-200 text-amber-800",
    rotation: "rotate-1",
    likes: 15
  },
  {
    id: 4,
    author: "Afrin",
    recipient: "RayHan",
    text: "I was just looking at our Kyoto trip pictures and my heart melted. We need to go on another spontaneous adventure soon! Where to next, Captain? ✈️🗺️",
    date: "June 22, 2026",
    emoji: "🗺️",
    color: "bg-sky-100 border-sky-200 text-sky-800",
    rotation: "-rotate-3",
    likes: 14
  }
];

export default function LoveNotes() {
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for new sticky notes
  const [formData, setFormData] = useState({
    author: "RayHan",
    text: "",
    emoji: "❤️",
    colorTheme: "pink"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;

    // Map selected theme to actual Tailwind color classes
    const themeMaps = {
      pink: "bg-rose-100 border-rose-200 text-rose-800",
      yellow: "bg-amber-100 border-amber-200 text-amber-800",
      blue: "bg-sky-100 border-sky-200 text-sky-800",
      green: "bg-emerald-100 border-emerald-200 text-emerald-800"
    };

    // Randomize a rotation angle for standard corkboard realism
    const rotations = ["-rotate-3", "-rotate-2", "-rotate-1", "rotate-1", "rotate-2", "rotate-3"];
    const randomRotation = rotations[Math.floor(Math.random() * rotations.length)];

    const newNote = {
      id: Date.now(),
      author: formData.author,
      recipient: formData.author === "RayHan" ? "Afrin" : "RayHan",
      text: formData.text,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      emoji: formData.emoji,
      color: themeMaps[formData.colorTheme] || themeMaps.pink,
      rotation: randomRotation,
      likes: 0
    };

    setNotes(prev => [newNote, ...prev]);
    setIsModalOpen(false);

    // Reset Form (keep author selected for convenience)
    setFormData(prev => ({
      ...prev,
      text: "",
      emoji: "❤️",
      colorTheme: "pink"
    }));
  };

  const handleLikeNote = (id) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, likes: note.likes + 1 } : note
      )
    );
  };

  const handleDeleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Filter logic based on who wrote it
  const filteredNotes = notes.filter(note => {
    if (activeFilter === "all") return true;
    return note.author.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="notes" className="relative py-24 bg-amber-50/20 px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Background aesthetic decorative blurs */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-amber-100 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-rose-100 rounded-full blur-3xl pointer-events-none opacity-60" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {}
        <div className="space-y-4 mb-16">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Digital Wall of Affection
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Our Shared Love Notes
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Leave cozy reminders, funny notes, or midnight greetings to brighten each other's day. Pin your heart to our virtual corkboard!
          </p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group"
          >
            <span>📌</span> Leave a New Note
          </button>
        </div>

        {}
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap mb-14">
          {[
            { key: "all", label: "All Notes", icon: "📋" },
            { key: "rayhan", label: "Written by RayHan", icon: "🙋‍♂️" },
            { key: "afrin", label: "Written by Afrin", icon: "🙋‍♀️" }
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

        {}
        <div className="relative max-w-5xl mx-auto bg-amber-950/5 border-4 border-amber-900/10 rounded-[2.5rem] p-6 sm:p-10 shadow-inner">
          {/* Cork pattern dot mesh backdrop layer */}
          <div className="absolute inset-0 bg-[radial-gradient(#854d0e_1px,transparent_1px)] bg-size-[16px_16px] opacity-15 rounded-[2.3rem] pointer-events-none" />
          
          {filteredNotes.length === 0 ? (
            <div className="relative text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border border-dashed border-amber-900/10 p-8 z-10">
              <span className="text-5xl block mb-3 animate-bounce">🎈</span>
              <p className="text-sm font-semibold text-slate-600">Our board is completely empty right now.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-3 text-xs font-bold text-rose-500 hover:text-rose-600 underline"
              >
                Write the very first sticky note!
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`relative p-6 pb-8 border shadow-lg transform ${note.rotation} hover:rotate-0 hover:scale-105 hover:shadow-2xl hover:z-20 transition-all duration-300 flex flex-col justify-between text-left min-h-55 group ${note.color}`}
                >
                  {/* Decorative Pin Vector Accent at Top Center */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center select-none z-10 filter drop-shadow">
                    <span className="text-2xl animate-pulse">📌</span>
                  </div>

                  {/* Header Author Tags & Emojis */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-60">
                        From: {note.author}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-55">
                        To: {note.recipient}
                      </span>
                    </div>
                    <span className="text-2xl filter drop-shadow-sm">{note.emoji}</span>
                  </div>

                  {/* Note Message Content */}
                  <div className="flex-1">
                    <p className="font-serif italic text-sm sm:text-base leading-relaxed font-medium">
                      "{note.text}"
                    </p>
                  </div>

                  {/* Footer Stats, Date, Action Controls */}
                  <div className="mt-6 pt-3 border-t border-black/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold tracking-tight opacity-50">
                      📅 {note.date}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Interactive Heart Counter Reaction */}
                      <button
                        onClick={() => handleLikeNote(note.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/50 hover:bg-white border border-black/5 transition-all text-xs font-bold hover:scale-105"
                        title="Give some love!"
                      >
                        <span className="text-rose-500">❤️</span>
                        <span className="text-slate-700 text-[11px]">{note.likes}</span>
                      </button>

                      {/* Trash Note Trigger on Hover */}
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-black/5 transition-opacity text-slate-500 hover:text-rose-600 text-xs"
                        title="Remove note"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-rose-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">Write a Love Note</h3>
                <p className="text-xs text-slate-500">Leave a sweet thought or reminder on the board!</p>
              </div>

              {/* Grid block author selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Who is Writing?
                  </label>
                  <select
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 font-medium"
                  >
                    <option value="RayHan">RayHan 🙋‍♂️</option>
                    <option value="Afrin">Afrin 🙋‍♀️</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Mood/Emoji Icon
                  </label>
                  <select
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 font-medium"
                  >
                    <option value="❤️">❤️ Love</option>
                    <option value="💖">💖 Cherish</option>
                    <option value="🧸">🧸 Cozy</option>
                    <option value="🍕">🍕 Foodie</option>
                    <option value="🍀">🍀 Support</option>
                    <option value="✨">✨ Sparkle</option>
                    <option value="☕">☕ Morning</option>
                  </select>
                </div>
              </div>

              {/* Sticky Background Themes Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Choose Sticky Note Color
                </label>
                <div className="flex gap-3">
                  {[
                    { key: "pink", class: "bg-rose-100 border-rose-200" },
                    { key: "yellow", class: "bg-amber-100 border-amber-200" },
                    { key: "blue", class: "bg-sky-100 border-sky-200" },
                    { key: "green", class: "bg-emerald-100 border-emerald-200" }
                  ].map(theme => (
                    <button
                      key={theme.key}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, colorTheme: theme.key }))}
                      className={`w-8 h-8 rounded-lg border transition-all ${theme.class} ${
                        formData.colorTheme === theme.key ? 'scale-110 ring-2 ring-rose-400 shadow-md' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Note Message Form Area */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Your Note Content
                </label>
                <textarea
                  name="text"
                  value={formData.text}
                  onChange={handleInputChange}
                  placeholder="E.g., Good morning gorgeous! Hope your coffee is sweet and your day is happy..."
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-100 hover:shadow-rose-200 transition-all text-xs uppercase tracking-wider"
              >
                📌 Pin Sticky Note
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}