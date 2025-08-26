import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// 分析用户照片和信息，生成个性化描述
export async function analyzeUserProfile(
  imageBase64: string,
  profileData: {
    name: string
    idealCareer: string
    interests: string[]
    skills: Record<string, number>
    personalityType: string
  }
) {
  const prompt = `你是一个专业的AI生涯规划师。请基于以下信息分析这位学生：

姓名：${profileData.name}
理想职业：${profileData.idealCareer}
技术兴趣：${profileData.interests.join(', ')}
技能评估：${JSON.stringify(profileData.skills)}
性格类型：${profileData.personalityType}

请从照片中分析这位学生的外貌特征，结合个人信息，生成：
1. 个人特征分析（性格、潜力、优势）
2. 四年后毕业时的可能样貌变化描述
3. 十年后职场成功时的形象描述
4. 成长路径建议

请用专业但温暖的语调，激发学生的学习动力。`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('OpenAI API Error:', error)
    throw error
  }
}

// 生成未来形象图片
export async function generateFutureImage(
  description: string,
  scenario: 'graduate' | 'career'
) {
  const scenarioPrompts = {
    graduate: '身穿学士服，在大学校园内，阳光自信的表情，手持毕业证书',
    career: '身穿职业装，在现代办公环境中，专业自信的形象，展现职场精英气质'
  }

  const prompt = `高质量的专业肖像照片，${description}，${scenarioPrompts[scenario]}，摄影师作品，专业光线，8K分辨率，真实感强`

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
      quality: "hd",
      n: 1,
    })

    return response.data[0]?.url || ''
  } catch (error) {
    console.error('DALL-E API Error:', error)
    throw error
  }
}

// 生成成长路径规划
export async function generateGrowthPath(
  profileData: {
    name: string
    idealCareer: string
    currentSkills: Record<string, number>
    learningGoals: any
  }
) {
  const prompt = `作为专业的教育规划师，为软件学院学生${profileData.name}制定详细的四年成长规划。

学生信息：
- 理想职业：${profileData.idealCareer}
- 当前技能水平：${JSON.stringify(profileData.currentSkills)}
- 学习目标：${JSON.stringify(profileData.learningGoals)}

请生成：
1. 每学年的核心学习目标和里程碑
2. 技能提升路线图（技术栈、项目实践）
3. 实习和就业准备时间线
4. 推荐的学习资源和平台
5. 可能的挑战和解决方案

格式要求：结构化的JSON格式，便于前端展示`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    })

    return response.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Growth Path Generation Error:', error)
    throw error
  }
}