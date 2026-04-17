import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  token: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: (() => {
        try {
          return localStorage.getItem('upstack_token')
        } catch {
          return null
        }
      })(),

      setAuth: (user, token) => {
        localStorage.setItem('upstack_token', token)
        set({ user, token })
      },

      logout: () => {
        localStorage.removeItem('upstack_token')
        set({ user: null, token: null })
      },
    }),
    {
      name: 'upstack-auth',
      // Only persist user, token is kept in localStorage separately for the axios interceptor
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
)
