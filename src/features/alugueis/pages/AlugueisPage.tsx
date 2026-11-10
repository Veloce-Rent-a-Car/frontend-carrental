import { useState } from 'react'
import { Button, Modal, ToastContainer } from '@/components'
import { AluguelTable } from '../components/AluguelTable'
import { AluguelForm } from '../components/AluguelForm'
import { useAlugueis } from '../hooks/useAlugueis'

export function AlugueisPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: alugueis, isLoading, error, refetch } = useAlugueis()

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
        <p className="text-red-600">Erro ao carregar aluguéis: {(error as Error).message}</p>
        <Button onClick={() => refetch()} className="mt-4">Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Aluguéis</h1>
        <Button onClick={() => setShowForm(true)}>Novo Aluguel</Button>
      </div>

      <AluguelTable alugueis={alugueis || []} />

      <Modal isOpen={showForm} onClose={handleCloseForm} title="Novo Aluguel" className="max-w-2xl">
        <AluguelForm onClose={handleCloseForm} />
      </Modal>

      <ToastContainer />
    </div>
  )
}
