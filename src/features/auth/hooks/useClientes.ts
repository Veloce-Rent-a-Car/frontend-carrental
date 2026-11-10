import { useQuery } from '@tanstack/react-query'
import { getClientes } from '@/api/clientes'
import type { Client } from '@/api/types'

export function useClientes() {
  return useQuery<Client[]>({
    queryKey: ['clientes'],
    queryFn: getClientes,
  })
}
