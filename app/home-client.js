"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { QuestionCard } from "../components/card";

export default function HomeClient({ questions, totalCount, error }) {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          {/* Floating orbs with glow effects */}
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </motion.div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-pulse" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent leading-tight mb-6">
              DSA Hub
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#E7A41F] to-[#d49419] mx-auto rounded-full mb-8" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            Master Data Structures & Algorithms with our curated collection of problems. 
            Track your progress, master the fundamentals, and ace your coding interviews.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Link
              href="/questions"
              className="group relative px-8 py-4 bg-[#E7A41F] hover:bg-[#d49419] text-white font-semibold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-[#E7A41F]/25"
            >
              <span className="relative z-10">Explore Questions</span>
              <div className="absolute inset-0 bg-[#E7A41F] rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              href="/progress"
              className="px-8 py-4 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-gray-900/50 backdrop-blur-sm"
            >
              Track Progress
            </Link>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          <div className="glass glow-border rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-4xl font-bold text-white mb-2">{totalCount || 0}+</div>
            <div className="text-gray-400">Total Problems</div>
          </div>
          <div className="glass glow-border rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-4xl font-bold text-white mb-2">3</div>
            <div className="text-gray-400">Platforms</div>
          </div>
          <div className="glass glow-border rounded-2xl p-8 text-center shadow-2xl">
            <div className="text-4xl font-bold text-white mb-2">∞</div>
            <div className="text-gray-400">Practice Hours</div>
          </div>
        </motion.div>

        {/* Latest Questions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Latest Questions
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Stay up to date with our newest problems and challenges
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <div className="text-red-400 text-lg mb-4">⚠️ {error}</div>
              <p className="text-gray-500">Please try refreshing the page</p>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">📝 No questions available</div>
              <p className="text-gray-500">Check back later for new problems</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.serial}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          )}

          {questions.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/questions"
                className="inline-flex items-center gap-2 px-6 py-3 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-xl transition-all duration-300 hover:bg-gray-900/30"
              >
                View All Questions
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <div className="glass glow-border rounded-2xl p-8 shadow-2xl group hover:scale-105 transition-transform duration-300">
            <div className="text-blue-400 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-3">Curated Problems</h3>
            <p className="text-gray-400 leading-relaxed">
              Hand-picked problems from top platforms like LeetCode, GeeksforGeeks, and Coding Ninjas
            </p>
          </div>

          <div className="glass glow-border rounded-2xl p-8 shadow-2xl group hover:scale-105 transition-transform duration-300">
            <div className="text-green-400 text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-3">Progress Tracking</h3>
            <p className="text-gray-400 leading-relaxed">
              Monitor your solving progress and revision status to stay on track with your goals
            </p>
          </div>

          <div className="glass glow-border rounded-2xl p-8 shadow-2xl group hover:scale-105 transition-transform duration-300">
            <div className="text-purple-400 text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-3">Multiple Platforms</h3>
            <p className="text-gray-400 leading-relaxed">
              Access problems from various coding platforms all in one centralized location
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
