import { Table } from '@/components'
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusLabel, formatCpf } from '@/lib/formatters'
import type { RentModel } from '@/api/types'

interface AluguelTableProps {
  alugueis: RentModel[]
}

export function AluguelTable({ alugueis }: AluguelTableProps) {
  const columns = [
    { key: 'id', header: 'ID', render: (a: RentModel) => <code>#{a.id}</code> },
    {
      key: 'client',
      header: 'Cliente',
      render: (a: RentModel) => (
        <div>
          <p className="font-medium">{a.client.name}</p>
          <p className="text-xs text-slate-500">{formatCpf(a.client.cpf)}</p>
        </div>
      ),
    },
    {
      key: 'car',
      header: 'Carro',
      render: (a: RentModel) => (
        <div>
          <p className="font-medium">{a.car.modelo}</p>
          <p className="text-xs text-slate-500">{a.car.categoria}</p>
        </div>
      ),
    },
    { key: 'startDate', header: 'Início', render: (a: RentModel) => formatDate(a.startDate) },
    { key: 'endDate', header: 'Fim', render: (a: RentModel) => a.endDate ? formatDate(a.endDate) : '—' },
    { key: 'rentValue', header: 'Total', render: (a: RentModel) => formatCurrency(a.rentValue) },
    {
      key: 'status',
      header: 'Status',
      render: (a: RentModel) => (
        <span className={getStatusBadgeClass(a.status)}>{getStatusLabel(a.status)}</span>
      ),
    },
  ]

  return <Table data={alugueis} columns={columns} rowKey={(a) => a.id} emptyMessage="Nenhum aluguel encontrado" />
}
