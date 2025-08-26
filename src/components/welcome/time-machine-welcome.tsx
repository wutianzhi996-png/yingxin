'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStepStore } from '@/lib/store/step-store'
import { useAuthContext } from '@/components/providers/auth-provider'
import { WelcomeStep } from './steps/welcome-step'
import { InfoCollectionStep } from './steps/info-collection-step'
import { CareerSelectionStep } from './steps/career-selection-step'
import { AssessmentStep } from './steps/assessment-step'
import { LearningGoalsStep } from './steps/learning-goals-step'
import { AIProcessingStep } from './steps/ai-processing-step'
import { ResultsStep } from './steps/results-step'
import { StepIndicator } from './components/step-indicator'

export function TimeMachineWelcome() {
  const { currentStep } = useStepStore()
  const { user, signInAnonymously } = useAuthContext()
  const [isInitialized, setIsInitialized] = useState(false)

  // 自动创建匿名用户会话
  useEffect(() => {
    const initializeUser = async () => {
      if (!user) {
        await signInAnonymously()
      }
      setIsInitialized(true)
    }

    initializeUser()
  }, [user, signInAnonymously])

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在初始化时光机...</p>
        </div>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep />
      case 2:
        return <InfoCollectionStep />
      case 3:
        return <CareerSelectionStep />
      case 4:
        return <AssessmentStep />
      case 5:
        return <LearningGoalsStep />
      case 6:
        return <AIProcessingStep />
      case 7:
        return <ResultsStep />
      default:
        return <WelcomeStep />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* 主要内容区域 */}
      <div className="relative z-10">
        {/* 步骤指示器 */}
        {currentStep > 1 && currentStep < 7 && (
          <div className="pt-8">
            <StepIndicator />
          </div>
        )}

        {/* 步骤内容 */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen flex items-center justify-center p-4"
        >
          {renderStep()}
        </motion.div>
      </div>

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}