import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import { useState } from "react";
import { AuthContext } from '@/contexts/authContext';
import { motion } from "framer-motion";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<'en' | 'zh'>('en');
  const [userInput, setUserInput] = useState({
    question: "",
    options: ["", ""]
  });
  const [selectedTags, setSelectedTags] = useState({
    basicInfo: {} as Record<string, string>,
    self认知: [] as string[],
    currentSituation: {} as Record<string, any>,
    optionEvaluation: [] as any[]
  });

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, logout }}
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen text-white"
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                userInput={userInput} 
                setUserInput={setUserInput}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                language={language}
                setLanguage={setLanguage}
              />
            } 
          />
          <Route 
            path="/result" 
            element={
              <Results 
                userInput={userInput}
                selectedTags={selectedTags}
                language={language}
                setLanguage={setLanguage}
              />
            } 
          />
        </Routes>
      </motion.div>
    </AuthContext.Provider>
  );
}
