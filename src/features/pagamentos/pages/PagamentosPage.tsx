import { useState } from 'react'
import { Button, Modal, ToastContainer } from '@/components'
import { PagamentoTable } from '../components/PagamentoTable'
import { PagamentoForm } from '../components/PagamentoForm'
import { usePagamentos } from '../hooks/usePagamentos'

export function PagamentosPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: pagamentos, isLoading, error, refetch } = usePagamentos()

  const handleCloseForm = () => {
    setShowForm(false)
    refetch()
  }

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
        <p className="text-red-600">Erro ao carregar pagamentos: {(error as Error).message}</p>
        <Button onClick={() => refetch()} className="mt-4">Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Pagamentos</h1>
        <Button onClick={() => setShowForm(true)}>Registrar Pagamento</Button>
      </div>

      <PagamentoTable pagamentos={pagamentos || []} />

      <Modal isOpen={showForm} onClose={handleCloseForm} title="Registrar Pagamento" className="max-w-xl">
        <PagamentoForm onClose={handleCloseForm} />
      </Modal>

      <ToastContainer />
    </div>
  )
}
