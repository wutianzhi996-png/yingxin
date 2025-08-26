'use client'

import { createContext, useContext, useEffect } from 'react'
import { useAuth } from '@/lib/hooks/use-auth'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInAnonymously: () => Promise<{ user: User | null; error: any }>
  signOut: () => Promise<void>
  upsertProfile: (profileData: {
    name: string
    phone?: string
    gender?: 'male' | 'female' | 'other'
    student_id?: string
  }) => Promise<any>
  loadUserProfile: (userId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}