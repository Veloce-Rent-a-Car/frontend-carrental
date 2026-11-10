import { Table } from '@/components'
import { formatCurrency, formatPlaca, getStatusBadgeClass, getStatusLabel } from '@/lib/formatters'
import type { Carro } from '@/api/types'

interface CarroTableProps {
  carros: Carro[]
  onEdit: (carro: Carro) => void
  onDelete: (carro: Carro) => void
}

export function CarroTable({ carros, onEdit, onDelete }: CarroTableProps) {
  const columns = [
    { key: 'modelo', header: 'Modelo' },
    {
      key: 'placa',
      header: 'Placa',
      render: (carro: Carro) => <code className="font-mono">{formatPlaca(carro.placa)}</code>,
    },
    { key: 'categoria', header: 'Categoria' },
    {
      key: 'valorDaDiaria',
      header: 'Diária',
      render: (carro: Carro) => formatCurrency(carro.valorDaDiaria),
    },
    {
      key: 'statusDisponibilidade',
      header: 'Status',
      render: (carro: Carro) => (
        <span className={getStatusBadgeClass(carro.statusDisponibilidade.toLowerCase())}>
          {getStatusLabel(carro.statusDisponibilidade)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Ações',
      render: (carro: Carro) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(carro)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            aria-label={`Editar ${carro.modelo}`}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(carro)}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
            aria-label={`Excluir ${carro.modelo}`}
          >
            Excluir
          </button>
        </div>
      ),
    },
  ]

  return <Table data={carros} columns={columns} rowKey={(c) => c.id} emptyMessage="Nenhum carro cadastrado" />
}
