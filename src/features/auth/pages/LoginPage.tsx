import { LoginForm } from '../components/LoginForm'
import { RegisterForm } from '../components/RegisterForm'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Veloce Rent a Car</h1>
          <p className="text-slate-500 mt-2">Faça login para acessar o sistema</p>
        </div>
        <div className="card">
          {isRegister ? (
            <>
              <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Criar conta</h2>
              <RegisterForm />
              <p className="mt-6 text-center text-sm text-slate-600">
                Já tem conta?{' '}
                <button onClick={() => setIsRegister(false)} className="text-blue-600 hover:underline">
                  Fazer login
                </button>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Entrar</h2>
              <LoginForm />
              <p className="mt-6 text-center text-sm text-slate-600">
                Não tem conta?{' '}
                <button onClick={() => setIsRegister(true)} className="text-blue-600 hover:underline">
                  Cadastrar
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
