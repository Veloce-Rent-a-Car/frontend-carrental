import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '@/api/auth'
import { setAccessToken, getAccessToken } from '@/api/client'
import type { User } from '@/api/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, senha: string) => {
    const response = await loginApi({ email, senha })
    setAccessToken(response.token)
    setUser(response.user)
    navigate('/carros')
  }

  const register = async (nome: string, email: string, senha: string) => {
    const response = await registerApi({ nome, email, senha })
    setAccessToken(response.token)
    setUser(response.user)
    navigate('/carros')
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}
