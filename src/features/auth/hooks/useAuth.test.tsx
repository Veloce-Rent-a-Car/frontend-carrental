import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './useAuth'
import { login, register } from '@/api/auth'
import { setAccessToken } from '@/api/client'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('@/api/auth')
vi.mock('@/api/client')

const mockLogin = vi.mocked(login)
const mockRegister = vi.mocked(register)
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
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, nome: 'Test User', email: 'test@test.com', role: 'USER' },
    }
    mockLogin.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })

    expect(mockLogin).toHaveBeenCalledWith({ email: 'test@test.com', senha: 'password123' })
    expect(mockSetAccessToken).toHaveBeenCalledWith('test-token')
    expect(result.current.user).toEqual(mockResponse.user)
  })

  it('should register and set user', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, nome: 'Test User', email: 'test@test.com', role: 'USER' },
    }
    mockRegister.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.register('Test User', 'test@test.com', 'password123')
    })

    expect(mockRegister).toHaveBeenCalledWith({ nome: 'Test User', email: 'test@test.com', senha: 'password123' })
    expect(mockSetAccessToken).toHaveBeenCalledWith('test-token')
    expect(result.current.user).toEqual(mockResponse.user)
  })

  it('should logout and clear user', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, nome: 'Test User', email: 'test@test.com', role: 'USER' },
    }
    mockLogin.mockResolvedValue(mockResponse)

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login('test@test.com', 'password123')
    })

    expect(result.current.user).toEqual(mockResponse.user)

    act(() => {
      result.current.logout()
    })

    expect(mockSetAccessToken).toHaveBeenCalledWith(null)
    expect(result.current.user).toBeNull()
  })
})
