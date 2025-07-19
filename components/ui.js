"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Dropdown({ options, value, onChange, placeholder, icon, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayValue = value ? options.find(opt => opt.value === value)?.label : placeholder;

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <motion.button
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="glass glow-border w-full rounded-xl px-4 py-3 text-left flex items-center justify-between text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-lg">{icon}</span>}
          <span className={value ? "text-white" : "text-gray-400"}>
            {displayValue}
          </span>
        </div>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 backdrop-blur-md border border-gray-600/50 rounded-xl shadow-2xl z-[9999] max-h-60 overflow-y-auto"
            style={{ zIndex: 9999 }}
          >
            {options.map((option, index) => (
              <motion.button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.15 }}
                className={`w-full px-4 py-3 text-left hover:bg-white/15 transition-colors duration-150 font-medium first:rounded-t-xl last:rounded-b-xl cursor-pointer ${
                  value === option.value
                    ? 'bg-white/15 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glass glow-border w-full rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 font-medium focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
      />
    </div>
  );
}

export function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass glow-border rounded-2xl p-6 animate-pulse relative overflow-hidden"
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      
      {/* Header section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 mr-4">
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-6 bg-gradient-to-r from-white/10 to-white/5 rounded-lg mb-2" 
          />
          <motion.div 
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="h-4 bg-gradient-to-r from-white/5 to-white/3 rounded-lg w-2/3" 
          />
        </div>
        <motion.div 
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="h-6 w-16 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-full" 
        />
      </div>
      
      {/* Tags section */}
      <div className="flex gap-2 mb-6">
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
          className="h-6 w-20 bg-gradient-to-r from-white/5 to-white/3 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
          className="h-6 w-24 bg-gradient-to-r from-white/5 to-white/3 rounded-full"
        />
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }}
          className="h-6 w-16 bg-gradient-to-r from-white/5 to-white/3 rounded-full"
        />
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-3">
        <motion.div 
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2.3, repeat: Infinity }}
          className="flex-1 h-10 bg-gradient-to-r from-emerald-500/20 to-emerald-400/10 rounded-xl" 
        />
        <motion.div 
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.2 }}
          className="flex-1 h-10 bg-gradient-to-r from-white/10 to-white/5 rounded-xl" 
        />
      </div>

      {/* Floating particles for extra effect */}
      <div className="absolute top-2 right-2 w-2 h-2">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-full h-full bg-emerald-500/30 rounded-full"
        />
      </div>
    </motion.div>
  );
}
