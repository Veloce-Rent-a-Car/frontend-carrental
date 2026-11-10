import { Table } from '@/components'
import { formatCurrency } from '@/lib/formatters'

export interface RentReportByClient {
  [clientKey: string]: Array<{
    id: number
    client: { id: number; name: string; cpf: string; phone: string; email: string; address: string; password: string }
    car: { id: number; modelo: string; placa: string; categoria: string; valorDaDiaria: number; statusDisponibilidade: string }
    rentValue: number
    startDate: string
    endDate: string | null
    status: string
  }>
}

export interface RentReportByCar {
  [carKey: string]: Array<{
    id: number
    client: { id: number; name: string; cpf: string; phone: string; email: string; address: string; password: string }
    car: { id: number; modelo: string; placa: string; categoria: string; valorDaDiaria: number; statusDisponibilidade: string }
    rentValue: number
    startDate: string
    endDate: string | null
    status: string
  }>
}

interface RelatorioTableProps {
  tipo: 'cliente' | 'carro'
  data: RentReportByClient | RentReportByCar
}

export function RelatorioTable({ tipo, data }: RelatorioTableProps) {
  if (tipo === 'cliente') {
    const entries = Object.entries(data as RentReportByClient)
    if (entries.length === 0) {
      return (
        <div className="empty-state">
          <svg className="empty-state-icon" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Nenhum relatório de cliente</p>
        </div>
      )
    }
    const columns = [
      { key: 'clientKey', header: 'Cliente' },
      { key: 'totalAlugueis', header: 'Total Aluguéis' },
      { key: 'valorTotal', header: 'Valor Total', render: (row: { clientKey: string; totalAlugueis: number; valorTotal: number }) => formatCurrency(row.valorTotal) },
    ]
    const rows = entries.map(([clientKey, alugueis]) => ({
      clientKey,
      totalAlugueis: alugueis.length,
      valorTotal: alugueis.reduce((sum, a) => sum + a.rentValue, 0),
    }))
    return <Table data={rows} columns={columns} rowKey={(r) => r.clientKey} emptyMessage="Nenhum relatório de cliente" />
  }

  const entries = Object.entries(data as RentReportByCar)
  if (entries.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p>Nenhum relatório de carro</p>
      </div>
    )
  }
  const columns = [
    { key: 'carKey', header: 'Carro' },
    { key: 'totalAlugueis', header: 'Total Aluguéis' },
    { key: 'valorTotal', header: 'Valor Total', render: (row: { carKey: string; totalAlugueis: number; valorTotal: number }) => formatCurrency(row.valorTotal) },
  ]
  const rows = entries.map(([carKey, alugueis]) => ({
    carKey,
    totalAlugueis: alugueis.length,
    valorTotal: alugueis.reduce((sum, a) => sum + a.rentValue, 0),
  }))
  return <Table data={rows} columns={columns} rowKey={(r) => r.carKey} emptyMessage="Nenhum relatório de carro" />
}
