"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { QuestionCard } from "../../components/card";
import { LoadingSkeleton } from "../../components/ui";

export default function ProgressPage() {
  const [allQuestions, setAllQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);
  
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  // Load questions
  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setAllQuestions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  const doneCount = allQuestions.filter(q => progress[q.serial]?.done).length;
  const revisedCount = allQuestions.filter(q => progress[q.serial]?.revised).length;
  const progressPercentage = allQuestions.length > 0 ? (doneCount / allQuestions.length) * 100 : 0;
  const revisionPercentage = allQuestions.length > 0 ? (revisedCount / allQuestions.length) * 100 : 0;

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden pt-16">

      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-2 animate-pulse" />
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
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-gray-400 via-white to-gray-400"
          />
          <p className="text-lg font-medium text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Track your progress as you solve and revise questions.
            <span className="block mt-6 mb-6 text-white font-semibold">
              ⚠️ Your progress is saved locally in your browser so if you change the browser, Google account, or device, the progress will reset. Sorry, due to free tier of database we can&apos;t implement account login and tracking.
            </span>
          </p>
        </motion.div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <div className="glass glow-border rounded-3xl p-8 shadow-2xl">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="text-center relative overflow-hidden">
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    {/* Content placeholders */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-12 w-16 bg-white/10 rounded-lg mr-2"></div>
                      <div className="h-8 w-20 bg-white/5 rounded-lg"></div>
                    </div>
                    <div className="h-6 w-40 bg-white/10 rounded-lg mx-auto mb-4"></div>
                    <div className="w-full bg-gray-800/50 rounded-full h-3 mb-2 overflow-hidden">
                      <div className="h-3 w-0 bg-white/5 rounded-full"></div>
                    </div>
                    <div className="h-4 w-24 bg-white/5 rounded mx-auto"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Questions Completed */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-4xl md:text-5xl font-black text-white">
                        {doneCount}
                      </div>
                      <div className="text-2xl md:text-3xl text-gray-400 ml-2">
                        / {allQuestions.length}
                      </div>
                    </div>
                    <div className="text-gray-300 text-lg font-medium mb-4">Questions Completed</div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800/50 rounded-full h-3 mb-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                        className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      />
                    </div>
                    <div className="text-sm text-gray-500">{progressPercentage.toFixed(1)}% Complete</div>
                  </motion.div>
                  
                  {/* Questions Revised */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-4">
                      <div className="text-4xl md:text-5xl font-black text-white">
                        {revisedCount}
                      </div>
                      <div className="text-2xl md:text-3xl text-gray-400 ml-2">
                        / {allQuestions.length}
                      </div>
                    </div>
                    <div className="text-gray-300 text-lg font-medium mb-4">Questions Revised</div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-800/50 rounded-full h-3 mb-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${revisionPercentage}%` }}
                        transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
                        className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400"
                      />
                    </div>
                    <div className="text-sm text-gray-500">{revisionPercentage.toFixed(1)}% Revised</div>
                  </motion.div>
                </div>

                {/* Achievement Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="mt-8 pt-8 border-t border-gray-700/30"
                >
                  <div className="flex flex-wrap justify-center gap-4">
                    {doneCount >= 10 && (
                      <div className="glass-dark glow-border rounded-2xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xl">🏆</span>
                        <span className="text-sm font-medium text-emerald-300">First 10!</span>
                      </div>
                    )}
                    {doneCount >= 50 && (
                      <div className="glass-dark glow-border rounded-2xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <span className="text-sm font-medium text-orange-300">Half Century!</span>
                      </div>
                    )}
                    {doneCount >= 100 && (
                      <div className="glass-dark glow-border rounded-2xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xl">💎</span>
                        <span className="text-sm font-medium text-blue-300">Centurion!</span>
                      </div>
                    )}
                    {revisedCount >= 25 && (
                      <div className="glass-dark glow-border rounded-2xl px-4 py-2 flex items-center gap-2">
                        <span className="text-xl">🎯</span>
                        <span className="text-sm font-medium text-purple-300">Reviewer!</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </motion.div>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gradient mb-2">
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  All Questions <div className="h-6 w-12 bg-white/10 rounded animate-pulse"></div>
                </span>
              ) : (
                `All Questions (${allQuestions.length})`
              )}
            </h2>
            <p className="text-gray-400">Click the checkboxes to track your progress</p>
          </div>
          
          {loading ? (
            // Simple professional loading animation like Facebook/LinkedIn
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 10 }, (_, i) => (
                <div key={i} className="glass glow-border rounded-2xl p-6 relative overflow-hidden">
                  {/* Shimmer effect overlay */}
                  <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                  
                  {/* Content placeholders */}
                  <div className="space-y-4">
                    {/* Header with serial and difficulty */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-white/10 rounded-md w-3/4"></div>
                        <div className="h-4 bg-white/5 rounded w-1/2"></div>
                      </div>
                      <div className="h-6 w-16 bg-white/10 rounded-full"></div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2">
                      <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                      <div className="h-6 w-24 bg-white/5 rounded-full"></div>
                    </div>
                    
                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                      <div className="flex-1 h-10 bg-white/10 rounded-xl"></div>
                      <div className="flex-1 h-10 bg-white/5 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allQuestions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-16"
            >
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg text-gray-400">No questions found. Check back soon!</p>
            </motion.div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {allQuestions.map((question, index) => (
                  <motion.div
                    key={question.serial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.4 }}
                  >
                    <QuestionCard
                      question={question}
                      index={index}
                      showProgress={true}
                      progress={progress[question.serial]}
                      onProgressChange={handleProgressChange}
                    />
                  </motion.div>
                ))}
              </div>
              
              {/* Results summary */}
              {allQuestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="flex justify-center py-12 mt-6"
                >
                  <div className="glass-dark glow-border rounded-full px-8 py-4 flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                    <span className="text-gray-300 font-medium">🎉 All questions loaded!</span>
                    <div className="text-sm text-gray-500">({allQuestions.length} questions)</div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}