
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Clock, Landmark, Heart, Share2, Search, BookOpen, Star, ChevronRight, Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import stories from "../data/stories";
import CulturalPlatformFooter from "../components/CulturalPlatformFooter.jsx";

const StoryTeller = () => {
  const [category, setCategory] = useState("historical");
  const [story, setStory] = useState(null);
  const [lang, setLang] = useState("mr"); // default Marathi
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("marathi");
  const [showFullStory, setShowFullStory] = useState(false);

  const toggleLang = () => setLang(lang === "mr" ? "en" : "mr");
  const toggleFavorite = () => {
    if (story && !favorites.includes(story.title[lang])) {
      setFavorites([...favorites, story.title[lang]]);
    } else if (story) {
      setFavorites(favorites.filter(fav => fav !== story.title[lang]));
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // Audio functionality would go here
  };

  const shareStory = () => {
    if (story) {
      navigator.share?.({
        title: story.title[lang],
        text: story.story[lang].substring(0, 100) + "...",
        url: window.location.href
      });
    }
  };

  const generateStory = () => {
    const list = stories[category];
    const randomStory = list[Math.floor(Math.random() * list.length)];
    setStory(randomStory);
    setReadingProgress(0);
    setShowFullStory(false);
  };

  const getFilteredStories = () => {
    const list = stories[category] || [];
    if (!searchTerm.trim()) return list;
    
    return list.filter(story => 
      story.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.story[lang].toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const emojiVariants = {
    hover: { y: [0, -5, 0], transition: { duration: 0.4, repeat: Infinity } },
  };

  return (
    <div className="bg-[#fff7ef] min-h-screen flex flex-col">
      

      <motion.div
        className="flex-1 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex flex-col items-center justify-center p-4 md:p-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
      {/* TITLE SECTION */}
      <motion.div
        className="text-center mb-8 w-full max-w-4xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-orange-600 mb-4">
          📚 {lang === "mr" ? "कथा संग्रह" : "Story Collection"}
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          {lang === "mr" 
            ? "महाराष्ट्राच्या सांस्कृतिक वारशातील मोत्यांसारख्या कथा" 
            : "Pearls from Maharashtra's Cultural Heritage"}
        </p>

        {/* SEARCH BAR */}
        <motion.div
          className="max-w-md mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={lang === "mr" ? "कथा शोधा..." : "Search stories..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full border border-orange-200 focus:border-orange-400 focus:outline-none bg-white shadow-sm"
            />
          </div>
        </motion.div>

        {/* CONTROLS */}
        <div className="flex justify-center items-center gap-4 flex-wrap">
          {/* LANGUAGE TOGGLE */}
          <motion.button
            onClick={toggleLang}
            whileTap={{ scale: 0.95 }}
            className="bg-orange-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-orange-700 transition"
          >
            {lang === "mr" ? "English" : "मराठी"}
          </motion.button>

          {/* VOICE SELECTION */}
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow border">
            <BookOpen size={16} className="text-orange-600" />
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="outline-none bg-transparent text-sm"
            >
              <option value="marathi">मराठी आवाज</option>
              <option value="english">English Voice</option>
            </select>
          </div>

          {/* FAVORITES COUNT */}
          {favorites.length > 0 && (
            <motion.div
              className="flex items-center gap-1 bg-white px-3 py-2 rounded-full shadow border"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Heart size={16} className="text-red-500 fill-red-500" />
              <span className="text-sm font-medium">{favorites.length}</span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* CATEGORY BUTTONS */}
      <motion.div
        className="flex flex-wrap gap-3 mb-8 justify-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { key: "historical", icon: "⚔️", mr: "ऐतिहासिक", en: "Historical" },
          { key: "folklore", icon: "🎭", mr: "लोककथा", en: "Folklore" },
          { key: "spiritual", icon: "🙏", mr: "आध्यात्मिक", en: "Spiritual" },
          { key: "mythological", icon: "🔱", mr: "पौराणिक", en: "Mythological" },
          { key: "inspirational", icon: "🌟", mr: "प्रेरणादायी", en: "Inspirational" },
          { key: "educational", icon: "📖", mr: "शैक्षणिक", en: "Educational" },
        ].map((cat) => (
          <motion.button
            key={cat.key}
            onClick={() => {
              setCategory(cat.key);
              setStory(null);
              setSearchTerm("");
            }}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            variants={buttonVariants}
            className={`px-4 py-3 rounded-xl font-semibold flex flex-col items-center w-32 transition-all ${
              category === cat.key 
                ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                : "bg-white border-2 border-orange-200 hover:border-orange-400"
            }`}
          >
            <motion.span
              className="text-2xl mb-1"
              variants={emojiVariants}
              whileHover="hover"
            >
              {cat.icon}
            </motion.span>
            <span className="text-sm">{lang === "mr" ? cat.mr : cat.en}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* STORY BOX */}
      <AnimatePresence mode="wait">
        <motion.div
          key={story ? story.title[lang] : "placeholder"}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-3xl p-6 md:p-8 w-full max-w-4xl border border-orange-100"
        >
          {story ? (
            <div className="space-y-6">
              {/* STORY HEADER */}
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-orange-700 mb-2">
                    {story.title[lang]}
                  </h2>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                      {lang === "mr" ? 
                        (category === "historical" ? "ऐतिहासिक" :
                         category === "folklore" ? "लोककथा" :
                         category === "spiritual" ? "आध्यात्मिक" :
                         category === "mythological" ? "पौराणिक" :
                         category === "inspirational" ? "प्रेरणादायी" : "शैक्षणिक")
                        : category.charAt(0).toUpperCase() + category.slice(1)
                      }
                    </span>
                    <span>📖 {lang === "mr" ? "२ मिनिटे वाचन" : "2 min read"}</span>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-2">
                  <motion.button
                    onClick={toggleFavorite}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-full transition-colors ${
                      favorites.includes(story.title[lang])
                        ? "bg-red-100 text-red-500"
                        : "bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    }`}
                  >
                    <Heart size={20} className={favorites.includes(story.title[lang]) ? "fill-current" : ""} />
                  </motion.button>
                  
                  <motion.button
                    onClick={shareStory}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-colors"
                  >
                    <Share2 size={20} />
                  </motion.button>
                  
                  <motion.button
                    onClick={togglePlay}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full bg-orange-100 text-orange-500 hover:bg-orange-200 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </motion.button>
                </div>
              </div>

              {/* READING PROGRESS */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{lang === "mr" ? "वाचन प्रगती" : "Reading Progress"}</span>
                  <span>{readingProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${readingProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* STORY CONTENT */}
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                  {showFullStory ? story.story[lang] : story.story[lang].substring(0, 300) + "..."}
                </p>
                
                {story.story[lang].length > 300 && (
                  <motion.button
                    onClick={() => setShowFullStory(!showFullStory)}
                    whileTap={{ scale: 0.95 }}
                    className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 mt-3"
                  >
                    {showFullStory ? 
                      (lang === "mr" ? "कमी दाखवा" : "Show less") : 
                      (lang === "mr" ? "पूर्ण कथा वाचा" : "Read full story")
                    }
                    <ChevronRight size={16} className={`transform transition-transform ${showFullStory ? "rotate-90" : ""}`} />
                  </motion.button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {lang === "mr" ? "कथा निवडा" : "Select a Story"}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {lang === "mr"
                  ? "खालील बटणावर क्लिक करून एक कथा निवडा किंवा शोधा"
                  : "Click the button below to generate a story or search for one"}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* GENERATE BUTTON WITH PULSE */}
      <motion.button
        onClick={generateStory}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        animate={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5 } }}
        className="mt-8 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <span className="flex items-center gap-2">
          <BookOpen size={20} />
          {lang === "mr" ? "नवीन कथा तयार करा" : "Generate New Story"}
        </span>
      </motion.button>

      {/* STORY PREVIEW CARDS */}
      {searchTerm && (
        <motion.div
          className="mt-8 w-full max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {lang === "mr" ? "शोध परिणाम" : "Search Results"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getFilteredStories().slice(0, 4).map((foundStory, index) => (
              <motion.div
                key={index}
                onClick={() => {
                  setStory(foundStory);
                  setSearchTerm("");
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-4 rounded-xl border border-orange-100 cursor-pointer hover:shadow-md transition-all"
              >
                <h4 className="font-semibold text-orange-700 mb-2">{foundStory.title[lang]}</h4>
                <p className="text-sm text-gray-600 line-clamp-2">{foundStory.story[lang].substring(0, 100)}...</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      </motion.div>

      {/* FOOTER */}
      <CulturalPlatformFooter />
    </div>
  );
};

export default StoryTeller;
