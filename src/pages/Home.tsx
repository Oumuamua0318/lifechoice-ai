import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HomeProps {
  userInput: {
    question: string;
    options: string[];
  };
  setUserInput: (input: {
    question: string;
    options: string[];
  }) => void;
  selectedTags: {
    basicInfo: Record<string, string>;
    self认知: string[];
    currentSituation: Record<string, any>;
    optionEvaluation: any[];
  };
  setSelectedTags: (tags: {
    basicInfo: Record<string, string>;
    self认知: string[];
    currentSituation: Record<string, any>;
    optionEvaluation: any[];
  }) => void;
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
}

export default function Home({ userInput, setUserInput, selectedTags, setSelectedTags, language, setLanguage }: HomeProps) {
  // 多语言文本
  const texts = {
    en: {
      title: "Build with the latest AI models for life decisions",
      subtitle: "Get your personalized analysis and integrate powerful AI insights into your decision-making in less than 3 minutes.",
      describeDilemma: "Describe your dilemma (max 50 characters)",
      placeholder: "e.g., Should I change jobs?",
      completeConfig: "Complete configuration",
      basicInfo: "Basic Information",
      personalityType: "Personality Type",
      selectAtLeastOne: "Select at least one",
      mbtiType: "MBTI Personality Type",
      discType: "DISC Personality Type",
      enneagram: "Enneagram",
      constellation: "Constellation",
      zodiac: "Chinese Zodiac",
      emotionalState: "Emotional State (1-10 points)",
      addCustom: "Add custom",
      decisionFactors: "Decision Factors (1-10 points)",
      customFactors: "Custom Factors",
      addFactor: "Add Factor",
      enterFactorName: "Enter custom factor name:",
      startAnalysis: "Start Analysis",
      personalizedAnalysis: "Personalized Analysis",
      aiPoweredDecisions: "AI-Powered Decisions",
      visualAnalytics: "Visual Analytics",
      personalizedDesc: "Get tailored insights based on your personality and situation",
      aiDesc: "Leverage advanced AI models for better life choices",
      visualDesc: "Comprehensive charts and detailed scenario simulations"
    },
    zh: {
      title: "用最新AI模型做出更好的人生决策",
      subtitle: "获得个性化分析，在3分钟内将强大的AI洞察融入你的决策过程。",
      describeDilemma: "描述你的困境（最多50字）",
      placeholder: "例如：我该不该换工作？",
      completeConfig: "完成选项配置",
      basicInfo: "基础信息",
      personalityType: "性格类型",
      selectAtLeastOne: "至少选一项",
      mbtiType: "MBTI 性格类型",
      discType: "DISC 性格类型",
      enneagram: "九型人格",
      constellation: "星座",
      zodiac: "生肖",
      emotionalState: "情绪状态 (1-10分)",
      addCustom: "添加自定义",
      decisionFactors: "决策因子 (1-10分)",
      customFactors: "自定义因素",
      addFactor: "添加因素",
      enterFactorName: "请输入自定义因素名称:",
      startAnalysis: "开始分析",
      personalizedAnalysis: "个性化分析",
      aiPoweredDecisions: "AI驱动决策",
      visualAnalytics: "可视化分析",
      personalizedDesc: "基于你的个性和情况获得量身定制的洞察",
      aiDesc: "利用先进的AI模型做出更好的人生选择",
      visualDesc: "全面的图表和详细的情景模拟"
    }
  };

  const [emotions, setEmotions] = useState([
    { label: language === 'en' ? 'Confused' : '迷茫', value: 5 },
    { label: language === 'en' ? 'Anxious' : '焦虑', value: 5 },
    { label: language === 'en' ? 'Hesitant' : '犹豫', value: 5 },
    { label: language === 'en' ? 'Confident' : '自信', value: 5 },
    { label: language === 'en' ? 'Excited' : '兴奋', value: 5 },
    { label: language === 'en' ? 'Calm' : '平静', value: 5 }
  ]);
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedAge, setSelectedAge] = useState('');
  const [selectedConstellation, setSelectedConstellation] = useState('');
  const [selectedZodiac, setSelectedZodiac] = useState('');
  const [customFactors, setCustomFactors] = useState<Array<{label: string, value: number}>>([]);
  const [decisionFactors, setDecisionFactors] = useState([
    { label: language === 'en' ? 'Urgency Level' : '急迫程度', value: 5 },
    { label: language === 'en' ? 'Expected Return' : '收益预期', value: 5 },
    { label: language === 'en' ? 'Skills Possessed' : '具备技能', value: 5 },
    { label: language === 'en' ? 'Family Resistance' : '家庭阻力', value: 5 },
    { label: language === 'en' ? 'Economic Pressure' : '经济压力', value: 5 }
  ]);
  const completedCount = (selectedAge ? 1 : 0) + (selectedGender ? 1 : 0);
  const navigate = useNavigate();


  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= 50) {
      setUserInput({
        ...userInput,
        question: e.target.value
      });
     }
  };



  const handleStartAnalysis = async () => {
    if (!userInput.question.trim()) {
      return;
    }
    
    // 保存用户输入的数据到selectedTags
    const tagsData = {
      ...selectedTags,
      basicInfo: {
        age: selectedAge,
        gender: selectedGender,
        constellation: selectedConstellation,
        zodiac: selectedZodiac
      },
      currentSituation: {
        emotions: emotions,
        decisionFactors: decisionFactors,
        customFactors: customFactors
      }
    };
    
    setSelectedTags(tagsData);
    
    navigate('/result');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
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
          <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors shadow-lg">
            {language === 'en' ? 'Get Started' : '开始使用'}
          </button>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 py-10">
        <div className="w-full max-w-2xl mx-auto">
          {/* 标题区域 */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-center text-white">
              {language === 'en' ? (
                <>Build with the latest <span className="text-blue-400">AI models</span> for life decisions</>
              ) : (
                <>用最新<span className="text-blue-400">AI模型</span>做出更好的人生决策</>
              )}
            </h2>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
              {texts[language].subtitle}
            </p>
          </div>

          {/* 输入卡片 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-10 border border-gray-700/50"
          >
            <div className="mb-6">
              <label className="block text-sm font-medium text-blue-400 mb-3">
                {texts[language].describeDilemma}
              </label>
              <div className="relative">
                <textarea
                  value={userInput.question}
                  onChange={handleQuestionChange}
                  placeholder={texts[language].placeholder}
                  className={cn(
                    "w-full px-4 py-4 rounded-xl border focus:ring-2 focus:border-blue-500 focus:ring-blue-500/20 transition-all outline-none resize-none bg-gray-700/50 border-gray-600 text-white placeholder-gray-400",
                    "h-32 text-base"
                   )}
                 />
                 <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {userInput.question.length}/50
                </div>
              </div>

            </div>


            <div className="mb-8">

             {/* 选项标签选择区域 */}
            <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl border border-gray-600/50 p-6 mb-6 shadow-lg">
              {/* 进度条 */}
               <div className="mb-6">
                 <div className="flex justify-between items-center mb-2">
                   <span className="text-sm font-medium text-blue-300">{texts[language].completeConfig}</span>
                   <span className="text-sm text-blue-400">{completedCount}/2</span>
                 </div>
                 <div className="w-full bg-gray-600 rounded-full h-2">
                   <div 
                     className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                     style={{ width: `${completedCount * 50}%` }}
                   ></div>
                 </div>
               </div>

              {/* 基础信息 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-300 mb-3">{texts[language].basicInfo}</h4>
                
                {/* 年龄段 */}
                <div className="mb-4">
                   <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                     {['18-25', '26-35', '36-45', '45-55', '55+'].map(age => (
                       <button
                         key={age}
                         className={`py-2 px-3 rounded-lg text-sm transition-all hover:scale-105 active:scale-95 ${
                           selectedAge === age
                             ? 'bg-blue-500 text-white border border-blue-500 shadow-lg'
                             : 'bg-gray-600 text-gray-300 border border-gray-500 hover:bg-gray-500'
                         }`}
                         onClick={() => setSelectedAge(age)}
                       >
                         {age}
                       </button>
                     ))}
                   </div>
                </div>
                
                  {/* 性别 */}
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      {['Male', 'Female'].map(gender => (
                        <button
                          key={gender}
                          className={`py-2 px-3 rounded-lg text-sm transition-all hover:scale-105 active:scale-95 ${
                            selectedGender === gender
                              ? 'bg-blue-500 text-white border border-blue-500 shadow-lg'
                              : 'bg-gray-600 text-gray-300 border border-gray-500 hover:bg-gray-500'
                          }`}
                          onClick={() => setSelectedGender(gender)}
                        >
                          {gender}
                        </button>
                      ))}
                    </div>
                  </div>
              </div>

              {/* 性格类型 */}
               <div className="mb-6">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-medium text-blue-300">{texts[language].personalityType}</h4>
                   <span className="text-xs text-gray-400">{texts[language].selectAtLeastOne}</span>
                 </div>
                
                {/* MBTI 下拉菜单 */}
                <div className="mb-4">
                  <label className="block text-xs text-blue-400 mb-2">{texts[language].mbtiType}</label>
                  <div className="relative">
                    <select className="w-full py-3 px-4 rounded-lg text-sm bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                      <option value="">{language === 'zh' ? '请选择' : 'Please select'}</option>
                      <option value="INTJ">INTJ - 建筑师</option>
                      <option value="INTP">INTP - 逻辑学家</option>
                      <option value="ENTJ">ENTJ - 指挥官</option>
                      <option value="ENTP">ENTP - 辩论家</option>
                      <option value="INFJ">INFJ - 提倡者</option>
                      <option value="INFP">INFP - 调停者</option>
                      <option value="ENFJ">ENFJ - 主人公</option>
                      <option value="ENFP">ENFP - 竞选者</option>
                      <option value="ISTJ">ISTJ - 物流师</option>
                      <option value="ISFJ">ISFJ - 守卫者</option>
                      <option value="ESTJ">ESTJ - 总经理</option>
                      <option value="ESFJ">ESFJ - 执政官</option>
                      <option value="ISTP">ISTP - 鉴赏家</option>
                      <option value="ISFP">ISFP - 艺术家</option>
                      <option value="ESTP">ESTP - 企业家</option>
                      <option value="ESFP">ESFP - 表演者</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="fa-solid fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                
                {/* DISC 下拉菜单 */}
                <div className="mb-4">
                  <label className="block text-xs text-blue-400 mb-2">{texts[language].discType}</label>
                  <div className="relative">
                    <select className="w-full py-3 px-4 rounded-lg text-sm bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                      <option value="">{language === 'zh' ? '请选择' : 'Please select'}</option>
                      <option value="D">支配型 (D)</option>
                      <option value="I">影响型 (I)</option>
                      <option value="S">稳健型 (S)</option>
                      <option value="C">谨慎型 (C)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <i className="fa-solid fa-chevron-down text-gray-400"></i>
                    </div>
                  </div>
                </div>
                
                {/* 九型人格 下拉菜单 */}
                <div>
                  <label className="block text-xs text-blue-400 mb-2">{texts[language].enneagram}</label>
                  <div className="relative">
                    <select className="w-full py-3 px-4 rounded-lg text-sm bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer">
                      <option value="">{language === 'zh' ? '请选择' : 'Please select'}</option>
                      <option value="1">1号 - 完美主义者</option>
                      <option value="2">2号 - 给予者</option>
                      <option value="3">3号 - 成就者</option>
                      <option value="4">4号 - 浪漫主义者</option>
                      <option value="5">5号 - 观察者</option>
                      <option value="6">6号 - 怀疑论者</option>
                      <option value="7">7号 - 享乐主义者</option>
                      <option value="8">8号 - 领导者</option>
                      <option value="9">9号 - 和平缔造者</option>
                     </select>
                     <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                       <i className="fa-solid fa-chevron-down text-gray-400"></i>
                     </div>
                   </div>
                 </div>

                  {/* 星座 */}
                  <div className="mb-4">
                    <label className="block text-xs text-blue-400 mb-2">{texts[language].constellation}</label>
                    <div className="relative">
                      <select 
                        value={selectedConstellation}
                        onChange={(e) => setSelectedConstellation(e.target.value)}
                        className="w-full py-3 px-4 rounded-lg text-sm bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">{language === 'zh' ? '请选择' : 'Please select'}</option>
                        {['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'].map(constellation => (
                          <option key={constellation} value={constellation}>{constellation}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i className="fa-solid fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>

                  {/* 生肖 */}
                  <div>
                    <label className="block text-xs text-blue-400 mb-2">{texts[language].zodiac}</label>
                    <div className="relative">
                      <select 
                        value={selectedZodiac}
                        onChange={(e) => setSelectedZodiac(e.target.value)}
                        className="w-full py-3 px-4 rounded-lg text-sm bg-gray-700 text-white border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none cursor-pointer"
                      >
                        <option value="">{language === 'zh' ? '请选择' : 'Please select'}</option>
                        {['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'].map(zodiac => (
                          <option key={zodiac} value={zodiac}>{zodiac}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <i className="fa-solid fa-chevron-down text-gray-400"></i>
                      </div>
                    </div>
                  </div>
               </div>

               {/* 情绪状态 */}
               <div className="mb-6">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-medium text-blue-300">{texts[language].emotionalState}</h4>
                   <button 
                     onClick={() => {
                       const customEmotion = prompt(language === 'zh' ? '请输入自定义情绪:' : 'Enter custom emotion:');
                       if (customEmotion && customEmotion.trim()) {
                         setEmotions([...emotions, { label: customEmotion.trim(), value: 5 }]);
                       }
                     }}
                     className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center"
                   >
                     <i className="fa-solid fa-plus-circle mr-1"></i> {texts[language].addCustom}
                   </button>
                 </div>
                 <div className="space-y-4">
                   {emotions.map((emotion, index) => (
                     <div key={index} className="group">
                       <div className="flex justify-between items-center mb-1">
                         <span className="text-sm text-blue-400">{emotion.label}</span>
                         <span className="text-sm font-medium text-blue-400">{emotion.value}</span>
                       </div>
                       <div className="relative">
                         <input
                           type="range"
                           min="1"
                           max="10"
                           value={emotion.value}
                           className={`w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer transition-all ${
                             index === 0 ? 'accent-indigo-500' :
                             index === 1 ? 'accent-orange-500' :
                             index === 2 ? 'accent-teal-500' :
                             index === 3 ? 'accent-emerald-500' :
                             index === 4 ? 'accent-pink-500' :
                             'accent-slate-500'
                           }`}
                           onChange={(e) => {
                             const newEmotions = [...emotions];
                             newEmotions[index].value = parseInt(e.target.value);
                             setEmotions(newEmotions);
                           }}
                         />
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

              {/* 决策因子 */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-blue-300 mb-3">{texts[language].decisionFactors}</h4>
                
                {/* 决策因子 */}
                <div className="mb-5">
                  <div className="space-y-4">
                     {decisionFactors.map((factor, index) => (
                       <div key={index}>
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm text-blue-400">{factor.label}</span>
                           <span className="text-sm font-medium text-blue-400">{factor.value}</span>
                         </div>
                         <div className="relative">
                           <input
                             type="range"
                             min="1"
                             max="10"
                             value={factor.value}
                             className={`w-full h-3 bg-gray-600 rounded-lg appearance-none cursor-pointer transition-all ${
                               index === 0 ? 'accent-emerald-500' :
                               index === 1 ? 'accent-violet-500' :
                               index === 2 ? 'accent-amber-500' :
                               index === 3 ? 'accent-rose-500' :
                               'accent-cyan-500'
                             }`}
                             onChange={(e) => {
                               const newFactors = [...decisionFactors];
                               newFactors[index].value = parseInt(e.target.value);
                               setDecisionFactors(newFactors);
                             }}
                           />
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
                
              </div>

               {/* 自定义因子 */}
               <div className="mt-6">
                 <div className="flex justify-between items-center mb-3">
                   <h4 className="text-sm font-medium text-blue-400">{texts[language].customFactors}</h4>
                   <button 
                     onClick={() => {
                       const factorName = prompt(texts[language].enterFactorName);
                       if (factorName && factorName.trim()) {
                         setCustomFactors([...customFactors, { 
                           label: factorName.trim(), 
                           value: 5 
                         }]);
                       }
                     }}
                     className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                   >
                     <i className="fa-solid fa-plus-circle mr-1"></i> {texts[language].addFactor}
                   </button>
                 </div>
                 
                 {customFactors.length > 0 && (
                   <div className="space-y-4 mt-3">
                     {customFactors.map((factor, index) => (
                       <div key={index}>
                         <div className="flex justify-between items-center mb-1">
                           <span className="text-sm text-gray-600 dark:text-gray-300">{factor.label}</span>
                           <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{factor.value}</span>
                         </div>
                         <input
                           type="range"
                           min="1"
                           max="10"value={factor.value}
                           className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                           onChange={(e) => {
                             const newFactors = [...customFactors];
                             newFactors[index].value = parseInt(e.target.value);
                             setCustomFactors(newFactors);
                           }}
                         />
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>
            </div>

             <button
               onClick={handleStartAnalysis}
               disabled={completedCount < 2}
               className={`w-full py-4 px-6 font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                 completedCount === 2
                   ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                   : 'bg-gray-600 text-gray-400 cursor-not-allowed'
               }`}
              >
               {texts[language].startAnalysis}
             </button>
          </motion.div>

          {/* 特性预览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            {[
              {
                icon: <i className="fa-solid fa-tags text-blue-400 text-xl"></i>,
                title: texts[language].personalizedAnalysis,
                description: texts[language].personalizedDesc
              },
              {
                icon: <i className="fa-solid fa-brain text-purple-400 text-xl"></i>,
                title: texts[language].aiPoweredDecisions,
                description: texts[language].aiDesc
              },
              {
                icon: <i className="fa-solid fa-chart-radar text-green-400 text-xl"></i>,
                title: texts[language].visualAnalytics,
                description: texts[language].visualDesc
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-gray-700/50"
              >
                <div className="mb-3">{feature.icon}</div>
                <h3 className="font-medium text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="py-6 px-6 sm:px-10 text-center text-sm text-gray-400">
        <p>LifeChoice AI © {new Date().getFullYear()} | {language === 'en' ? 'Powered by Advanced AI Models' : '由先进AI模型驱动'}</p>
      </footer>
    </div>
  );
}