import { useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/supabase'
import { useUserStore } from '@/lib/store/user-store'

export function useAuth() {
  const [loading, setLoading] = useState(true)
  const { user, setUser, setProfile, setPrediction, reset } = useUserStore()

  useEffect(() => {
    // 获取初始会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // 用户登录后，加载用户档案和预测结果
          await loadUserProfile(session.user.id)
        } else {
          // 用户登出后，清除本地状态
          reset()
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setPrediction, reset])

  // 加载用户档案
  const loadUserProfile = async (userId: string) => {
    try {
      // 加载学生档案
      const { data: profile, error: profileError } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError)
      } else if (profile) {
        setProfile(profile)
      }

      // 加载AI预测结果
      const { data: prediction, error: predictionError } = await supabase
        .from('future_predictions')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (predictionError && predictionError.code !== 'PGRST116') {
        console.error('Error loading prediction:', predictionError)
      } else if (prediction) {
        setPrediction(prediction)
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error)
    }
  }

  // 登录函数
  const signInAnonymously = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInAnonymously()
      
      if (error) {
        throw error
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { user: null, error }
    } finally {
      setLoading(false)
    }
  }

  // 登出函数
  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  // 创建或更新用户档案
  const upsertProfile = async (profileData: {
    name: string
    phone?: string
    gender?: 'male' | 'female' | 'other'
    student_id?: string
  }) => {
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          email: user.email || '',
          name: profileData.name,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInAnonymously,
    signOut,
    upsertProfile,
    loadUserProfile
  }
}