import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';
import { 
  generateExpertRecommendation, 
  generateAnalysisAndFindings, 
  generateAdviceAndOutlook,
  calculateComprehensiveScore 
} from '@/services/api';

interface ResultsProps {
  userInput: {
    question: string;
    options: string[];
  };
  selectedTags: {
    basicInfo: Record<string, string>;
    self认知: string[];
    currentSituation: Record<string, any>;
    optionEvaluation: any[];
  };
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
}

// 生成AI分析结果的函数
const generateAnalysisResults = (userInput: any, selectedTags: any, language: 'en' | 'zh') => {
  const { currentSituation } = selectedTags;
  
  const emotions = currentSituation?.emotions || [];
  const decisionFactors = currentSituation?.decisionFactors || [];

  // 计算匹配分数
  const emotionalStability = emotions.find((e: any) => e.label === '平静' || e.label === 'Calm')?.value || 5;
  const confidence = emotions.find((e: any) => e.label === '自信' || e.label === 'Confident')?.value || 5;
  const anxiety = emotions.find((e: any) => e.label === '焦虑' || e.label === 'Anxious')?.value || 5;
  const urgency = decisionFactors.find((f: any) => f.label === '急迫程度' || f.label === 'Urgency Level')?.value || 5;
  const skillMatch = decisionFactors.find((f: any) => f.label === '具备技能' || f.label === 'Skills Possessed')?.value || 5;

  const matchScore = Math.round((emotionalStability + confidence + skillMatch + urgency) * 2.5);

  // 生成雷达图数据
  const chartData = [
    { name: language === 'zh' ? '成功概率' : 'Success Rate', value: Math.min(95, matchScore + 10) },
    { name: language === 'zh' ? '风险控制' : 'Risk Control', value: Math.min(90, emotionalStability * 8 + 20) },
    { name: language === 'zh' ? '发展潜力' : 'Development Potential', value: Math.min(95, confidence * 8 + 15) },
    { name: language === 'zh' ? '适应能力' : 'Adaptability', value: Math.min(90, skillMatch * 7 + 25) },
    { name: language === 'zh' ? '执行力度' : 'Execution Power', value: Math.min(95, urgency * 8 + 10) },
    { name: language === 'zh' ? '心理准备' : 'Mental Preparation', value: Math.min(90, (10 - anxiety) * 7 + 20) },
  ];

  return {
    matchScore,
    chartData
  };
};

export default function Results({ userInput, selectedTags, language, setLanguage }: ResultsProps) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<null | 'like' | 'dislike'>(null);
  
  // API调用状态
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expertRecommendation, setExpertRecommendation] = useState<string>('');
  const [analysisFindings, setAnalysisFindings] = useState<{
    coreTraits: string;
    behaviorPatterns: string;
    emotionalPatterns: string;
    socialCharacteristics: string;
  }>({
    coreTraits: '',
    behaviorPatterns: '',
    emotionalPatterns: '',
    socialCharacteristics: ''
  });
  const [adviceOutlook, setAdviceOutlook] = useState<{
    personalGrowth: string;
    interpersonalRelations: string;
    careerPlanning: string;
    mentalHealth: string;
  }>({
    personalGrowth: '',
    interpersonalRelations: '',
    careerPlanning: '',
    mentalHealth: ''
  });
  
  // API调用逻辑
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // 并行调用所有API
        const [recommendation, findings, advice] = await Promise.all([
          generateExpertRecommendation(userInput, selectedTags, language),
          generateAnalysisAndFindings(userInput, selectedTags, language),
          generateAdviceAndOutlook(userInput, selectedTags, language)
        ]);
        
        setExpertRecommendation(recommendation);
        setAnalysisFindings(findings);
        setAdviceOutlook(advice);
        
      } catch (err) {
        console.error('API调用失败:', err);
        setError(language === 'zh' ? '分析生成失败，请稍后重试' : 'Analysis generation failed, please try again');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalysisData();
  }, [userInput, selectedTags, language]);
  
  // 多语言文本
  const texts = {
    en: {
      aiAnalysisResults: "AI Analysis Results",
      basedOnAnalysis: "Based on your situation analysis, here's your personalized recommendation",
      yourQuestion: "Your Question",
      expertRecommendation: "Expert Recommendation",
      analysisAndFindings: "Analysis & Findings",
      comprehensiveAssessment: "Comprehensive Assessment",
      adviceAndOutlook: "Advice & Outlook",
      personalGrowth: "Personal Growth",
      interpersonalRelations: "Interpersonal Relations",
      careerPlanning: "Career Planning",
      mentalHealth: "Mental Health",
      coreTraits: "Core Traits Analysis",
      behaviorPatterns: "Behavior Patterns",
      emotionalPatterns: "Emotional Patterns",
      socialCharacteristics: "Social Characteristics",
      helpful: "Helpful",
      notHelpful: "Not Helpful",
      startOver: "Start Over",
      restartAnalysis: "Restart Analysis",
      generatingRecommendation: "Generating expert recommendation...",
      analyzing: "Analyzing...",
      generating: "Generating..."
    },
    zh: {
      aiAnalysisResults: "AI分析结果",
      basedOnAnalysis: "基于你的情况分析，为你推荐最佳选择",
      yourQuestion: "你的问题",
      expertRecommendation: "专家建议",
      analysisAndFindings: "分析与发现",
      comprehensiveAssessment: "综合评估",
      adviceAndOutlook: "建议与展望",
      personalGrowth: "个人发展",
      interpersonalRelations: "人际互动",
      careerPlanning: "职业规划",
      mentalHealth: "心理健康维护",
      coreTraits: "核心特质剖析",
      behaviorPatterns: "行为模式解读",
      emotionalPatterns: "情绪情感模式",
      socialCharacteristics: "人际互动特点",
      helpful: "有帮助",
      notHelpful: "没帮助",
      startOver: "重新开始",
      restartAnalysis: "重新分析",
      generatingRecommendation: "正在生成专家建议...",
      analyzing: "分析中...",
      generating: "生成中..."
    }
  };
  
  // 计算综合评估分数
  const comprehensiveScore = calculateComprehensiveScore(selectedTags);
  
  // 生成分析结果（用于雷达图）
  const analysisResults = generateAnalysisResults(userInput, selectedTags, language);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* 顶部导航 */}
      <header className="py-6 px-6 sm:px-10 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">LC</span>
          </div>
          <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">LifeChoice AI</h1>
        </div>
        <div className="flex items-center space-x-4">
          {/* 语言切换开关 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">EN</span>
            <button
              onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                language === 'zh' ? 'bg-blue-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  language === 'zh' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm text-gray-300">中</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-lg"
          >
            {texts[language].startOver}
          </button>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 px-6 sm:px-10 py-10">
        <div className="max-w-4xl mx-auto">
          {/* 结果标题 */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">
              {texts[language].aiAnalysisResults}
            </h2>
            <p className="text-xl text-gray-300">
              {texts[language].basedOnAnalysis}
            </p>
          </div>

          {/* 问题回顾 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-4">{texts[language].yourQuestion}</h3>
            <p className="text-gray-300 text-lg">{userInput.question}</p>
          </motion.div>

          {/* 专家建议 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 backdrop-blur-sm rounded-2xl shadow-2xl p-8 mb-8 border border-blue-500/30"
          >
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                <i className="fa-solid fa-lightbulb text-white text-xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-blue-400">
                {texts[language].expertRecommendation}
              </h3>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-600/50">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <span className="ml-3 text-gray-300">{texts[language].generatingRecommendation}</span>
                </div>
              ) : error ? (
                <p className="text-red-400 text-lg">{error}</p>
              ) : (
                <p className="text-gray-300 text-lg leading-relaxed">
                  {expertRecommendation}
                </p>
              )}
            </div>
          </motion.div>

          {/* 分析与发现 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-6">{texts[language].analysisAndFindings}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
                <h4 className="font-semibold text-emerald-400 mb-3 flex items-center">
                  <i className="fa-solid fa-user-check mr-2"></i>
                  {texts[language].coreTraits}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].analyzing}</span>
                  ) : (
                    analysisFindings.coreTraits || (language === 'zh' 
                      ? "你的性格展现出强烈的外向特质，对新体验保持高度开放性。在决策过程中表现出优秀的情緒稳定性和责任心。"
                      : "Your personality shows strong extroversion traits with high openness to new experiences. You demonstrate excellent emotional stability and conscientiousness in decision-making processes.")
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
                <h4 className="font-semibold text-violet-400 mb-3 flex items-center">
                  <i className="fa-solid fa-brain mr-2"></i>
                  {texts[language].behaviorPatterns}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].analyzing}</span>
                  ) : (
                    analysisFindings.behaviorPatterns || (language === 'en'
                      ? "You exhibit analytical decision-making style with systematic approach to problem-solving. Under pressure, you maintain composure and rely on logical reasoning."
                      : "你展现出分析型决策风格，采用系统化的问题解决方法。在压力下能够保持冷静，依赖逻辑推理。")
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
                <h4 className="font-semibold text-amber-400 mb-3 flex items-center">
                  <i className="fa-solid fa-heart mr-2"></i>
                  {texts[language].emotionalPatterns}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].analyzing}</span>
                  ) : (
                    analysisFindings.emotionalPatterns || (language === 'en'
                      ? "Your emotional regulation is well-developed with balanced expression patterns. You show healthy stress response mechanisms and positive emotional resilience."
                      : "你的情绪调节能力发展良好，表达模式平衡。展现出健康的压力反应机制和积极的情绪韧性。")
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl p-4 border border-rose-500/20">
                <h4 className="font-semibold text-rose-400 mb-3 flex items-center">
                  <i className="fa-solid fa-users mr-2"></i>
                  {texts[language].socialCharacteristics}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].analyzing}</span>
                  ) : (
                    analysisFindings.socialCharacteristics || (language === 'en'
                      ? "You demonstrate strong social skills with effective communication patterns. Your collaborative approach and empathy make you a valuable team member."
                      : "你展现出强大的社交技能和有效的沟通模式。你的协作方法和同理心使你成为团队中的宝贵成员。")
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 综合评估 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-blue-400">{texts[language].comprehensiveAssessment}</h3>
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full px-6 py-2">
                <span className="text-white font-bold text-lg">{comprehensiveScore}</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analysisResults.chartData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                  <Radar
                    name={language === 'en' ? 'Overall Score' : '综合评分'}
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.3}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* 建议与展望 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-8 border border-gray-700/50"
          >
            <h3 className="text-xl font-semibold text-blue-400 mb-6">{texts[language].adviceAndOutlook}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
                <h4 className="font-semibold text-emerald-400 mb-3 flex items-center">
                  <i className="fa-solid fa-user mr-2"></i>
                  {texts[language].personalGrowth}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].generating}</span>
                  ) : (
                    adviceOutlook.personalGrowth || (language === 'en'
                      ? "Focus on developing your analytical strengths while building emotional intelligence. Practice mindfulness techniques to enhance decision-making clarity and reduce stress responses."
                      : "专注于发展你的分析优势，同时建立情商。练习正念技巧以增强决策清晰度，减少压力反应。")
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
                <h4 className="font-semibold text-violet-400 mb-3 flex items-center">
                  <i className="fa-solid fa-users mr-2"></i>
                  {texts[language].interpersonalRelations}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].generating}</span>
                  ) : (
                    adviceOutlook.interpersonalRelations || (language === 'en'
                      ? "Leverage your natural communication skills to build stronger relationships. Practice active listening and empathetic responses to improve team dynamics and family connections."
                      : "利用你天生的沟通技巧建立更牢固的关系。练习积极倾听和同理心回应，改善团队动态和家庭关系。")
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20">
                <h4 className="font-semibold text-amber-400 mb-3 flex items-center">
                  <i className="fa-solid fa-briefcase mr-2"></i>
                  {texts[language].careerPlanning}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].generating}</span>
                  ) : (
                    adviceOutlook.careerPlanning || (language === 'en'
                      ? "Your systematic approach suits leadership roles in analytical fields. Consider roles that combine strategic thinking with people management to maximize your potential."
                      : "你的系统化方法适合分析领域的领导角色。考虑将战略思维与人员管理相结合的角色，以最大化你的潜力。")
                  )}
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl p-4 border border-rose-500/20">
                <h4 className="font-semibold text-rose-400 mb-3 flex items-center">
                  <i className="fa-solid fa-heart mr-2"></i>
                  {texts[language].mentalHealth}
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {isLoading ? (
                    <span className="text-gray-500">{texts[language].generating}</span>
                  ) : (
                    adviceOutlook.mentalHealth || (language === 'en'
                      ? "Maintain your emotional balance through regular reflection and stress management techniques. Practice gratitude journaling and establish healthy boundaries in professional relationships."
                      : "通过定期反思和压力管理技巧保持情绪平衡。练习感恩日记，在职业关系中建立健康的界限。")
                  )}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 反馈按钮 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-gray-300 mb-4">
              {language === 'en' ? 'Was this advice helpful?' : '这个建议对你有帮助吗？'}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setFeedback('like')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  feedback === 'like'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                <i className="fa-solid fa-thumbs-up mr-2"></i>
                {texts[language].helpful}
              </button>
              <button
                onClick={() => setFeedback('dislike')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  feedback === 'dislike'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                }`}
              >
                <i className="fa-solid fa-thumbs-down mr-2"></i>
                {texts[language].notHelpful}
              </button>
            </div>
          </motion.div>

          {/* 重新开始按钮 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              <i className="fa-solid fa-redo mr-2"></i>
              {texts[language].restartAnalysis}
            </button>
          </motion.div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="py-6 px-6 sm:px-10 text-center text-sm text-gray-400">
        <p>LifeChoice AI © {new Date().getFullYear()} | {language === 'en' ? 'Powered by Advanced AI Models' : '由先进AI模型驱动'}</p>
      </footer>
    </div>
  );
}