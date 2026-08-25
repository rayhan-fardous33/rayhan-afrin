"use client"
import React, { useState } from 'react';

const DEFAULT_DECISIONS = [
  "Spicy Sushi Night 🍣",
  "Homemade Pizza Party 🍕",
  "Cozy Blanket Fort & Movie 🎪",
  "Spontaneous Road Trip 🚗",
  "Cook a Brand New Recipe 🍳",
  "Board Game Duel 🎲",
  "Stargazing in the Backyard 🌌",
  "Local Cafe Coffee Date ☕"
];

const MYSTERY_DATES = [
  {
    id: 1,
    title: "Cozy Adventure 🕯️",
    challenge: "Recreate your very first date dinner, but cook it entirely at home while wearing formal clothes!",
    scratched: false
  },
  {
    id: 2,
    title: "Midnight Run 🌙",
    challenge: "Drop everything at 10 PM tonight and go on a drive to find the nearest open ice cream shop.",
    scratched: false
  },
  {
    id: 3,
    title: "Sweet Nostalgia 📻",
    challenge: "Spend 30 minutes searching old videos/photos, then build a 5-song playlist of tracks that define your year.",
    scratched: false
  }
];

export default function DateDecider() {
  const [choices, setChoices] = useState(DEFAULT_DECISIONS);
  const [newChoice, setNewChoice] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelDegree, setWheelDegree] = useState(0);
  const [selectedResult, setSelectedResult] = useState(null);
  const [scratchCards, setScratchCards] = useState(MYSTERY_DATES);
  
  // Mood States
  const [hisMood, setHisMood] = useState({ status: "Cozy 🏡", note: "Busy coding, but missing you!" });
  const [herMood, setHerMood] = useState({ status: "Needs Snacks 🍫", note: "Craving chocolate chip cookies..." });
  const [showMoodForm, setShowMoodForm] = useState(null); // 'his' or 'hers'
  const [tempStatus, setTempStatus] = useState("");
  const [tempNote, setTempNote] = useState("");

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedResult(null);

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * choices.length);
    const degreesPerSegment = 360 / choices.length;
    
    // Calculate rotation to land selected index at the top (12 o'clock)
    // We rotate multiple times for dramatic effect, then align the segment
    const spins = 5; // number of full spins
    const targetAngle = 360 - (randomIndex * degreesPerSegment) - (degreesPerSegment / 2);
    const totalRotation = (spins * 360) + targetAngle;
    
    setWheelDegree(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setSelectedResult(choices[randomIndex]);
    }, 4000); // matches transition time
  };

  const handleAddChoice = (e) => {
    e.preventDefault();
    if (!newChoice.trim()) return;
    setChoices(prev => [...prev, newChoice]);
    setNewChoice("");
  };

  const handleResetWheel = () => {
    setChoices(DEFAULT_DECISIONS);
    setSelectedResult(null);
    setWheelDegree(0);
  };

  const handleScratchCard = (id) => {
    setScratchCards(prev => 
      prev.map(card => card.id === id ? { ...card, scratched: true } : card)
    );
  };

  const handleResetScratchCards = () => {
    setScratchCards(prev => 
      prev.map(card => {
        // reshuffle a new challenge
        const allChallenges = [
          "Bake a chocolate dessert with whatever ingredients are in your pantry right now!",
          "No phones allowed for the next 3 hours. Play a board game or talk over hot mugs of cocoa.",
          "Write a 3-sentence love letter, fold it into a paper airplane, and throw it to each other.",
          "Go stargazing on the balcony or backyard with a cozy warm blanket.",
          "Take a selfie together pulling the silliest faces you can think of!",
          "Midnight drive to grab milkshakes!"
        ];
        const randomChallenge = allChallenges[Math.floor(Math.random() * allChallenges.length)];
        return {
          ...card,
          scratched: false,
          challenge: randomChallenge
        };
      })
    );
  };

  const handleMoodSubmit = (e, type) => {
    e.preventDefault();
    if (!tempStatus.trim()) return;

    if (type === 'his') {
      setHisMood({ status: tempStatus, note: tempNote });
    } else {
      setHerMood({ status: tempStatus, note: tempNote });
    }
    
    setShowMoodForm(null);
    setTempStatus("");
    setTempNote("");
  };

  const startMoodEdit = (type, current) => {
    setShowMoodForm(type);
    setTempStatus(current.status);
    setTempNote(current.note);
  };

  return (
    <section id="decider" className="relative py-24 bg-rose-50/10 px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Playful Chemistry Board
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Date Night Deciders & Check-ins
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Can't agree on dinner? Need a mystery date idea? Or want to check in on each other's moods? We've got you covered!
          </p>
        </div>

        {/* Grid split: Left Side - Mood Check-ins & Scratch Cards | Right Side - Decision Wheel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Moods & Scratch Cards */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Live Check-ins widget */}
            <div className="bg-white border border-rose-100/60 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <h3 className="font-serif text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span>🧸</span> Live Emotional Check-in
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Alex's mood */}
                <div className="bg-blue-50/30 border border-blue-100 p-5 rounded-2xl relative group">
                  <span className="block text-[10px] font-extrabold text-blue-500 uppercase tracking-widest mb-1">
                    Alex is currently:
                  </span>
                  <p className="text-lg font-bold text-slate-800">{hisMood.status}</p>
                  <p className="text-xs text-slate-500 mt-2 italic font-medium">"{hisMood.note}"</p>
                  
                  <button 
                    onClick={() => startMoodEdit('his', hisMood)}
                    className="absolute bottom-4 right-4 text-xs font-bold text-blue-500 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✏️ Update
                  </button>
                </div>

                {/* Maya's mood */}
                <div className="bg-pink-50/30 border border-pink-100 p-5 rounded-2xl relative group">
                  <span className="block text-[10px] font-extrabold text-pink-500 uppercase tracking-widest mb-1">
                    Maya is currently:
                  </span>
                  <p className="text-lg font-bold text-slate-800">{herMood.status}</p>
                  <p className="text-xs text-slate-500 mt-2 italic font-medium">"{herMood.note}"</p>
                  
                  <button 
                    onClick={() => startMoodEdit('hers', herMood)}
                    className="absolute bottom-4 right-4 text-xs font-bold text-pink-500 hover:text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✏️ Update
                  </button>
                </div>
              </div>

              {/* Edit mood inline form popup */}
              {showMoodForm && (
                <div className="mt-6 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl animate-fade-in">
                  <form onSubmit={(e) => handleMoodSubmit(e, showMoodForm)} className="space-y-3">
                    <p className="text-xs font-bold text-slate-700">
                      Update status for {showMoodForm === 'his' ? "Alex" : "Maya"}:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input 
                        type="text"
                        placeholder="Status (e.g., Hungry 🍕, Cozy 🏡)"
                        value={tempStatus}
                        onChange={(e) => setTempStatus(e.target.value)}
                        required
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                      />
                      <input 
                        type="text"
                        placeholder="Add a tiny note..."
                        value={tempNote}
                        onChange={(e) => setTempNote(e.target.value)}
                        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        type="button" 
                        onClick={() => setShowMoodForm(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-[10px] font-bold uppercase transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold uppercase transition-all"
                      >
                        Save Status
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Mystery Date night Scratch cards */}
            <div className="bg-white border border-rose-100/60 rounded-3xl p-6 sm:p-8 shadow-sm text-left">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🎟️</span> Mystery Date Scratchers
                </h3>
                <button 
                  onClick={handleResetScratchCards}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  🔄 Reshuffle Challenges
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {scratchCards.map(card => (
                  <div 
                    key={card.id}
                    onClick={() => handleScratchCard(card.id)}
                    className="relative aspect-3/4 rounded-2xl border overflow-hidden cursor-pointer transition-all hover:scale-102 hover:shadow-md flex flex-col justify-between"
                  >
                    {!card.scratched ? (
                      /* Silver scratching layer */
                      <div className="absolute inset-0 bg-linear-to-br from-slate-300 via-slate-400 to-slate-300 border-4 border-white rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all duration-300 hover:brightness-105 shadow-inner">
                        <span className="text-3xl block filter drop-shadow animate-pulse">✨</span>
                        <p className="text-[10px] font-extrabold text-white uppercase tracking-wider mt-3">
                          Tap to scratch!
                        </p>
                        <p className="text-[9px] font-bold text-slate-200 mt-1 uppercase">
                          {card.title}
                        </p>
                      </div>
                    ) : null}

                    {/* Revealed Challenge content */}
                    <div className="h-full bg-rose-50/40 p-4 border-2 border-rose-100 rounded-2xl flex flex-col justify-between text-center select-none animate-fade-in">
                      <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest block">
                        Our Challenge:
                      </span>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed py-2">
                        {card.challenge}
                      </p>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full py-0.5 px-2 self-center block">
                        ✓ Revealed!
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Decision Wheel */}
          <div className="lg:col-span-6 bg-white border border-rose-100/60 rounded-3xl p-6 sm:p-8 shadow-sm text-center">
            <h3 className="font-serif text-xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
              <span>🎡</span> The "Make a Choice" Wheel
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Spin the wheel of fortune to solve any disagreement! Edit your choices below.
            </p>

            {/* Wheel Canvas Mock / SVG Spinner Element */}
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto my-8">
              {/* Pointer arrow marker */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-slate-900 rotate-45 z-30 shadow-md rounded-br" />
              
              {/* Spinning circular container */}
              <div 
                className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl overflow-hidden relative transition-transform ease-out duration-4000 bg-slate-50"
                style={{ 
                  transform: `rotate(${wheelDegree}deg)`,
                }}
              >
                {/* Visual Segment Lines using SVGs */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  {choices.map((_, index) => {
                    const totalSlices = choices.length;
                    const angle = 360 / totalSlices;
                    const rotate = index * angle;
                    return (
                      <line 
                        key={index}
                        x1="50" y1="50" x2="50" y2="0"
                        className="stroke-slate-900 stroke-2"
                        transform={`rotate(${rotate} 50 50)`}
                      />
                    );
                  })}
                </svg>

                {/* Text Placement inside wheel segments */}
                {choices.map((choice, index) => {
                  const totalSlices = choices.length;
                  const angle = 360 / totalSlices;
                  const rotate = (index * angle) + (angle / 2);
                  return (
                    <div
                      key={index}
                      className="absolute top-0 bottom-0 left-0 right-0 origin-center flex items-start justify-center pt-8 text-center"
                      style={{
                        transform: `rotate(${rotate}deg)`,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      <span className="text-[10px] sm:text-xs font-bold text-slate-700 tracking-tight max-w-16.25 leading-tight select-none">
                        {choice.split(" ").slice(0, 2).join(" ")}
                      </span>
                    </div>
                  );
                })}

                {/* Elegant Center Peg Pin */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 border-4 border-white rounded-full shadow-md z-20 flex items-center justify-center">
                  <span className="text-white text-xs">❤️</span>
                </div>
              </div>
            </div>

            {/* Spinner buttons */}
            <div className="space-y-4">
              <button
                onClick={handleSpin}
                disabled={isSpinning || choices.length === 0}
                className="px-8 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-300 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-100 hover:scale-103"
              >
                {isSpinning ? "Spinnnnnnning..." : "🎡 Spin the Wheel"}
              </button>

              {/* Reveal Result block */}
              {selectedResult && !isSpinning && (
                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl max-w-sm mx-auto animate-bounce mt-4">
                  <p className="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-1">
                    🎉 Fate Has Decided:
                  </p>
                  <p className="text-base font-bold text-slate-800">
                    {selectedResult}
                  </p>
                </div>
              )}
            </div>

            {/* Custom choice adder block */}
            <div className="pt-8 mt-8 border-t border-slate-100 text-left">
              <div className="flex justify-between items-center mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Custom Decision List ({choices.length}):
                </p>
                <button 
                  onClick={handleResetWheel}
                  className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase"
                >
                  Reset Defaults
                </button>
              </div>

              {/* Quick Input Form */}
              <form onSubmit={handleAddChoice} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newChoice}
                  onChange={(e) => setNewChoice(e.target.value)}
                  placeholder="E.g., Thai Takeout 🍜, Ice cream run 🍦..." 
                  className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-4 rounded-xl transition-all shadow-sm"
                >
                  Add Option
                </button>
              </form>

              {/* Active list tag caps */}
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {choices.map((choice, i) => (
                  <span 
                    key={i}
                    className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg border border-slate-100 flex items-center gap-1"
                  >
                    {choice}
                    <button 
                      type="button" 
                      onClick={() => setChoices(prev => prev.filter((_, idx) => idx !== i))}
                      className="text-[9px] font-bold text-slate-400 hover:text-rose-500 pl-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}