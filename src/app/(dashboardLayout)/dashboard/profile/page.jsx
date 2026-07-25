"use client"
import React, { useState, useEffect } from 'react';

const INITIAL_PARTNERS_DATA = {
  rayhan: {
    name: "Rayhan",
    role: "Admin & Developer",
    avatar: "🙋‍♂️",
    email: "rayhan@ourstory.com",
    birthdate: "1999-04-12",
    location: "Dhaka, Bangladesh",
    status: "Busy coding, but missing you! 💻",
    loveLanguage: "Quality Time & Acts of Service ⏳",
    favoriteMemory: "Our late-night walk by the river under the glowing lanterns.",
    colorTheme: "from-blue-500 to-indigo-600",
    textTheme: "text-blue-600",
    bgTheme: "bg-blue-50/40"
  },
  afrin: {
    name: "Afrin",
    role: "Co-Author & Designer",
    avatar: "🙋‍♀️",
    email: "afrin@ourstory.com",
    birthdate: "2001-09-24",
    location: "Dhaka, Bangladesh",
    status: "Craving chocolate chip cookies... 🍪",
    loveLanguage: "Words of Affirmation & Gifts 💌",
    favoriteMemory: "The rainy afternoon cafe when we shared that single collapsed chocolate soufflé.",
    colorTheme: "from-rose-500 to-pink-600",
    textTheme: "text-pink-600",
    bgTheme: "bg-pink-50/40"
  }
};

export default function PartnerProfile() {
  const [partnerData, setPartnerData] = useState(INITIAL_PARTNERS_DATA);
  const [activeTab, setActiveTab] = useState("rayhan"); // To switch view on mobile if needed
  const [anniversaryDate] = useState("2024-06-15T00:00:00");
  const [daysTogether, setDaysTogether] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable fields for Rayhan
  const [statusInput, setStatusInput] = useState(INITIAL_PARTNERS_DATA.rayhan.status);
  const [locationInput, setLocationInput] = useState(INITIAL_PARTNERS_DATA.rayhan.location);
  const [memoryInput, setMemoryInput] = useState(INITIAL_PARTNERS_DATA.rayhan.favoriteMemory);

  useEffect(() => {
    const calculateDays = () => {
      const anniversary = new Date(anniversaryDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - anniversary.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysTogether(diffDays);
    };
    calculateDays();
  }, [anniversaryDate]);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setPartnerData(prev => ({
      ...prev,
      rayhan: {
        ...prev.rayhan,
        status: statusInput,
        location: locationInput,
        favoriteMemory: memoryInput
      }
    }));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-rose-50/30 text-slate-800 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {}
        <div className="bg-white border border-rose-100 rounded-[2.5rem] p-6 sm:p-10 shadow-xl relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold tracking-wider uppercase">
                🔒 Secure Portal Profile
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
                Our Private <span className="text-rose-500 italic font-normal">Universe</span>
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Verified Connection: Rayhan <span className="text-rose-400">❤</span> Afrin
              </p>
            </div>

            {/* Anniversary Stats Badge */}
            <div className="bg-rose-50/80 border border-rose-100/60 rounded-3xl p-5 text-center min-w-[200px] shadow-sm">
              <span className="text-xs font-bold text-rose-700 tracking-widest uppercase block mb-1">
                Days Committed
              </span>
              <span className="text-4xl font-black text-slate-800 tracking-tight block">
                {daysTogether} Days
              </span>
              <span className="text-[10px] font-semibold text-slate-400 block mt-1 uppercase">
                Since June 15, 2024
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COMPONENT: Rayhan's Detailed Info Card (7 Columns) */}
          <div className="lg:col-span-7 bg-white border border-rose-100/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl relative text-left">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h2 className="font-serif text-2xl font-bold text-slate-950 flex items-center gap-2">
                <span>🙋‍♂️</span> My Profile
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
              >
                {isEditing ? "Cancel" : "✏️ Edit Profile"}
              </button>
            </div>

            {isEditing ? (
              /* Edit Profile Form */
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Your Status / Mood Message
                  </label>
                  <input
                    type="text"
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-blue-400 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Current Location
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-blue-400 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Favorite Shared Memory
                  </label>
                  <textarea
                    value={memoryInput}
                    onChange={(e) => setMemoryInput(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:ring-1 focus:ring-blue-400 focus:bg-white focus:outline-none leading-relaxed"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Save Profile Info
                </button>
              </form>
            ) : (
              /* Profile Read View */
              <div className="space-y-6">
                
                {/* Hero Avatar Row */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-3xl bg-blue-50/20 border border-blue-100/30">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-600 flex items-center justify-center text-4xl shadow-inner text-white">
                    {partnerData.rayhan.avatar}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-serif font-extrabold text-slate-900">{partnerData.rayhan.name}</h3>
                    <p className="text-xs text-slate-500 font-semibold">{partnerData.rayhan.role}</p>
                    <span className="inline-block mt-2 text-[10px] font-extrabold text-blue-500 bg-blue-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      📍 {partnerData.rayhan.location}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50/40 border border-slate-100 p-4.5 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                      Email address
                    </span>
                    <span className="text-xs font-bold text-slate-700">{partnerData.rayhan.email}</span>
                  </div>

                  <div className="bg-slate-50/40 border border-slate-100 p-4.5 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                      Birthday
                    </span>
                    <span className="text-xs font-bold text-slate-700">April 12 (Aries ♈)</span>
                  </div>

                  <div className="col-span-1 sm:col-span-2 bg-slate-50/40 border border-slate-100 p-4.5 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                      Current Status / Note
                    </span>
                    <p className="text-xs font-medium text-slate-700 italic">
                      "{partnerData.rayhan.status}"
                    </p>
                  </div>

                  <div className="col-span-1 sm:col-span-2 bg-slate-50/40 border border-slate-100 p-4.5 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-1">
                      Love Language
                    </span>
                    <p className="text-xs font-bold text-slate-700">
                      {partnerData.rayhan.loveLanguage}
                    </p>
                  </div>

                  <div className="col-span-1 sm:col-span-2 bg-blue-50/10 border border-blue-100/30 p-4.5 rounded-2xl">
                    <span className="block text-[10px] font-extrabold text-blue-600 uppercase tracking-widest mb-1">
                      Favorite Shared Memory
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium italic leading-relaxed">
                      "{partnerData.rayhan.favoriteMemory}"
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RIGHT COMPONENT: Afrin's Commited Partner Card (5 Columns) */}
          <div className="lg:col-span-5 bg-white border border-rose-100/80 rounded-[2.5rem] p-6 sm:p-8 shadow-xl relative text-left">
            <div className="pb-4 border-b border-slate-100 mb-6">
              <h2 className="font-serif text-2xl font-bold text-slate-950 flex items-center gap-2">
                <span>🙋‍♀️</span> Committed Partner
              </h2>
            </div>

            <div className="space-y-6">
              
              {/* Partner Avatar Profile Header */}
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-pink-50/20 border border-pink-100/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-400 to-pink-600 flex items-center justify-center text-3xl shadow-inner text-white">
                  {partnerData.afrin.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-extrabold text-slate-900">{partnerData.afrin.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{partnerData.afrin.role}</p>
                  <span className="inline-block mt-1 text-[9px] font-extrabold text-pink-500 bg-pink-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    📍 {partnerData.afrin.location}
                  </span>
                </div>
              </div>

              {/* Partner Credentials Details */}
              <div className="space-y-4">
                
                <div className="bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Email address
                  </span>
                  <a 
                    href={`mailto:${partnerData.afrin.email}`}
                    className="text-xs font-bold text-slate-700 hover:text-pink-500 hover:underline flex items-center gap-1.5"
                  >
                    <span>{partnerData.afrin.email}</span> 
                    <span className="text-slate-300">✉️</span>
                  </a>
                </div>

                <div className="bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Birthday
                  </span>
                  <span className="text-xs font-bold text-slate-700">September 24 (Libra ♎)</span>
                </div>

                <div className="bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
                  <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Current Status / Mood
                  </span>
                  <p className="text-xs font-medium text-slate-700 italic">
                    "{partnerData.afrin.status}"
                  </p>
                </div>

                <div className="bg-slate-50/40 border border-slate-100 p-4 rounded-2xl">
                  <span className="block text-[10px] font-extrabold text-pink-500 uppercase tracking-widest mb-1">
                    Love Language
                  </span>
                  <p className="text-xs font-bold text-slate-700">
                    {partnerData.afrin.loveLanguage}
                  </p>
                </div>

                <div className="bg-pink-50/10 border border-pink-100/30 p-4 rounded-2xl">
                  <span className="block text-[10px] font-extrabold text-pink-600 uppercase tracking-widest mb-1">
                    Her Favorite Shared Memory
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600 font-medium italic">
                    "{partnerData.afrin.favoriteMemory}"
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

        {}
        <div className="text-center pt-4 text-[11px] font-mono tracking-wider text-slate-400">
          <span>💖 Two Profiles • One Synchronized Database Space • Designed with Love 💖</span>
        </div>

      </div>
    </div>
  );
}