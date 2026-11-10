import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Select, Input } from '@/components'
import { aluguelSchema, type AluguelForm } from '@/lib/validation'
import { useCriarAluguel } from '../hooks/useAlugueis'
import { useClientes } from '@/features/auth/hooks/useClientes'
import { useCarros } from '@/features/carros/hooks/useCarros'
import { useToast } from '@/components'
import { formatCurrency } from '@/lib/formatters'

interface AluguelFormProps {
  onClose: () => void
}

export function AluguelForm({ onClose }: AluguelFormProps) {
  const criarAluguel = useCriarAluguel()
  const { data: clientes } = useClientes()
  const { data: carros } = useCarros()
  const { showToast } = useToast()

  const clienteOptions = (clientes || []).map(c => ({ value: String(c.id), label: `${c.nome} (${c.cpf})` }))
  const carroOptions = (carros || []).filter(c => c.disponivel).map(c => ({ value: String(c.id), label: `${c.marca} ${c.modelo} - ${formatCurrency(c.valorDiaria)}/dia` }))

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<AluguelForm>({
    resolver: zodResolver(aluguelSchema),
  })

  const dataInicio = watch('dataInicio')
  const dataFim = watch('dataFim')
  const carroId = watch('carroId')

  const selectedCarro = carros?.find(c => c.id === Number(carroId))
  const dias = dataInicio && dataFim ? Math.ceil((new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const valorEstimado = selectedCarro && dias > 0 ? selectedCarro.valorDiaria * dias : 0

  const onSubmit = async (data: AluguelForm) => {
    try {
      await criarAluguel.mutateAsync(data)
      showToast('Aluguel criado com sucesso', 'success')
      onClose()
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      showToast(error.data?.message || 'Erro ao criar aluguel', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Select
        label="Cliente"
        placeholder="Selecione um cliente"
        options={clienteOptions}
        error={errors.clienteId?.message}
        {...register('clienteId')}
      />
      <Select
        label="Carro"
        placeholder="Selecione um carro disponível"
        options={carroOptions}
        error={errors.carroId?.message}
        {...register('carroId')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Data de Início"
          type="date"
          error={errors.dataInicio?.message}
          {...register('dataInicio')}
          min={new Date().toISOString().split('T')[0]}
        />
        <Input
          label="Data de Fim"
          type="date"
          error={errors.dataFim?.message}
          {...register('dataFim')}
          min={dataInicio || new Date().toISOString().split('T')[0]}
        />
      </div>
      {valorEstimado > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Valor estimado: <strong className="text-lg">{formatCurrency(valorEstimado)}</strong> ({dias} diária{dias !== 1 ? 's' : ''})
          </p>
        </div>
      )}
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">Criar Aluguel</Button>
      </div>
    </form>
  )
}
