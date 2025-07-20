"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { QuestionCard } from "../components/card";
import { BuyMeCoffeeModal } from "../components/BuyMeCoffeeModal";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.slice(-4).reverse()); // latest 4 questions
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden">
      {/* Animated background elements with parallax */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0"
        >
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse" />
        </motion.div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-5" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section */}
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="mb-8"
          >
            {/* Logo/Icon */}
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-white/10 to-white/5 glow-border shadow-2xl"
            >
              <span className="text-4xl">⚡</span>
            </motion.div>

            <h1 className="mb-6 text-6xl font-black tracking-tight text-gradient md:text-8xl lg:text-9xl">
              DSA Hub
            </h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "6rem" }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mx-auto mb-8 h-1 rounded-full bg-gradient-to-r from-gray-400 via-white to-gray-400"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-12 max-w-4xl"
          >
            <p className="text-xl font-medium leading-relaxed text-gray-300 md:text-2xl">
              Your modern, secure, and efficient platform to explore, manage, and solve curated questions.
            </p>
            <p className="mt-4 text-lg font-semibold text-white md:text-xl">
              Built for speed, security, and style.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mb-16 flex flex-col items-center gap-6 sm:flex-row"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <button className="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-white/20 via-gray-300/20 to-white/20 p-1 shadow-2xl hover:shadow-white/20 transition-all duration-300 cursor-pointer">
                <Link
                  href="/questions"
                  className="relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gray-900 to-black px-16 py-5 text-white transition-all duration-300 group-hover:from-gray-800 group-hover:to-gray-900 w-96 cursor-pointer"
                >
                  <span className="text-2xl">🚀</span>
                  <span className="text-lg font-bold">Explore Questions</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/10 to-gray-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <button className="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-gray-400/20 via-gray-500/20 to-gray-300/20 p-1 shadow-2xl hover:shadow-gray-400/20 transition-all duration-300 cursor-pointer">
                <Link
                  href="/progress"
                  className="relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gray-900 to-black px-16 py-5 text-white transition-all duration-300 group-hover:from-gray-800 group-hover:to-gray-900 w-96 cursor-pointer"
                >
                  <span className="text-2xl">📊</span>
                  <span className="text-lg font-bold">Track Progress</span>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-400/10 to-gray-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </button>
            </motion.div>
          </motion.div>

          {/* Buy Me a Coffee Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mb-16 flex justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCoffeeModal(true)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 p-1 shadow-2xl hover:shadow-yellow-500/20 transition-all duration-300 hover:cursor-pointer"
            >
              <div className="relative flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-gray-900 to-black px-8 py-4 text-white transition-all duration-300 group-hover:from-yellow-900/20 group-hover:to-orange-900/20">
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ☕
                </motion.span>
                <span className="text-base font-bold">Buy Me a Coffee</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Latest Questions Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="pb-20"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="text-4xl font-bold text-gradient mb-4 md:text-5xl"
            >
              Latest Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="text-lg text-gray-400"
            >
              Fresh challenges to sharpen your skills
            </motion.p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-16">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-500" />
              <p className="text-lg text-gray-400">Loading amazing questions...</p>
            </div>
          ) : questions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-16"
            >
              <div className="mb-4 text-6xl">🚀</div>
              <p className="text-lg text-gray-400">No questions found. Check back soon for fresh challenges!</p>
            </motion.div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.serial}
                  question={question}
                  index={index}
                />
              ))}
            </div>
          )}

          {/* See all questions link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href="/questions"
              className="group inline-flex items-center gap-2 text-lg font-medium text-gray-400 transition-colors hover:text-white cursor-pointer"
            >
              <span>See all questions</span>
              <motion.svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                whileHover={{ x: 4 }}
                transition={{ type: "spring", bounce: 0.5 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </Link>
          </motion.div>
        </motion.section>

        {/* Decorative Wave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="mx-auto mb-20 w-full max-w-4xl"
        >
          <svg viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-16 w-full">
            <motion.path
              d="M0 50 Q200 10 400 50 T800 50"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.8, duration: 2, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6B7280" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#6B7280" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>

      {/* Buy Me a Coffee Modal */}
      <BuyMeCoffeeModal 
        isOpen={showCoffeeModal} 
        onClose={() => setShowCoffeeModal(false)} 
      />
    </main>
  );
}