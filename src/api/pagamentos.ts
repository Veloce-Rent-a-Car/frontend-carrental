import { api } from './client'
import type { Pagamento, PagamentoRequest } from './types'

export async function getPagamentos(): Promise<Pagamento[]> {
  return api.get<Pagamento[]>('/api/payments')
}

export async function getPagamento(id: number): Promise<Pagamento> {
  return api.get<Pagamento>(`/api/payments/${id}`)
}

export async function createPagamento(data: PagamentoRequest): Promise<Pagamento> {
  return api.post<Pagamento>('/api/payments', data)
}
