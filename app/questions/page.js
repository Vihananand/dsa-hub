"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { QuestionCard } from "../../components/card";
import { Dropdown, SearchInput, LoadingSkeleton } from "../../components/ui";

export default function QuestionsPage() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ topic: "", difficulty: "" });
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(false);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  // Fetch all questions with simplified loading
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setLoadingProgress(0);
        
        const res = await fetch("/api/questions");
        setLoadingProgress(50);
        
        const data = await res.json();
        setAllQuestions(data);
        setLoadingProgress(100);
        
        // Ensure animation lasts at least 1 second for better UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        setError(true);
        // Still wait for 1 second on error for consistent timing
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Calculate difficulty counts
  const getFilteredQuestions = useCallback(() => {
    return allQuestions.filter((q) => {
      // Handle comma-separated topics for filtering
      const questionTopics = q.topic ? q.topic.split(',').map(t => t.trim()) : [];
      const topicMatch = !filter.topic || questionTopics.includes(filter.topic);
      
      return (
        (!search || q.title.toLowerCase().includes(search.toLowerCase())) &&
        topicMatch &&
        (!filter.difficulty || q.difficulty === filter.difficulty)
      );
    });
  }, [allQuestions, search, filter]);

  const difficultyStats = useCallback(() => {
    const filtered = getFilteredQuestions();
    const stats = filtered.reduce((acc, q) => {
      const diff = q.difficulty?.toLowerCase() || 'unknown';
      acc[diff] = (acc[diff] || 0) + 1;
      return acc;
    }, {});
    
    return {
      easy: stats.easy || 0,
      medium: stats.medium || 0,
      hard: stats.hard || 0,
      total: filtered.length
    };
  }, [getFilteredQuestions]);

  // Get all filtered questions for display
  const displayedQuestions = getFilteredQuestions();

  // Extract unique topics from comma-separated strings
  const topics = Array.from(
    new Set(
      allQuestions
        .flatMap((q) => q.topic ? q.topic.split(',').map(t => t.trim()) : [])
        .filter(topic => topic !== "") // Remove empty strings
    )
  ).sort(); // Sort alphabetically for better UX

  const difficulties = Array.from(new Set(allQuestions.map((q) => q.difficulty)));

  // Prepare dropdown options
  const topicOptions = [
    { value: "", label: "All Topics" },
    ...topics.map(topic => ({ value: topic, label: topic }))
  ];

  const difficultyOptions = [
    { value: "", label: "All Difficulties" },
    ...difficulties.map(difficulty => ({ value: difficulty, label: difficulty }))
  ];

  const stats = difficultyStats();

  // Simple Loading Component
  const LoadingScreen = () => {
    const stageInfo = error ? {
      title: "Connection Error",
      subtitle: "Please check your internet connection",
      icon: "⚠️"
    } : {
      title: "Ready to Code!",
      subtitle: "Loading amazing questions...",
      icon: "🚀"
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-black via-gray-950 to-black z-50 flex items-center justify-center overflow-hidden"
      >
        {/* Animated background particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full opacity-20"
              animate={{
                x: [0, 100, -100, 0],
                y: [0, -100, 100, 0],
                scale: [1, 1.5, 0.5, 1],
                opacity: [0.2, 0.5, 0.1, 0.2]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Main loading content */}
        <div className="relative z-10 text-center max-w-md mx-auto px-6">
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="text-6xl mb-8"
          >
            {stageInfo.icon}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-4 tracking-tight"
          >
            {stageInfo.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 mb-8 text-lg"
          >
            {stageInfo.subtitle}
          </motion.p>

          {/* Enhanced Progress Bar */}
          <div className="relative mb-8 w-full max-w-sm mx-auto">
            <div className="glass glow-border rounded-full p-2">
              <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </motion.div>
              </div>
            </div>
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center mt-3 text-sm text-gray-500 font-medium"
            >
              {loadingProgress}%
            </motion.div>
          </div>

          {/* Loading dots animation */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
              />
            ))}
          </div>

          {/* Fun facts during loading */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 p-4 glass-dark rounded-xl border border-gray-700/30"
          >
            <p className="text-xs text-gray-500 italic">
              💡 Did you know? The first computer bug was an actual bug - a moth trapped in a Harvard computer in 1947!
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {/* Full Screen Loading Experience */}
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>

      {/* Main Content */}
      <AnimatePresence>
        {!loading && (
            <motion.main
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden"
            >
              {/* Animated background elements with parallax */}
              <div className="absolute inset-0 overflow-hidden">
                <motion.div
                  style={{ y: backgroundY }}
                  className="absolute inset-0"
                >
                  <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
                  <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
                </motion.div>
              </div>      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-5" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black tracking-tight text-gradient md:text-6xl lg:text-7xl mb-6">
            Questions
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-gray-400 via-white to-gray-400"
          />
          <p className="text-lg font-medium text-gray-400">
            Explore and filter through our curated collection of coding challenges
          </p>

          {/* Difficulty Statistics */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-4"
            >
              {Array.from({ length: 4 }, (_, i) => (
                <motion.div 
                  key={`stat-skeleton-${i}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                  className="glass-dark glow-border rounded-2xl px-6 py-4 min-w-[120px] animate-pulse"
                >
                  <div className="h-8 w-8 bg-white/10 rounded mx-auto mb-2"></div>
                  <div className="h-4 w-16 bg-white/5 rounded mx-auto"></div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-4"
            >
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-dark glow-border rounded-2xl px-3 py-3 sm:px-6 sm:py-4 min-w-[90px] sm:min-w-[120px]"
              >
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">{stats.easy}</div>
                <div className="text-xs sm:text-sm font-medium uppercase tracking-wide text-emerald-300/80">Easy</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-dark glow-border rounded-2xl px-3 py-3 sm:px-6 sm:py-4 min-w-[90px] sm:min-w-[120px]"
              >
                <div className="text-xl sm:text-2xl font-bold text-amber-400">{stats.medium}</div>
                <div className="text-xs sm:text-sm font-medium uppercase tracking-wide text-amber-300/80">Medium</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-dark glow-border rounded-2xl px-3 py-3 sm:px-6 sm:py-4 min-w-[90px] sm:min-w-[120px]"
              >
                <div className="text-xl sm:text-2xl font-bold text-red-400">{stats.hard}</div>
                <div className="text-xs sm:text-sm font-medium uppercase tracking-wide text-red-300/80">Hard</div>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05, y: -2 }}
                className="glass-dark glow-border rounded-2xl px-3 py-3 sm:px-6 sm:py-4 min-w-[90px] sm:min-w-[120px]"
              >
                <div className="text-xl sm:text-2xl font-bold text-gray-300">{stats.total}</div>
                <div className="text-xs sm:text-sm font-medium uppercase tracking-wide text-gray-400/80">Total</div>
              </motion.div>
            </motion.div>
          )}

          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-6"
            >
              <span className="text-sm text-gray-500">
                Showing {displayedQuestions.length} of {stats.total} questions
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Search and Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12 relative z-10"
        >
          <div className="glass glow-border rounded-2xl p-6 shadow-2xl relative">
            {loading ? (
              <div className="flex flex-col lg:flex-row gap-4 items-center animate-pulse">
                <div className="flex-1 w-full h-12 bg-white/10 rounded-xl"></div>
                <div className="flex gap-4 w-full lg:flex-1 lg:max-w-md">
                  <div className="flex-1 h-12 bg-white/10 rounded-xl"></div>
                  <div className="flex-1 h-12 bg-white/10 rounded-xl"></div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search questions by title..."
                  className="flex-1 w-full"
                />
                
                <div className="flex gap-3 w-full lg:flex-1 lg:max-w-lg relative z-20">
                  <Dropdown
                    options={topicOptions}
                    value={filter.topic}
                    onChange={(value) => setFilter(f => ({ ...f, topic: value }))}
                    placeholder="Topics"
                    icon="🏷️"
                    className="flex-1 min-w-0"
                  />
                  
                  <Dropdown
                    options={difficultyOptions}
                    value={filter.difficulty}
                    onChange={(value) => setFilter(f => ({ ...f, difficulty: value }))}
                    placeholder="Difficulty"
                    icon="⚡"
                    className="flex-1 min-w-0"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Questions Grid with Infinite Scroll */}
        {loading ? (
          // Show skeleton cards during initial loading
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={`initial-skeleton-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <LoadingSkeleton />
              </motion.div>
            ))}
          </div>
        ) : displayedQuestions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-lg font-medium text-gray-400">No questions found matching your criteria.</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {displayedQuestions.map((question, index) => (
              <motion.div
                key={`${question.serial}-${index}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.03,
                  duration: 0.5,
                  type: "spring",
                  bounce: 0.2
                }}
                whileHover={{ 
                  y: -2, 
                  transition: { duration: 0.2 } 
                }}
              >
                <QuestionCard question={question} index={index} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Results summary */}
        {!loading && displayedQuestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center py-12"
          >
            <div className="glass-dark glow-border rounded-full px-8 py-4 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-gray-300 font-medium">🎉 All questions loaded!</span>
              <div className="text-sm text-gray-500">({displayedQuestions.length} questions)</div>
            </div>
          </motion.div>
        )}

        {/* Loading indicator for when items are being fetched - REMOVED since we have overlay now */}
      </div>
            </motion.main>
        )}
      </AnimatePresence>
    </>
  );
}
