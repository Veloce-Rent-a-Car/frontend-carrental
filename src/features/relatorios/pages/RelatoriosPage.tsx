import { useState } from 'react'
import { ToastContainer } from '@/components'
import { RelatorioTable } from '../components/RelatorioTable'
import { useRelatorioPorCliente, useRelatorioPorCarro } from '@/features/alugueis/hooks/useAlugueis'
import { formatCurrency } from '@/lib/formatters'

export function RelatoriosPage() {
  const [aba, setAba] = useState<'cliente' | 'carro'>('cliente')
  const { data: porCliente, isLoading: loadingCliente, error: errorCliente } = useRelatorioPorCliente()
  const { data: porCarro, isLoading: loadingCarro, error: errorCarro } = useRelatorioPorCarro()

  const isLoading = aba === 'cliente' ? loadingCliente : loadingCarro
  const error = aba === 'cliente' ? errorCliente : errorCarro
  const data = aba === 'cliente' ? porCliente : porCarro

  const totalGeral = data?.reduce((acc, r) => acc + r.valorTotal, 0) || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="card text-center">
        <p className="text-red-600">Erro ao carregar relatórios: {(error as Error).message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Relatórios</h1>

      <div className="card">
        <div className="border-b border-slate-200 mb-4">
          <nav className="flex gap-1" aria-label="Abas de relatório">
            <button
              onClick={() => setAba('cliente')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                aba === 'cliente' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-selected={aba === 'cliente'}
              role="tab"
            >
              Por Cliente
            </button>
            <button
              onClick={() => setAba('carro')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                aba === 'carro' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              aria-selected={aba === 'carro'}
              role="tab"
            >
              Por Carro
            </button>
          </nav>
        </div>

        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold text-slate-900">
            Total Geral: <span className="text-blue-600">{formatCurrency(totalGeral)}</span>
          </p>
          <span className="text-sm text-slate-500">
            {data?.length || 0} registro{data?.length !== 1 ? 's' : ''}
          </span>
        </div>

        <RelatorioTable tipo={aba} data={data || []} />
      </div>

      <ToastContainer />
    </div>
  )
}
