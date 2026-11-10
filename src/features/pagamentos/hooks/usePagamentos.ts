import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPagamentos, createPagamento } from '@/api/pagamentos'
import type { PagamentoRequest } from '@/api/types'

export function usePagamentos() {
  return useQuery({
    queryKey: ['pagamentos'],
    queryFn: getPagamentos,
  })
}

export function useCriarPagamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: PagamentoRequest) => createPagamento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] })
      queryClient.invalidateQueries({ queryKey: ['alugueis'] })
    },
  })
}
