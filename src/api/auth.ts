import { api } from './client'
import type { LoginRequest, RegisterRequest, AuthResponse } from './types'

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/login', data)
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return api.post<AuthResponse>('/api/auth/register', data)
}
