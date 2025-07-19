"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", type = "danger" }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: '⚠️',
          confirmBtn: 'bg-red-900/30 text-red-300 border-red-500/30 hover:bg-red-900/50',
          iconBg: 'bg-red-900/20 border-red-500/30'
        };
      case 'success':
        return {
          icon: '✅',
          confirmBtn: 'bg-green-900/30 text-green-300 border-green-500/30 hover:bg-green-900/50',
          iconBg: 'bg-green-900/20 border-green-500/30'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          confirmBtn: 'bg-blue-900/30 text-blue-300 border-blue-500/30 hover:bg-blue-900/50',
          iconBg: 'bg-blue-900/20 border-blue-500/30'
        };
      default:
        return {
          icon: '⚠️',
          confirmBtn: 'bg-red-900/30 text-red-300 border-red-500/30 hover:bg-red-900/50',
          iconBg: 'bg-red-900/20 border-red-500/30'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          style={{ zIndex: 99999 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md mx-auto"
          >
            <div className="glass glow-border rounded-2xl p-6 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border ${typeStyles.iconBg}`}>
                  <span className="text-2xl">{typeStyles.icon}</span>
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-3">
                  {title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/70 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 cursor-pointer"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium border transition-all duration-200 cursor-pointer ${typeStyles.confirmBtn}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function NotificationModal({ isOpen, onClose, title, message, type = "success", autoClose = 3000 }) {
  useEffect(() => {
    if (isOpen && autoClose > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoClose);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgColor: 'bg-green-900/20 border-green-500/30',
          textColor: 'text-green-300'
        };
      case 'error':
        return {
          icon: '❌',
          bgColor: 'bg-red-900/20 border-red-500/30',
          textColor: 'text-red-300'
        };
      case 'info':
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-900/20 border-blue-500/30',
          textColor: 'text-blue-300'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-yellow-900/20 border-yellow-500/30',
          textColor: 'text-yellow-300'
        };
      default:
        return {
          icon: '✅',
          bgColor: 'bg-green-900/20 border-green-500/30',
          textColor: 'text-green-300'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-6 left-0 right-0 z-[99999] flex justify-center px-4"
          style={{ zIndex: 99999 }}
        >
          <div className={`glass glow-border rounded-xl p-4 border shadow-2xl w-full max-w-md ${typeStyles.bgColor}`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{typeStyles.icon}</span>
              <div className="flex-1">
                <h4 className={`font-medium ${typeStyles.textColor}`}>{title}</h4>
                <p className="text-sm text-gray-400 mt-1">{message}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
