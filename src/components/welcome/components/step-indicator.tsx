'use client'

import { motion } from 'framer-motion'
import { useStepStore } from '@/lib/store/step-store'
import { Check } from 'lucide-react'

const steps = [
  { id: 2, label: '基础信息' },
  { id: 3, label: '理想职业' },
  { id: 4, label: '能力测评' },
  { id: 5, label: '学习目标' },
  { id: 6, label: 'AI分析' }
]

export function StepIndicator() {
  const { currentStep } = useStepStore()

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* 步骤圆圈 */}
            <motion.div
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-full
                transition-all duration-300
                ${currentStep >= step.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-500'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep > step.id ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
              
              {/* 当前步骤的脉冲动画 */}
              {currentStep === step.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-blue-600"
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              )}
            </motion.div>

            {/* 步骤标签 */}
            <div className="ml-3 hidden sm:block">
              <p className={`
                text-sm font-medium transition-colors duration-300
                ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'}
              `}>
                {step.label}
              </p>
            </div>

            {/* 连接线 */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-0.5 bg-gray-200 relative overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-blue-600"
                  initial={{ width: '0%' }}
                  animate={{
                    width: currentStep > step.id ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 移动端步骤标签 */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium text-blue-600">
          {steps.find(s => s.id === currentStep)?.label}
        </p>
      </div>
    </div>
  )
}