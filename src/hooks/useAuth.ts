import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types'

interface LoginPayload {
  email: string
  password: string
}

interface RegisterPayload {
  name: string
  email: string
  password: string
}

interface AuthResponse {
  user: User
  token: string
}

export function useAuth() {
  const { user, token, setAuth, logout: storeLogout } = useAuthStore()
  const navigate = useNavigate()

  const isAuthenticated = !!token && !!user

  async function login(email: string, password: string) {
    const payload: LoginPayload = { email, password }
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload)
    setAuth(data.user, data.token)
    toast.success(`Welcome back, ${data.user.name}!`)
    navigate('/dashboard')
  }

  async function register(name: string, email: string, password: string) {
    const payload: RegisterPayload = { name, email, password }
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload)
    setAuth(data.user, data.token)
    toast.success(`Account created! Welcome, ${data.user.name}!`)
    navigate('/dashboard')
  }

  function logout() {
    storeLogout()
    navigate('/login')
    toast.info('Logged out successfully.')
  }

  return { user, token, isAuthenticated, login, register, logout }
}
