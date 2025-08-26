'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, RotateCcw, Star, Trophy, Target } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'
import { useUserStore } from '@/lib/store/user-store'
import { useAuthContext } from '@/components/providers/auth-provider'
import { supabase } from '@/lib/supabase/supabase'

export function ResultsStep() {
  const { resetForm } = useStepStore()
  const { prediction, setPrediction } = useUserStore()
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState('graduate')
  const [loading, setLoading] = useState(false)

  // 获取预测结果
  useEffect(() => {
    const fetchPrediction = async () => {
      if (!user || prediction) return
      
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('future_predictions')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (error && error.code !== 'PGRST116') {
          console.error('获取预测结果失败:', error)
          return
        }
        
        if (data) {
          setPrediction(data)
        }
      } catch (err) {
        console.error('获取预测结果时出错:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [user, prediction, setPrediction])

  const handleRestart = () => {
    resetForm()
  }

  const handleShare = () => {
    // 实现分享功能
    if (navigator.share) {
      navigator.share({
        title: '我的未来画像 - 时光机迎新系统',
        text: '快来看看我的未来画像！',
        url: window.location.href
      })
    }
  }

  const handleDownload = () => {
    // 实现下载功能
    console.log('下载画像')
  }

  if (loading || !prediction) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <div className="w-full h-full border-4 border-blue-500 border-t-transparent rounded-full" />
          </motion.div>
          <p className="text-gray-600">正在加载你的未来画像...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            你的未来画像
          </h2>
          <p className="text-xl text-gray-600">
            时光机已经为你描绘了未来的蓝图
          </p>
        </div>

        {/* 标签切换 */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('graduate')}
              className={`px-6 py-3 rounded-md transition-all ${
                activeTab === 'graduate'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🎓 四年后毕业
            </button>
            <button
              onClick={() => setActiveTab('career')}
              className={`px-6 py-3 rounded-md transition-all ${
                activeTab === 'career'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              💼 十年后职场
            </button>
          </div>
        </div>

        {/* 毕业画像 */}
        {activeTab === 'graduate' && (
          <motion.div
            key="graduate"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid lg:grid-cols-2 gap-8 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
                毕业成就预测
              </h3>
              {prediction.graduate_achievements && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>学业成绩 (GPA)</span>
                    <span className="font-semibold text-blue-600">
                      {(prediction.graduate_achievements as any).gpa || '--'}
                    </span>
                  </div>
                  <div>
                    <span className="block mb-2">核心技能</span>
                    <div className="flex flex-wrap gap-2">
                      {((prediction.graduate_achievements as any).skills || []).map((skill: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>项目作品</span>
                    <span className="font-semibold text-green-600">
                      {(prediction.graduate_achievements as any).projects || 3} 个
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>技能证书</span>
                    <span className="font-semibold text-purple-600">
                      {(prediction.graduate_achievements as any).certifications || 2} 个
                    </span>
                  </div>
                  
                  {/* 添加详细描述 */}
                  {(prediction.graduate_achievements as any).description && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">详细分析</h4>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {(prediction.graduate_achievements as any).description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                能力雷达图
              </h3>
              {prediction.skill_radar_data && (
                <div className="space-y-4">
                  {Object.entries(prediction.skill_radar_data as any).map(([skill, level]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {{
                            technical: '技术能力',
                            communication: '沟通能力', 
                            leadership: '领导力',
                            creativity: '创新力',
                            problem_solving: '问题解决'
                          }[skill] || skill}
                        </span>
                        <span className="text-sm text-gray-600">{level}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(level as number) * 10}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 职业画像 */}
        {activeTab === 'career' && (
          <motion.div
            key="career"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid lg:grid-cols-2 gap-8 mb-8"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-green-500" />
                职业成就预测
              </h3>
              {prediction.career_achievements && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>职位</span>
                    <span className="font-semibold text-green-600">
                      {(prediction.career_achievements as any).position}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>薪资范围</span>
                    <span className="font-semibold text-purple-600">
                      {(prediction.career_achievements as any).salary}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>工作经验</span>
                    <span className="font-semibold text-blue-600">
                      {(prediction.career_achievements as any).experience}
                    </span>
                  </div>
                  <div>
                    <span className="block mb-2">可能就职的公司</span>
                    <div className="flex flex-wrap gap-2">
                      {((prediction.career_achievements as any).companies || []).map((company: string, index: number) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* 添加详细描述 */}
                  {(prediction.career_achievements as any).description && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800 mb-2">职业发展分析</h4>
                      <p className="text-sm text-green-700 leading-relaxed">
                        {(prediction.career_achievements as any).description}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">
                📈 四年成长轨迹
              </h3>
              {prediction.growth_path && (
                <div className="space-y-6">
                  {Object.entries(prediction.growth_path as any).map(([year, plan]) => (
                    <div key={year} className="relative">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {year === 'year1' ? '1' : year === 'year2' ? '2' : year === 'year3' ? '3' : '4'}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="font-semibold text-lg text-gray-800 mb-2">
                            {{
                              year1: '大一 - 基础夯实期',
                              year2: '大二 - 实践提升期', 
                              year3: '大三 - 专业深化期',
                              year4: '大四 - 求职准备期'
                            }[year] || year}
                          </div>
                          <div className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {plan as string}
                          </div>
                        </div>
                      </div>
                      {year !== 'year4' && (
                        <div className="absolute left-4 top-10 w-px h-8 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleShare}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            分享结果
          </button>
          
          <button
            onClick={handleDownload}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            下载画像
          </button>
          
          <button
            onClick={handleRestart}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            重新体验
          </button>
        </div>

        {/* 置信度显示 */}
        {prediction.confidence_score && (
          <div className="text-center mt-8">
            <p className="text-gray-600">
              AI 预测置信度: 
              <span className="font-semibold text-blue-600 ml-1">
                {Math.round((prediction.confidence_score as number) * 100)}%
              </span>
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}