import { create } from 'zustand'

interface StepData {
  // 第一步：照片上传
  photo?: File | string
  
  // 第二步：基本信息
  name?: string
  studentId?: string
  phone?: string
  gender?: 'male' | 'female' | 'other'
  
  // 第三步：职业理想
  idealCareer?: string
  careerCustom?: string
  
  // 第四步：编程潜力评估
  skillsAssessment?: {
    [questionId: string]: {
      value: string
      score: number
    }
  }
  
  // 第五步：学习目标
  learningGoals?: {
    fourYearPlan?: string
    careerPath?: 'big_company' | 'graduate' | 'startup' | 'civil_service' | 'career_change'
  }
}

interface StepState {
  currentStep: number
  totalSteps: number
  stepData: StepData
  isProcessing: boolean
  
  // Actions
  setCurrentStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateStepData: <K extends keyof StepData>(key: K, value: StepData[K]) => void
  setProcessing: (processing: boolean) => void
  resetForm: () => void
  
  // Validation
  isStepValid: (step: number) => boolean
}

export const useStepStore = create<StepState>()((set, get) => ({
  currentStep: 1,
  totalSteps: 7, // 欢迎页 -> 信息采集 -> 职业选择 -> 能力评估 -> 学习目标 -> AI处理 -> 结果展示
  stepData: {},
  isProcessing: false,
  
  setCurrentStep: (step) => set({ currentStep: step }),
  
  nextStep: () => set((state) => ({ 
    currentStep: Math.min(state.currentStep + 1, state.totalSteps) 
  })),
  
  prevStep: () => set((state) => ({ 
    currentStep: Math.max(state.currentStep - 1, 1) 
  })),
  
  updateStepData: (key, value) => set((state) => ({
    stepData: { ...state.stepData, [key]: value }
  })),
  
  setProcessing: (processing) => set({ isProcessing: processing }),
  
  resetForm: () => set({
    currentStep: 1,
    stepData: {},
    isProcessing: false
  }),
  
  isStepValid: (step: number) => {
    const { stepData } = get()
    
    switch (step) {
      case 1: // 欢迎页
        return true
      case 2: // 照片上传 + 基本信息
        return !!(stepData.photo && stepData.name && stepData.gender)
      case 3: // 职业理想
        return !!(stepData.idealCareer || stepData.careerCustom)
      case 4: // 编程潜力评估
        return !!(stepData.skillsAssessment && Object.keys(stepData.skillsAssessment).length === 5)
      case 5: // 学习目标
        return !!(stepData.learningGoals?.fourYearPlan)
      case 6: // AI处理
        return true
      case 7: // 结果展示
        return true
      default:
        return false
    }
  }
}))

// 预设的职业选项
export const CAREER_OPTIONS = [
  '全栈开发工程师',
  '前端开发工程师', 
  '后端开发工程师',
  'AI工程师',
  '大数据工程师',
  '云计算工程师',
  '网络安全工程师',
  '移动应用开发工程师',
  '游戏开发工程师',
  'DevOps工程师',
  '算法工程师',
  '产品经理',
  'UI/UX设计师',
  '技术架构师',
  '创业者'
]

// 技术兴趣选项
export const TECH_INTERESTS = [
  '前端开发',
  '后端开发', 
  '移动开发',
  '人工智能',
  '大数据',
  '云计算',
  '网络安全',
  '游戏开发',
  '区块链',
  '物联网',
  '机器学习',
  '数据科学'
]

// MBTI类型选项
export const PERSONALITY_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP', 
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
]