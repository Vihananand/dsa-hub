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

export default function AdminDashboardClient({ initialQuestions }) {
  const [auth, setAuth] = useState(null);
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ serial: "", title: "", questionlink: "", topic: "", difficulty: "Easy" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(null); // null = checking, true = authenticated, false = not authenticated
  const [confirmModal, setConfirmModal] = useState({ show: false, item: null });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Add refs for auto-scroll functionality  
  const formRef = useRef(null);
  const router = useRouter();

  // Check authentication
  useEffect(() => {
    fetch("/api/admin/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          setIsAuth(false);
          router.push("/admin");
          return;
        }
        const authData = await res.json();
        setAuth(authData);
        setIsAuth(true);
      })
      .catch(() => {
        setIsAuth(false);
        router.push("/admin");
      });
  }, [router]);

  const scrollToForm = useCallback(() => {
    if (formRef.current) {
      // Using requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        formRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      });
    }
  }, []);

  const handleAddQuestion = async (data) => {
    try {
      setLoading(true);
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to add question");
      }

      const newQuestion = await response.json();
      setQuestions(prev => [...prev, newQuestion]);
      setFormData({ serial: "", title: "", questionlink: "", topic: "", difficulty: "Easy" });
      setShowForm(false);
      setNotification({ show: true, message: "Question added successfully!", type: "success" });
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleEditQuestion = async (serial, data) => {
    try {
      setLoading(true);
      const response = await fetch("/api/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ serial, ...data }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update question");
      }

      const updatedQuestion = await response.json();
      setQuestions(prev => prev.map(q => q.serial === serial ? updatedQuestion : q));
      setEditingItem(null);
      setFormData({ serial: "", title: "", questionlink: "", topic: "", difficulty: "Easy" });
      setShowForm(false);
      setNotification({ show: true, message: "Question updated successfully!", type: "success" });
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (serial) => {
    try {
      setLoading(true);
      const response = await fetch("/api/questions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ serial }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete question");
      }

      setQuestions(prev => prev.filter(q => q.serial !== serial));
      setConfirmModal({ show: false, item: null });
      setNotification({ show: true, message: "Question deleted successfully!", type: "success" });
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to change password");
      }

      setNotification({ show: true, message: "Password changed successfully!", type: "success" });
      setShowPasswordModal(false);
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { 
        method: "POST", 
        credentials: "include" 
      });
      setShowLogoutModal(false);
      router.push("/admin");
    } catch (error) {
      setShowLogoutModal(false);
      router.push("/admin");
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const validateForm = (data) => {
    const newErrors = {};
    if (!data.serial) newErrors.serial = "Serial is required";
    if (!data.title) newErrors.title = "Title is required";
    if (!data.questionlink) newErrors.questionlink = "Question link is required";
    if (!data.topic) newErrors.topic = "Topic is required";
    if (!data.difficulty) newErrors.difficulty = "Difficulty is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm(formData)) return;
    
    if (editingItem) {
      handleEditQuestion(editingItem.serial, formData);
    } else {
      handleAddQuestion(formData);
    }
  };

  const startEdit = (question) => {
    setEditingItem(question);
    setFormData({
      serial: question.serial,
      title: question.title,
      questionlink: question.questionlink,
      topic: question.topic,
      difficulty: question.difficulty
    });
    setShowForm(true);
    // Auto-scroll to form when editing
    setTimeout(scrollToForm, 100);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({ serial: "", title: "", questionlink: "", topic: "", difficulty: "Easy" });
    setShowForm(false);
    setErrors({});
  };

  const filteredQuestions = questions.filter(q =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.topic.toLowerCase().includes(search.toLowerCase()) ||
    q.difficulty.toLowerCase().includes(search.toLowerCase())
  );

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <p className="text-white text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (isAuth === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🚫</div>
          <p className="text-white text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Rest of the component JSX remains the same as original...
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              {auth && (
                <div className="text-sm text-gray-400">
                  Welcome, <span className="text-white font-medium">{auth.username}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                Total Questions: <span className="text-white font-bold">{questions.length}</span>
              </span>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
              >
                Change Password
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors hover:cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search and Add Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search questions..."
            className="w-full sm:max-w-md"
          />
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowForm(true);
              setTimeout(scrollToForm, 100);
            }}
            className="w-full sm:w-auto px-6 py-2 bg-[#E7A41F] hover:bg-[#d49419] text-white rounded-lg font-medium shadow-lg transition-all duration-200 hover:cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span>➕</span>
              Add New Question
            </span>
          </motion.button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            ref={formRef}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-8 glass glow-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                {editingItem ? "Edit Question" : "Add New Question"}
              </h2>
              <button
                onClick={cancelEdit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Serial Number *
                </label>
                <input
                  type="number"
                  value={formData.serial}
                  onChange={(e) => setFormData(prev => ({ ...prev, serial: e.target.value }))}
                  disabled={!!editingItem}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.serial ? 'border-red-500' : 'border-gray-600'
                  } ${editingItem ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter serial number"
                />
                {errors.serial && <p className="text-red-400 text-sm mt-1">{errors.serial}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Difficulty *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.difficulty ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                {errors.difficulty && <p className="text-red-400 text-sm mt-1">{errors.difficulty}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter question title"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Question Link *
                </label>
                <input
                  type="url"
                  value={formData.questionlink}
                  onChange={(e) => setFormData(prev => ({ ...prev, questionlink: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.questionlink ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter question URL"
                />
                {errors.questionlink && <p className="text-red-400 text-sm mt-1">{errors.questionlink}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topics * <span className="text-xs text-gray-400">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  className={`w-full px-3 py-2 bg-gray-800 border rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.topic ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="e.g., Array, Two Pointers, Dynamic Programming"
                />
                {errors.topic && <p className="text-red-400 text-sm mt-1">{errors.topic}</p>}
              </div>

              <div className="md:col-span-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#E7A41F] hover:bg-[#d49419] text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : (editingItem ? "Update Question" : "Add Question")}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Questions Table */}
        <div className="glass glow-border rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-gray-900/50 border-b border-gray-700">
            <h2 className="text-lg font-semibold text-white">
              Questions ({filteredQuestions.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Serial
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredQuestions.map((question, index) => {
                  const platform = detectPlatform(question.questionlink);
                  const PlatformLogo = platform ? PlatformLogos[platform] : null;

                  return (
                    <motion.tr
                      key={question.serial}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {question.serial}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-white">
                          {question.title}
                        </div>
                        <a
                          href={question.questionlink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate block max-w-xs"
                        >
                          {question.questionlink}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        {PlatformLogo ? (
                          <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded border border-white">
                              <PlatformLogo />
                            </div>
                            <span className="text-sm text-gray-300 capitalize">
                              {platform === 'gfg' ? 'GeeksforGeeks' : 
                               platform === 'codingninjas' ? 'Coding Ninjas' : 
                               platform}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unknown</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-300">
                          {question.topic}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800' :
                          question.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {question.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(question)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setConfirmModal({ show: true, item: question })}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {filteredQuestions.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <p className="text-gray-400">No questions found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass glow-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Confirm Logout</h2>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-300">
                Are you sure you want to logout? You will need to login again to access the admin dashboard.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="glass glow-border rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Change Password</h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordForm({ currentPassword: "", newPassword: "" });
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passwordForm.currentPassword && passwordForm.newPassword) {
                  handlePasswordChange(passwordForm.currentPassword, passwordForm.newPassword);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({ currentPassword: "", newPassword: "" });
                  }}
                  className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !passwordForm.currentPassword || !passwordForm.newPassword}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.show}
        onClose={() => setConfirmModal({ show: false, item: null })}
        onConfirm={() => handleDeleteQuestion(confirmModal.item?.serial)}
        title="Delete Question"
        message={`Are you sure you want to delete "${confirmModal.item?.title}"? This action cannot be undone.`}
        loading={loading}
      />

      <NotificationModal
        isOpen={notification.show}
        onClose={() => setNotification({ show: false, message: "", type: "" })}
        message={notification.message}
        type={notification.type}
      />
    </div>
  );
}
