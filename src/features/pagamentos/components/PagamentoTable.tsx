import { Table } from '@/components'
import { formatCurrency, formatDateTime, getStatusBadgeClass, getStatusLabel } from '@/lib/formatters'
import type { Payment } from '@/api/types'

interface PagamentoTableProps {
  pagamentos: Payment[]
}

export function PagamentoTable({ pagamentos }: PagamentoTableProps) {
  const columns = [
    { key: 'id', header: 'ID', render: (p: Payment) => <code>#{p.id}</code> },
    {
      key: 'rent',
      header: 'Aluguel',
      render: (p: Payment) => (
        <div>
          <p className="font-medium">#{p.rent.id}</p>
          <p className="text-xs text-slate-500">{p.rent.client.name}</p>
        </div>
      ),
    },
    { key: 'valorPago', header: 'Valor', render: (p: Payment) => formatCurrency(p.valorPago) },
    {
      key: 'metodoPagamento',
      header: 'Método',
      render: (p: Payment) => p.metodoPagamento.replace('_', ' '),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Payment) => (
        <span className={getStatusBadgeClass(p.status)}>{getStatusLabel(p.status)}</span>
      ),
    },
    { key: 'dataPagamento', header: 'Data', render: (p: Payment) => formatDateTime(p.dataPagamento) },
  ]

  return <Table data={pagamentos} columns={columns} rowKey={(p) => p.id} emptyMessage="Nenhum pagamento encontrado" />
}
