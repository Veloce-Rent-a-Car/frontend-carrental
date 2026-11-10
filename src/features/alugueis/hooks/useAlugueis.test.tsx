import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAlugueis, useCriarAluguel } from './useAlugueis'
import { getAlugueis, createAluguel } from '@/api/alugueis'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Aluguel } from '@/api/types'

vi.mock('@/api/alugueis')

const mockGetAlugueis = vi.mocked(getAlugueis)
const mockCreateAluguel = vi.mocked(createAluguel)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useAlugueis', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('should fetch alugueis', async () => {
    const mockAlugueis: Aluguel[] = [
      { id: 1, cliente: { id: 1, nome: 'Cliente', cpf: '123', email: '', telefone: '', endereco: '', createdAt: '', updatedAt: '' }, carro: { id: 1, marca: 'VW', modelo: 'Gol', ano: 2020, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 150, disponivel: true, createdAt: '', updatedAt: '' }, dataInicio: '2024-01-01', dataFim: '2024-01-05', valorTotal: 600, status: 'ATIVO', createdAt: '', updatedAt: '' },
    ]
    mockGetAlugueis.mockResolvedValue(mockAlugueis)

    const { result } = renderHook(() => useAlugueis(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockAlugueis)
  })

  it('should create aluguel', async () => {
    const newAluguel: Aluguel = { id: 2, cliente: { id: 1, nome: 'Cliente', cpf: '123', email: '', telefone: '', endereco: '', createdAt: '', updatedAt: '' }, carro: { id: 1, marca: 'VW', modelo: 'Gol', ano: 2020, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 150, disponivel: true, createdAt: '', updatedAt: '' }, dataInicio: '2024-02-01', dataFim: '2024-02-03', valorTotal: 300, status: 'PENDENTE', createdAt: '', updatedAt: '' }
    mockCreateAluguel.mockResolvedValue(newAluguel)

    const { result } = renderHook(() => useCriarAluguel(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ clienteId: 1, carroId: 1, dataInicio: '2024-02-01', dataFim: '2024-02-03' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCreateAluguel).toHaveBeenCalled()
  })
})
