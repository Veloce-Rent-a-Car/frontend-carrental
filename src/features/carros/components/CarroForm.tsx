import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components'
import { carroSchema, type CarroForm } from '@/lib/validation'
import { useCriarCarro, useAtualizarCarro } from '../hooks/useCarros'
import { useToast } from '@/components'
import type { Carro } from '@/api/types'

interface CarroFormProps {
  initialData?: Carro
  onClose: () => void
}

export function CarroForm({ initialData, onClose }: CarroFormProps) {
  const isEditing = !!initialData
  const criarCarro = useCriarCarro()
  const atualizarCarro = useAtualizarCarro()
  const { showToast } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CarroForm>({
    resolver: zodResolver(carroSchema),
    defaultValues: initialData ? {
      modelo: initialData.modelo,
      placa: initialData.placa,
      categoria: initialData.categoria,
      valorDaDiaria: initialData.valorDaDiaria,
      statusDisponibilidade: initialData.statusDisponibilidade,
    } : undefined,
  })

  const onSubmit = async (data: CarroForm) => {
    try {
      if (isEditing && initialData) {
        await atualizarCarro.mutateAsync({ id: initialData.id, data })
        showToast('Carro atualizado com sucesso', 'success')
      } else {
        await criarCarro.mutateAsync(data)
        showToast('Carro criado com sucesso', 'success')
      }
      onClose()
    } catch (err: unknown) {
      const error = err as { data?: { message?: string; status?: number } }
      if (error.data?.status === 409) {
        showToast('Placa já cadastrada', 'error')
      } else {
        showToast(error.data?.message || 'Erro ao salvar carro', 'error')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Modelo"
          placeholder="Ex: Gol"
          error={errors.modelo?.message}
          {...register('modelo')}
        />
        <Select
          label="Categoria"
          placeholder="Selecione"
          options={[
            { value: 'ECONOMICO', label: 'Econômico' },
            { value: 'INTERMEDIARIO', label: 'Intermediário' },
            { value: 'EXECUTIVO', label: 'Executivo' },
            { value: 'SUV', label: 'SUV' },
            { value: 'PICAPE', label: 'Picape' },
          ]}
          error={errors.categoria?.message}
          {...register('categoria')}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Placa"
          placeholder="ABC1D23"
          error={errors.placa?.message}
          {...register('placa')}
          maxLength={7}
        />
        <Input
          label="Valor da Diária"
          type="number"
          step="0.01"
          placeholder="150.00"
          error={errors.valorDaDiaria?.message}
          {...register('valorDaDiaria', { valueAsNumber: true })}
        />
        <Select
          label="Status"
          placeholder="Selecione"
          options={[
            { value: 'DISPONIVEL', label: 'Disponível' },
            { value: 'ALUGADO', label: 'Alugado' },
            { value: 'MANUTENCAO', label: 'Manutenção' },
          ]}
          error={errors.statusDisponibilidade?.message}
          {...register('statusDisponibilidade')}
        />
      </div>
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {isEditing ? 'Atualizar' : 'Criar'}
        </Button>
      </div>
    </form>
  )
}
