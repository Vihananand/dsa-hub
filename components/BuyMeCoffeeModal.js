"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function BuyMeCoffeeModal({ isOpen, onClose }) {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const predefinedAmounts = [25, 50, 100, 200, 500];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setShowQR(false);
    setShowThankYou(false);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(parseFloat(value) || 0);
    setShowQR(false);
    setShowThankYou(false);
  };

  const generateQR = async () => {
    if (selectedAmount <= 0) return;
    
    setQrLoading(true);
    setShowQR(true);
    
    // Small delay to show loading state, then show thank you
    setTimeout(() => {
      setQrLoading(false);
      setShowThankYou(true);
    }, 800);
  };

  const handleClose = () => {
    setShowQR(false);
    setShowThankYou(false);
    setQrLoading(false);
    setSelectedAmount(50);
    setCustomAmount("");
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 50 }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={handleClose}
      >
        <motion.div
          className="glass glow-border rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Show Thank You Screen after QR generation */}
          {showThankYou ? (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
                className="mb-6"
              >
                <div className="bg-white p-4 rounded-xl mb-6 inline-block">
                  <Image
                    src={`/api/upi-qr?amount=${selectedAmount}&name=Vihan Anand&upi=9506277581@slc`}
                    alt="UPI QR Code"
                    width={250}
                    height={250}
                    className="w-64 h-64"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-white mb-4">
                  Thank you for keeping me awake! ☕
                </h2>
                <p className="text-sm text-gray-400 mb-4">
                  Scan this QR code with any UPI app
                </p>
                <div className="flex justify-center gap-2 text-xs text-gray-500 mb-6">
                  <span>PhonePe</span>
                  <span>•</span>
                  <span>Google Pay</span>
                  <span>•</span>
                  <span>Paytm</span>
                  <span>•</span>
                  <span>BHIM</span>
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", bounce: 0.5 }}
                  className="text-6xl mb-4"
                >
                  ☕
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Buy Me a Coffee</h2>
                <p className="text-gray-400 text-sm">
                  Support the development of DSA Hub! Your contribution helps keep this platform free and growing.
                </p>
              </div>

              {/* Amount Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Choose Amount (₹)</h3>
                
                {/* Predefined amounts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-3 rounded-xl font-semibold transition-all duration-200 ${
                        selectedAmount === amount && !customAmount
                          ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      ₹{amount}
                    </motion.button>
                  ))}
                </div>

                {/* Custom amount */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    min="1"
                    className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                  />
                  {customAmount && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      ₹
                    </div>
                  )}
                </div>
              </div>

              {/* Generate QR Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateQR}
                disabled={selectedAmount <= 0}
                className={`w-full p-4 rounded-xl font-bold text-lg mb-6 transition-all duration-200 ${
                  selectedAmount > 0
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {qrLoading ? 'Generating...' : `Generate UPI QR - ₹${selectedAmount}`}
              </motion.button>

              {/* Loading State */}
              <AnimatePresence>
                {qrLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="text-center"
                  >
                    <div className="flex flex-col items-center py-8">
                      <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-gray-400">Generating QR code...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-all duration-200"
          >
            ✕
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
