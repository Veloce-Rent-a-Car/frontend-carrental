import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPagamentos, createPagamento } from '@/api/pagamentos'
import type { NewPaymentDTO, Payment } from '@/api/types'

export function usePagamentos() {
  return useQuery<Payment[]>({
    queryKey: ['pagamentos'],
    queryFn: getPagamentos,
  })
}

export function useCriarPagamento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: NewPaymentDTO) => createPagamento(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagamentos'] })
      queryClient.invalidateQueries({ queryKey: ['alugueis'] })
    },
  })
}
