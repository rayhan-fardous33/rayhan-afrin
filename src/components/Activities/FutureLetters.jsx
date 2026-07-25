"use client"
import React, { useState, useEffect } from 'react';

const DEFAULT_CAPSULES = [
  {
    id: 1,
    sender: "Alex",
    receiver: "Maya",
    title: "To open on our next Anniversary! 🥂",
    message: "If you are reading this, it means we made it to another beautiful year together! Thank you for being my teammate, my laughter, and my safest home. I love you more with every single rotation of the earth. Here is to all our next steps! ❤️",
    unlockDate: "2027-06-15T00:00:00", // Future lock date
    isOpen: false,
    envelopeColor: "from-rose-400 to-pink-500"
  },
  {
    id: 2,
    sender: "Maya",
    receiver: "Alex",
    title: "Read this when you're having a stressful day ☕",
    message: "Hey love! Just a reminder that you are incredibly smart, capable, and hardworking. Do not let the small bugs or stressful presentation details dim your light. Take a deep breath, stretch your shoulders, and remember that I am waiting at home with warm tea and the biggest hug. You've got this! 💪✨",
    unlockDate: "2026-07-02T12:00:00", // Set closer for testing/interactive purposes
    isOpen: false,
    envelopeColor: "from-amber-400 to-orange-500"
  }
];

const DEFAULT_SAVINGS_GOALS = [
  {
    id: 1,
    title: "Chasing Aurora Borealis in Iceland 🌌",
    target: 3000,
    current: 1250,
    icon: "✈️",
    color: "bg-indigo-500"
  },
  {
    id: 2,
    title: "Cozy Living Room Projector Setup 🎬",
    target: 400,
    current: 400, // Completed goal
    icon: "🍿",
    color: "bg-emerald-500"
  }
];

export default function FutureCapsule() {
  const [capsules, setCapsules] = useState(DEFAULT_CAPSULES);
  const [savingsGoals, setSavingsGoals] = useState(DEFAULT_SAVINGS_GOALS);
  const [activeTab, setActiveTab] = useState("capsule"); // "capsule" or "savings"

  // Time Capsule Form State
  const [capsuleTitle, setCapsuleTitle] = useState("");
  const [capsuleSender, setCapsuleSender] = useState("Alex");
  const [capsuleMsg, setCapsuleMsg] = useState("");
  const [capsuleDate, setCapsuleDate] = useState("");
  const [showAddCapsule, setShowAddCapsule] = useState(false);

  // Savings Goal Form State
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTarget, setGoalTarget] = useState("");
  const [goalIcon, setGoalIcon] = useState("✈️");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [tempContribution, setTempContribution] = useState({});

  // Countdown Helper state that triggers a rerender every second
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getCountdown = (targetDateString) => {
    const target = new Date(targetDateString).getTime();
    const difference = target - currentTime;

    if (difference <= 0) {
      return null; // Ready to unlock
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  };

  const handleOpenCapsule = (id, isLocked) => {
    if (isLocked) return;
    setCapsules(prev =>
      prev.map(cap => cap.id === id ? { ...cap, isOpen: !cap.isOpen } : cap)
    );
  };

  const handleAddCapsule = (e) => {
    e.preventDefault();
    if (!capsuleTitle || !capsuleMsg || !capsuleDate) return;

    const colors = [
      "from-rose-400 to-pink-500",
      "from-amber-400 to-orange-500",
      "from-sky-400 to-blue-500",
      "from-teal-400 to-emerald-500"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCapsule = {
      id: Date.now(),
      sender: capsuleSender,
      receiver: capsuleSender === "Alex" ? "Maya" : "Alex",
      title: capsuleTitle,
      message: capsuleMsg,
      unlockDate: new Date(capsuleDate).toISOString(),
      isOpen: false,
      envelopeColor: randomColor
    };

    setCapsules(prev => [...prev, newCapsule]);
    setCapsuleTitle("");
    setCapsuleMsg("");
    setCapsuleDate("");
    setShowAddCapsule(false);
  };

  const handleAddSavings = (e) => {
    e.preventDefault();
    if (!goalTitle || !goalTarget) return;

    const colors = ["bg-indigo-500", "bg-emerald-500", "bg-rose-500", "bg-amber-500"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newGoal = {
      id: Date.now(),
      title: goalTitle,
      target: parseFloat(goalTarget),
      current: 0,
      icon: goalIcon,
      color: randomColor
    };

    setSavingsGoals(prev => [...prev, newGoal]);
    setGoalTitle("");
    setGoalTarget("");
    setShowAddGoal(false);
  };

  const handleAddContribution = (id) => {
    const value = parseFloat(tempContribution[id] || "");
    if (isNaN(value) || value <= 0) return;

    setSavingsGoals(prev =>
      prev.map(goal => {
        if (goal.id === id) {
          const updatedCurrent = Math.min(goal.target, goal.current + value);
          return { ...goal, current: updatedCurrent };
        }
        return goal;
      })
    );

    setTempContribution(prev => ({ ...prev, [id]: "" }));
  };

  return (
    <section id="future" className="relative py-24 bg-white px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Visual Ambience */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-rose-50/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        
        {/* Section Header */}
        <div className="space-y-4 mb-12">
          <span className="text-indigo-500 font-serif italic text-lg font-semibold block">
            Planning Our Tomorrows
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Future Letters & Shared Goals
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Lock letters to be opened on magical milestone dates, or team up with a cute visual tracker to fund your next big trips together!
          </p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="flex justify-center items-center gap-2 mb-12">
          <button
            onClick={() => setActiveTab("capsule")}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 border ${
              activeTab === "capsule"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
            }`}
          >
            <span>🔒</span> Time Capsules
          </button>
          <button
            onClick={() => setActiveTab("savings")}
            className={`px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-2 border ${
              activeTab === "savings"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100"
                : "bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100"
            }`}
          >
            <span>🐷</span> Adventure Funds
          </button>
        </div>

        {/* Tab 1: TIME CAPSULES */}
        {activeTab === "capsule" && (
          <div className="space-y-12 max-w-5xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center max-w-3xl mx-auto px-4">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Sealed Letters ({capsules.length})
              </p>
              <button
                onClick={() => setShowAddCapsule(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                ✍️ Write Time Capsule
              </button>
            </div>

            {/* Capsul Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {capsules.map((cap) => {
                const countdown = getCountdown(cap.unlockDate);
                const isLocked = countdown !== null;

                return (
                  <div
                    key={cap.id}
                    className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 relative flex flex-col justify-between min-h-85 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {/* SENDER/RECEIVER BAR */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-200/55 text-left">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          From
                        </span>
                        <span className="text-xs font-extrabold text-slate-800">{cap.sender}</span>
                      </div>
                      <div className="text-slate-300">➔</div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          To
                        </span>
                        <span className="text-xs font-extrabold text-slate-800">{cap.receiver}</span>
                      </div>
                    </div>

                    {/* ENVELOPE DESIGN */}
                    {!cap.isOpen ? (
                      /* Sealed Graphic */
                      <div className="flex-1 flex flex-col justify-center items-center py-6 space-y-4">
                        <div
                          onClick={() => handleOpenCapsule(cap.id, isLocked)}
                          className={`w-36 h-24 bg-linear-to-br ${cap.envelopeColor} rounded-xl shadow-lg relative cursor-pointer transform hover:scale-105 transition-all duration-300 flex items-center justify-center border-2 border-white`}
                        >
                          {/* Envelope Flap Shape */}
                          <div className="absolute top-0 left-0 right-0 h-10 border-b border-white/20 clip-envelope bg-white/10" />
                          
                          {/* Heart Stamp */}
                          <div className="w-10 h-10 bg-white rounded-full shadow-inner flex items-center justify-center text-rose-500 text-lg z-10 border border-slate-100">
                            {isLocked ? "🔒" : "💌"}
                          </div>
                        </div>

                        <div className="text-center space-y-1">
                          <h4 className="font-serif font-bold text-slate-800 text-sm sm:text-base">
                            {cap.title}
                          </h4>
                          {isLocked ? (
                            /* Lock Ticker timer */
                            <div className="space-y-1.5">
                              <span className="text-[9px] font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                ⌛ Locked
                              </span>
                              <div className="flex justify-center items-center gap-1.5 text-xs font-mono font-bold text-slate-600">
                                <span>{countdown.days}d</span>
                                <span>{countdown.hours}h</span>
                                <span>{countdown.minutes}m</span>
                                <span className="text-indigo-600 animate-pulse">{countdown.seconds}s</span>
                              </div>
                            </div>
                          ) : (
                            /* Unlocked Action */
                            <div>
                              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 animate-bounce">
                                🎉 Unlocked!
                              </span>
                              <p className="text-[10px] text-slate-400 mt-1">Tap the envelope to read!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Revealed Message */
                      <div className="flex-1 flex flex-col justify-between py-2 text-left animate-fade-in">
                        <div className="space-y-2">
                          <h4 className="font-serif font-bold text-indigo-700 text-base leading-snug">
                            {cap.title}
                          </h4>
                          <p className="text-slate-600 text-xs sm:text-sm font-medium italic leading-relaxed bg-white p-4 rounded-xl border border-slate-100">
                            "{cap.message}"
                          </p>
                        </div>
                        <button
                          onClick={() => setCapsules(prev => prev.map(c => c.id === cap.id ? { ...c, isOpen: false } : c))}
                          className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 uppercase mt-4 transition-colors"
                        >
                          Close Letter 📁
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: ADVENTURE SAVINGS FUNDS */}
        {activeTab === "savings" && (
          <div className="space-y-12 max-w-5xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center max-w-3xl mx-auto px-4">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
                Our Shared Savings goals ({savingsGoals.length})
              </p>
              <button
                onClick={() => setShowAddGoal(true)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                ➕ Create Savings Goal
              </button>
            </div>

            {/* Savings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {savingsGoals.map((goal) => {
                const percent = Math.round((goal.current / goal.target) * 100);
                const isCompleted = goal.current >= goal.target;

                return (
                  <div
                    key={goal.id}
                    className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden"
                  >
                    {isCompleted && (
                      <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full z-10">
                        🎉 Funded!
                      </div>
                    )}

                    <div className="space-y-4">
                      {/* Title & Icon Header */}
                      <div className="flex items-start gap-4 text-left">
                        <span className="text-3xl p-2.5 bg-white border rounded-2xl shadow-sm">
                          {goal.icon}
                        </span>
                        <div>
                          <h4 className="font-serif font-bold text-slate-800 text-sm sm:text-base leading-tight">
                            {goal.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                            Shared Goal Amount: ${goal.target.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Cute Progress Glass Filler container */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>Filled: ${goal.current.toLocaleString()}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden border border-white/40">
                          <div
                            className={`h-full ${goal.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interactive Contribution Form */}
                    {!isCompleted ? (
                      <div className="mt-6 pt-4 border-t border-slate-200/50 flex gap-2">
                        <input
                          type="number"
                          placeholder="Add savings ($)"
                          value={tempContribution[goal.id] || ""}
                          onChange={(e) =>
                            setTempContribution(prev => ({ ...prev, [goal.id]: e.target.value }))
                          }
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400 focus:outline-none font-medium text-slate-800"
                        />
                        <button
                          onClick={() => handleAddContribution(goal.id)}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
                        >
                          Piggy Bank 🐷
                        </button>
                      </div>
                    ) : (
                      <div className="mt-6 pt-4 border-t border-slate-200/50 text-center text-xs text-emerald-600 font-bold">
                        Pack your bags, we are doing this! ✈️🥳
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* MODAL 1: CREATE TIME CAPSULE */}
      {showAddCapsule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left">
            <button
              onClick={() => setShowAddCapsule(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 p-1.5 rounded-full hover:bg-slate-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddCapsule} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">Seal a Time Capsule</h3>
                <p className="text-xs text-slate-500">Lock letters that can only be read on a specific day!</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Who is Writing?
                  </label>
                  <select
                    value={capsuleSender}
                    onChange={(e) => setCapsuleSender(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="Alex">Alex 🙋‍♂️</option>
                    <option value="Maya">Maya 🙋‍♀️</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Unlock Date
                  </label>
                  <input
                    type="date"
                    value={capsuleDate}
                    onChange={(e) => setCapsuleDate(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Envelope Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Read this on our 3rd Anniversary! 🍾"
                  value={capsuleTitle}
                  onChange={(e) => setCapsuleTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Sealed Love Message
                </label>
                <textarea
                  placeholder="Pour your heart here... Note: Neither you nor your partner can unlock this until the timer expires!"
                  value={capsuleMsg}
                  onChange={(e) => setCapsuleMsg(e.target.value)}
                  rows={4}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                🔒 Seal Envelope
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE SAVINGS GOAL */}
      {showAddGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left">
            <button
              onClick={() => setShowAddGoal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-indigo-600 p-1.5 rounded-full hover:bg-slate-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddSavings} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">Add a Shared Savings Goal</h3>
                <p className="text-xs text-slate-500">Fund your dream bucket list adventures together!</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Adventure / Goal Title
                </label>
                <input
                  type="text"
                  placeholder="E.g., Roadtrip to see the Mountains 🚗"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Target Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="E.g., 500"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Goal Emoji
                  </label>
                  <select
                    value={goalIcon}
                    onChange={(e) => setGoalIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="✈️">✈️ Travel</option>
                    <option value="🏡">🏡 Cozy Home</option>
                    <option value="🚗">🚗 Roadtrip</option>
                    <option value="🍕">🍕 Foodie Tour</option>
                    <option value="🎸">🎸 Concert</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                🐷 Start Adventure Fund
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}