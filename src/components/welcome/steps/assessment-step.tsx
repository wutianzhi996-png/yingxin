'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft, Code, BookOpen, Bot, Users, Heart } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'

// 编程潜力评估问题
const PROGRAMMING_ASSESSMENT = [
  {
    id: 'coding_experience',
    title: '编程经验',
    icon: <Code className="w-6 h-6 text-blue-500" />,
    question: '你有任何编程经验吗？',
    options: [
      { value: 'none', label: '完全没有接触过编程', score: 1 },
      { value: 'scratch', label: '玩过Scratch或类似的图形化编程', score: 3 },
      { value: 'basic', label: '学过一点Python、C++等语言基础', score: 5 },
      { value: 'projects', label: '做过一些小项目或练习题', score: 7 },
      { value: 'advanced', label: '参加过编程竞赛或有完整项目经验', score: 9 }
    ]
  },
  {
    id: 'logical_thinking',
    title: '逻辑思维',
    icon: <BookOpen className="w-6 h-6 text-green-500" />,
    question: '你喜欢逻辑思维比较强的内容吗？',
    options: [
      { value: 'dislike', label: '不太喜欢，觉得烧脑', score: 1 },
      { value: 'ok', label: '还可以，偶尔接触', score: 3 },
      { value: 'like', label: '比较喜欢推理小说、数学题等', score: 5 },
      { value: 'love', label: '很喜欢解密游戏、逻辑推理', score: 7 },
      { value: 'expert', label: '热爱数学竞赛、编程解题等挑战', score: 9 }
    ]
  },
  {
    id: 'ai_experience',
    title: 'AI接触经验',
    icon: <Bot className="w-6 h-6 text-purple-500" />,
    question: '你接触过大模型（如ChatGPT、文心一言等）吗？',
    options: [
      { value: 'never', label: '从来没用过', score: 1 },
      { value: 'heard', label: '听说过但没怎么用', score: 3 },
      { value: 'basic', label: '偶尔用来回答问题', score: 5 },
      { value: 'frequent', label: '经常使用，会写提示词', score: 7 },
      { value: 'advanced', label: '深度使用，了解各种AI工具', score: 9 }
    ]
  },
  {
    id: 'family_background',
    title: '家庭环境',
    icon: <Users className="w-6 h-6 text-orange-500" />,
    question: '你的亲戚朋友中有从事软件开发的人吗？',
    options: [
      { value: 'none', label: '没有，对这个行业不太了解', score: 1 },
      { value: 'distant', label: '有远房亲戚，但接触不多', score: 3 },
      { value: 'some', label: '有一些朋友或表亲在做开发', score: 5 },
      { value: 'close', label: '有比较亲近的人在软件行业', score: 7 },
      { value: 'family', label: '父母或兄弟姐妹就是程序员', score: 9 }
    ]
  },
  {
    id: 'major_interest',
    title: '专业兴趣',
    icon: <Heart className="w-6 h-6 text-red-500" />,
    question: '你选择软件工程专业是因为？',
    options: [
      { value: 'assigned', label: '被调剂的，不是我的第一志愿', score: 1 },
      { value: 'family', label: '家人建议的，我自己不太了解', score: 3 },
      { value: 'practical', label: '觉得就业前景好，比较实用', score: 5 },
      { value: 'interested', label: '对编程和技术比较感兴趣', score: 7 },
      { value: 'passionate', label: '非常喜欢，这就是我的第一选择', score: 9 }
    ]
  }
]

export function AssessmentStep() {
  const { stepData, updateStepData, nextStep, prevStep, isStepValid } = useStepStore()

  const handleAnswerSelect = (questionId: string, value: string, score: number) => {
    const currentAssessment = stepData.skillsAssessment || {}
    updateStepData('skillsAssessment', {
      ...currentAssessment,
      [questionId]: { value, score }
    })
  }

  const getSelectedValue = (questionId: string) => {
    return stepData.skillsAssessment?.[questionId]?.value
  }

  const calculateTotalScore = () => {
    if (!stepData.skillsAssessment) return 90
    const rawScore = Object.values(stepData.skillsAssessment).reduce((total: number, assessment: any) => {
      return total + (assessment.score || 0)
    }, 0)
    // 将原始分数(5-45)转换为90-100分制
    return Math.round(90 + (rawScore - 5) * 10 / 40)
  }

  const getPersonalizedAdvice = () => {
    if (!stepData.skillsAssessment) return null
    
    const assessmentData = stepData.skillsAssessment
    const score = calculateTotalScore()
    
    // 分析各维度强弱项
    const strengths = []
    const improvements = []
    const suggestions = []
    
    // 编程经验分析
    const codingExp = assessmentData.coding_experience?.score || 1
    if (codingExp >= 7) {
      strengths.push('编程实践经验丰富')
    } else if (codingExp <= 3) {
      improvements.push('编程实践经验')
      suggestions.push('建议从Python或Scratch开始，多动手练习基础语法')
    }
    
    // 逻辑思维分析
    const logicalThinking = assessmentData.logical_thinking?.score || 1
    if (logicalThinking >= 7) {
      strengths.push('逻辑思维能力突出')
    } else if (logicalThinking <= 3) {
      improvements.push('逻辑思维能力')
      suggestions.push('可以多做数学题、逻辑推理游戏来训练思维')
    }
    
    // AI接触经验
    const aiExp = assessmentData.ai_experience?.score || 1
    if (aiExp >= 7) {
      strengths.push('AI工具使用经验丰富')
    } else if (aiExp <= 3) {
      improvements.push('AI工具使用')
      suggestions.push('建议多使用ChatGPT、GitHub Copilot等AI工具辅助学习')
    }
    
    // 家庭环境支持
    const familyBg = assessmentData.family_background?.score || 1
    if (familyBg >= 7) {
      strengths.push('家庭环境支持度高')
    } else {
      suggestions.push('主动寻找编程社区和同伴，弥补环境支持不足')
    }
    
    // 专业兴趣
    const majorInterest = assessmentData.major_interest?.score || 1
    if (majorInterest >= 7) {
      strengths.push('专业兴趣浓厚')
    } else if (majorInterest <= 3) {
      suggestions.push('通过实际项目和应用场景培养对编程的兴趣')
    }
    
    // 生成分维度成长建议
    const dimensionAdvice = [
      {
        dimension: '编程实践经验',
        currentLevel: assessmentData.coding_experience?.score || 1,
        icon: '💻',
        advice: codingExp >= 7 
          ? '继续深化项目经验，可以尝试开源贡献或复杂系统设计'
          : codingExp >= 5 
          ? '建议完成2-3个完整项目，从简单到复杂循序渐进'
          : codingExp >= 3
          ? '可以从Python基础语法开始，配合简单的实战项目练习'
          : '推荐从Scratch图形化编程入门，培养编程思维和兴趣',
        nextSteps: codingExp >= 7
          ? ['参与开源项目', '学习系统架构', '指导新手编程']
          : codingExp >= 5
          ? ['完成个人项目', '学习代码规范', '尝试团队协作']
          : codingExp >= 3
          ? ['掌握Python基础', '完成课程作业', '加入编程社团']
          : ['体验Scratch编程', '观看编程入门视频', '参加编程体验课']
      },
      {
        dimension: '逻辑思维能力',
        currentLevel: assessmentData.logical_thinking?.score || 1,
        icon: '🧠',
        advice: logicalThinking >= 7
          ? '逻辑思维很强！可以挑战算法竞赛和复杂问题求解'
          : logicalThinking >= 5
          ? '思维能力不错，可以通过编程练习进一步提升'
          : logicalThinking >= 3
          ? '建议多做逻辑推理题，培养结构化思维方式'
          : '从简单的数学游戏开始，逐步建立逻辑思维习惯',
        nextSteps: logicalThinking >= 7
          ? ['挑战ACM竞赛', '学习算法与数据结构', '解决复杂问题']
          : logicalThinking >= 5
          ? ['练习LeetCode题目', '学习基础算法', '参与编程挑战']
          : logicalThinking >= 3
          ? ['玩逻辑推理游戏', '学习基础数学', '培养分析能力']
          : ['数独等益智游戏', '观看逻辑思维视频', '参加思维训练']
      },
      {
        dimension: 'AI工具使用',
        currentLevel: assessmentData.ai_experience?.score || 1,
        icon: '🤖',
        advice: aiExp >= 7
          ? 'AI工具使用熟练！可以探索更高级的AI应用开发'
          : aiExp >= 5
          ? '有一定AI工具经验，可以学习如何在编程中更好地运用'
          : aiExp >= 3
          ? '建议经常使用ChatGPT等工具，提高学习和工作效率'
          : '现在是AI时代，从ChatGPT开始体验AI的强大能力',
        nextSteps: aiExp >= 7
          ? ['学习AI API开发', '构建AI应用', '研究提示工程']
          : aiExp >= 5
          ? ['学习GitHub Copilot', '掌握提示词技巧', '探索AI编程助手']
          : aiExp >= 3
          ? ['日常使用ChatGPT', '学习基础提示词', '了解AI能力边界']
          : ['注册ChatGPT账号', '体验AI对话', '学习基本使用方法']
      }
    ]

    return {
      score,
      strengths,
      improvements,
      suggestions,
      dimensionAdvice,
      level: score >= 98 ? '卓越潜质' : score >= 95 ? '优秀基础' : score >= 92 ? '良好起点' : '待发掘潜力'
    }
  }

  const allQuestionsAnswered = PROGRAMMING_ASSESSMENT.every(q => getSelectedValue(q.id))

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            编程潜力评估
          </h2>
          <p className="text-gray-600">
            通过几个简单问题，了解你的编程基础和发展潜力
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8">
          {PROGRAMMING_ASSESSMENT.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                {question.icon}
                <h3 className="text-xl font-semibold text-gray-800">
                  {question.title}
                </h3>
              </div>
              
              <p className="text-gray-700 font-medium mb-4">
                {question.question}
              </p>

              <div className="space-y-3">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswerSelect(question.id, option.value, option.score)}
                    className={`
                      w-full p-4 text-left rounded-lg border-2 transition-all duration-200
                      ${getSelectedValue(question.id) === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }
                    `}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        getSelectedValue(question.id) === option.value 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {getSelectedValue(question.id) === option.value && (
                          <span className="text-white text-xs">●</span>
                        )}
                      </div>
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}

          {/* 个性化建议 */}
          {allQuestionsAnswered && (() => {
            const advice = getPersonalizedAdvice()
            const assessmentData = stepData.skillsAssessment || {}
            if (!advice) return null
            
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-6"
              >
                {/* 总体评价 */}
                <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      🌟 你的编程成长潜力
                    </h4>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-blue-600">
                        {advice.score}
                      </span>
                      <span className="text-gray-500 ml-2">/ 100分</span>
                    </div>
                    <span className="inline-block px-4 py-2 rounded-full font-medium bg-blue-100 text-blue-800">
                      {advice.level}
                    </span>
                  </div>
                  <p className="text-center text-gray-600">
                    恭喜！你已经具备了良好的编程学习基础，通过系统的学习和实践，你将能够成长为优秀的软件工程师。
                  </p>
                </div>

                {/* 优势分析 */}
                {advice.strengths.length > 0 && (
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <h5 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                      ✅ 你的优势特质
                    </h5>
                    <div className="space-y-2">
                      {advice.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center text-green-700">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 提升建议 */}
                {advice.suggestions.length > 0 && (
                  <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                    <h5 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
                      🚀 成长提升建议
                    </h5>
                    <div className="space-y-3">
                      {advice.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start text-orange-700">
                          <span className="w-6 h-6 bg-orange-500 text-white rounded-full text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{suggestion}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 分维度成长建议 */}
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-xl border border-indigo-200">
                  <h5 className="text-lg font-semibold text-indigo-800 mb-4 flex items-center">
                    📈 个人成长路径规划
                  </h5>
                  <div className="space-y-4">
                    {advice.dimensionAdvice.map((dimension, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{dimension.icon}</span>
                            <span className="font-medium text-gray-800">{dimension.dimension}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-gradient-to-r from-indigo-400 to-cyan-400 h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.max(30, Math.round(dimension.currentLevel / 9 * 100))}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              Lv.{dimension.currentLevel}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                          {dimension.advice}
                        </p>
                        
                        <div>
                          <p className="text-xs font-medium text-indigo-700 mb-2">🎯 下一步行动计划：</p>
                          <div className="flex flex-wrap gap-1">
                            {dimension.nextSteps.map((step, stepIndex) => (
                              <span 
                                key={stepIndex}
                                className="inline-block px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-md"
                              >
                                {step}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-sm flex items-center">
                      <span className="text-lg mr-2">💪</span>
                      <strong>记住：</strong>每个优秀程序员都是从新手开始的！持续学习比起点更重要，你的编程之路才刚刚开始，未来可期！
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })()}

          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </button>

            <button
              onClick={nextStep}
              disabled={!allQuestionsAnswered}
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一步
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}