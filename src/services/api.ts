// API服务配置
const API_CONFIG = {
  baseURL: 'https://api.siliconflow.cn/v1/chat/completions',
  model: 'Qwen/QwQ-32B',
  apiKey: 'sk-zvusdbvzwfohxwypmhhrxwmwjvldpnmgorceaxtfsdzewizd'
};

// API响应类型定义
interface APIResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
      reasoning_content?: string;
      tool_calls?: Array<{
        id: string;
        type: string;
        function: {
          name: string;
          arguments: string;
        };
      }>;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  created: number;
  model: string;
  object: string;
}

// 用户输入数据类型
interface UserInput {
  question: string;
  options: string[];
}

// 用户标签数据类型
interface SelectedTags {
  basicInfo: Record<string, string>;
  self认知: string[];
  currentSituation: Record<string, any>;
  optionEvaluation: any[];
}

// API调用函数
export async function callSiliconFlowAPI(messages: Array<{role: string, content: string}>): Promise<APIResponse> {
  try {
    const response = await fetch(API_CONFIG.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data: APIResponse = await response.json();
    return data;
  } catch (error) {
    console.error('API调用错误:', error);
    throw error;
  }
}

// 生成专家建议
export async function generateExpertRecommendation(userInput: UserInput, selectedTags: SelectedTags, language: 'en' | 'zh'): Promise<string> {
  const { basicInfo, currentSituation } = selectedTags;
  const age = basicInfo?.age || '';
  const gender = basicInfo?.gender || '';
  const emotions = currentSituation?.emotions || [];
  const decisionFactors = currentSituation?.decisionFactors || [];

  // 构建用户信息摘要
  const userInfo = `
用户问题: ${userInput.question}
年龄: ${age}
性别: ${gender}
情绪状态: ${emotions.map(e => `${e.label}: ${e.value}/10`).join(', ')}
决策因子: ${decisionFactors.map(f => `${f.label}: ${f.value}/10`).join(', ')}
`;

  const systemPrompt = language === 'zh' 
    ? `你是一位专业的心理咨询师和决策顾问。请基于用户的个人信息和情况，给出明确、专业的建议。建议应该：
1. 像真正的专家一样给出明确的建议（如"我认为你应该抓住这次机会"、"我建议你慎重对待"等）
2. 结合用户的具体情况进行分析
3. 语言要专业但易懂
4. 控制在150字以内`
    : `You are a professional psychologist and decision consultant. Based on the user's personal information and situation, provide clear, professional advice. The advice should:
1. Give clear recommendations like a real expert (e.g., "I believe you should seize this opportunity", "I recommend you approach this thoughtfully", etc.)
2. Analyze based on the user's specific situation
3. Use professional but understandable language
4. Keep within 150 words`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInfo }
  ];

  const response = await callSiliconFlowAPI(messages);
  return response.choices[0]?.message?.content || '无法生成建议，请稍后重试';
}

// 生成分析与发现
export async function generateAnalysisAndFindings(userInput: UserInput, selectedTags: SelectedTags, language: 'en' | 'zh'): Promise<{
  coreTraits: string;
  behaviorPatterns: string;
  emotionalPatterns: string;
  socialCharacteristics: string;
}> {
  const { basicInfo, currentSituation } = selectedTags;
  const emotions = currentSituation?.emotions || [];
  const decisionFactors = currentSituation?.decisionFactors || [];

  const userInfo = `
用户问题: ${userInput.question}
情绪状态: ${emotions.map(e => `${e.label}: ${e.value}/10`).join(', ')}
决策因子: ${decisionFactors.map(f => `${f.label}: ${f.value}/10`).join(', ')}
`;

  const systemPrompt = language === 'zh'
    ? `作为专业心理学家，请分析用户的性格特征。请分别从以下四个维度进行分析，每个维度控制在50字以内：
1. 核心特质剖析（外向性、神经质、开放性等）
2. 行为模式解读（决策风格、压力应对）
3. 情绪情感模式（情绪稳定性、表达与调节）
4. 人际互动特点（社交倾向、沟通模式）

请以JSON格式返回，格式如下：
{
  "coreTraits": "核心特质分析内容",
  "behaviorPatterns": "行为模式分析内容", 
  "emotionalPatterns": "情绪模式分析内容",
  "socialCharacteristics": "社交特点分析内容"
}`
    : `As a professional psychologist, please analyze the user's personality traits. Analyze from the following four dimensions, keeping each under 50 words:
1. Core Traits Analysis (extroversion, neuroticism, openness, etc.)
2. Behavior Patterns (decision-making style, stress response)
3. Emotional Patterns (emotional stability, expression and regulation)
4. Social Characteristics (social tendencies, communication patterns)

Please return in JSON format:
{
  "coreTraits": "core traits analysis content",
  "behaviorPatterns": "behavior patterns analysis content",
  "emotionalPatterns": "emotional patterns analysis content", 
  "socialCharacteristics": "social characteristics analysis content"
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInfo }
  ];

  const response = await callSiliconFlowAPI(messages);
  const content = response.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('解析分析结果失败:', error);
    // 返回默认内容
    return language === 'zh' 
      ? {
          coreTraits: "您的性格展现出良好的平衡性，在决策中表现出理性和情感的结合。",
          behaviorPatterns: "您采用系统化的决策方法，在压力下能够保持冷静和客观。",
          emotionalPatterns: "您的情绪调节能力良好，能够有效管理压力和焦虑情绪。",
          socialCharacteristics: "您具有良好的社交技能和沟通能力，善于与他人协作。"
        }
      : {
          coreTraits: "Your personality shows good balance, combining rationality and emotion in decision-making.",
          behaviorPatterns: "You use systematic decision-making methods and remain calm and objective under pressure.",
          emotionalPatterns: "Your emotional regulation is well-developed, effectively managing stress and anxiety.",
          socialCharacteristics: "You have good social skills and communication abilities, skilled at collaboration."
        };
  }
}

// 生成建议与展望
export async function generateAdviceAndOutlook(userInput: UserInput, selectedTags: SelectedTags, language: 'en' | 'zh'): Promise<{
  personalGrowth: string;
  interpersonalRelations: string;
  careerPlanning: string;
  mentalHealth: string;
}> {
  const { basicInfo, currentSituation } = selectedTags;
  const emotions = currentSituation?.emotions || [];
  const decisionFactors = currentSituation?.decisionFactors || [];

  const userInfo = `
用户问题: ${userInput.question}
年龄: ${basicInfo?.age || ''}
情绪状态: ${emotions.map(e => `${e.label}: ${e.value}/10`).join(', ')}
决策因子: ${decisionFactors.map(f => `${f.label}: ${f.value}/10`).join(', ')}
`;

  const systemPrompt = language === 'zh'
    ? `作为专业的人生规划师，请为用户提供四个维度的发展建议，每个建议控制在60字以内：
1. 个人发展（发挥优势、改善不足的具体策略）
2. 人际互动（改善沟通、处理关系的建议）
3. 职业规划（适合的职业方向与发展建议）
4. 心理健康维护（情绪调节、压力管理方法）

请以JSON格式返回：
{
  "personalGrowth": "个人发展建议",
  "interpersonalRelations": "人际互动建议",
  "careerPlanning": "职业规划建议", 
  "mentalHealth": "心理健康建议"
}`
    : `As a professional life planner, please provide development advice in four dimensions, keeping each under 60 words:
1. Personal Growth (strategies to leverage strengths and improve weaknesses)
2. Interpersonal Relations (advice on improving communication and relationships)
3. Career Planning (suitable career directions and development advice)
4. Mental Health (emotional regulation and stress management methods)

Please return in JSON format:
{
  "personalGrowth": "personal growth advice",
  "interpersonalRelations": "interpersonal relations advice",
  "careerPlanning": "career planning advice",
  "mentalHealth": "mental health advice"
}`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userInfo }
  ];

  const response = await callSiliconFlowAPI(messages);
  const content = response.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('解析建议结果失败:', error);
    // 返回默认内容
    return language === 'zh'
      ? {
          personalGrowth: "专注于发展你的分析优势，同时建立情商。练习正念技巧以增强决策清晰度。",
          interpersonalRelations: "利用你天生的沟通技巧建立更牢固的关系。练习积极倾听和同理心回应。",
          careerPlanning: "你的系统化方法适合分析领域的领导角色。考虑将战略思维与人员管理相结合。",
          mentalHealth: "通过定期反思和压力管理技巧保持情绪平衡。练习感恩日记，建立健康界限。"
        }
      : {
          personalGrowth: "Focus on developing your analytical strengths while building emotional intelligence. Practice mindfulness techniques.",
          interpersonalRelations: "Leverage your natural communication skills to build stronger relationships. Practice active listening.",
          careerPlanning: "Your systematic approach suits leadership roles in analytical fields. Consider strategic thinking with people management.",
          mentalHealth: "Maintain emotional balance through regular reflection and stress management techniques. Practice gratitude journaling."
        };
  }
}

// 计算综合评估分数
export function calculateComprehensiveScore(selectedTags: SelectedTags): number {
  const { currentSituation } = selectedTags;
  const emotions = currentSituation?.emotions || [];
  const decisionFactors = currentSituation?.decisionFactors || [];

  const confidence = emotions.find((e: any) => e.label === '自信' || e.label === 'Confident')?.value || 5;
  const anxiety = emotions.find((e: any) => e.label === '焦虑' || e.label === 'Anxious')?.value || 5;
  const urgency = decisionFactors.find((f: any) => f.label === '急迫程度' || f.label === 'Urgency Level')?.value || 5;
  const skillMatch = decisionFactors.find((f: any) => f.label === '具备技能' || f.label === 'Skills Possessed')?.value || 5;

  // 计算综合分数 (0-100)
  const emotionalStability = (10 - anxiety) * 8;
  const decisionReadiness = (confidence + skillMatch + urgency) * 6;
  
  const totalScore = Math.min(95, Math.max(20, Math.round((emotionalStability + decisionReadiness) / 3)));
  
  return totalScore;
}
