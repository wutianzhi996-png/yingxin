-- 创建用户表扩展
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建学生档案表
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id TEXT,
  name TEXT NOT NULL,
  phone TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  ideal_career TEXT,
  career_custom TEXT,
  personality_type TEXT,
  learning_goals JSONB,
  interests JSONB,
  skills_assessment JSONB,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 创建AI预测结果表
CREATE TABLE IF NOT EXISTS future_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  graduate_image_url TEXT,
  career_image_url TEXT,
  graduate_achievements JSONB,
  career_achievements JSONB,
  skill_radar_data JSONB,
  growth_path JSONB,
  confidence_score REAL CHECK (confidence_score >= 0 AND confidence_score <= 1),
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 创建分享记录表
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  share_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为相关表创建更新时间触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON student_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_future_predictions_updated_at BEFORE UPDATE ON future_predictions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE future_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- 用户表安全策略
CREATE POLICY "Users can view own profile" ON users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
FOR INSERT WITH CHECK (auth.uid() = id);

-- 学生档案表安全策略
CREATE POLICY "Students can view own profile" ON student_profiles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Students can update own profile" ON student_profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Students can insert own profile" ON student_profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI预测结果表安全策略
CREATE POLICY "Users can view own predictions" ON future_predictions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own predictions" ON future_predictions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON future_predictions
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 分享记录表安全策略
CREATE POLICY "Users can view own shares" ON shares
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own shares" ON shares
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建存储桶用于图片存储
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('predictions', 'predictions', true);

-- 存储桶安全策略
CREATE POLICY "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own avatar" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- AI生成图片存储策略
CREATE POLICY "Users can upload prediction images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'predictions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view prediction images" ON storage.objects
FOR SELECT USING (
  bucket_id = 'predictions'
);

CREATE POLICY "Users can update prediction images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'predictions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete prediction images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'predictions' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);