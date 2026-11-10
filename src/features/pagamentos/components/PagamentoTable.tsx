import { Table } from '@/components'
import { formatCurrency, formatDateTime, getStatusBadgeClass, getStatusLabel } from '@/lib/formatters'
import type { Pagamento } from '@/api/types'

interface PagamentoTableProps {
  pagamentos: Pagamento[]
}

export function PagamentoTable({ pagamentos }: PagamentoTableProps) {
  const columns = [
    { key: 'id', header: 'ID', render: (p: Pagamento) => <code>#{p.id}</code> },
    {
      key: 'aluguel',
      header: 'Aluguel',
      render: (p: Pagamento) => (
        <div>
          <p className="font-medium">#{p.aluguel.id}</p>
          <p className="text-xs text-slate-500">{p.aluguel.cliente.nome}</p>
        </div>
      ),
    },
    { key: 'valorPago', header: 'Valor', render: (p: Pagamento) => formatCurrency(p.valorPago) },
    {
      key: 'metodoPagamento',
      header: 'Método',
      render: (p: Pagamento) => p.metodoPagamento.replace('_', ' '),
    },
    {
      key: 'status',
      header: 'Status',
      render: (p: Pagamento) => (
        <span className={getStatusBadgeClass(p.status)}>{getStatusLabel(p.status)}</span>
      ),
    },
    { key: 'dataPagamento', header: 'Data', render: (p: Pagamento) => formatDateTime(p.dataPagamento) },
  ]

  return <Table data={pagamentos} columns={columns} rowKey={(p) => p.id} emptyMessage="Nenhum pagamento encontrado" />
}
