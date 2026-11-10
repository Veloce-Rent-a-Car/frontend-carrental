import { api } from './client'
import type { Cliente, ClienteRequest } from './types'

export async function getClientes(): Promise<Cliente[]> {
  return api.get<Cliente[]>('/api/clients')
}

export async function getCliente(id: number): Promise<Cliente> {
  return api.get<Cliente>(`/api/clients/${id}`)
}

export async function createCliente(data: ClienteRequest): Promise<Cliente> {
  return api.post<Cliente>('/api/clients', data)
}

export async function updateCliente(id: number, data: ClienteRequest): Promise<Cliente> {
  return api.put<Cliente>(`/api/clients/${id}`, data)
}

export async function deleteCliente(id: number): Promise<void> {
  return api.delete<void>(`/api/clients/${id}`)
}
