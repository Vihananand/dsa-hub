"use client";
import { motion } from "framer-motion";

export function Card({ children, className = "", hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
      className={`glass glow-border rounded-2xl shadow-2xl transition-all duration-300 ${className}`}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export function QuestionCard({ question, index = 0, showProgress = false, progress = null, onProgressChange = null }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-300';
      case 'medium': return 'from-amber-500/20 to-orange-600/20 border-amber-500/30 text-amber-300';
      case 'hard': return 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300';
      default: return 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", bounce: 0.3 }}
      className="group"
    >
      <Card className="p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors leading-tight flex-1 mr-3">
            {question.title}
          </h3>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border bg-gradient-to-r ${getDifficultyColor(question.difficulty)} shrink-0`}>
            {question.difficulty || 'Unknown'}
          </div>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-6">
          {question.topic.split(',').map(topic => (
            <span
              key={topic.trim()}
              className="px-2 py-1 text-xs font-medium bg-gray-800/50 border border-gray-600/30 text-gray-300 rounded-full hover:bg-gray-700/50 transition-colors"
            >
              {topic.trim()}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mb-4">
          <motion.a
            href={question.questionlink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 rounded-xl text-sm text-center transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
          >
            View Question
          </motion.a>
          {question.solutionlink && (
            <motion.a
              href={question.solutionlink}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 border border-gray-500/50 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-4 py-2 rounded-xl text-sm text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-800/30 cursor-pointer"
            >
              Solution
            </motion.a>
          )}
        </div>

        {/* Progress checkboxes */}
        {showProgress && (
          <div className="flex gap-6 pt-4 border-t border-gray-700/30">
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!progress?.done}
                  onChange={() => onProgressChange?.(question.serial, "done")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  progress?.done 
                    ? 'bg-emerald-500 border-emerald-500' 
                    : 'border-gray-500 hover:border-gray-400'
                }`}>
                  {progress?.done && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-medium">Done</span>
            </label>
            
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={!!progress?.revised}
                  onChange={() => onProgressChange?.(question.serial, "revised")}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 transition-all duration-200 ${
                  progress?.revised 
                    ? 'bg-blue-500 border-blue-500' 
                    : 'border-gray-500 hover:border-gray-400'
                }`}>
                  {progress?.revised && (
                    <svg className="w-3 h-3 text-white absolute top-0.5 left-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-medium">Revised</span>
            </label>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
