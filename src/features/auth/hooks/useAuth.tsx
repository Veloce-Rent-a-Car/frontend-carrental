import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi, getClientByCpf } from '@/api/auth'
import { setAccessToken, getAccessToken } from '@/api/client'
import type { Client } from '@/api/types'

interface AuthContextType {
  user: Client | null
  isLoading: boolean
  login: (cpf: string, password: string) => Promise<void>
  register: (data: { nome: string; cpf: string; telefone: string; email: string; endereco?: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      // Token exists, but we don't have user data - could fetch if we stored CPF
      // For now, just mark as loaded
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (cpf: string, password: string) => {
    const response = await loginApi({ cpf, password })
    setAccessToken(response.token)
    // Buscar dados do usuário pelo CPF
    const userData = await getClientByCpf(cpf)
    setUser(userData)
    navigate('/carros')
  }

  const register = async (data: { nome: string; cpf: string; telefone: string; email: string; endereco?: string; password: string }) => {
    await registerApi(data)
    // Após registrar, fazer login automático
    await login(data.cpf, data.password)
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
