"use client";
import { useEffect, useState } from "react";
import { SearchInput } from "../../../components/ui";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ConfirmModal, NotificationModal } from "../../../components/modal";

export default function AdminDashboard() {
  const [auth, setAuth] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ serial: "", title: "", difficulty: "", topic: "", questionlink: "", solutionlink: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState({ show: false, title: "", message: "", type: "success" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log("[DASHBOARD] Checking authentication...");
    fetch("/api/admin/me", {
      credentials: "include"
    })
      .then(async (res) => {
        console.log("[DASHBOARD] Auth check status:", res.status);
        if (!res.ok) {
          console.log("[DASHBOARD] Not authenticated, redirecting to login");
          router.replace("/admin");
        } else {
          const authData = await res.json();
          console.log("[DASHBOARD] Authenticated as:", authData);
          setAuth(authData);
          fetchQuestions();
        }
      })
      .catch((error) => {
        console.error("[DASHBOARD] Auth check failed:", error);
        router.replace("/admin");
      });
  }, [router]);

  function fetchQuestions() {
    setLoading(true);
    fetch("/api/questions", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        console.log("[DASHBOARD] Raw API response:", data);
        
        // Ensure we have an array
        const qs = Array.isArray(data) ? data : [];
        
        // Filter out any null/undefined questions and ensure all required fields exist
        const validQuestions = qs.filter((q, index) => {
          if (!q) {
            console.warn(`[DASHBOARD] Question at index ${index} is null/undefined`);
            return false;
          }
          if (!q.title) {
            console.warn(`[DASHBOARD] Question at index ${index} has no title:`, q);
            return false;
          }
          if (!q.serial) {
            console.warn(`[DASHBOARD] Question at index ${index} has no serial:`, q);
            return false;
          }
          return true;
        });
        
        console.log("[DASHBOARD] Valid questions after filtering:", validQuestions);
        setQuestions(validQuestions);
        setLoading(false);
      })
      .catch(error => {
        console.error("[DASHBOARD] Error fetching questions:", error);
        setQuestions([]);
        setLoading(false);
        setNotification({
          show: true,
          title: "Error",
          message: "Failed to load questions",
          type: "danger"
        });
      });
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.serial || !form.title || !form.difficulty || !form.topic || !form.questionlink || !form.solutionlink) {
      setError("All fields are required");
      return;
    }

    try {
      const method = editId ? "PUT" : "POST";
      const response = await fetch("/api/questions", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (editId) {
        setQuestions(questions.map(q => q.serial === editId ? data.question : q));
        setNotification({
          show: true,
          title: "Success",
          message: "Question updated successfully",
          type: "success"
        });
      } else {
        setQuestions([...questions, data.question]);
        setNotification({
          show: true,
          title: "Success", 
          message: "Question added successfully",
          type: "success"
        });
      }

      setForm({ serial: "", title: "", difficulty: "", topic: "", questionlink: "", solutionlink: "" });
      setEditId(null);
      
      // Refresh questions list to ensure data consistency
      fetchQuestions();
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: `Save failed: ${error.message}`,
        type: "danger"
      });
    }
  };

  const handleDelete = async (serial) => {
    setDeleteTarget(serial);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const response = await fetch("/api/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serial: deleteTarget }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      setQuestions(questions.filter(q => q.serial !== deleteTarget));
      setNotification({
        show: true,
        title: "Success",
        message: "Question deleted successfully",
        type: "success"
      });
      
      // Refresh questions list to ensure data consistency
      fetchQuestions();
    } catch (error) {
      setNotification({
        show: true,
        title: "Error",
        message: `Delete failed: ${error.message}`,
        type: "danger"
      });
    } finally {
      setShowDeleteModal(false);
      setDeleteTarget(null);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All password fields are required");
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }
    
    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      setNotification({
        show: true,
        title: "Success",
        message: "Password changed successfully",
        type: "success"
      });
      
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowChangePassword(false);
    } catch (error) {
      setPasswordError(error.message);
    }
  };

  async function handleLogout() {
    await fetch("/api/admin/logout", { 
      method: "POST",
      credentials: "include" // 🔥 CRITICAL: Send cookies
    });
    router.replace("/admin");
  }

  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black pt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-400 rounded-full mix-blend-multiply filter blur-3xl opacity-3 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-2 animate-pulse"></div>
        </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-dots opacity-5"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gradient tracking-tight">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChangePassword(true)}
                className="px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-900/30 transition-colors cursor-pointer"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-900/30 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
          <p className="text-lg text-gray-400">Welcome, {auth.user?.username}</p>
        </motion.div>

        {/* Add/Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-12"
        >
          <div className="glass glow-border rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editId ? "Edit Question" : "Add New Question"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Serial Number</label>
                  <input
                    name="serial"
                    type="number"
                    placeholder="Enter serial number"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={form.serial}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Question Title</label>
                  <input
                    name="title"
                    type="text"
                    placeholder="Enter question title"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={form.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Difficulty</label>
                  <select
                    name="difficulty"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={form.difficulty}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Topic</label>
                  <input
                    name="topic"
                    type="text"
                    placeholder="e.g., Array, Dynamic Programming"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={form.topic}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Question Link</label>
                  <input
                    name="questionlink"
                    type="url"
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={form.questionlink}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Solution Link (Optional)</label>
                <input
                  name="solutionlink"
                  type="url"
                  placeholder="https://github.com/username/solutions/..."
                  className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                  value={form.solutionlink}
                  onChange={handleChange}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-white/20 to-white/10 text-white font-medium hover:from-white/30 hover:to-white/20 border border-white/20 hover:border-white/30 transition-all duration-300 cursor-pointer"
                >
                  {editId ? "Update Question" : "Add Question"}
                </button>
                {editId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditId(null);
                      setForm({ serial: "", title: "", difficulty: "", topic: "", questionlink: "", solutionlink: "" });
                    }}
                    className="px-6 py-3 rounded-lg bg-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/70 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-300 cursor-pointer"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
              <div className="glass glow-border rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-white">Questions ({questions.length})</h2>
                  <div className="w-full sm:w-80">
                    <SearchInput
                      value={search}
                      onChange={setSearch}
                      placeholder="Search by title, topic, or serial..."
                    />
                  </div>
                </div>
                {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                <p className="mt-2 text-gray-400">Loading questions...</p>
              </div>
            ) : questions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No questions found. Add your first question above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {questions
                  .filter(q => {
                    if (!q || !q.title || !q.serial) return false;
                    const searchLower = search.toLowerCase();
                    return (
                      q.title.toLowerCase().includes(searchLower) ||
                      (q.topic && q.topic.toLowerCase().includes(searchLower)) ||
                      q.serial.toString().includes(searchLower)
                    );
                  })
                  .map((q) => (
                    <div key={q.serial} className="glass-dark rounded-lg p-4 border border-gray-600/30">
                      <div className="flex flex-col space-y-3">
                        {/* Header with serial and title */}
                        <div className="flex items-start gap-3">
                          <span className="px-2 py-1 text-xs font-mono bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded flex-shrink-0">
                            {q.serial}
                          </span>
                          <h3 className="text-white font-medium leading-tight flex-1">{q.title}</h3>
                        </div>
                        {/* Difficulty and topic */}
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            q.difficulty === 'Easy' ? 'bg-green-900/30 text-green-300 border border-green-500/30' :
                            q.difficulty === 'Medium' ? 'bg-yellow-900/30 text-yellow-300 border border-yellow-500/30' :
                            'bg-red-900/30 text-red-300 border border-red-500/30'
                          }`}>
                            {q.difficulty || 'Unknown'}
                          </span>
                          <span className="text-gray-400 text-xs">{q.topic || 'General'}</span>
                        </div>
                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <a
                            href={q.questionlink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-3 py-2 text-xs bg-blue-900/30 text-blue-300 border border-blue-500/30 rounded hover:bg-blue-900/50 transition-colors cursor-pointer text-center"
                          >
                            View
                          </a>
                          <button
                            onClick={() => {
                              setEditId(q.serial);
                              setForm({
                                serial: q.serial,
                                title: q.title || '',
                                difficulty: q.difficulty || '',
                                topic: q.topic || '',
                                questionlink: q.questionlink || '',
                                solutionlink: q.solutionlink || ''
                              });
                            }}
                            className="flex-1 px-3 py-2 text-xs bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded hover:bg-gray-700/70 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(q.serial)}
                            className="flex-1 px-3 py-2 text-xs bg-red-900/30 text-red-300 border border-red-500/30 rounded hover:bg-red-900/50 transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      </main>
      
      {/* Custom Modals */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
      
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="relative w-full max-w-md mx-auto"
          >
            <div className="glass glow-border rounded-2xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                
                {passwordError && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 text-red-300 text-sm">
                    {passwordError}
                  </div>
                )}
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
                      setPasswordError("");
                    }}
                    className="flex-1 px-4 py-3 rounded-lg bg-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/70 border border-gray-600/50 hover:border-gray-500/50 transition-all duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 rounded-lg bg-blue-900/30 text-blue-300 border border-blue-500/30 hover:bg-blue-900/50 font-medium transition-all duration-200 cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      <NotificationModal
        isOpen={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
    </>
  );
}