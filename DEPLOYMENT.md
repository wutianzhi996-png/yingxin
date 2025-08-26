# 部署指南

本文档详细介绍如何将河北师范大学"时光机"迎新系统部署到生产环境。

## 📋 部署前准备

### 1. 环境要求
- Node.js 18.0.0+
- GitHub账户
- Vercel账户
- Supabase账户
- OpenAI API Key

### 2. 服务配置

#### Supabase 配置
1. 在 [Supabase](https://supabase.com) 创建新项目
2. 记录以下信息：
   - Project URL: `https://xxx.supabase.co`
   - Anon Key: `eyJhbGciOiJIUzI1NiIsIn...`
   - Service Role Key (仅后端使用)

3. 执行数据库脚本：
   - 在 SQL Editor 中运行 `supabase/migrations/001_initial_schema.sql`
   - 验证所有表和策略创建成功

4. 配置存储桶：
   ```sql
   -- 如果需要手动创建存储桶
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('avatars', 'avatars', true),
   ('predictions', 'predictions', true);
   ```

#### OpenAI 配置
1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 创建API Key
3. 确保账户有足够的使用额度

## 🚀 Vercel 部署

### 方法一：自动部署 (推荐)

1. **连接 GitHub**
   - 将代码推送到 GitHub 仓库
   - 登录 [Vercel Dashboard](https://vercel.com/dashboard)
   - 点击 "New Project"
   - 选择 GitHub 仓库

2. **配置环境变量**
   在 Vercel 项目设置中添加以下环境变量：
   
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # OpenAI
   OPENAI_API_KEY=your-openai-api-key
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

3. **部署配置**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Development Command: `npm run dev`

4. **自动部署**
   - Vercel 会自动检测配置
   - 每次推送到 main 分支时自动重新部署

### 方法二：手动部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署项目
vercel --prod

# 4. 配置环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_APP_URL

# 5. 重新部署
vercel --prod
```

## 🔧 生产环境配置

### 1. 域名配置
```bash
# 在 Vercel Dashboard 中：
# Project Settings > Domains
# 添加自定义域名
```

### 2. 分析监控
```bash
# 启用 Vercel Analytics
# Project Settings > Analytics
# 启用 Web Analytics 和 Speed Insights
```

### 3. 安全配置
```bash
# 环境变量安全检查
- 确保所有敏感信息都通过环境变量配置
- 不要将 API keys 提交到代码仓库
- 使用 Supabase RLS 保护数据
```

## 📊 部署后验证

### 1. 功能测试清单
- [ ] 页面正常加载
- [ ] 用户注册/登录
- [ ] 照片上传功能
- [ ] 信息收集表单
- [ ] AI 分析处理
- [ ] 结果展示页面
- [ ] 分享功能
- [ ] 移动端适配

### 2. 性能检查
```bash
# 使用 Lighthouse 检查性能
# 目标指标：
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90
```

### 3. 数据库连接测试
```sql
-- 在 Supabase SQL Editor 中验证
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM student_profiles;  
SELECT COUNT(*) FROM future_predictions;
```

## 🐛 常见问题排查

### 构建错误
```bash
# 检查依赖版本冲突
npm ls
npm audit

# 清理缓存重新安装
rm -rf node_modules package-lock.json
npm install
```

### API 调用失败
```bash
# 检查环境变量
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('OpenAI Key exists:', !!process.env.OPENAI_API_KEY)

# 检查 Supabase 连接
const { data, error } = await supabase.from('users').select('count')
```

### 图片上传问题
```bash
# 检查 Supabase Storage 配置
# 确保存储桶策略正确设置
# 检查文件大小和格式限制
```

## 📈 监控和维护

### 1. 错误监控
- Vercel Functions 日志
- Supabase 实时监控
- OpenAI API 使用统计

### 2. 定期维护
- 定期备份数据库
- 更新依赖包版本
- 监控 API 调用量
- 检查系统性能

### 3. 扩展计划
- CDN 加速配置
- 负载均衡优化
- 缓存策略调整
- 数据库性能调优

## 🔗 相关链接

- [Vercel 文档](https://vercel.com/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [OpenAI API 文档](https://platform.openai.com/docs)

---

📞 如遇到部署问题，请查看项目 Issues 或联系技术支持团队。