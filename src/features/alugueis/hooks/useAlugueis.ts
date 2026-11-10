import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAlugueis, createAluguel, getRelatorioPorCliente, getRelatorioPorCarro } from '@/api/alugueis'
import type { NewRentDTO, RentModel, RentReportByClient, RentReportByCar } from '@/api/types'

export function useAlugueis() {
  return useQuery<RentModel[]>({
    queryKey: ['alugueis'],
    queryFn: getAlugueis,
  })
}

export function useCriarAluguel() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NewRentDTO) => createAluguel(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alugueis'] })
      queryClient.invalidateQueries({ queryKey: ['carros'] })
    },
  })
}

export function useRelatorioPorCliente() {
  return useQuery<RentReportByClient>({
    queryKey: ['relatorios', 'por-cliente'],
    queryFn: getRelatorioPorCliente,
  })
}

export function useRelatorioPorCarro() {
  return useQuery<RentReportByCar>({
    queryKey: ['relatorios', 'por-carro'],
    queryFn: getRelatorioPorCarro,
  })
}
