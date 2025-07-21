"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { QuestionCard } from "../../components/card";
import { LoadingSkeleton } from "../../components/ui";

export default function ProgressClient({ questions }) {
  const [progress, setProgress] = useState({});
  
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  // Load progress from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("dsa-progress");
    if (stored) setProgress(JSON.parse(stored));
  }, []);

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem("dsa-progress", JSON.stringify(progress));
  }, [progress]);

  function handleProgressChange(serial, type) {
    setProgress((prev) => ({
      ...prev,
      [serial]: {
        ...prev[serial],
        [type]: !prev[serial]?.[type],
      },
    }));
  }

  const doneCount = questions.filter(q => progress[q.serial]?.done).length;
  const revisedCount = questions.filter(q => progress[q.serial]?.revised).length;
  const progressPercentage = questions.length > 0 ? (doneCount / questions.length) * 100 : 0;
  const revisionPercentage = questions.length > 0 ? (revisedCount / questions.length) * 100 : 0;

  const topicStats = questions.reduce((stats, q) => {
    const topics = q.topic ? q.topic.split(',').map(t => t.trim()) : [];
    topics.forEach(topic => {
      if (!stats[topic]) stats[topic] = { total: 0, done: 0 };
      stats[topic].total++;
      if (progress[q.serial]?.done) stats[topic].done++;
    });
    return stats;
  }, {});

  const difficultyStats = questions.reduce((stats, q) => {
    const diff = q.difficulty?.toLowerCase() || 'unknown';
    if (!stats[diff]) stats[diff] = { total: 0, done: 0 };
    stats[diff].total++;
    if (progress[q.serial]?.done) stats[diff].done++;
    return stats;
  }, {});

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-2 animate-pulse" />
        </motion.div>
      </div>

      {/* Grid pattern overlay */}
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
            Progress Tracker
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400"
          />
          <p className="text-lg font-medium text-gray-400 max-w-2xl mx-auto">
            Track your coding journey and monitor your progress across different topics and difficulty levels
          </p>
        </motion.div>

        {/* Progress Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12"
        >
          {/* Overall Progress */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass glow-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
              <span className="text-2xl">📊</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-emerald-400">{doneCount}</span>
                <span className="text-sm text-gray-400">/ {questions.length}</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-emerald-300">
                  {Math.round(progressPercentage)}% Complete
                </span>
              </div>
            </div>
          </motion.div>

          {/* Revision Progress */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass glow-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Revision</h3>
              <span className="text-2xl">🔄</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-3xl font-bold text-blue-400">{revisedCount}</span>
                <span className="text-sm text-gray-400">/ {questions.length}</span>
              </div>
              <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${revisionPercentage}%` }}
                  transition={{ delay: 0.7, duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-blue-300">
                  {Math.round(revisionPercentage)}% Revised
                </span>
              </div>
            </div>
          </motion.div>

          {/* Difficulty Breakdown */}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            className="glass glow-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Difficulty</h3>
              <span className="text-2xl">⚡</span>
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(difficultyStats).map(([difficulty, stats]) => (
                <div key={difficulty} className="flex justify-between items-center">
                  <span className="capitalize text-gray-300">{difficulty}</span>
                  <span className={`font-medium ${
                    difficulty === 'easy' ? 'text-emerald-400' :
                    difficulty === 'medium' ? 'text-amber-400' :
                    difficulty === 'hard' ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {stats.done}/{stats.total}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Questions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">All Questions</h2>
            <p className="text-gray-400">Mark questions as done or revised to track your progress</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {questions.map((question, index) => (
              <motion.div
                key={question.serial}
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
                <QuestionCard 
                  question={question} 
                  index={index}
                  showProgress={true}
                  progress={progress[question.serial] || {}}
                  onProgressChange={handleProgressChange}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Motivational Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="glass-dark glow-border rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">
              {progressPercentage >= 100 ? '🎉' : progressPercentage >= 75 ? '🚀' : progressPercentage >= 50 ? '💪' : progressPercentage >= 25 ? '👍' : '🌱'}
            </div>
            <p className="text-lg font-medium text-gray-300">
              {progressPercentage >= 100 ? 'Congratulations! You\'ve completed all questions!' :
               progressPercentage >= 75 ? 'Amazing progress! You\'re almost there!' :
               progressPercentage >= 50 ? 'Great job! You\'re halfway through!' :
               progressPercentage >= 25 ? 'Good start! Keep pushing forward!' :
               'Begin your coding journey. Every expert was once a beginner!'}
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
