import { useQuery } from '@tanstack/react-query'
import { getClientes } from '@/api/clientes'
import type { Cliente } from '@/api/types'

export function useClientes() {
  return useQuery<Cliente[]>({
    queryKey: ['clientes'],
    queryFn: getClientes,
  })
}
