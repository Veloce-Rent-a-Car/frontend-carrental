import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAlugueis, useCriarAluguel } from './useAlugueis'
import { getAlugueis, createAluguel } from '@/api/alugueis'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { RentModel } from '@/api/types'

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
    const mockAlugueis: RentModel[] = [
      { id: 1, client: { id: 1, name: 'Cliente', cpf: '123', phone: '', email: '', address: '', password: '' }, car: { id: 1, modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 150, statusDisponibilidade: 'DISPONIVEL' }, rentValue: 600, startDate: '2024-01-01T00:00:00', endDate: '2024-01-05T00:00:00', status: 'ACTIVE' },
    ]
    mockGetAlugueis.mockResolvedValue(mockAlugueis)

    const { result } = renderHook(() => useAlugueis(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockAlugueis)
  })

  it('should create aluguel', async () => {
    const newAluguel: RentModel = { id: 2, client: { id: 1, name: 'Cliente', cpf: '123', phone: '', email: '', address: '', password: '' }, car: { id: 1, modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 150, statusDisponibilidade: 'DISPONIVEL' }, rentValue: 300, startDate: '2024-02-01T00:00:00', endDate: '2024-02-03T00:00:00', status: 'PENDING' }
    mockCreateAluguel.mockResolvedValue(newAluguel)

    const { result } = renderHook(() => useCriarAluguel(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ clientCpf: '12345678901', carName: 'Gol', carModelType: 'ECONOMICO', rentValue: 300 })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCreateAluguel).toHaveBeenCalled()
  })
})
