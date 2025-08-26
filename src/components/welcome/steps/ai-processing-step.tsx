'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Clock, Brain, Zap } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'
import { useAuthContext } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/supabase'
import { fileToBase64 } from '@/lib/utils'

export function AIProcessingStep() {
  const { stepData, nextStep, setProcessing } = useStepStore()
  const { user } = useAuthContext()
  const [currentStep, setCurrentStep] = useState(1)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('分析中...')

  const processingSteps = [
    { id: 1, text: '分析个人特征', icon: Brain },
    { id: 2, text: '生成未来画像', icon: Sparkles },
    { id: 3, text: '制定成长路径', icon: Clock },
    { id: 4, text: '完成分析报告', icon: Zap }
  ]

  useEffect(() => {
    if (!user) return

    setProcessing(true)
    processUserData()
  }, [user, setProcessing])

  const processUserData = async () => {
    try {
      // 步骤 1: 保存学生档案
      setCurrentStep(1)
      setStatusText('保存学生信息...')
      await saveStudentProfile()
      await updateProgress(25)

      // 步骤 2: 上传照片
      setCurrentStep(2)
      setStatusText('上传照片...')
      const photoUrl = await uploadPhoto()
      await updateProgress(50)

      // 步骤 3: 调用AI分析
      setCurrentStep(3)
      setStatusText('AI分析中...')
      await callAIAnalysis(photoUrl)
      await updateProgress(75)

      // 步骤 4: 完成
      setCurrentStep(4)
      setStatusText('生成完成!')
      await updateProgress(100)
      
      setTimeout(() => {
        setProcessing(false)
        nextStep()
      }, 2000)

    } catch (error) {
      console.error('AI处理错误:', error)
      setStatusText('处理失败，请重试')
    }
  }

  const updateProgress = (value: number) => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        setProgress(prev => {
          const next = Math.min(prev + 2, value)
          if (next >= value) {
            clearInterval(interval)
            setTimeout(resolve, 500)
          }
          return next
        })
      }, 50)
    })
  }

  const saveStudentProfile = async () => {
    if (!user) throw new Error('No user found')

    const { error } = await supabase
      .from('student_profiles')
      .upsert({
        user_id: user.id,
        name: stepData.name || '',
        student_id: stepData.studentId,
        phone: stepData.phone,
        gender: stepData.gender,
        ideal_career: stepData.idealCareer,
        career_custom: stepData.careerCustom,
        learning_goals: stepData.learningGoals,
        skills_assessment: stepData.skillsAssessment
      })

    if (error) throw error
  }

  const uploadPhoto = async () => {
    if (!user || !stepData.photo) return null

    try {
      let file: File
      if (stepData.photo instanceof File) {
        file = stepData.photo
      } else {
        // 如果是base64或URL，转换为File
        const response = await fetch(stepData.photo)
        const blob = await response.blob()
        file = new File([blob], 'photo.jpg', { type: 'image/jpeg' })
      }

      const fileName = `${user.id}/photo_${Date.now()}.jpg`
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file)

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)

      // 更新用户档案中的照片URL
      await supabase
        .from('student_profiles')
        .update({ photo_url: publicUrl })
        .eq('user_id', user.id)

      return publicUrl
    } catch (error) {
      console.error('照片上传失败:', error)
      return null
    }
  }

  const callAIAnalysis = async (photoUrl: string | null) => {
    if (!user) return

    try {
      // 准备发送给AI API的数据
      const profileData = {
        name: stepData.name,
        idealCareer: stepData.idealCareer,
        careerCustom: stepData.careerCustom,
        techInterests: stepData.techInterests,
        programmingSkills: calculateProgrammingSkills(),
        logicalThinking: calculateLogicalThinking(),
        personalityType: getPersonalityType(),
        learningGoals: stepData.learningGoals
      }

      // 转换照片为base64（如果有照片）
      let photoBase64 = null
      if (stepData.photo) {
        photoBase64 = await fileToBase64(stepData.photo as File)
      }

      // 调用AI预测API
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          profileData,
          photoBase64
        })
      })

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'AI analysis failed')
      }

      console.log('AI分析完成:', result.data)
      
    } catch (error) {
      console.error('AI分析失败:', error)
      // 如果AI分析失败，先尝试简化的AI调用，再使用备用数据
      await trySimplifiedAIFallback()
    }
  }

  // 计算编程技能分数
  const calculateProgrammingSkills = () => {
    if (!stepData.skillsAssessment) return 5
    const codingExp = stepData.skillsAssessment.coding_experience?.score || 1
    const aiExp = stepData.skillsAssessment.ai_experience?.score || 1
    return Math.round((codingExp + aiExp) / 2)
  }

  // 计算逻辑思维分数
  const calculateLogicalThinking = () => {
    if (!stepData.skillsAssessment) return 5
    return stepData.skillsAssessment.logical_thinking?.score || 5
  }

  // 获取性格类型
  const getPersonalityType = () => {
    if (!stepData.skillsAssessment) return '探索型'
    const majorInterest = stepData.skillsAssessment.major_interest?.score || 5
    const familyBg = stepData.skillsAssessment.family_background?.score || 5
    
    if (majorInterest >= 7) return '热情驱动型'
    if (familyBg >= 7) return '环境支持型'
    if (majorInterest <= 3) return '被动接受型'
    return '实用导向型'
  }

  // 尝试使用简化的AI调用作为备用方案
  const trySimplifiedAIFallback = async () => {
    try {
      // 使用更简单的prompt重试AI调用
      const simpleProfileData = {
        idealCareer: stepData.idealCareer || stepData.careerCustom || '软件开发工程师',
        programmingSkills: calculateProgrammingSkills(),
        logicalThinking: calculateLogicalThinking(),
        techInterests: stepData.techInterests?.slice(0, 2) || ['编程开发'],
        name: stepData.name
      }

      const fallbackResponse = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user!.id,
          profileData: simpleProfileData,
          photoBase64: null, // 不使用照片，减少API调用复杂度
          useFallbackPrompt: true // 标记使用简化提示词
        })
      })

      if (fallbackResponse.ok) {
        const result = await fallbackResponse.json()
        if (result.success) {
          console.log('简化AI调用成功')
          return
        }
      }
    } catch (error) {
      console.error('简化AI调用也失败:', error)
    }
    
    // 如果AI调用完全失败，使用本地备用数据
    await saveLocalFallbackPrediction()
  }

  // 保存本地备用预测数据（最后的备用方案）
  const saveLocalFallbackPrediction = async () => {
    const fallbackPrediction = {
      user_id: user!.id,
      processing_status: 'completed' as const,
      confidence_score: 0.6,
      graduate_achievements: {
        gpa: Math.round((3.5 + (calculateProgrammingSkills() / 10) * 0.4) * 100) / 100,
        skills: stepData.techInterests?.slice(0, 3) || ['编程开发', '项目管理', '团队协作'],
        projects: Math.max(2, Math.floor(calculateLogicalThinking() / 2)),
        certifications: Math.max(1, Math.floor(calculateProgrammingSkills() / 3)),
        description: `基于你的学习能力和专业兴趣，预计能够在四年内获得扎实的专业基础。建议重点关注${stepData.techInterests?.[0] || '编程技能'}的深入学习，通过项目实践提升综合能力。`
      },
      career_achievements: {
        position: stepData.idealCareer || stepData.careerCustom || '软件开发工程师',
        salary: calculateProgrammingSkills() >= 7 ? '15-25K' : '10-18K',
        experience: '2-4年相关经验',
        companies: ['互联网公司', '科技企业', '创新型公司', '传统企业IT部门'],
        description: `凭借专业技能的持续提升，预计能够在${stepData.idealCareer || '软件开发'}领域取得良好发展。建议多参与实际项目，积累工作经验，提升职场竞争力。`
      },
      skill_radar_data: {
        technical: Math.min(calculateProgrammingSkills() + 2, 10),
        communication: Math.min(6 + Math.floor(calculateLogicalThinking() / 3), 9),
        leadership: Math.min(5 + Math.floor(calculateProgrammingSkills() / 4), 8),
        creativity: Math.min(7 + Math.floor(Math.random() * 2), 9),
        problem_solving: Math.min(calculateLogicalThinking() + 1, 10)
      },
      growth_path: {
        year1: `大一：夯实基础。掌握${stepData.techInterests?.[0] || 'Python'}等编程语言，学好数学和计算机基础课程，培养编程思维，参与1-2个课程项目。`,
        year2: `大二：技能提升。深入学习数据结构与算法，参与技术竞赛，开始个人项目开发，学习${stepData.techInterests?.[1] || '前端技术'}等专业技能。`,
        year3: `大三：专业深化。选择${stepData.idealCareer || '软件开发'}方向深入学习，寻找优质实习机会，参与开源项目，准备技术认证考试。`,
        year4: `大四：求职准备。完成高质量毕业设计，系统准备技术面试，积极参加校园招聘，建立个人技术品牌和作品集。`
      }
    }

    const { error } = await supabase
      .from('future_predictions')
      .upsert(fallbackPrediction)

    if (error) throw error
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 mx-auto mb-6"
          >
            <Sparkles className="w-full h-full text-blue-600" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            时光机正在运作中...
          </h2>
          <p className="text-gray-600">
            AI正在分析你的信息，生成你的未来画像
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          {/* 进度条 */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>处理进度</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* 处理步骤 */}
          <div className="space-y-4">
            {processingSteps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <motion.div
                  key={step.id}
                  className={`
                    flex items-center p-4 rounded-lg transition-all
                    ${isActive ? 'bg-blue-50 border-2 border-blue-200' : ''}
                    ${isCompleted ? 'bg-green-50 border-2 border-green-200' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-50' : ''}
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.id * 0.1 }}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mr-4
                    ${isActive ? 'bg-blue-500 text-white' : ''}
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${!isActive && !isCompleted ? 'bg-gray-300 text-gray-600' : ''}
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`
                    font-medium
                    ${isActive ? 'text-blue-700' : ''}
                    ${isCompleted ? 'text-green-700' : ''}
                    ${!isActive && !isCompleted ? 'text-gray-500' : ''}
                  `}>
                    {step.text}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5"
                      >
                        <div className="w-full h-full border-2 border-blue-500 border-t-transparent rounded-full" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <motion.p
            key={statusText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-600 mt-6"
          >
            {statusText}
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}