"use client";
import React, { useState, useEffect } from "react";

const DEFAULT_MIX_TAPES = [
  {
    id: 1,
    title: "Songs That Remind Me of You ❤️",
    description:
      "The official soundtrack of our butterflies and sweet inside jokes.",
    tapeColor: "from-rose-500 to-pink-600",
    labelColor: "bg-rose-50 text-rose-900",
    tracks: [
      {
        title: "Lover",
        artist: "Taylor Swift",
        memory:
          "We slow-danced to this in our living room at 2 AM, stepping all over each other's toes but laughing the entire time.",
        lyric:
          "Can I go where you go? Can we always be this close forever and ever?",
      },
      {
        title: "Yellow",
        artist: "Coldplay",
        memory:
          "Reminds me of our first stargazing trip when the sky cleared up just for us. Your eyes sparkled brighter than any constellation.",
        lyric: "Look at the stars, look how they shine for you...",
      },
      {
        title: "Beyond",
        artist: "Leon Bridges",
        memory:
          "The song Alex secretly queued up on the AUX cord on our first road trip. It was the moment we both knew this was something forever.",
        lyric:
          "I'm scared to death that she might be it. That the love is real...",
      },
    ],
  },
  {
    id: 2,
    title: "Cozy Rainy Sundays ☕",
    description:
      "For lazy mornings under thick blankets, sipping warm coffee together.",
    tapeColor: "from-amber-500 to-amber-600",
    labelColor: "bg-amber-50 text-amber-900",
    tracks: [
      {
        title: "Banana Pancakes",
        artist: "Jack Johnson",
        memory:
          "Our go-to jam whenever we decide to drop our morning chores, stay in bed, and make chocolate chip stacks instead.",
        lyric:
          "Baby, you hardly even notice when I try to show you this song is meant to keep you from doing what you're supposed to.",
      },
      {
        title: "Like Real People Do",
        artist: "Hozier",
        memory:
          "Playing quietly in that small, rainy cafe on our second date. You were wearing that green sweater and holding your mug with both hands.",
        lyric:
          "I had a thought, dear, however scary... About that love we found.",
      },
    ],
  },
  {
    id: 3,
    title: "Late Night Road Trips 🚗",
    description:
      "Windows rolled down, warm wind in our hair, and singing at the top of our lungs.",
    tapeColor: "from-indigo-500 to-purple-600",
    labelColor: "bg-indigo-50 text-indigo-900",
    tracks: [
      {
        title: "Midnight City",
        artist: "M83",
        memory:
          "That spontaneous midnight drive we took just to grab milkshakes. The city skyline was glowing, and we felt completely infinite.",
        lyric: "Waiting in a car... Waiting for a ride in the dark.",
      },
      {
        title: "Put Your Records On",
        artist: "Corinne Bailey Rae",
        memory:
          "You singing this with total confidence while driving down the coast, getting absolutely none of the lyrics right but looking adorable.",
        lyric:
          "Girl, put your records on, tell me your favorite song. Go ahead, let your hair down.",
      },
    ],
  },
];

export default function MixtapeJukebox() {
  const [mixtapes, setMixtapes] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("couple_mixtapes");
      return saved ? JSON.parse(saved) : DEFAULT_MIX_TAPES;
    }
    return DEFAULT_MIX_TAPES;
  });

  const [activeTapeIndex, setActiveTapeIndex] = useState(0);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for adding songs
  const [newTitle, setNewTitle] = useState("");
  const [newArtist, setNewArtist] = useState("");
  const [newMemory, setNewMemory] = useState("");
  const [newLyric, setNewLyric] = useState("");
  const [targetTapeId, setTargetTapeId] = useState(DEFAULT_MIX_TAPES[0].id);

  useEffect(() => {
    localStorage.setItem("couple_mixtapes", JSON.stringify(mixtapes));
  }, [mixtapes]);

  const activeTape = mixtapes[activeTapeIndex] || mixtapes[0];
  const activeTrack =
    activeTape.tracks[activeTrackIndex] || activeTape.tracks[0];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    if (activeTape.tracks.length === 0) return;
    setActiveTrackIndex((prev) => (prev + 1) % activeTape.tracks.length);
  };

  const handlePrevTrack = () => {
    if (activeTape.tracks.length === 0) return;
    setActiveTrackIndex(
      (prev) =>
        (prev - 1 + activeTape.tracks.length) % activeTape.tracks.length,
    );
  };

  const handleSelectTape = (index) => {
    setActiveTapeIndex(index);
    setActiveTrackIndex(0);
    setIsPlaying(false);
  };

  const handleAddSong = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim() || !newMemory.trim()) return;

    const newSong = {
      title: newTitle,
      artist: newArtist,
      memory: newMemory,
      lyric: newLyric || "No lyrics compiled yet, just sweet beats.",
    };

    setMixtapes((prev) =>
      prev.map((tape) => {
        if (tape.id === parseInt(targetTapeId)) {
          return {
            ...tape,
            tracks: [...tape.tracks, newSong],
          };
        }
        return tape;
      }),
    );

    // Reset Form
    setNewTitle("");
    setNewArtist("");
    setNewMemory("");
    setNewLyric("");
    setShowAddModal(false);
  };

  return (
    <section
      id="jukebox"
      className="relative py-24 bg-rose-50/10 px-4 sm:px-6 lg:px-8 border-t border-rose-100/30 overflow-hidden"
    >
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 bg-rose-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-amber-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10 text-center">
        {/* Section Header */}
        <div className="space-y-4 mb-16">
          <span className="text-rose-500 font-serif italic text-lg font-semibold block">
            Love Jukebox
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-extrabold text-slate-900 tracking-tight">
            Our Retro Mixtape Deck
          </h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            Music holds the memory of where we’ve been. Select a custom tape,
            slide it into the deck, play the tracks, and read the romantic
            memories we share behind each song.
          </p>

          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 px-6 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2 group"
          >
            <span>🎵</span> Add a Song to a Tape
          </button>
        </div>

        {/* Tape Selector List */}
        <div className="flex justify-center items-center gap-2 md:gap-3 flex-wrap mb-14 max-w-4xl mx-auto">
          {mixtapes.map((tape, idx) => (
            <button
              key={tape.id}
              onClick={() => handleSelectTape(idx)}
              className={`px-4.5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm border ${
                activeTapeIndex === idx
                  ? "bg-rose-500 text-white border-rose-500 shadow-rose-200"
                  : "bg-white hover:bg-rose-50 text-slate-600 border-slate-100 hover:text-rose-600"
              }`}
            >
              <span>📼</span>
              {tape.title.split(" ").slice(0, 3).join(" ")} Tapes
            </button>
          ))}
        </div>

        {/* Main Jukebox Interface Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
          {/* LEFT SIDE: CASSETTE TAPE DECK PLAYER */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl flex flex-col justify-between min-h-112.5">
            {/* Retro Tape Deck brand frame */}
            <div className="flex justify-between items-center text-slate-500 text-[10px] font-mono tracking-widest uppercase pb-4 border-b border-slate-800/60">
              <span>🎚️ DUAL HIGH-FIDELITY</span>
              <span className="text-rose-500 animate-pulse">● REC PLAY</span>
              <span>AUTO REVERSE</span>
            </div>

            {/* CASSETTE TAPE PLAYER GRAPHIC */}
            <div className="my-8 flex-1 flex items-center justify-center">
              <div
                className={`relative w-full max-w-85 aspect-[1.58/1] rounded-2xl bg-linear-to-br ${activeTape.tapeColor} border-4 border-slate-950 p-3 shadow-inner flex flex-col justify-between overflow-hidden group`}
              >
                {/* Cassette Top Plastic details */}
                <div className="flex justify-between items-center px-2">
                  <span className="text-[9px] font-mono font-bold text-white/50 tracking-wide">
                    SIDE A
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-950/40" />
                  </div>
                </div>

                {/* CASSETTE WRAPPER LABEL */}
                <div
                  className={`w-full flex-1 rounded-lg ${activeTape.labelColor} p-2 border border-slate-950/20 flex flex-col justify-between relative`}
                >
                  {/* Cassette Lines Design */}
                  <div className="absolute top-0 bottom-0 left-0 right-0 border-y border-dashed border-black/5 pointer-events-none" />

                  <div className="text-left space-y-0.5 z-10">
                    <h4 className="font-serif font-extrabold text-xs sm:text-sm tracking-tight truncate leading-tight">
                      {activeTape.title}
                    </h4>
                    <p className="text-[9px] opacity-75 font-mono truncate">
                      Track:{" "}
                      {activeTrack
                        ? `"${activeTrack.title}"`
                        : "No tracks loaded"}
                    </p>
                  </div>

                  {/* CENTER REEL MECHANISM & WINDOW */}
                  <div className="bg-slate-950 rounded-lg h-10 w-[70%] mx-auto border-2 border-slate-900 flex items-center justify-between px-6 relative overflow-hidden z-10">
                    {/* Gear Left */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-7 h-7 rounded-full border-4 border-dashed border-slate-600 ${isPlaying ? "animate-spin" : ""}`}
                        style={{ animationDuration: "6s" }}
                      />
                      <div className="absolute w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-600" />
                    </div>

                    {/* Window view of tape level inside */}
                    <div className="w-10 h-3.5 bg-slate-900/60 rounded border border-slate-800/40 flex items-center justify-center gap-0.5 px-1 relative">
                      {/* Fake Magnetic brown tape rolling block */}
                      <div className="h-full bg-amber-900/40 w-full rounded-sm absolute left-0 right-0 top-0 bottom-0 pointer-events-none animate-pulse" />
                    </div>

                    {/* Gear Right */}
                    <div className="relative flex items-center justify-center">
                      <div
                        className={`w-7 h-7 rounded-full border-4 border-dashed border-slate-600 ${isPlaying ? "animate-spin" : ""}`}
                        style={{ animationDuration: "6s" }}
                      />
                      <div className="absolute w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-600" />
                    </div>
                  </div>

                  <div className="text-right text-[8px] font-mono tracking-wider opacity-60 z-10">
                    90 MINUTE / IEC TYPE I
                  </div>
                </div>

                {/* Cassette bottom screwholes */}
                <div className="flex justify-between items-center px-6 pt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950/60" />
                  <div className="w-4 h-1.5 bg-slate-950/40 rounded-full" />
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-950/60" />
                </div>
              </div>
            </div>

            {/* Pulsing Music Visualizer Bar */}
            <div className="h-6 flex items-end justify-center gap-0.75 px-12 mb-4">
              {[15, 25, 45, 12, 35, 55, 18, 48, 22, 60, 10, 40, 52, 14, 30].map(
                (height, i) => (
                  <div
                    key={i}
                    className="bg-rose-500 rounded-t-sm w-1.5 transition-all duration-300 ease-in-out"
                    style={{
                      height: isPlaying
                        ? `${Math.floor(Math.random() * 80) + 20}%`
                        : "4px",
                      animation: isPlaying
                        ? `pulse 1.${(i % 5) + 1}s infinite alternate`
                        : "none",
                      opacity: isPlaying ? 0.9 : 0.4,
                    }}
                  />
                ),
              )}
            </div>

            {/* PLAYER BUTTONS ROW */}
            <div className="flex justify-center items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <button
                onClick={handlePrevTrack}
                disabled={activeTape.tracks.length <= 1}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                title="Previous Song"
              >
                ◀◀
              </button>

              <button
                onClick={handlePlayPause}
                disabled={activeTape.tracks.length === 0}
                className={`p-4 rounded-full transition-all flex items-center justify-center shadow-lg ${
                  isPlaying
                    ? "bg-slate-800 text-rose-500 hover:text-rose-400 border border-slate-700 shadow-rose-900/10"
                    : "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-950/20"
                }`}
                title={isPlaying ? "Pause Tape" : "Play Tape"}
              >
                {isPlaying ? (
                  <span className="text-sm font-extrabold px-1">❚❚ PAUSE</span>
                ) : (
                  <span className="text-sm font-extrabold px-1">▶ PLAY</span>
                )}
              </button>

              <button
                onClick={handleNextTrack}
                disabled={activeTape.tracks.length <= 1}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none"
                title="Next Song"
              >
                ▶▶
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: SONG LIST & LOVE STORY CARDS */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            {/* Selected track details / Story card */}
            {activeTrack ? (
              <div className="bg-white border border-rose-100/50 rounded-3xl p-6 sm:p-8 text-left shadow-sm flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl animate-pulse">🎵</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      Track {activeTrackIndex + 1} of {activeTape.tracks.length}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif font-bold text-xl text-slate-900 leading-none">
                      {activeTrack.title}
                    </h3>
                    <p className="text-xs text-rose-600 font-semibold mt-1">
                      by {activeTrack.artist}
                    </p>
                  </div>

                  {/* Lyric Snippet box */}
                  <div className="relative bg-rose-50/40 p-4 rounded-xl border border-dashed border-rose-100 italic text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                    <span className="absolute -top-2 left-3 bg-white px-2 border border-rose-100/60 rounded text-[9px] text-rose-500 font-serif not-italic uppercase font-bold tracking-widest">
                      Favorite Lyric
                    </span>
                    "{activeTrack.lyric}"
                  </div>

                  {/* The Backstory Memory */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      Why This Song is "Ours":
                    </span>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {activeTrack.memory}
                    </p>
                  </div>
                </div>

                <div className="text-[10px] italic text-slate-400 text-center lg:text-left mt-6 pt-3 border-t border-slate-100">
                  💖 Pinned to your shared Next.js directory diary.
                </div>
              </div>
            ) : (
              <div className="bg-white border border-rose-100/50 rounded-3xl p-12 text-center shadow-sm flex-1 flex flex-col justify-center items-center">
                <span className="text-5xl block mb-2">📼</span>
                <h4 className="font-serif font-bold text-lg text-slate-800">
                  Empty Mixtape
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  No tracks currently loaded onto this tape. Use the add form to
                  compile your favorite memories!
                </p>
              </div>
            )}

            {/* Quick Track Selection Sidebar inside Card */}
            <div className="bg-white border border-rose-100/50 rounded-3xl p-5 text-left shadow-sm max-h-55 overflow-y-auto">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                Cassette Tracklist ({activeTape.tracks.length}):
              </h4>

              <div className="space-y-1.5">
                {activeTape.tracks.map((track, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveTrackIndex(i);
                      setIsPlaying(false);
                    }}
                    className={`w-full flex justify-between items-center p-2.5 rounded-xl text-left text-xs transition-all border ${
                      activeTrackIndex === i
                        ? "bg-rose-50 text-rose-700 border-rose-100 font-bold"
                        : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 text-slate-600"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-[9px] opacity-60">
                        0{i + 1}.
                      </span>
                      <span className="truncate">{track.title}</span>
                    </div>
                    <span className="text-[10px] opacity-60 shrink-0">
                      {track.artist}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: ADD SONGS TO MIXTAPE */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white border border-rose-100 rounded-3xl shadow-2xl p-6 sm:p-8 relative text-left">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-slate-50 transition-all font-bold text-lg"
            >
              ✕
            </button>

            <form onSubmit={handleAddSong} className="space-y-4">
              <div className="text-center pb-2 border-b border-slate-100">
                <h3 className="font-serif text-xl font-bold text-slate-950">
                  Add a Song Card
                </h3>
                <p className="text-xs text-slate-500">
                  Add a song that defines your relationship directly into a
                  mixtape!
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Target Mixtape
                </label>
                <select
                  value={targetTapeId}
                  onChange={(e) => setTargetTapeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-rose-400"
                >
                  {mixtapes.map((tape) => (
                    <option key={tape.id} value={tape.id}>
                      📼 {tape.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Song Title
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Perfect"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    Artist Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Ed Sheeran"
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Your Favorite Lyric
                </label>
                <input
                  type="text"
                  placeholder="E.g., I found a love, to carry more than just my secrets..."
                  value={newLyric}
                  onChange={(e) => setNewLyric(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Memory or Backstory
                </label>
                <textarea
                  placeholder="Why is this song ours? Explain the cozy memory or the time you heard this song together!"
                  value={newMemory}
                  onChange={(e) => setNewMemory(e.target.value)}
                  rows={3}
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-rose-400 focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                📼 Insert Song into Tape
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
