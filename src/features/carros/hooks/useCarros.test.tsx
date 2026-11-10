import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCarros, useCriarCarro, useAtualizarCarro, useDeletarCarro } from './useCarros'
import { getCarros, createCarro, updateCarro, deleteCarro } from '@/api/carros'
import { ReactNode } from 'react'
import { vi, describe, it, beforeEach, expect } from 'vitest'

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
    const mockCarros = [
      { id: 1, marca: 'VW', modelo: 'Gol', ano: 2020, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 150, disponivel: true, createdAt: '', updatedAt: '' },
    ]
    mockGetCarros.mockResolvedValue(mockCarros)

    const { result } = renderHook(() => useCarros(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(mockCarros)
  })

  it('should create carro', async () => {
    const newCarro = { id: 2, marca: 'Fiat', modelo: 'Uno', ano: 2021, placa: 'XYZ9W87', cor: 'Branco', valorDiaria: 120, disponivel: true, createdAt: '', updatedAt: '' }
    mockCreateCarro.mockResolvedValue(newCarro)

    const { result } = renderHook(() => useCriarCarro(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ marca: 'Fiat', modelo: 'Uno', ano: 2021, placa: 'XYZ9W87', cor: 'Branco', valorDiaria: 120 })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(mockCreateCarro).toHaveBeenCalled()
  })

  it('should update carro', async () => {
    const updatedCarro = { id: 1, marca: 'VW', modelo: 'Gol', ano: 2022, placa: 'ABC1D23', cor: 'Preto', valorDiaria: 160, disponivel: true, createdAt: '', updatedAt: '' }
    mockUpdateCarro.mockResolvedValue(updatedCarro)

    const { result } = renderHook(() => useAtualizarCarro(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync({ id: 1, data: { marca: 'VW', modelo: 'Gol', ano: 2022, placa: 'ABC1D23', cor: 'Preto', valorDiaria: 160 } })
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
