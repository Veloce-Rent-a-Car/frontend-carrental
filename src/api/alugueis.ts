import { api } from './client'
import type { Aluguel, AluguelRequest, RelatorioCliente, RelatorioCarro } from './types'

export async function getAlugueis(): Promise<Aluguel[]> {
  return api.get<Aluguel[]>('/api/rentals')
}

export async function getAluguel(id: number): Promise<Aluguel> {
  return api.get<Aluguel>(`/api/rentals/${id}`)
}

export async function createAluguel(data: AluguelRequest): Promise<Aluguel> {
  return api.post<Aluguel>('/api/rentals', data)
}

export async function updateAluguel(id: number, data: Partial<AluguelRequest>): Promise<Aluguel> {
  return api.put<Aluguel>(`/api/rentals/${id}`, data)
}

export async function deleteAluguel(id: number): Promise<void> {
  return api.delete<void>(`/api/rentals/${id}`)
}

export async function getRelatorioPorCliente(): Promise<RelatorioCliente[]> {
  return api.get<RelatorioCliente[]>('/api/rentals/report/by-client')
}

export async function getRelatorioPorCarro(): Promise<RelatorioCarro[]> {
  return api.get<RelatorioCarro[]>('/api/rentals/report/by-car')
}
