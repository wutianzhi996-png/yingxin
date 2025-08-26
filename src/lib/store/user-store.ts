import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase/database.types'

type StudentProfile = Database['public']['Tables']['student_profiles']['Row']
type FuturePrediction = Database['public']['Tables']['future_predictions']['Row']

interface UserState {
  user: User | null
  profile: StudentProfile | null
  prediction: FuturePrediction | null
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: StudentProfile | null) => void
  setPrediction: (prediction: FuturePrediction | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      prediction: null,
      loading: false,
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setPrediction: (prediction) => set({ prediction }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ user: null, profile: null, prediction: null, loading: false }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        prediction: state.prediction,
      }),
    }
  )
)