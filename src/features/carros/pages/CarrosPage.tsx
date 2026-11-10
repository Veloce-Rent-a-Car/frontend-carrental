import { useState } from 'react'
import { Button, Modal, ToastContainer } from '@/components'
import { CarroTable } from '../components/CarroTable'
import { CarroForm } from '../components/CarroForm'
import { CsvImport } from '../components/CsvImport'
import { useCarros, useDeletarCarro } from '../hooks/useCarros'
import { useToast } from '@/components'
import type { Carro } from '@/api/types'

export function CarrosPage() {
  const [editingCarro, setEditingCarro] = useState<Carro | null>(null)
  const [deletingCarro, setDeletingCarro] = useState<Carro | null>(null)
  const { data: carros, isLoading, error, refetch } = useCarros()
  const deletar = useDeletarCarro()
  const { showToast } = useToast()

  const handleEdit = (carro: Carro) => setEditingCarro(carro)
  const handleDeleteClick = (carro: Carro) => setDeletingCarro(carro)

  const confirmDelete = async () => {
    if (!deletingCarro) return
    try {
      await deletar.mutateAsync(deletingCarro.id)
      showToast('Carro excluído com sucesso', 'success')
      setDeletingCarro(null)
      refetch()
    } catch {
      showToast('Erro ao excluir carro', 'error')
    }
  }

  const handleCloseForm = () => {
    setEditingCarro(null)
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
        <p className="text-red-600">Erro ao carregar carros: {(error as Error).message}</p>
        <Button onClick={() => refetch()} className="mt-4">Tentar novamente</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Carros</h1>
        <div className="flex gap-2">
          <Button onClick={() => setEditingCarro(null)}>Novo Carro</Button>
        </div>
      </div>

      <CarroTable carros={carros || []} onEdit={handleEdit} onDelete={handleDeleteClick} />

      <CsvImport />

      <Modal isOpen={!!editingCarro} onClose={handleCloseForm} title={editingCarro ? 'Editar Carro' : 'Novo Carro'}>
        <CarroForm initialData={editingCarro || undefined} onClose={handleCloseForm} />
      </Modal>

      <Modal isOpen={!!deletingCarro} onClose={() => setDeletingCarro(null)} title="Confirmar Exclusão">
        <p className="text-slate-600 mb-6">
          Tem certeza que deseja excluir <strong>{deletingCarro?.modelo}</strong> ({deletingCarro?.placa})?
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeletingCarro(null)}>Cancelar</Button>
          <Button variant="danger" onClick={confirmDelete} loading={deletar.isPending}>
            Excluir
          </Button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  )
}
