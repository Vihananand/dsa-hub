"use client";
import { motion } from "framer-motion";

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
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#B3B1B0" d="M22 14.355c0-.742-.564-1.346-1.26-1.346H10.676c-.696 0-1.26.604-1.26 1.346s.563 1.346 1.26 1.346H20.74c.696.001 1.26-.603 1.26-1.346z"/>
      <path fill="#E7A41F" d="m3.482 18.187 4.313 4.361c.973.979 2.318 1.452 3.803 1.452 1.485 0 2.83-.512 3.805-1.494l2.588-2.637c.51-.514.492-1.365-.039-1.9-.531-.535-1.375-.553-1.884-.039l-2.676 2.607c-.462.467-1.102.662-1.809.662s-1.346-.195-1.81-.662l-4.298-4.363c-.463-.467-.696-1.15-.696-1.863 0-.713.233-1.357.696-1.824l4.285-4.38c.463-.467 1.116-.645 1.822-.645s1.346.195 1.809.662l2.676 2.606c.51.515 1.354.497 1.885-.038.531-.536.549-1.387.039-1.901l-2.588-2.636a4.994 4.994 0 0 0-2.392-1.33l-.034-.007 2.447-2.503c.512-.514.494-1.366-.037-1.901-.531-.535-1.376-.552-1.887-.038l-10.018 10.1C2.509 11.458 2 12.813 2 14.311c0 1.498.509 2.896 1.482 3.876z"/>
      <path fill="#000000" stroke="#ffffff" strokeWidth="0.3" d="M8.115 22.814a2.109 2.109 0 0 1-.474-.361c-1.327-1.333-2.66-2.66-3.984-3.997-1.989-2.008-2.302-4.937-.786-7.32a6 6 0 0 1 .839-1.004L13.333.489c.625-.626 1.498-.652 2.079-.067.56.563.527 1.455-.078 2.066-.769.776-1.539 1.55-2.309 2.325-.041.122-.14.2-.225.287-.863.876-1.75 1.729-2.601 2.618-.111.116-.262.186-.372.305-1.423 1.423-2.863 2.83-4.266 4.272-1.135 1.167-1.097 2.938.068 4.127 1.308 1.336 2.639 2.65 3.961 3.974.067.067.136.132.204.198.468.303.474 1.25.183 1.671-.321.465-.74.75-1.333.728-.199-.006-.363-.086-.529-.179z"/>
    </svg>
  ),
  gfg: () => (
    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill="#43a047" d="M29.035,24C29.014,23.671,29,23.339,29,23c0-6.08,2.86-10,7-10c3.411,0,6.33,2.662,7,7l2,0l0.001-9	L43,11c0,0-0.533,1.506-1,1.16c-1.899-1.066-3.723-1.132-6.024-1.132C30.176,11.028,25,16.26,25,22.92	c0,0.364,0.021,0.723,0.049,1.08h-2.099C22.979,23.643,23,23.284,23,22.92c0-6.66-5.176-11.892-10.976-11.892	c-2.301,0-4.125,0.065-6.024,1.132C5.533,12.506,5,11,5,11l-2.001,0L3,20l2,0c0.67-4.338,3.589-7,7-7c4.14,0,7,3.92,7,10	c0,0.339-0.014,0.671-0.035,1H0v2h1.009c1.083,0,1.977,0.861,1.999,1.943C3.046,29.789,3.224,32.006,4,33c1.269,1.625,3,3,8,3	c5.022,0,9.92-4.527,11-10h2c1.08,5.473,5.978,10,11,10c5,0,6.731-1.375,8-3c0.776-0.994,0.954-3.211,0.992-5.057	C45.014,26.861,45.909,26,46.991,26H48v-2H29.035z M11.477,33.73C9.872,33.73,7.322,33.724,7,32	c-0.109-0.583-0.091-2.527-0.057-4.046C6.968,26.867,7.855,26,8.943,26H19C18.206,30.781,15.015,33.73,11.477,33.73z M41,32	c-0.322,1.724-2.872,1.73-4.477,1.73c-3.537,0-6.729-2.949-7.523-7.73h10.057c1.088,0,1.975,0.867,2,1.954	C41.091,29.473,41.109,31.417,41,32z"/>
    </svg>
  ),
  codingninjas: () => (
    <svg className="w-5 h-5" fill="#bc6d38" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg" stroke="#bc6d38">
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

  const platform = detectPlatform(question.questionlink);
  const PlatformLogo = platform ? PlatformLogos[platform] : null;

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
          <div className="flex items-start gap-3 flex-1 mr-3">
            {PlatformLogo && (
              <div className="mt-0.5 shrink-0" title={platform.charAt(0).toUpperCase() + platform.slice(1)}>
                <PlatformLogo />
              </div>
            )}
            <h3 className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors leading-tight flex-1">
              {question.title}
            </h3>
          </div>
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
        <div className="flex gap-3 mb-4 items-stretch">
          <motion.a
            href={question.questionlink}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white font-semibold px-4 py-2 rounded-xl text-sm text-center transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center"
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
              className="flex-1 border border-gray-500/50 hover:border-gray-400 text-gray-300 hover:text-white font-semibold px-4 py-2 rounded-xl text-sm text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-gray-800/30 cursor-pointer flex items-center justify-center"
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
