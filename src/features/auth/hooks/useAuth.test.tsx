import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './useAuth'
import { login, register, getClientByCpf } from '@/api/auth'
import { setAccessToken } from '@/api/client'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/api/auth')
vi.mock('@/api/client')

const mockLogin = vi.mocked(login)
const mockRegister = vi.mocked(register)
const mockGetClientByCpf = vi.mocked(getClientByCpf)
const mockSetAccessToken = vi.mocked(setAccessToken)

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    <AuthProvider>{children}</AuthProvider>
  </MemoryRouter>
)

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSetAccessToken.mockImplementation(() => undefined)
  })

  it('should login and set user', async () => {
    const mockLoginResponse = {
      type: 'Bearer' as const,
      token: 'test-token',
    }
    const mockUser = {
      id: 1,
      name: 'Test User',
      cpf: '12345678901',
      phone: '11999999999',
      email: 'test@test.com',
      address: 'Rua Teste',
      password: 'hashed',
    }
    mockLogin.mockResolvedValue(mockLoginResponse)
    mockGetClientByCpf.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('12345678901', 'password123')
    })

    expect(mockLogin).toHaveBeenCalledWith({ cpf: '12345678901', password: 'password123' })
    expect(mockSetAccessToken).toHaveBeenCalledWith('test-token')
    expect(mockGetClientByCpf).toHaveBeenCalledWith('12345678901')
    expect(result.current.user).toEqual(mockUser)
  })

  it('should register and login automatically', async () => {
    const mockLoginResponse = {
      type: 'Bearer' as const,
      token: 'test-token',
    }
    const mockRegisterResponse = {
      message: 'Cliente cadastrado com sucesso',
      id: 1,
    }
    const mockUser = {
      id: 1,
      name: 'Test User',
      cpf: '12345678901',
      phone: '11999999999',
      email: 'test@test.com',
      address: 'Rua Teste',
      password: 'hashed',
    }
    mockRegister.mockResolvedValue(mockRegisterResponse)
    mockLogin.mockResolvedValue(mockLoginResponse)
    mockGetClientByCpf.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.register({
        nome: 'Test User',
        cpf: '12345678901',
        telefone: '11999999999',
        email: 'test@test.com',
        endereco: 'Rua Teste',
        password: 'password123',
      })
    })

    expect(mockRegister).toHaveBeenCalledWith({
      nome: 'Test User',
      cpf: '12345678901',
      telefone: '11999999999',
      email: 'test@test.com',
      endereco: 'Rua Teste',
      password: 'password123',
    })
    expect(mockLogin).toHaveBeenCalledWith({ cpf: '12345678901', password: 'password123' })
    expect(result.current.user).toEqual(mockUser)
  })

  it('should logout and clear user', async () => {
    const mockLoginResponse = {
      type: 'Bearer' as const,
      token: 'test-token',
    }
    const mockUser = {
      id: 1,
      name: 'Test User',
      cpf: '12345678901',
      phone: '11999999999',
      email: 'test@test.com',
      address: 'Rua Teste',
      password: 'hashed',
    }
    mockLogin.mockResolvedValue(mockLoginResponse)
    mockGetClientByCpf.mockResolvedValue(mockUser)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('12345678901', 'password123')
    })

    expect(result.current.user).toEqual(mockUser)

    act(() => {
      result.current.logout()
    })

    expect(mockSetAccessToken).toHaveBeenCalledWith(null)
    expect(result.current.user).toBeNull()
  })
})
