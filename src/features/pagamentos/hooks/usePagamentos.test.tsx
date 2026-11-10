import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePagamentos, useCriarPagamento } from './usePagamentos'
import { getPagamentos, createPagamento } from '@/api/pagamentos'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Payment } from '@/api/types'

vi.mock('@/api/pagamentos')

const mockGetPagamentos = vi.mocked(getPagamentos)
const mockCreatePagamento = vi.mocked(createPagamento)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('usePagamentos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('should fetch pagamentos', async () => {
    const mockPagamentos: Payment[] = [
      { id: 1, rent: { id: 1, client: { id: 1, name: 'Cliente', cpf: '123', phone: '', email: '', address: '', password: '' }, car: { id: 1, modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 150, statusDisponibilidade: 'DISPONIVEL' }, rentValue: 600, startDate: '2024-01-01T00:00:00', endDate: '2024-01-05T00:00:00', status: 'ACTIVE' }, valorPago: 600, dataPagamento: '2024-01-01T10:00:00', metodoPagamento: 'PIX', status: 'APROVADO' },
    ]
    mockGetPagamentos.mockResolvedValue(mockPagamentos)

    const { result } = renderHook(() => usePagamentos(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockPagamentos)
  })

  it('should create pagamento', async () => {
    const newPagamento: Payment = { id: 2, rent: { id: 1, client: { id: 1, name: 'Cliente', cpf: '123', phone: '', email: '', address: '', password: '' }, car: { id: 1, modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 150, statusDisponibilidade: 'DISPONIVEL' }, rentValue: 600, startDate: '2024-01-01T00:00:00', endDate: '2024-01-05T00:00:00', status: 'ACTIVE' }, valorPago: 300, dataPagamento: '2024-01-01T10:00:00', metodoPagamento: 'PIX', status: 'APROVADO' }
    mockCreatePagamento.mockResolvedValue(newPagamento)

    const { result } = renderHook(() => useCriarPagamento(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ rentId: 1, valorPago: 300, metodoPagamento: 'PIX' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCreatePagamento).toHaveBeenCalled()
  })
})
