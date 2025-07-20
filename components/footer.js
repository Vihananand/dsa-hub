"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BuyMeCoffeeModal } from "./BuyMeCoffeeModal";

export default function Footer() {
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/Vihananand",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/_vihan.anand_",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/vihan-anand-5bb36a282",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="relative border-t border-gray-800/30 bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/2 -left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        <div className="absolute -bottom-1/2 -right-1/4 w-96 h-96 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="flex items-center justify-center md:justify-start mb-3">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                whileTap={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 glow-border mr-2 cursor-pointer"
              >
                <span className="text-xl">⚡</span>
              </motion.div>
              <h3 className="text-xl font-bold text-gradient">DSA Hub</h3>
            </div>
            <p className="text-gray-400 text-xs max-w-xs">
              Your modern platform for mastering Data Structures and Algorithms
            </p>
          </motion.div>

          {/* Social Links & Coffee Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-300 glass glow-border"
                    >
                      {link.icon}
                    </motion.div>
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Buy Me a Coffee Button */}
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCoffeeModal(true)}
              className="group relative overflow-hidden rounded-full bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 p-0.5 shadow-xl hover:shadow-yellow-500/20 transition-all duration-300 hover:cursor-pointer"
            >
              <div className="relative flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-gray-900 to-black px-4 py-2 text-white transition-all duration-300 group-hover:from-yellow-900/20 group-hover:to-orange-900/20">
                <motion.span 
                  className="text-sm"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  ☕
                </motion.span>
                <span className="text-xs font-bold whitespace-nowrap">Buy Me a Coffee</span>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.button>
          </motion.div>

          {/* Copyright & Contact */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center md:text-right"
          >
            <p className="text-gray-500 text-xs mb-2">
              © 2025 Built with ❤️ by{" "}
              <Link 
                href="https://github.com/Vihananand" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                Vihan Anand
              </Link>
            </p>
            <div className="mb-1">
              <motion.a
                href="mailto:vihananand2018@gmail.com"
                className="inline-flex items-center gap-1 text-gray-500 hover:text-white transition-all duration-300 font-medium group relative text-xs"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                target="_blank"
              >
                <span>📧</span>
                <span className="underline decoration-dotted underline-offset-2 group-hover:decoration-solid">
                  vihananand2018@gmail.com
                </span>
                <motion.div 
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  whileHover={{ scale: 1.1 }}
                />
              </motion.a>
            </div>
            <p className="text-gray-600 text-xs">
              Keep coding, keep growing! 🚀
            </p>
          </motion.div>
        </div>
      </div>

      {/* Buy Me a Coffee Modal */}
      <BuyMeCoffeeModal 
        isOpen={showCoffeeModal} 
        onClose={() => setShowCoffeeModal(false)} 
      />
    </footer>
  );
}
