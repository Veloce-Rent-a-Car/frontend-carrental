import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCarros, createCarro, updateCarro, deleteCarro, exportCarrosCsv, importCarrosCsv } from '@/api/carros'
import type { CarroRequest } from '@/api/types'

export function useCarros() {
  return useQuery({
    queryKey: ['carros'],
    queryFn: getCarros,
  })
}

export function useCarro(id: number) {
  return useQuery({
    queryKey: ['carros', id],
    queryFn: () => getCarro(id),
    enabled: !!id,
  })
}

export function useCriarCarro() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CarroRequest) => createCarro(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carros'] })
    },
  })
}

export function useAtualizarCarro() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CarroRequest }) => updateCarro(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carros'] })
    },
  })
}

export function useDeletarCarro() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteCarro(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carros'] })
    },
  })
}

export function useExportarCarrosCsv() {
  return useMutation({
    mutationFn: exportCarrosCsv,
  })
}

export function useImportarCarrosCsv() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => importCarrosCsv(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['carros'] })
    },
  })
}

async function getCarro(id: number) {
  const { getCarro } = await import('@/api/carros')
  return getCarro(id)
}
