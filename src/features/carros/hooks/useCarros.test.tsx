import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCarros, useCriarCarro, useAtualizarCarro, useDeletarCarro } from './useCarros'
import { getCarros, createCarro, updateCarro, deleteCarro } from '@/api/carros'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'
import type { Carro } from '@/api/types'

vi.mock('@/api/carros')

const mockGetCarros = vi.mocked(getCarros)
const mockCreateCarro = vi.mocked(createCarro)
const mockUpdateCarro = vi.mocked(updateCarro)
const mockDeleteCarro = vi.mocked(deleteCarro)

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
})

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)

describe('useCarros', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    queryClient.clear()
  })

  it('should fetch carros', async () => {
    const mockCarros: Carro[] = [
      { id: 1, modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 150, statusDisponibilidade: 'DISPONIVEL' },
    ]
    mockGetCarros.mockResolvedValue(mockCarros)

    const { result } = renderHook(() => useCarros(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockCarros)
  })

  it('should create carro', async () => {
    const newCarro: Carro = { id: 2, modelo: 'Uno', placa: 'XYZ9W87', categoria: 'ECONOMICO', valorDaDiaria: 120, statusDisponibilidade: 'DISPONIVEL' }
    mockCreateCarro.mockResolvedValue(newCarro)

    const { result } = renderHook(() => useCriarCarro(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ modelo: 'Uno', placa: 'XYZ9W87', categoria: 'ECONOMICO', valorDaDiaria: 120, statusDisponibilidade: 'DISPONIVEL' })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCreateCarro).toHaveBeenCalled()
  })

  it('should update carro', async () => {
    const updatedCarro: Carro = { id: 1, modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 160, statusDisponibilidade: 'DISPONIVEL' }
    mockUpdateCarro.mockResolvedValue(updatedCarro)

    const { result } = renderHook(() => useAtualizarCarro(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ id: 1, data: { modelo: 'Gol', placa: 'ABC1D23', categoria: 'ECONOMICO', valorDaDiaria: 160, statusDisponibilidade: 'DISPONIVEL' } })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockUpdateCarro).toHaveBeenCalledWith(1, expect.any(Object))
  })

  it('should delete carro', async () => {
    mockDeleteCarro.mockResolvedValue(undefined)

    const { result } = renderHook(() => useDeletarCarro(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync(1)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockDeleteCarro).toHaveBeenCalledWith(1)
  })
})
