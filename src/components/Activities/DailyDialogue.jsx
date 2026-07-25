"use client"
import React, { useState, useEffect } from 'react';

// Pool of cute relationship prompts
const QUESTION_POOL = [
  "If we were characters in a movie or TV show, which couple would we be? 🎬",
  "If we won a million-dollar lottery tomorrow, what is the very first thing we would buy together? 🗺️",
  "What is a tiny, weird habit of mine that you secretly find absolutely adorable? 🥺",
  "If you could travel back in time to any moment in our relationship, which day would you relive? ⏳",
  "What is a song that instantly makes you think of me whenever you hear it on the radio? 🎵",
  "If we could build our absolute dream house, where would it be and what is one crazy room we'd add? 🏡",
  "What was the exact moment or date when you realized you were completely falling for me? 💖",
  "If we were animals, which species would we be and why do they match our chemistry? 🦁🦊",
  "What is one brand new hobby or activity you've been dying to try together this year? 🌱"
];

const INITIAL_HISTORY = [
  {
    id: 1,
    question: "What is your absolute favorite comfort food to eat when we are cuddling? 🍕",
    alexAnswer: "Definitely a hot box of extra-cheesy garlic bread dipping strips!",
    mayaAnswer: "Spicy tuna sushi rolls and chocolate lava cake. Hands down!",
    revealed: true
  },
  {
    id: 2,
    question: "What is a funny memory of us that still makes you laugh out loud? 😂",
    alexAnswer: "The time we tried pitching that tent in the pitch black backyard and it fell on us.",
    mayaAnswer: "Yes! And you lost your flashlight inside the sleeping bag for an hour!",
    revealed: true
  }
];

export default function DailyDialogue() {
  const [history, setHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dialogue_history');
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    }
    return INITIAL_HISTORY;
  });

  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [alexInput, setAlexInput] = useState("");
  const [mayaInput, setMayaInput] = useState("");
  const [hasAlexAnswered, setHasAlexAnswered] = useState(false);
  const [hasMayaAnswered, setHasMayaAnswered] = useState(false);
  const [showNewPromptForm, setShowNewPromptForm] = useState(false);
  const [customPromptText, setCustomPromptText] = useState("");

  useEffect(() => {
    localStorage.setItem('dialogue_history', JSON.stringify(history));
  }, [history]);

  const activeQuestion = QUESTION_POOL[currentPromptIndex];
  const bothAnswered = hasAlexAnswered && hasMayaAnswered;

  const handleAlexSubmit = (e) => {
    e.preventDefault();
    if (!alexInput.trim()) return;
    setHasAlexAnswered(true);
  };

  const handleMayaSubmit = (e) => {
    e.preventDefault();
    if (!mayaInput.trim()) return;
    setHasMayaAnswered(true);
  };

  const handleRevealAnswers = () => {
    const newHistoryEntry = {
      id: Date.now(),
      question: activeQuestion,
      alexAnswer: alexInput,
      mayaAnswer: mayaInput,
      revealed: true
    };

    setHistory([newHistoryEntry, ...history]);
    
    // Cycle to next question in the pool
    setCurrentPromptIndex((prev) => (prev + 1) % QUESTION_POOL.length);
    
    // Reset input states
    setAlexInput("");
    setMayaInput("");
    setHasAlexAnswered(false);
    setHasMayaAnswered(false);
  };

  const handleAddCustomPrompt = (e) => {
    e.preventDefault();
    if (!customPromptText.trim()) return;
    
    QUESTION_POOL.unshift(customPromptText);
    setCurrentPromptIndex(0); // Set active to newly created custom prompt
    setCustomPromptText("");
    setShowNewPromptForm(false);
    
    // Reset answers for the new active question
    setAlexInput("");
    setMayaInput("");
    setHasAlexAnswered(false);
    setHasMayaAnswered(false);
  };

  return (
    <section id="dialogue" className="relative py-24 bg-purple-50/10 px-4 sm:px-6 lg:px-8 border-t border-purple-100/30 overflow-hidden text-left">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-pink-100/40 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-purple-600 font-serif italic text-lg font-semibold block">
            Our Private Dialogue
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Daily Secret Prompts
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Answer the daily question in secret! Your partner's response remains blurred and locked 🔒 until you submit your own answer.
          </p>

          <button
            onClick={() => setShowNewPromptForm(true)}
            className="mt-6 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group"
          >
            <span>💬</span> Write a Custom Prompt
          </button>
        </div>

        {/* Main Interface Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
          
          {/* LEFT SIDE: ACTIVE DAILY PROMPT CARDS */}
          <div className="lg:col-span-7 bg-white border border-purple-100/60 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-120">
            
            {/* Top Prompt Display Header */}
            <div className="space-y-4">
              <span className="text-[10px] font-extrabold text-purple-600 tracking-widest uppercase block">
                🔥 Today's Spark Question
              </span>
              <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-950 leading-snug">
                "{activeQuestion}"
              </h3>
            </div>

            {/* SECRETS / BLURRED ANSWER FIELDS CONTAINER */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Alex's Hidden Response Card */}
              <div className="bg-purple-50/20 border border-purple-100/40 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden min-h-40">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    🙋‍♂️ Alex's Answer
                  </span>
                  
                  {hasAlexAnswered ? (
                    bothAnswered ? (
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                        "{alexInput}"
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-100 w-max">
                        <span>✓ Submitted</span>
                      </div>
                    )
                  ) : (
                    <p className="text-xs text-slate-400 italic">Waiting for response...</p>
                  )}
                </div>

                {/* Lock Overlay on partner field if both have not answered */}
                {hasAlexAnswered && !bothAnswered && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
                    <span className="text-xl mb-1">🔒</span>
                    <p className="text-[11px] font-bold text-slate-700">Blurred Answer</p>
                    <p className="text-[9px] text-slate-400 max-w-32.5 mt-0.5">Maya must submit her response to unlock this answer!</p>
                  </div>
                )}
              </div>

              {/* Maya's Hidden Response Card */}
              <div className="bg-pink-50/20 border border-pink-100/40 rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden min-h-40">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    🙋‍♀️ Maya's Answer
                  </span>
                  
                  {hasMayaAnswered ? (
                    bothAnswered ? (
                      <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
                        "{mayaInput}"
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold bg-emerald-50 py-1.5 px-3 rounded-xl border border-emerald-100 w-max">
                        <span>✓ Submitted</span>
                      </div>
                    )
                  ) : (
                    <p className="text-xs text-slate-400 italic">Waiting for response...</p>
                  )}
                </div>

                {/* Lock Overlay on partner field if both have not answered */}
                {hasMayaAnswered && !bothAnswered && (
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center text-center p-4">
                    <span className="text-xl mb-1">🔒</span>
                    <p className="text-[11px] font-bold text-slate-700">Blurred Answer</p>
                    <p className="text-[9px] text-slate-400 max-w-32.5 mt-0.5">Alex must submit his response to unlock this answer!</p>
                  </div>
                )}
              </div>

            </div>

            {/* ACTION TRIGGERS BAR */}
            <div>
              {bothAnswered ? (
                <button
                  onClick={handleRevealAnswers}
                  className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-purple-100 transition-all text-center block"
                >
                  🎉 Unravel & Save Dialogues!
                </button>
              ) : (
                <p className="text-[10px] font-semibold text-slate-400 text-center italic">
                  💡 Hint: Both partners must answer below to trigger the final reveal!
                </p>
              )}
            </div>

          </div>

          {/* RIGHT SIDE: WRITER SUBMISSION FORMS */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Alex Answer Logger Card */}
            <div className="bg-white border border-purple-100/50 rounded-3xl p-5 shadow-sm">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                ✍️ Write as Alex (🙋‍♂️):
              </h4>
              <form onSubmit={handleAlexSubmit} className="space-y-3">
                <input
                  type="text"
                  value={alexInput}
                  onChange={(e) => setAlexInput(e.target.value)}
                  disabled={hasAlexAnswered}
                  placeholder={hasAlexAnswered ? "Answer submitted!" : "What is your secret response, Alex?..."}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none text-slate-800 font-medium disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={hasAlexAnswered}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm"
                >
                  {hasAlexAnswered ? "✓ Alex is Ready" : "Submit Alex's Answer"}
                </button>
              </form>
            </div>

            {/* Maya Answer Logger Card */}
            <div className="bg-white border border-purple-100/50 rounded-3xl p-5 shadow-sm">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                ✍️ Write as Maya (🙋‍♀️):
              </h4>
              <form onSubmit={handleMayaSubmit} className="space-y-3">
                <input
                  type="text"
                  value={mayaInput}
                  onChange={(e) => setMayaInput(e.target.value)}
                  disabled={hasMayaAnswered}
                  placeholder={hasMayaAnswered ? "Answer submitted!" : "What is your secret response, Maya?..."}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none text-slate-800 font-medium disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={hasMayaAnswered}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-sm"
                >
                  {hasMayaAnswered ? "✓ Maya is Ready" : "Submit Maya's Answer"}
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* DIALOGUE HISTORY FEED LEDGER */}
        <div className="max-w-5xl mx-auto mt-14 bg-white/50 border border-purple-100/40 rounded-[2.5rem] p-6 sm:p-10 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-purple-100/20">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">
              📖 Past Secret Dialogues Archive ({history.length})
            </h4>
          </div>

          <div className="space-y-6 max-h-95 overflow-y-auto pr-2">
            {history.map((entry) => (
              <div key={entry.id} className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <h5 className="font-serif font-bold text-slate-800 text-sm sm:text-base leading-tight">
                    Q: "{entry.question}"
                  </h5>
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase bg-slate-50 border rounded px-2 py-0.5 shrink-0">
                    Saved
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed border-slate-100">
                  <div className="bg-purple-50/20 border border-purple-100/10 p-3 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-purple-600 uppercase tracking-wide block mb-1">
                      🙋‍♂️ Alex's Memory
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                      "{entry.alexAnswer}"
                    </p>
                  </div>
                  <div className="bg-pink-50/20 border border-pink-100/10 p-3 rounded-xl text-left">
                    <span className="text-[9px] font-bold text-pink-600 uppercase tracking-wide block mb-1">
                      🙋‍♀️ Maya's Memory
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed italic font-medium">
                      "{entry.mayaAnswer}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* MODAL: CREATE CUSTOM DIALOGUE PROMPT */}
      {showNewPromptForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-purple-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left">
            <button
              onClick={() => setShowNewPromptForm(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-purple-500 p-1.5 rounded-full hover:bg-slate-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddCustomPrompt} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">Write a Custom Dialogue</h3>
                <p className="text-xs text-slate-500">Draft a secret prompt to challenge your partner tonight!</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  The Dialogue Prompt
                </label>
                <textarea
                  placeholder="E.g., What is one movie we watched together that you secretly hated? 🍿🤐"
                  value={customPromptText}
                  onChange={(e) => setCustomPromptText(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-purple-400 focus:outline-none leading-relaxed text-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                💬 Insert Daily Dialogue Prompt
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}