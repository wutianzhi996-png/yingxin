'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Heart, Lightbulb, Target, Star, Code, Gamepad2, Shield, Palette } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'

// 兴趣发现问题
const INTEREST_QUESTIONS = [
  {
    id: 'apps',
    question: '你平时最喜欢用哪类APP？',
    icon: '📱',
    options: [
      { value: 'social', label: '微信、QQ等社交软件', career: 'frontend' },
      { value: 'game', label: '王者荣耀、原神等游戏', career: 'gamedev' },
      { value: 'video', label: '抖音、B站等视频软件', career: 'multimedia' },
      { value: 'tool', label: '支付宝、美团等工具软件', career: 'fullstack' },
    ]
  },
  {
    id: 'interests',
    question: '你对以下哪个最感兴趣？',
    icon: '🤔',
    options: [
      { value: 'ai', label: 'AI换脸、智能对话很神奇', career: 'ai' },
      { value: 'security', label: '黑客电影、网络安全很酷', career: 'security' },
      { value: 'design', label: '好看的界面、用户体验', career: 'frontend' },
      { value: 'data', label: '大数据分析、商业洞察', career: 'data' },
    ]
  },
  {
    id: 'preference',
    question: '你更喜欢做什么类型的工作？',
    icon: '💭',
    options: [
      { value: 'create', label: '创造用户能看到的产品', career: 'frontend' },
      { value: 'logic', label: '解决复杂的逻辑问题', career: 'backend' },
      { value: 'research', label: '研究前沿技术', career: 'ai' },
      { value: 'protect', label: '保护系统和数据安全', career: 'security' },
    ]
  }
]

// 职业场景化描述
const CAREER_SCENARIOS = {
  frontend: {
    title: '前端开发工程师',
    icon: <Palette className="w-8 h-8 text-blue-500" />,
    scenario: `小王每天早上到公司，打开VS Code，开始调试淘宝购物车的bug。
    他需要让页面在不同手机上都显示完美，确保千万用户能顺利下单购买心仪商品。
    当看到自己写的代码让用户体验更流畅时，他觉得特别有成就感。`,
    skills: ['HTML/CSS', 'JavaScript', 'React/Vue', 'UI设计'],
    salary: '8-30K'
  },
  backend: {
    title: '后端开发工程师',
    icon: <Code className="w-8 h-8 text-green-500" />,
    scenario: `小李专注于服务器端开发，每天处理海量数据请求。
    当双十一来临时，他要确保系统能承受亿万次的并发访问，
    让每一笔交易都能安全快速地完成。他是互联网世界的幕后英雄。`,
    skills: ['Java/Python', '数据库', '系统架构', '性能优化'],
    salary: '10-35K'
  },
  ai: {
    title: 'AI应用工程师',
    icon: <Lightbulb className="w-8 h-8 text-purple-500" />,
    scenario: `小张每天用AI技术开发各种实用应用。
    她用ChatGPT API开发智能客服系统，用计算机视觉做商品识别应用，
    用语音识别技术做会议记录工具。她不研究算法，而是用现成的AI能力解决实际问题，让技术真正服务于生活。`,
    skills: ['Python', 'AI API调用', 'Web开发', '产品思维'],
    salary: '15-50K'
  },
  gamedev: {
    title: '游戏开发工程师',
    icon: <Gamepad2 className="w-8 h-8 text-red-500" />,
    scenario: `小陈每天沉浸在游戏世界的创造中。
    他设计游戏玩法，优化游戏性能，让玩家在虚拟世界中获得快乐。
    当看到自己开发的游戏被千万玩家喜爱时，他感到无比自豪。`,
    skills: ['Unity/Unreal', 'C#/C++', '3D图形学', '游戏设计'],
    salary: '12-40K'
  },
  security: {
    title: '网络安全工程师',
    icon: <Shield className="w-8 h-8 text-orange-500" />,
    scenario: `小赵是数字世界的守护者，每天与黑客斗智斗勇。
    他建设防火墙，检测入侵，保护企业和用户的数据安全。
    在这个网络威胁日益严重的时代，他的工作至关重要。`,
    skills: ['网络协议', '渗透测试', '安全防护', '风险评估'],
    salary: '12-45K'
  },
  fullstack: {
    title: '全栈开发工程师',
    icon: <Target className="w-8 h-8 text-indigo-500" />,
    scenario: `小刘是技术全才，前端后端都精通。
    她独立开发完整的应用，从用户界面到数据库，
    一个人就能搭建整个产品。在创业公司中特别受欢迎。`,
    skills: ['前后端技术', '数据库', '系统设计', '项目管理'],
    salary: '15-40K'
  },
  multimedia: {
    title: '多媒体开发工程师',
    icon: <Star className="w-8 h-8 text-pink-500" />,
    scenario: `小周每天与视频、音频、图像打交道。
    她开发直播平台的推流技术，优化视频压缩算法，
    让用户能流畅观看4K视频。当看到技术让内容传播更精彩时，她很有成就感。`,
    skills: ['音视频编解码', 'WebRTC', '流媒体技术', '图像处理'],
    salary: '12-35K'
  },
  data: {
    title: '数据分析工程师',
    icon: <Lightbulb className="w-8 h-8 text-cyan-500" />,
    scenario: `小王每天从海量数据中挖掘商业价值。
    她分析用户行为数据，帮助产品团队优化功能设计，
    通过数据驱动决策，让公司业务增长50%。数据就是她的武器。`,
    skills: ['Python/R', 'SQL', '数据可视化', '统计分析'],
    salary: '10-30K'
  }
}

// 成长路径数据
const GROWTH_PATHS = {
  frontend: {
    year1: { title: '掌握基础', desc: '学习HTML、CSS、JavaScript，做简单的网页' },
    year2: { title: '框架入门', desc: '学习React/Vue框架，做个人博客网站' },
    year3: { title: '项目实战', desc: '参与真实项目，做电商小程序' },
    year4: { title: '毕业项目', desc: '独立开发完整的Web应用' },
    career: { title: '职场发展', desc: '高级前端 → 前端架构师 → 技术专家' }
  },
  backend: {
    year1: { title: '编程基础', desc: '学习Java/Python基础，掌握数据结构算法' },
    year2: { title: '框架学习', desc: '学习Spring/Django框架，做简单API' },
    year3: { title: '系统设计', desc: '学习分布式系统，参与大型项目开发' },
    year4: { title: '架构实践', desc: '设计高并发系统，完成毕业设计' },
    career: { title: '职场发展', desc: '后端工程师 → 系统架构师 → 技术总监' }
  },
  ai: {
    year1: { title: '编程基础', desc: '学习Python、Web开发基础，了解AI基本概念' },
    year2: { title: 'AI应用入门', desc: '学习调用OpenAI API、百度AI等，做聊天机器人' },
    year3: { title: '项目实战', desc: '开发AI应用产品，如智能问答、图像识别工具' },
    year4: { title: '产品开发', desc: '完整的AI应用产品开发，用户体验优化' },
    career: { title: '职场发展', desc: 'AI应用开发 → 产品经理 → AI产品总监' }
  },
  gamedev: {
    year1: { title: '基础入门', desc: '学习C#编程，Unity引擎基础操作' },
    year2: { title: '游戏开发', desc: '完成2D/3D小游戏，学习游戏设计理论' },
    year3: { title: '团队协作', desc: '参与Game Jam，与策划美术合作开发' },
    year4: { title: '商业项目', desc: '独立游戏发布，或参与大厂游戏开发' },
    career: { title: '职场发展', desc: '游戏程序员 → 主程序 → 游戏制作人' }
  },
  security: {
    year1: { title: '网络基础', desc: '学习计算机网络，Linux系统操作' },
    year2: { title: '安全技术', desc: '学习渗透测试，Web安全，密码学基础' },
    year3: { title: '实战演练', desc: '参加CTF竞赛，完成漏洞挖掘项目' },
    year4: { title: '专业认证', desc: '考取安全认证，安全公司实习' },
    career: { title: '职场发展', desc: '安全工程师 → 安全专家 → 首席安全官' }
  },
  fullstack: {
    year1: { title: '全栈基础', desc: '前端HTML/CSS/JS，后端Python/Node.js' },
    year2: { title: '框架掌握', desc: 'React+Express全栈开发，做完整应用' },
    year3: { title: '技术提升', desc: '学习云服务、DevOps，优化系统性能' },
    year4: { title: '产品思维', desc: '独立开发SaaS产品，掌握商业思维' },
    career: { title: '职场发展', desc: '全栈工程师 → 技术合伙人 → CTO' }
  },
  multimedia: {
    year1: { title: '基础学习', desc: '学习C++编程，音视频理论基础' },
    year2: { title: '技术入门', desc: '学习FFmpeg，做简单的视频处理工具' },
    year3: { title: '项目实战', desc: '参与直播平台开发，学习WebRTC技术' },
    year4: { title: '专业提升', desc: '音视频算法优化，多媒体系统架构设计' },
    career: { title: '职场发展', desc: '多媒体工程师 → 音视频专家 → 技术架构师' }
  },
  data: {
    year1: { title: '数据基础', desc: '学习Python、SQL，统计学基础知识' },
    year2: { title: '分析工具', desc: '掌握pandas、numpy，做数据清洗分析' },
    year3: { title: '机器学习', desc: '学习ML算法，参与数据挖掘项目' },
    year4: { title: '业务洞察', desc: '结合业务做数据产品，数据驱动决策' },
    career: { title: '职场发展', desc: '数据分析师 → 数据科学家 → 数据总监' }
  }
}

export function CareerSelectionStep() {
  const { stepData, updateStepData, nextStep, prevStep, isStepValid } = useStepStore()
  const [currentPhase, setCurrentPhase] = useState<'interest' | 'scenario' | 'path'>('interest')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [recommendedCareers, setRecommendedCareers] = useState<string[]>([])
  const [selectedCareerIndex, setSelectedCareerIndex] = useState(0)

  const handleAnswerSelect = (questionId: string, answer: string, careerType: string) => {
    const currentAnswers = answers[questionId] || []
    let newAnswers: string[]
    
    // 切换选择状态（支持多选）
    if (currentAnswers.includes(answer)) {
      newAnswers = currentAnswers.filter(a => a !== answer)
    } else {
      newAnswers = [...currentAnswers, answer]
    }
    
    setAnswers({ ...answers, [questionId]: newAnswers })
  }

  const handleQuestionComplete = () => {
    if (currentQuestion === INTEREST_QUESTIONS.length - 1) {
      // 分析所有答案并推荐多个职业
      const careerCounts: Record<string, number> = {}
      
      Object.entries(answers).forEach(([questionId, answerList]) => {
        answerList.forEach(ans => {
          const question = INTEREST_QUESTIONS.find(q => q.id === questionId)
          const option = question?.options.find(o => o.value === ans)
          if (option) {
            careerCounts[option.career] = (careerCounts[option.career] || 0) + 1
          }
        })
      })
      
      // 获取前3个推荐职业
      const sortedCareers = Object.entries(careerCounts)
        .sort(([,a], [,b]) => b - a)
        .map(([career]) => career)
      
      // 始终优先推荐AI应用工程师
      let finalRecommendations = ['ai']
      
      // 添加其他相关职业，去重
      sortedCareers.forEach(career => {
        if (career !== 'ai' && !finalRecommendations.includes(career)) {
          finalRecommendations.push(career)
        }
      })
      
      // 如果推荐少于3个，补充相关职业
      const fallbackCareers = ['frontend', 'backend', 'fullstack']
      fallbackCareers.forEach(career => {
        if (finalRecommendations.length < 3 && !finalRecommendations.includes(career)) {
          finalRecommendations.push(career)
        }
      })
      
      // 只保留前3个推荐
      finalRecommendations = finalRecommendations.slice(0, 3)
      
      // 确保所有推荐的职业都在场景描述中存在
      finalRecommendations = finalRecommendations.filter(career => 
        CAREER_SCENARIOS[career as keyof typeof CAREER_SCENARIOS]
      )
      
      if (finalRecommendations.length === 0) {
        finalRecommendations = ['ai', 'frontend']
      }
      
      setRecommendedCareers(finalRecommendations)
      updateStepData('idealCareer', CAREER_SCENARIOS[finalRecommendations[0] as keyof typeof CAREER_SCENARIOS].title)
      
      setTimeout(() => setCurrentPhase('scenario'), 1000)
    } else {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500)
    }
  }

  const canProceedToNext = () => {
    const currentAnswers = answers[INTEREST_QUESTIONS[currentQuestion].id] || []
    return currentAnswers.length > 0
  }

  const handleNext = () => {
    if (isStepValid(3)) {
      nextStep()
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {currentPhase === 'interest' ? '兴趣发现' : 
             currentPhase === 'scenario' ? '职业场景' : '成长路径'}
          </h2>
          <p className="text-gray-600">
            {currentPhase === 'interest' ? '通过几个简单问题，发现你的兴趣方向' : 
             currentPhase === 'scenario' ? '看看你未来可能的工作场景' : '了解从新生到专家的成长轨迹'}
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <AnimatePresence mode="wait">
            {/* 兴趣发现阶段 */}
            {currentPhase === 'interest' && (
              <motion.div
                key="interest"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="mb-8">
                  <div className="text-6xl mb-4">{INTEREST_QUESTIONS[currentQuestion].icon}</div>
                  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    {INTEREST_QUESTIONS[currentQuestion].question}
                  </h3>
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                      {INTEREST_QUESTIONS.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index <= currentQuestion ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 mb-6">
                  {INTEREST_QUESTIONS[currentQuestion].options.map((option, index) => {
                    const isSelected = (answers[INTEREST_QUESTIONS[currentQuestion].id] || []).includes(option.value)
                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAnswerSelect(
                          INTEREST_QUESTIONS[currentQuestion].id, 
                          option.value, 
                          option.career
                        )}
                        className={`p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 text-blue-700' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
                            isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                          }`}>
                            {isSelected && <span className="text-white text-xs">✓</span>}
                          </div>
                          <div className="font-medium text-gray-800">{option.label}</div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* 多选提示 */}
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 mb-4">
                    💡 可以选择多个选项哦！选择完成后点击下一题
                  </p>
                  <button
                    onClick={handleQuestionComplete}
                    disabled={!canProceedToNext()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {currentQuestion === INTEREST_QUESTIONS.length - 1 ? '完成测评' : '下一题'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* 职业场景展示阶段 */}
            {currentPhase === 'scenario' && recommendedCareers.length > 0 && (
              <motion.div
                key="scenario"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                    🎯 为你推荐 {recommendedCareers.length} 个职业方向
                  </h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800">
                      <span className="font-medium">特别推荐：AI应用工程师</span> - 用现成AI技术开发实用应用，最具发展潜力！
                    </p>
                  </div>
                </div>

                {/* 职业选择标签 */}
                <div className="flex justify-center mb-6">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {recommendedCareers.map((career, index) => (
                      <button
                        key={career}
                        onClick={() => setSelectedCareerIndex(index)}
                        className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                          selectedCareerIndex === index
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        {CAREER_SCENARIOS[career as keyof typeof CAREER_SCENARIOS].title}
                        {index === 0 && career === 'ai' && (
                          <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">推荐</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 当前选中职业的详情 */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCareerIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      const currentCareer = recommendedCareers[selectedCareerIndex]
                      const careerInfo = CAREER_SCENARIOS[currentCareer as keyof typeof CAREER_SCENARIOS]
                      
                      return (
                        <>
                          <div className="text-center mb-6">
                            <div className="flex justify-center mb-4">
                              {careerInfo.icon}
                            </div>
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">
                              {careerInfo.title}
                            </h4>
                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block text-sm">
                              推荐薪资: {careerInfo.salary}
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-6 mb-6">
                            <h5 className="font-semibold text-gray-800 mb-3">💼 一天的工作场景</h5>
                            <p className="text-gray-600 leading-relaxed">
                              {careerInfo.scenario}
                            </p>
                          </div>

                          <div className="mb-6">
                            <h5 className="font-semibold text-gray-800 mb-3">🛠️ 需要掌握的技能</h5>
                            <div className="flex flex-wrap gap-2">
                              {careerInfo.skills.map((skill, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      )
                    })()}
                  </motion.div>
                </AnimatePresence>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentPhase('path')}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    查看成长路径
                  </button>
                </div>
              </motion.div>
            )}

            {/* 成长路径展示阶段 */}
            {currentPhase === 'path' && recommendedCareers.length > 0 && (
              <motion.div
                key="path"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">🚀 你的成长轨迹</h3>
                  <p className="text-gray-600">选择职业方向，查看对应的成长路径</p>
                </div>

                {/* 职业选择标签 */}
                <div className="flex justify-center mb-8">
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    {recommendedCareers.map((career, index) => (
                      <button
                        key={career}
                        onClick={() => setSelectedCareerIndex(index)}
                        className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                          selectedCareerIndex === index
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600 hover:text-blue-600'
                        }`}
                      >
                        {CAREER_SCENARIOS[career as keyof typeof CAREER_SCENARIOS].title}
                        {index === 0 && career === 'ai' && (
                          <span className="ml-1 text-xs bg-red-500 text-white px-1 rounded">推荐</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* 当前选中职业的成长路径 */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCareerIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {(() => {
                      const currentCareer = recommendedCareers[selectedCareerIndex]
                      const growthPath = GROWTH_PATHS[currentCareer as keyof typeof GROWTH_PATHS]
                      
                      if (!growthPath) {
                        return (
                          <div className="text-center text-gray-500">
                            该职业的成长路径正在完善中...
                          </div>
                        )
                      }
                      
                      return (
                        <div className="space-y-6">
                          {Object.entries(growthPath).map(([key, value], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="flex items-start space-x-4"
                            >
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                  {index + 1}
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">{value.title}</h4>
                                <p className="text-gray-600 text-sm mt-1">{value.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )
                    })()}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 text-center">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800">
                      <Star className="w-5 h-5 inline mr-2" />
                      <span className="font-medium">太棒了！AI已经为你量身定制了成长规划</span>
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm">
                      💡 <strong>温馨提示：</strong>AI应用工程师专注于应用开发，不需要深入研究算法！
                      只要会调用AI API，结合Web开发技能，就能创造出各种实用的AI产品，门槛低但前景广阔！
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 操作按钮 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </button>

            {currentPhase === 'path' && (
              <button
                onClick={handleNext}
                className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                下一步
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}