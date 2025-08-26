# 河北师范大学软件学院"时光机"迎新系统

基于AI技术的创新迎新体验系统，让新生"看见"未来的自己，激发学习动力。

## 🎯 项目特色

- **AI智能预测**：基于先进的AI技术，分析学生兴趣特长，预测未来发展轨迹
- **时光穿越体验**：穿越到四年后的毕业典礼，十年后的职场巅峰
- **个性化规划**：生成专属的学习路径和成长建议
- **社交分享**：一键分享未来画像到社交平台

## 🛠 技术栈

### 前端
- **框架**：Next.js 14 (App Router) + TypeScript
- **样式**：Tailwind CSS + Framer Motion
- **组件库**：Radix UI + Lucide React
- **状态管理**：Zustand

### 后端
- **数据库**：Supabase PostgreSQL + Row Level Security
- **存储**：Supabase Storage (图片文件)
- **实时功能**：Supabase Realtime

### AI服务
- **AI SDK**：OpenAI GPT-4 Vision + DALL-E 3
- **图像处理**：Canvas API + html2canvas
- **摄像头**：react-webcam

### 部署
- **前端部署**：Vercel
- **版本控制**：GitHub

## 🚀 快速开始

### 环境要求
- Node.js 18.0.0+
- npm 或 yarn

### 1. 克隆项目
```bash
git clone <repository-url>
cd yingxin
```

### 2. 安装依赖
```bash
npm install
```

### 3. 环境配置
复制 `.env.local` 文件并填入配置：

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key

# Application Configuration  
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. 数据库设置

1. 在 [Supabase](https://supabase.com) 创建新项目
2. 执行 `supabase/migrations/001_initial_schema.sql` 中的SQL脚本
3. 启用 Row Level Security (RLS)
4. 创建存储桶：`avatars` 和 `predictions`

### 5. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📋 主要功能模块

### 1. 智能信息采集系统
- 📸 照片上传（拍照/文件上传）
- 👤 基础信息收集
- 🎯 理想职业选择
- 🧠 兴趣能力测评
- 📚 学习目标设定

### 2. AI预测引擎
- 🤖 GPT-4 Vision图像分析
- 🎨 DALL-E 3未来形象生成
- 📊 个性化数据分析
- 🛤️ 成长路径规划

### 3. 未来画像展示
- 🎓 四年后毕业成就
- 💼 十年后职业发展
- 📈 能力雷达图
- 🗺️ 详细成长路径

### 4. 交互体验功能
- 🎬 动画过渡效果
- 📱 响应式设计
- 🔄 实时进度更新
- 🎊 沉浸式视觉体验

## 🎨 用户体验流程

1. **欢迎引导** (30秒) - 产品介绍动画，隐私协议同意
2. **信息采集** (3-5分钟) - 照片上传，基础信息，职业选择，能力测评，学习目标
3. **AI处理** (30-60秒) - 实时处理进度，激励音效反馈  
4. **结果展示** (5-10分钟) - 未来画像揭晓，交互式展示，详细分析报告
5. **分享保存** (1-2分钟) - 生成专属海报，社交平台分享，结果永久保存

## 🚀 部署到 Vercel

1. 连接GitHub仓库到Vercel
2. 配置环境变量
3. 自动部署

## 📞 联系我们

- **项目负责人**：河北师范大学软件学院
- **技术支持**：GitHub Issues
- **PRD文档**：见项目根目录 `河北师范大学迎新系统PRD.md`

---

⭐ 让AI带你看见未来的自己！
