'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Sparkles, Clock, Star } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'

export function WelcomeStep() {
  const { nextStep } = useStepStore()
  const [isStarting, setIsStarting] = useState(false)

  const handleStart = async () => {
    setIsStarting(true)
    // 添加一点延迟增强体验感
    await new Promise(resolve => setTimeout(resolve, 1000))
    nextStep()
  }

  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* 主标题 */}
        <div className="mb-12">
          <motion.h1
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            时光机
          </motion.h1>
          <motion.p
            className="text-xl text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            让AI带你看见未来的自己
          </motion.p>
        </div>

        {/* 体验说明 - 移到中间位置 */}
        <motion.div
          className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            🎯 5分钟体验未来
          </h3>
          <div className="text-left space-y-2 text-gray-600 mb-6">
            <p>📸 上传你的照片</p>
            <p>🎯 选择理想职业</p>
            <p>🧠 完成能力测评</p>
            <p>📋 设定学习目标</p>
            <p>✨ AI生成你的未来画像</p>
          </div>

          {/* 开始按钮 - 移到这里 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <button
              onClick={handleStart}
              disabled={isStarting}
              className="group relative inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStarting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  启动时光机...
                </div>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  开始时光之旅
                </>
              )}
              
              {/* 按钮背景动画 */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              点击同意使用条款和隐私政策
            </p>
          </motion.div>
        </motion.div>

        {/* 特色功能介绍 - 移到下面 */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI智能预测</h3>
            <p className="text-gray-600 text-sm">
              基于先进的AI技术，分析你的兴趣特长，预测未来发展轨迹
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">时光穿越</h3>
            <p className="text-gray-600 text-sm">
              穿越到四年后的毕业典礼，十年后的职场巅峰，看见更好的自己
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">成长路径</h3>
            <p className="text-gray-600 text-sm">
              获得个性化的学习规划和成长建议，让梦想照进现实
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* 装饰性元素 */}
      <div className="absolute top-10 left-10 w-20 h-20 text-blue-200 opacity-50 animate-pulse">
        <Sparkles className="w-full h-full" />
      </div>
      <div className="absolute top-20 right-20 w-16 h-16 text-purple-200 opacity-50 animate-bounce">
        <Star className="w-full h-full" />
      </div>
      <div className="absolute bottom-20 left-20 w-12 h-12 text-pink-200 opacity-50 animate-spin">
        <Clock className="w-full h-full" />
      </div>
    </div>
  )
}