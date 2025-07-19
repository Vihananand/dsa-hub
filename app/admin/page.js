"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      console.log("[CLIENT] Attempting login for username:", username);
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // 🔥 CRITICAL: Send cookies
        body: JSON.stringify({ username, password }),
      });
      
      console.log("[CLIENT] Login response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("[CLIENT] Login successful:", data);
        console.log("[CLIENT] Redirecting to dashboard...");
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        console.log("[CLIENT] Login failed:", data);
        setError(data.error || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      console.error("[CLIENT] Network error:", err);
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

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
        {/* Admin Icon Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-6xl md:text-7xl mb-6"
          >
            👨‍💻
          </motion.div>
        </motion.div>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-black text-gradient mb-4 tracking-tight">
            Admin Portal
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "6rem" }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto mb-4 h-1 rounded-full bg-gradient-to-r from-gray-400 via-white to-gray-400"
          />
          <p className="text-lg text-gray-400">Secure access to DSA Hub management</p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="glass glow-border rounded-2xl p-8 shadow-2xl">
            
            <div className="relative z-10">
              <form onSubmit={handleLogin} className="flex flex-col gap-6">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-white mb-2">Login Required</h2>
                  <p className="text-gray-400 text-sm">Enter your credentials to continue</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="username">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 pr-12 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none p-1 cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative glass-dark glow-border text-white font-bold px-8 py-4 rounded-lg shadow-2xl hover:shadow-white/10 transition-all duration-300 text-lg overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed hover:scale-105 cursor-pointer"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Login to Dashboard
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 pt-6 border-t border-gray-700/50">
                <div className="flex items-center justify-center text-gray-400 text-xs">
                  <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>This is a secure admin area</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8"
        >
          <Link
            href="/"
            className="group inline-flex items-center text-lg font-medium text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <svg className="mr-2 w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Homepage</span>
          </Link>
        </motion.div>

        {/* Decorative Wave */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.0, duration: 1 }}
          className="w-full max-w-2xl mt-16"
        >
          <svg viewBox="0 0 400 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12">
            <motion.path
              d="M0 25 Q100 10 200 25 T400 25"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="transparent"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.4, duration: 2, ease: "easeInOut" }}
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