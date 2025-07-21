"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { SearchInput } from "../../../components/ui";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ConfirmModal, NotificationModal } from "../../../components/modal";

// Platform detection function
const detectPlatform = (questionLink) => {
  if (!questionLink) return null;
  const url = questionLink.toLowerCase();
  
  if (url.includes('leetcode.com')) return 'leetcode';
  if (url.includes('geeksforgeeks.org') || url.includes('gfg.org')) return 'gfg';
  if (url.includes('codingninjas.com') || url.includes('codingninjas.in') || url.includes('naukri.com/code360')) return 'codingninjas';
  
  return null;
};

// Platform logo components
const PlatformLogos = {
  leetcode: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
      <path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
      <path fill="#000000" stroke="#ffffff" strokeWidth="0.3" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"/>
    </svg>
  ),
  gfg: () => (
    <svg className="w-4 h-4" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#43a047" d="M29.035,24C29.014,23.671,29,23.339,29,23c0-6.08,2.86-10,7-10c3.411,0,6.33,2.662,7,7l2,0l0.001-9	L43,11c0,0-0.533,1.506-1,1.16c-1.899-1.066-3.723-1.132-6.024-1.132C30.176,11.028,25,16.26,25,22.92	c0,0.364,0.021,0.723,0.049,1.08h-2.099C22.979,23.643,23,23.284,23,22.92c0-6.66-5.176-11.892-10.976-11.892	c-2.301,0-4.125,0.065-6.024,1.132C5.533,12.506,5,11,5,11l-2.001,0L3,20l2,0c0.67-4.338,3.589-7,7-7c4.14,0,7,3.92,7,10	c0,0.339-0.014,0.671-0.035,1H0v2h1.009c1.083,0,1.977,0.861,1.999,1.943C3.046,29.789,3.224,32.006,4,33c1.269,1.625,3,3,8,3	c5.022,0,9.92-4.527,11-10h2c1.08,5.473,5.978,10,11,10c5,0,6.731-1.375,8-3c0.776-0.994,0.954-3.211,0.992-5.057	C45.014,26.861,45.909,26,46.991,26H48v-2H29.035z M11.477,33.73C9.872,33.73,7.322,33.724,7,32	c-0.109-0.583-0.091-2.527-0.057-4.046C6.968,26.867,7.855,26,8.943,26H19C18.206,30.781,15.015,33.73,11.477,33.73z M41,32	c-0.322,1.724-2.872,1.73-4.477,1.73c-3.537,0-6.729-2.949-7.523-7.73h10.057c1.088,0,1.975,0.867,2,1.954	C41.091,29.473,41.109,31.417,41,32z"/>
    </svg>
  ),
  codingninjas: () => (
    <svg className="w-4 h-4" fill="#bc6d38" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" stroke="#bc6d38">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#f7f7f7" strokeWidth="1.92">
        <path d="M23.198 0c-.499.264-1.209.675-1.79.984a542.82 542.82 0 0 0 0 6.242c.995-.526 1.761-.834 1.79-2.066V0zM8.743.181C7.298.144 5.613.65 4.47 1.414c-1.17.8-1.987 1.869-2.572 3.179A16.787 16.787 0 0 0 .9 8.87c-.15 1.483-.128 3.079.025 4.677.27 1.855.601 3.724 1.616 5.456 1.57 2.62 4.313 4.109 7.262 4.19 3.41.246 7.233.53 11.411.807.022-2.005.01-5.418 0-6.25-3.206-.21-7.398-.524-11.047-.782-.443-.043-.896-.056-1.324-.172-1.086-.295-1.806-.802-2.374-1.757-.643-1.107-.875-2.832-.797-4.294.11-1.27.287-2.41 1.244-3.44.669-.56 1.307-.758 2.161-.84 5.17.345 7.609.53 12.137.858.032-1.133.01-3.46 0-6.229C16.561.752 12.776.474 8.743.181zm-.281 9.7c.174.675.338 1.305.729 1.903.537.832 1.375 1.127 2.388.877.76-.196 1.581-.645 2.35-1.282zm12.974 1.04-5.447.689c.799.739 1.552 1.368 2.548 1.703.988.319 1.78.01 2.308-.777.209-.329.56-1.148.591-1.614zm.842 6.461c-.388.01-.665.198-.87.355.002 1.798 0 4.127 0 6.223.586-.297 1.135-.644 1.793-.998-.005-1.454.002-3.137-.005-4.707a.904.904 0 0 0-.917-.873z"></path>
      </g>
      <g id="SVGRepo_iconCarrier">
        <path d="M23.198 0c-.499.264-1.209.675-1.79.984a542.82 542.82 0 0 0 0 6.242c.995-.526 1.761-.834 1.79-2.066V0zM8.743.181C7.298.144 5.613.65 4.47 1.414c-1.17.8-1.987 1.869-2.572 3.179A16.787 16.787 0 0 0 .9 8.87c-.15 1.483-.128 3.079.025 4.677.27 1.855.601 3.724 1.616 5.456 1.57 2.62 4.313 4.109 7.262 4.19 3.41.246 7.233.53 11.411.807.022-2.005.01-5.418 0-6.25-3.206-.21-7.398-.524-11.047-.782-.443-.043-.896-.056-1.324-.172-1.086-.295-1.806-.802-2.374-1.757-.643-1.107-.875-2.832-.797-4.294.11-1.27.287-2.41 1.244-3.44.669-.56 1.307-.758 2.161-.84 5.17.345 7.609.53 12.137.858.032-1.133.01-3.46 0-6.229C16.561.752 12.776.474 8.743.181zm-.281 9.7c.174.675.338 1.305.729 1.903.537.832 1.375 1.127 2.388.877.76-.196 1.581-.645 2.35-1.282zm12.974 1.04-5.447.689c.799.739 1.552 1.368 2.548 1.703.988.319 1.78.01 2.308-.777.209-.329.56-1.148.591-1.614zm.842 6.461c-.388.01-.665.198-.87.355.002 1.798 0 4.127 0 6.223.586-.297 1.135-.644 1.793-.998-.005-1.454.002-3.137-.005-4.707a.904.904 0 0 0-.917-.873z"></path>
      </g>
    </svg>
  )
};

export default function AdminDashboard() {
  const [auth, setAuth] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ serial: "1", title: "", difficulty: "", topic: "", questionlink: "", solutionlink: "" });
  const [editId, setEditId] = useState(null);
  const [nextSerial, setNextSerial] = useState("1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState({ show: false, title: "", message: "", type: "success" });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const formRef = useRef(null);
  const router = useRouter();

  const fetchQuestions = useCallback(() => {
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
        
        // Calculate next serial number
        const maxSerial = validQuestions.length > 0 
          ? Math.max(...validQuestions.map(q => parseInt(q.serial) || 0))
          : 0;
        const nextSerialNumber = maxSerial + 1;
        setNextSerial(nextSerialNumber.toString());
        
        // Set next serial in form if not editing
        if (!editId) {
          setForm(prevForm => ({ ...prevForm, serial: nextSerialNumber.toString() }));
        }
        
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
  }, [editId]);

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
  }, [router, fetchQuestions]);

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

      setForm({ serial: nextSerial || "1", title: "", difficulty: "", topic: "", questionlink: "", solutionlink: "" });
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
          ref={formRef}
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
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Serial Number {!editId && "(Auto-generated)"}
                  </label>
                  <input
                    name="serial"
                    type="number"
                    placeholder={!editId ? `Next: ${nextSerial}` : "Enter serial number"}
                    className={`w-full px-4 py-3 rounded-lg glass-dark border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300 ${!editId ? 'bg-gray-800/50 cursor-not-allowed' : ''}`}
                    value={form.serial}
                    onChange={handleChange}
                    required
                    min="1"
                    readOnly={!editId}
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
                      setForm({ serial: nextSerial || "1", title: "", difficulty: "", topic: "", questionlink: "", solutionlink: "" });
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
                  .map((q) => {
                    const platform = detectPlatform(q.questionlink);
                    const PlatformLogo = platform ? PlatformLogos[platform] : null;
                    
                    return (
                    <div key={q.serial} className="glass-dark rounded-lg p-4 border border-gray-600/30">
                      <div className="flex flex-col space-y-3">
                        {/* Header with serial, platform logo and title */}
                        <div className="flex items-start gap-3">
                          <span className="px-2 py-1 text-xs font-mono bg-gray-700/50 text-gray-300 border border-gray-600/50 rounded flex-shrink-0">
                            {q.serial}
                          </span>
                          {PlatformLogo && (
                            <div className="mt-1 flex-shrink-0" title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                              <PlatformLogo />
                            </div>
                          )}
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
                              // Auto-scroll to form with requestAnimationFrame for better timing
                              requestAnimationFrame(() => {
                                setTimeout(() => {
                                  if (formRef.current) {
                                    formRef.current.scrollIntoView({ 
                                      behavior: 'smooth', 
                                      block: 'start',
                                      inline: 'nearest'
                                    });
                                  } else {
                                    // Fallback to window.scrollTo
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }
                                }, 50);
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
                    );
                  })}
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