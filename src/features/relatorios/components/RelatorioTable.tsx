import { Table } from '@/components'
import { formatCurrency } from '@/lib/formatters'

interface RelatorioCliente {
  clienteId: number
  clienteNome: string
  totalAlugueis: number
  valorTotal: number
}

interface RelatorioCarro {
  carroId: number
  carroMarca: string
  carroModelo: string
  carroPlaca: string
  totalAlugueis: number
  valorTotal: number
}

interface RelatorioTableProps {
  tipo: 'cliente' | 'carro'
  data: RelatorioCliente[] | RelatorioCarro[]
}

export function RelatorioTable({ tipo, data }: RelatorioTableProps) {
  if (tipo === 'cliente') {
    const columns = [
      { key: 'clienteNome', header: 'Cliente' },
      { key: 'totalAlugueis', header: 'Total Aluguéis' },
      { key: 'valorTotal', header: 'Valor Total', render: (r: RelatorioCliente) => formatCurrency(r.valorTotal) },
    ]
    return <Table data={data as RelatorioCliente[]} columns={columns} rowKey={(r) => r.clienteId} emptyMessage="Nenhum relatório de cliente" />
  }

  const columns = [
    { key: 'carroMarca', header: 'Marca' },
    { key: 'carroModelo', header: 'Modelo' },
    { key: 'carroPlaca', header: 'Placa' },
    { key: 'totalAlugueis', header: 'Total Aluguéis' },
    { key: 'valorTotal', header: 'Valor Total', render: (r: RelatorioCarro) => formatCurrency(r.valorTotal) },
  ]
  return <Table data={data as RelatorioCarro[]} columns={columns} rowKey={(r) => r.carroId} emptyMessage="Nenhum relatório de carro" />
}
