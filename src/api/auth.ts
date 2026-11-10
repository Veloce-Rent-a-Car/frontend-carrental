import { api } from './client'
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, Client } from './types'

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return api.post<LoginResponse>('/api/auth/login', data)
}

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return api.post<RegisterResponse>('/api/auth/register', data)
}

export async function getClientByCpf(cpf: string): Promise<Client> {
  return api.get<Client>(`/api/clients/cpf/${cpf}`)
}
