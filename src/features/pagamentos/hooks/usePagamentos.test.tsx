import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { usePagamentos, useCriarPagamento } from './usePagamentos'
import { getPagamentos, createPagamento } from '@/api/pagamentos'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Pagamento } from '@/api/types'

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
    const mockPagamentos: Pagamento[] = [
      { id: 1, aluguel: { id: 1, cliente: { id: 1, nome: 'Cliente', cpf: '123', email: '', telefone: '', endereco: '', createdAt: '', updatedAt: '' }, carro: { id: 1, marca: 'VW', modelo: 'Gol', ano: 2020, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 150, disponivel: true, createdAt: '', updatedAt: '' }, dataInicio: '2024-01-01', dataFim: '2024-01-05', valorTotal: 600, status: 'ATIVO', createdAt: '', updatedAt: '' }, valorPago: 600, metodoPagamento: 'PIX', status: 'CONFIRMADO', dataPagamento: '2024-01-01T10:00:00', createdAt: '', updatedAt: '' },
    ]
    mockGetPagamentos.mockResolvedValue(mockPagamentos)

    const { result } = renderHook(() => usePagamentos(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockPagamentos)
  })

  it('should create pagamento', async () => {
    const newPagamento: Pagamento = { id: 2, aluguel: { id: 1, cliente: { id: 1, nome: 'Cliente', cpf: '123', email: '', telefone: '', endereco: '', createdAt: '', updatedAt: '' }, carro: { id: 1, marca: 'VW', modelo: 'Gol', ano: 2020, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 150, disponivel: true, createdAt: '', updatedAt: '' }, dataInicio: '2024-01-01', dataFim: '2024-01-05', valorTotal: 600, status: 'ATIVO', createdAt: '', updatedAt: '' }, valorPago: 300, metodoPagamento: 'DINHEIRO', status: 'CONFIRMADO', dataPagamento: '2024-01-01T10:00:00', createdAt: '', updatedAt: '' }
    mockCreatePagamento.mockResolvedValue(newPagamento)

    const { result } = renderHook(() => useCriarPagamento(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ aluguelId: 1, valorPago: 300, metodoPagamento: 'DINHEIRO' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCreatePagamento).toHaveBeenCalled()
  })
})
