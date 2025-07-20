"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        when: "afterChildren",
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  const hamburgerVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 }
  };

  const lineVariants = {
    closed: { 
      top: { rotate: 0, y: 0, transformOrigin: 'center' },
      middle: { opacity: 1, scale: 1 },
      bottom: { rotate: 0, y: 0, transformOrigin: 'center' }
    },
    open: {
      top: { rotate: 45, y: 4, transformOrigin: 'center' },
      middle: { opacity: 0, scale: 0 },
      bottom: { rotate: -45, y: -4, transformOrigin: 'center' }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-white/20 to-white/10 text-lg">
              ⚡
            </div>
            <span className="text-xl font-bold text-white">DSA Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              href="/questions" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Questions
            </Link>
            <Link 
              href="/progress" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Progress Tracker
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden relative h-6 w-6 focus:outline-none cursor-pointer flex flex-col justify-center items-center"
            aria-label="Toggle menu"
          >
            <motion.div
              className="relative w-6 h-6 flex flex-col justify-center items-center"
            >
              <motion.span
                variants={lineVariants.closed}
                animate={isOpen ? lineVariants.open.top : lineVariants.closed.top}
                className="absolute h-0.5 w-6 bg-white rounded-full"
                style={{ top: '8px' }}
              />
              <motion.span
                variants={lineVariants.closed}
                animate={isOpen ? lineVariants.open.middle : lineVariants.closed.middle}
                className="absolute h-0.5 w-6 bg-white rounded-full"
                style={{ top: '12px' }}
              />
              <motion.span
                variants={lineVariants.closed}
                animate={isOpen ? lineVariants.open.bottom : lineVariants.closed.bottom}
                className="absolute h-0.5 w-6 bg-white rounded-full"
                style={{ top: '16px' }}
              />
            </motion.div>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden mt-2 pb-4"
            >
              <div className="flex flex-col gap-4 bg-black/40 backdrop-blur-md rounded-lg p-4 border border-white/10">
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/" 
                    className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/questions" 
                    className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Questions
                  </Link>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Link 
                    href="/progress" 
                    className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Progress Tracker
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
