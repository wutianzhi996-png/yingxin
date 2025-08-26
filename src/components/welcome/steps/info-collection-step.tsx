'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Camera, Upload, User, ArrowRight, ArrowLeft } from 'lucide-react'
import { useStepStore } from '@/lib/store/step-store'
import { isValidImageFile, compressImage } from '@/lib/utils'
import Webcam from 'react-webcam'

export function InfoCollectionStep() {
  const { stepData, updateStepData, nextStep, prevStep, isStepValid } = useStepStore()
  const [showCamera, setShowCamera] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const webcamRef = useRef<Webcam>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 拍照
  const capturePhoto = useCallback(async () => {
    if (!webcamRef.current) return
    
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      // 将base64转换为File对象
      const response = await fetch(imageSrc)
      const blob = await response.blob()
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' })
      
      updateStepData('photo', file)
      setShowCamera(false)
    }
  }, [updateStepData])

  // 上传文件
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!isValidImageFile(file)) {
      alert('请上传有效的图片文件（JPG、PNG或WebP格式，大小不超过10MB）')
      return
    }

    setIsUploading(true)
    try {
      // 压缩图片
      const compressedBlob = await compressImage(file)
      const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })
      updateStepData('photo', compressedFile)
    } catch (error) {
      console.error('图片处理失败:', error)
      alert('图片处理失败，请重试')
    } finally {
      setIsUploading(false)
    }
  }

  const handleNext = () => {
    if (isStepValid(2)) {
      nextStep()
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* 标题 */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
            基础信息
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            请填写姓名、性别并上传你的照片
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg">
          {/* 照片上传区域 */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              📸 上传你的照片
            </label>
            
            {stepData.photo ? (
              <div className="relative">
                <img
                  src={
                    stepData.photo instanceof File 
                      ? URL.createObjectURL(stepData.photo)
                      : stepData.photo
                  }
                  alt="用户照片"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full object-cover mx-auto border-4 border-blue-200"
                />
                <button
                  onClick={() => updateStepData('photo', undefined)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="space-y-4">
                  {showCamera ? (
                    <div className="space-y-4">
                      <Webcam
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full max-w-sm mx-auto rounded-lg"
                        videoConstraints={{
                          facingMode: 'user'
                        }}
                      />
                      <div className="flex gap-4 justify-center">
                        <button
                          onClick={capturePhoto}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          拍照
                        </button>
                        <button
                          onClick={() => setShowCamera(false)}
                          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Camera className="w-16 h-16 text-gray-400 mx-auto" />
                      <div className="space-y-2">
                        <p className="text-gray-600">选择上传方式</p>
                        <div className="flex gap-4 justify-center">
                          <button
                            onClick={() => setShowCamera(true)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            拍照
                          </button>
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {isUploading ? '处理中...' : '选择文件'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
          </div>

          {/* 基本信息表单 */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👤 姓名 *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={stepData.name || ''}
                  onChange={(e) => updateStepData('name', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入你的姓名"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👥 性别 *
              </label>
              <div className="flex gap-6">
                {[
                  { value: 'male', label: '男' },
                  { value: 'female', label: '女' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={stepData.gender === option.value}
                      onChange={(e) => updateStepData('gender', e.target.value as 'male' | 'female')}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 mr-3"
                    />
                    <span className="text-gray-700 font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepValid(2)}
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