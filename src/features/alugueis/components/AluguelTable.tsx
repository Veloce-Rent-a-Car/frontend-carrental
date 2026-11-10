import { Table } from '@/components'
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel } from '@/lib/formatters'
import type { Aluguel } from '@/api/types'

interface AluguelTableProps {
  alugueis: Aluguel[]
}

export function AluguelTable({ alugueis }: AluguelTableProps) {
  const columns = [
    { key: 'id', header: 'ID', render: (a: Aluguel) => <code>#{a.id}</code> },
    {
      key: 'cliente',
      header: 'Cliente',
      render: (a: Aluguel) => (
        <div>
          <p className="font-medium">{a.cliente.nome}</p>
          <p className="text-xs text-slate-500">{a.cliente.cpf}</p>
        </div>
      ),
    },
    {
      key: 'carro',
      header: 'Carro',
      render: (a: Aluguel) => (
        <div>
          <p className="font-medium">{a.carro.marca} {a.carro.modelo}</p>
          <p className="text-xs text-slate-500">{a.carro.placa}</p>
        </div>
      ),
    },
    { key: 'dataInicio', header: 'Início', render: (a: Aluguel) => formatDate(a.dataInicio) },
    { key: 'dataFim', header: 'Fim', render: (a: Aluguel) => formatDate(a.dataFim) },
    { key: 'valorTotal', header: 'Total', render: (a: Aluguel) => formatCurrency(a.valorTotal) },
    {
      key: 'status',
      header: 'Status',
      render: (a: Aluguel) => (
        <span className={getStatusBadgeClass(a.status)}>{getStatusLabel(a.status)}</span>
      ),
    },
  ]

  return <Table data={alugueis} columns={columns} rowKey={(a) => a.id} emptyMessage="Nenhum aluguel encontrado" />
}
