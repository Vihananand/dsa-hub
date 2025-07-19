"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Custom404() {
  return (
    <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black overflow-hidden pt-16">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-2 animate-pulse"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-5"></div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[90vh] px-4">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-8xl md:text-9xl mb-6"
          >
            🔍
          </motion.div>
        </motion.div>

        {/* 404 Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-8xl md:text-9xl font-black text-gradient mb-4 tracking-tight">
            404
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "8rem" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto mb-6 h-1 rounded-full bg-gradient-to-r from-gray-400 via-white to-gray-400"
          />
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Page Not Found
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl leading-relaxed">
            Oops! The page you&apos;re looking for seems to have vanished into the digital void.
            <span className="block mt-2 text-white font-semibold">
              Let&apos;s get you back on track to solve some coding challenges!
            </span>
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex gap-6 flex-col sm:flex-row items-center mb-16"
        >
          <Link
            href="/"
            className="glass-dark glow-border text-white font-bold px-10 py-4 rounded-full shadow-2xl hover:shadow-white/10 transition-all duration-300 text-lg hover:scale-105"
          >
            <span className="relative z-10">Go Home</span>
          </Link>
          
          <Link
            href="/questions"
            className="glass-dark glow-border text-gray-300 font-bold px-10 py-4 rounded-full shadow-2xl hover:shadow-white/10 transition-all duration-300 text-lg hover:scale-105"
          >
            <span className="relative z-10">Browse Questions</span>
          </Link>
        </motion.div>

        {/* Error Code Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="w-full max-w-2xl"
        >
          <div className="glass glow-border rounded-2xl p-8 shadow-xl hover:shadow-2xl hover:shadow-white/5 transition-all duration-300">
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gray-700/50 rounded-full p-3 mr-4">
                  <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">HTTP 404 Error</h3>
              </div>
              
              <p className="text-gray-400 mb-6 leading-relaxed">
                The requested resource could not be found on this server. This might be due to a mistyped URL, 
                a moved page, or a link that&apos;s no longer valid.
              </p>
              
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>Error Code: 404</span>
                <span>•</span>
                <span>Status: Not Found</span>
                <span>•</span>
                <span>Server: DSA Hub</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          <Link
            href="/"
            className="group inline-flex items-center text-lg font-medium text-gray-400 hover:text-white transition-colors duration-300"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Homepage</span>
          </Link>
          
          <Link
            href="/questions"
            className="group inline-flex items-center text-lg font-medium text-gray-400 hover:text-white transition-colors duration-300"
          >
            <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>All Questions</span>
          </Link>
        </motion.div>

        {/* Decorative Wave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="w-full max-w-4xl mt-16"
        >
          <svg viewBox="0 0 800 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-16">
            <motion.path
              d="M0 50 Q200 80 400 50 T800 50"
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.6, duration: 2, ease: "easeInOut" }}
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
    </main>
  );
}