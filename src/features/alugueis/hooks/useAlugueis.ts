import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlugueis, createAluguel, getRelatorioPorCliente, getRelatorioPorCarro } from '@/api/alugueis'
import type { AluguelRequest, RelatorioCliente, RelatorioCarro } from '@/api/types'

export function useAlugueis() {
  return useQuery({
    queryKey: ['alugueis'],
    queryFn: getAlugueis,
  })
}

export function useCriarAluguel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AluguelRequest) => createAluguel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alugueis'] })
      queryClient.invalidateQueries({ queryKey: ['carros'] })
    },
  })
}

export function useRelatorioPorCliente() {
  return useQuery<RelatorioCliente[]>({
    queryKey: ['relatorios', 'por-cliente'],
    queryFn: getRelatorioPorCliente,
  })
}

export function useRelatorioPorCarro() {
  return useQuery<RelatorioCarro[]>({
    queryKey: ['relatorios', 'por-carro'],
    queryFn: getRelatorioPorCarro,
  })
}
