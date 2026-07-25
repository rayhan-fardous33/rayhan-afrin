"use client"
import React, { useState } from 'react';

const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "Where did we go on our very first official date? 🌹",
    options: [
      "La Piazza Italian Trattoria",
      "Starlight Rooftop Cafe",
      "The Botanical Garden",
      "Downtown Bowling Alley"
    ],
    correctIndex: 0,
    funFact: "We ended up talking for four straight hours until the staff started putting the chairs on the tables!"
  },
  {
    id: 2,
    question: "Who said 'I love you' first? 💬",
    options: [
      "Alex",
      "Maya",
      "We blurted it out at the exact same time!",
      "Neither, our cat did"
    ],
    correctIndex: 0,
    funFact: "Alex said it on the beach during our first trip, looking super nervous!"
  },
  {
    id: 3,
    question: "What is our absolute go-to comfort TV show to binge? 📺",
    options: [
      "The Office",
      "Stranger Things",
      "Ted Lasso",
      "Friends"
    ],
    correctIndex: 2,
    funFact: "We've rewatched the biscuit-baking scene at least twenty times. Biscuits with boss!"
  },
  {
    id: 4,
    question: "What was our biggest cooking disaster? 🍳",
    options: [
      "Burning the midnight pancakes",
      "The collapsed chocolate soufflé",
      "Too much salt in the lasagna",
      "Setting off the smoke alarm during pizza night"
    ],
    correctIndex: 1,
    funFact: "The soufflé looked like a flat chocolate cookie, but we ate it straight out of the ramekins anyway!"
  }
];

export default function TriviaQuiz() {
  const [questions, setQuestions] = useState(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State for creating custom questions
  const [formData, setFormData] = useState({
    question: "",
    option0: "",
    option1: "",
    option2: "",
    option3: "",
    correctIndex: 0,
    funFact: ""
  });

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsQuizCompleted(false);
  };

  const handleOptionSelect = (index) => {
    if (isAnswerSubmitted) return; // Prevent selecting after submitting
    setSelectedOptionIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIndex === null || isAnswerSubmitted) return;
    
    setIsAnswerSubmitted(true);
    if (selectedOptionIndex === currentQuestion.correctIndex) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionIndex(null);
    setIsAnswerSubmitted(false);
    
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setIsQuizCompleted(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!formData.question || !formData.option0 || !formData.option1) return;

    const newQuestion = {
      id: Date.now(),
      question: formData.question,
      options: [formData.option0, formData.option1, formData.option2 || "Option C", formData.option3 || "Option D"],
      correctIndex: parseInt(formData.correctIndex),
      funFact: formData.funFact || "A cute memory we shared!"
    };

    setQuestions(prev => [...prev, newQuestion]);
    setIsModalOpen(false);
    
    // Reset Form
    setFormData({
      question: "",
      option0: "",
      option1: "",
      option2: "",
      option3: "",
      correctIndex: 0,
      funFact: ""
    });
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return { title: "Soulmates! 😍", desc: "You know each other absolutely perfectly. True cosmic connection!" };
    if (percentage >= 75) return { title: "Lovebirds! 💕", desc: "So in sync! You pay attention to all the beautiful little details." };
    if (percentage >= 50) return { title: "Getting Cozy! ☕", desc: "Great score! But hey, a perfect excuse to go on another long talk date." };
    return { title: "Let's Talk More! 🛋️", desc: "Time to bake a flat soufflé and catch up over memory lane together." };
  };

  return (
    <section id="quiz" className="relative py-24 bg-white px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden">
      
      {/* Dynamic drifting background glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-50 rounded-full blur-3xl pointer-events-none opacity-70" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-rose-50 rounded-full blur-3xl pointer-events-none opacity-70" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        
        {}
        <div className="space-y-4 mb-14">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Just For Fun
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            How Well Do We Know Us?
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Take turns playing our interactive relationship trivia game, or suggest some wild funny questions to challenge each other!
          </p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            ➕ Write a New Question
          </button>
        </div>

        {}
        <div className="max-w-xl mx-auto bg-linear-to-tr from-slate-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-36 h-36 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          
          {!quizStarted ? (
            /* LOBBY / SCREEN START */
            <div className="py-10 space-y-6">
              <span className="text-6xl block animate-bounce">🏆</span>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold">Couple Trivia Challenge</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  Contains <strong className="text-rose-400">{questions.length} active questions</strong> curated from our timeline, favorites, and cozy memories.
                </p>
              </div>
              <button
                onClick={handleStartQuiz}
                className="px-8 py-3.5 rounded-full bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-rose-900/30 hover:scale-105"
              >
                🎮 Start Trivia Game
              </button>
            </div>
          ) : isQuizCompleted ? (
            /* RESULTS SCREEN */
            <div className="py-8 space-y-6 animate-fade-in text-center">
              <span className="text-6xl block">✨👑✨</span>
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-bold text-rose-400">
                  {getScoreMessage().title}
                </h3>
                <p className="text-5xl font-extrabold text-white tracking-tight mt-3">
                  {score} <span className="text-2xl text-slate-500">/</span> {questions.length}
                </p>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed pt-2">
                  {getScoreMessage().desc}
                </p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 font-bold text-xs uppercase tracking-wider transition-all"
                >
                  🔁 Play Again
                </button>
                <button
                  onClick={() => setQuizStarted(false)}
                  className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 font-bold text-xs uppercase tracking-wider transition-all text-slate-300"
                >
                  🚪 Exit Lobby
                </button>
              </div>
            </div>
          ) : (
            /* ACTIVE QUIZ WIZARD */
            <div className="space-y-6 text-left">
              {/* Progress Tracker */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs font-bold text-rose-400 bg-rose-950/40 px-3 py-1 rounded-full border border-rose-900/40">
                  Score: {score}
                </span>
              </div>

              {/* Progress Mini bar */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Statement */}
              <h3 className="font-serif text-lg sm:text-xl font-semibold leading-relaxed text-slate-100">
                {currentQuestion.question}
              </h3>

              {/* Options Selection List */}
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedOptionIndex === index;
                  const isCorrect = index === currentQuestion.correctIndex;
                  
                  let optionStyle = "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300";
                  if (isSelected) optionStyle = "bg-rose-500/10 border-rose-500/70 text-rose-300";
                  
                  // Styles if submitted
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optionStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold";
                    } else if (isSelected) {
                      optionStyle = "bg-rose-500/20 border-rose-500 text-rose-400 line-through";
                    } else {
                      optionStyle = "bg-slate-800/30 border-slate-800 text-slate-500 pointer-events-none";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswerSubmitted}
                      className={`w-full text-left p-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && <span className="text-emerald-400 text-sm">✓ Correct</span>}
                      {isAnswerSubmitted && isSelected && !isCorrect && <span className="text-rose-400 text-sm">✕ Incorrect</span>}
                    </button>
                  );
                })}
              </div>

              {}
              <div className="pt-4 space-y-4">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOptionIndex === null}
                    className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-slate-800 text-white disabled:text-slate-500 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    🔒 Confirm My Answer
                  </button>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    {/* Revelations/Explanation Frame */}
                    <div className="bg-rose-950/30 border border-rose-900/30 p-4 rounded-xl">
                      <p className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest mb-1">
                        ✨ Inside Scoop Memory
                      </p>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {currentQuestion.funFact}
                      </p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                    >
                      Next Question ➔
                    </button>
                  </div>
                )}
              </div>

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

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">Add a Relationship Question</h3>
                <p className="text-xs text-slate-500">Pencil down a quiz card and see if your lover gets it right!</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  The Question
                </label>
                <input
                  type="text"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="E.g., What was the color of my shirt on our first date?"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all text-slate-800"
                />
              </div>

              {/* Grid block options */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Option A (0)
                  </label>
                  <input
                    type="text"
                    name="option0"
                    value={formData.option0}
                    onChange={handleInputChange}
                    placeholder="E.g., Sky Blue"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Option B (1)
                  </label>
                  <input
                    type="text"
                    name="option1"
                    value={formData.option1}
                    onChange={handleInputChange}
                    placeholder="E.g., Forest Green"
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Option C (2)
                  </label>
                  <input
                    type="text"
                    name="option2"
                    value={formData.option2}
                    onChange={handleInputChange}
                    placeholder="E.g., Pastel Yellow"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Option D (3)
                  </label>
                  <input
                    type="text"
                    name="option3"
                    value={formData.option3}
                    onChange={handleInputChange}
                    placeholder="E.g., Crimson Red"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Select Correct Option
                  </label>
                  <select
                    name="correctIndex"
                    value={formData.correctIndex}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-700 font-medium"
                  >
                    <option value="0">Option A</option>
                    <option value="1">Option B</option>
                    <option value="2">Option C</option>
                    <option value="3">Option D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Fun Fact / Explanation
                </label>
                <textarea
                  name="funFact"
                  value={formData.funFact}
                  onChange={handleInputChange}
                  placeholder="Record the memory explanation here... 'It had a coffee stain on it that we tried hiding!'"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 text-slate-800 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-100 hover:shadow-rose-200 transition-all text-xs uppercase tracking-wider"
              >
                🎮 Add Question Card
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
}