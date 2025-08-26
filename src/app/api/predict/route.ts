import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/ai/openai'
import { supabase } from '@/lib/supabase/supabase'
import { generateId } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, profileData, photoBase64, useFallbackPrompt } = body

    if (!userId || !profileData) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // 标记开始处理
    await supabase
      .from('future_predictions')
      .upsert({
        user_id: userId,
        processing_status: 'processing'
      })

    // 根据是否使用简化提示词选择不同的AI调用方式
    const systemPrompt = useFallbackPrompt ? 
      `你是一个AI教育规划助手。基于学生基本信息生成未来发展预测。返回JSON格式，包含graduate_achievements、career_achievements、skill_radar_data、growth_path、confidence_score字段。保持内容简洁但有用。` :
      `你是一个专业的AI生涯规划师和教育咨询专家。请基于用户提供的信息，生成详细、个性化的未来预测分析。

请根据学生的专业背景、兴趣爱好、能力水平等信息，提供具体而实用的建议。每个成长阶段的描述应该包含3-5个具体的行动建议和目标。

返回格式为JSON，包含以下字段：
{
  "graduate_achievements": {
    "gpa": number, // 基于学生能力预测的GPA
    "skills": string[], // 3-5个核心技能
    "projects": number, // 预期完成的项目数量
    "certifications": number, // 建议获得的证书数量
    "description": string // 100-150字的详细描述，包含具体的成就预测和建议
  },
  "career_achievements": {
    "position": string, // 具体职位
    "salary": string, // 薪资范围
    "experience": string, // 工作经验
    "companies": string[], // 3-5个可能的公司类型
    "description": string // 100-150字的详细描述，包含职业发展路径和成就预测
  },
  "skill_radar_data": {
    "technical": number, // 1-10分
    "communication": number, 
    "leadership": number,
    "creativity": number,
    "problem_solving": number
  },
  "growth_path": {
    "year1": string, // 80-120字，包含3-4个具体的学习目标和行动计划
    "year2": string, // 80-120字，包含3-4个具体的能力提升和实践目标
    "year3": string, // 80-120字，包含3-4个专业深化和实习相关目标
    "year4": string // 80-120字，包含3-4个求职准备和毕业项目目标
  },
  "confidence_score": number // 0.0-1.0，基于信息完整度和匹配度
}`

    const userPrompt = useFallbackPrompt ? 
      `学生信息：姓名${profileData.name}，理想职业${profileData.idealCareer}，编程能力${profileData.programmingSkills}/10，逻辑思维${profileData.logicalThinking}/10。请生成预测分析。` :
      `请分析以下学生信息：
姓名：${profileData.name}
理想职业：${profileData.idealCareer || profileData.careerCustom}
技术兴趣：${profileData.techInterests?.join(', ')}
编程能力：${profileData.programmingSkills}/10
逻辑思维：${profileData.logicalThinking}/10
性格类型：${profileData.personalityType}
学习目标：${JSON.stringify(profileData.learningGoals)}

请基于以上信息生成详细的个性化分析报告，包括：
1. 四年后毕业成就预测（包含具体的GPA预测、核心技能清单、项目经验和证书建议）
2. 十年后职业成就预测（包含具体职位、薪资预期、可能就职的公司类型）
3. 五维能力雷达图数据（技术、沟通、领导、创新、问题解决能力的1-10分评估）
4. 详细的四年成长路径规划（每年包含3-4个具体目标和行动计划）
5. 基于信息完整度和能力匹配度的置信度评分

请确保每个部分的建议都具体、可执行，符合学生的实际情况和发展潜力。`

    // 调用OpenAI分析用户档案
    const analysis = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      max_tokens: useFallbackPrompt ? 1500 : 3000,
      temperature: 0.7
    })

    let predictionData
    try {
      const content = analysis.choices[0]?.message?.content || '{}'
      predictionData = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError)
      console.log('Raw OpenAI response:', analysis.choices[0]?.message?.content)
      // 使用详细的默认数据
      const baseGpa = 3.5 + (profileData.programmingSkills / 10) * 0.5
      const techSkills = profileData.techInterests?.slice(0, 3) || ['编程开发', '系统设计']
      const careerField = profileData.idealCareer || '软件开发工程师'
      
      predictionData = {
        graduate_achievements: {
          gpa: Math.round(baseGpa * 100) / 100,
          skills: [...techSkills, '项目管理', '团队协作'],
          projects: Math.min(Math.max(Math.floor(profileData.logicalThinking / 3), 2), 6),
          certifications: Math.floor(profileData.programmingSkills / 3) + 1,
          description: `基于你当前${profileData.programmingSkills}/10的编程能力和${profileData.logicalThinking}/10的逻辑思维能力，预计四年后能够达到GPA ${Math.round(baseGpa * 100) / 100}的优秀学业水平。你将掌握${techSkills.join('、')}等核心技能，完成${Math.min(Math.max(Math.floor(profileData.logicalThinking / 3), 2), 6)}个实践项目，获得相关专业认证。建议重点培养实践能力和创新思维。`
        },
        career_achievements: {
          position: careerField,
          salary: profileData.programmingSkills >= 7 ? '18-30K' : '12-20K',
          experience: '2-4年相关经验',
          companies: ['知名互联网公司', '科技独角兽企业', '创新型科技公司', '传统企业数字化部门'],
          description: `凭借扎实的专业基础和${careerField}方向的深入发展，预计十年后能够胜任${careerField}或相关高级职位。根据你的技术兴趣(${profileData.techInterests?.join('、') || '技术开发'})和能力特点，建议向技术专家或技术管理方向发展，薪资水平将达到行业中上游标准。`
        },
        skill_radar_data: {
          technical: Math.min(profileData.programmingSkills + 2, 10),
          communication: Math.min(6 + Math.floor(profileData.logicalThinking / 3), 9),
          leadership: Math.min(5 + Math.floor(profileData.programmingSkills / 4), 8),
          creativity: Math.min(6 + Math.floor(Math.random() * 3), 9),
          problem_solving: Math.min(profileData.logicalThinking + 1, 10)
        },
        growth_path: {
          year1: `大一阶段重点夯实基础：1)系统学习计算机基础理论和数学基础，目标GPA3.5+；2)掌握至少2门编程语言(${profileData.techInterests?.[0] || 'Python'}、Java等)；3)参与1-2个课程项目，培养编程思维；4)加入相关技术社团，建立学习网络。`,
          year2: `大二阶段注重实践提升：1)深入学习数据结构和算法，强化逻辑思维能力；2)参与校内外技术竞赛或hackathon活动；3)开始个人项目开发，建立GitHub作品集；4)学习前沿技术栈，关注${careerField}相关技术发展趋势。`,
          year3: `大三阶段专业深化：1)选择专业方向深入学习，重点发展${profileData.techInterests?.slice(0,2).join('和') || '核心技术'}能力；2)寻找优质实习机会，积累真实项目经验；3)参与开源项目贡献，提升代码质量和协作能力；4)准备相关技术认证考试，增强求职竞争力。`,
          year4: `大四阶段求职准备：1)完成高质量毕业设计，展示综合技术能力；2)系统性准备技术面试，刷题和项目复盘并重；3)积极参加校园招聘和实习转正机会；4)建立个人技术品牌，通过技术博客等方式展示专业能力和学习成果。`
        },
        confidence_score: Math.min(0.75 + (profileData.programmingSkills + profileData.logicalThinking) / 50, 0.95)
      }
    }

    // 如果有照片且不是简化调用，生成图像预测
    let graduateImageUrl = null
    let careerImageUrl = null

    if (photoBase64 && !useFallbackPrompt) {
      try {
        // 生成毕业照
        const graduatePrompt = `基于用户照片生成一个专业的大学毕业照，身穿学士服，在校园环境中，表情自信阳光`
        
        const graduateImage = await openai.images.generate({
          model: "dall-e-3",
          prompt: graduatePrompt,
          size: "1024x1024",
          quality: "hd",
          n: 1,
        })

        graduateImageUrl = graduateImage.data[0]?.url

        // 生成职业照
        const careerPrompt = `生成一个专业的职场人士形象，${profileData.idealCareer || '软件工程师'}，身穿商务装，在现代办公环境中，表情专业自信`

        const careerImage = await openai.images.generate({
          model: "dall-e-3", 
          prompt: careerPrompt,
          size: "1024x1024",
          quality: "hd",
          n: 1,
        })

        careerImageUrl = careerImage.data[0]?.url

      } catch (imageError) {
        console.error('Image generation failed:', imageError)
        // 图片生成失败不影响整体流程
      }
    }

    // 保存预测结果到数据库
    const { data, error } = await supabase
      .from('future_predictions')
      .upsert({
        user_id: userId,
        graduate_image_url: graduateImageUrl,
        career_image_url: careerImageUrl,
        graduate_achievements: predictionData.graduate_achievements,
        career_achievements: predictionData.career_achievements,
        skill_radar_data: predictionData.skill_radar_data,
        growth_path: predictionData.growth_path,
        confidence_score: predictionData.confidence_score,
        processing_status: 'completed'
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data
    })

  } catch (error) {
    console.error('Prediction API error:', error)

    // 标记处理失败
    if (body?.userId) {
      await supabase
        .from('future_predictions')
        .upsert({
          user_id: body.userId,
          processing_status: 'failed'
        })
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}