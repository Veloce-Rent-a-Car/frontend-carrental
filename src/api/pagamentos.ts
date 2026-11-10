import { api } from './client'
import type { Payment, NewPaymentDTO } from './types'

export async function getPagamentos(): Promise<Payment[]> {
  return api.get<Payment[]>('/api/payments')
}

export async function getPagamento(id: number): Promise<Payment> {
  return api.get<Payment>(`/api/payments/${id}`)
}

export async function createPagamento(data: NewPaymentDTO): Promise<Payment> {
  return api.post<Payment>('/api/payments', data)
}
