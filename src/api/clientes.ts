import { api } from './client'
import type { Client } from './types'

export async function getClientes(): Promise<Client[]> {
  return api.get<Client[]>('/api/clients')
}

export async function getCliente(id: number): Promise<Client> {
  return api.get<Client>(`/api/clients/${id}`)
}

export async function createCliente(data: Client): Promise<Client> {
  return api.post<Client>('/api/clients', data)
}

export async function updateCliente(id: number, data: Client): Promise<Client> {
  return api.put<Client>(`/api/clients/${id}`, data)
}

export async function deleteCliente(id: number): Promise<void> {
  return api.delete<void>(`/api/clients/${id}`)
}
