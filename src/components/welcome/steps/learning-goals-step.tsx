'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'

const FOUR_YEAR_PLANS = [
  '深入学习技术栈，成为技术专家',
  '培养全栈能力，掌握前后端技术',
  '专注AI/机器学习方向',
  '发展产品思维，向技术管理转型',
  '积累项目经验，准备创业'
]


export function LearningGoalsStep() {
  const { stepData, updateStepData, nextStep, prevStep, isStepValid } = useStepStore()

  const handleGoalUpdate = (key: string, value: any) => {
    updateStepData('learningGoals', {
      ...stepData.learningGoals,
      [key]: value
    })
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
            学习目标设定
          </h2>
          <p className="text-gray-600">
            制定你的四年学习规划和成长目标
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg space-y-8">
          {/* 四年规划 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">🎤 四年学习规划</h3>
            <div className="space-y-3">
              {FOUR_YEAR_PLANS.map((plan) => (
                <label key={plan} className="flex items-center p-3 rounded-lg border hover:bg-gray-50">
                  <input
                    type="radio"
                    name="fourYearPlan"
                    value={plan}
                    checked={stepData.learningGoals?.fourYearPlan === plan}
                    onChange={(e) => handleGoalUpdate('fourYearPlan', e.target.value)}
                    className="mr-3"
                  />
                  <span>{plan}</span>
                </label>
              ))}
            </div>
          </div>


          {/* 毕业去向 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">🎓 毕业后的计划</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'big_company', label: '入职大厂就业', icon: '🏢' },
                { value: 'graduate', label: '继续深造(考研/留学)', icon: '📚' },
                { value: 'startup', label: '创业当老板的想法', icon: '🚀' },
                { value: 'civil_service', label: '考公务员', icon: '🏛️' },
                { value: 'career_change', label: '转行做其他的', icon: '🔄' }
              ].map((option) => (
                <label 
                  key={option.value} 
                  className={`
                    flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${stepData.learningGoals?.careerPath === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="careerPath"
                    value={option.value}
                    checked={stepData.learningGoals?.careerPath === option.value}
                    onChange={(e) => handleGoalUpdate('careerPath', e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-xl mr-3">{option.icon}</span>
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </button>

            <button
              onClick={nextStep}
              disabled={!isStepValid(5)}
              className="flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              开始AI分析
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}