"use client";
import { useState, useCallback, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { QuestionCard } from "../../components/card";
import { Dropdown, SearchInput } from "../../components/ui";

export default function QuestionsClient({ questions: allQuestions, error: initialError }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ topic: "", difficulty: "" });
  
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  // Calculate difficulty counts
  const getFilteredQuestions = useCallback(() => {
    return allQuestions.filter((q) => {
      const matchesSearch = !search || 
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.topic.toLowerCase().includes(search.toLowerCase());
      
      const matchesTopic = !filter.topic || q.topic.toLowerCase().includes(filter.topic.toLowerCase());
      const matchesDifficulty = !filter.difficulty || q.difficulty.toLowerCase() === filter.difficulty.toLowerCase();
      
      return matchesSearch && matchesTopic && matchesDifficulty;
    });
  }, [allQuestions, search, filter]);

  const filteredQuestions = getFilteredQuestions();
  
  const getStats = useCallback(() => {
    const stats = {
      total: allQuestions.length,
      easy: allQuestions.filter(q => q.difficulty?.toLowerCase() === 'easy').length,
      medium: allQuestions.filter(q => q.difficulty?.toLowerCase() === 'medium').length,
      hard: allQuestions.filter(q => q.difficulty?.toLowerCase() === 'hard').length,
    };
    return stats;
  }, [allQuestions]);

  const stats = getStats();
  
  const getTopics = useCallback(() => {
    const topicSet = new Set();
    allQuestions.forEach(q => {
      const topics = q.topic.split(',').map(t => t.trim());
      topics.forEach(topic => topicSet.add(topic));
    });
    return Array.from(topicSet).sort();
  }, [allQuestions]);

  const availableTopics = getTopics();
  const difficulties = ['Easy', 'Medium', 'Hard'];

  if (initialError) {
    return (
      <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            style={{ y: backgroundY }}
            className="absolute inset-0"
          >
            <div className="absolute top-20 left-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          </motion.div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-8xl font-black text-red-400 mb-6">
                Error
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                {initialError}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-semibold rounded-2xl transition-all duration-300"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent mb-6">
            Questions
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Master DSA with our comprehensive collection of coding problems
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <div className="glass glow-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-gray-400 text-sm">Total</div>
          </div>
          <div className="glass glow-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-1">{stats.easy}</div>
            <div className="text-gray-400 text-sm">Easy</div>
          </div>
          <div className="glass glow-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-1">{stats.medium}</div>
            <div className="text-gray-400 text-sm">Medium</div>
          </div>
          <div className="glass glow-border rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-1">{stats.hard}</div>
            <div className="text-gray-400 text-sm">Hard</div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <div className="glass glow-border rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search questions or topics..."
                />
              </div>
              <div>
                <Dropdown
                  value={filter.topic}
                  onChange={(value) => setFilter(prev => ({ ...prev, topic: value }))}
                  options={['All Topics', ...availableTopics]}
                  placeholder="Filter by Topic"
                />
              </div>
              <div>
                <Dropdown
                  value={filter.difficulty}
                  onChange={(value) => setFilter(prev => ({ ...prev, difficulty: value }))}
                  options={['All Difficulties', ...difficulties]}
                  placeholder="Filter by Difficulty"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-gray-400">
            <span>Showing {filteredQuestions.length} of {stats.total} questions</span>
            {(search || filter.topic || filter.difficulty) && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter({ topic: "", difficulty: "" });
                }}
                className="text-sm hover:text-white transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Questions Grid */}
        <AnimatePresence mode="wait">
          {filteredQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">No questions found</h3>
              <p className="text-gray-400 mb-8">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearch("");
                  setFilter({ topic: "", difficulty: "" });
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Show All Questions
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredQuestions.map((question, index) => (
                <QuestionCard
                  key={question.serial}
                  question={question}
                  index={index}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
