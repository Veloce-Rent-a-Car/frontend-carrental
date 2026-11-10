import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components'
import { aluguelSchema, type AluguelForm } from '@/lib/validation'
import { useCriarAluguel } from '../hooks/useAlugueis'
import { useToast } from '@/components'

interface AluguelFormProps {
  onClose: () => void
}

export function AluguelForm({ onClose }: AluguelFormProps) {
  const criarAluguel = useCriarAluguel()
  const { showToast } = useToast()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<AluguelForm>({
    resolver: zodResolver(aluguelSchema),
  })

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
      <Input
        label="CPF do Cliente"
        type="text"
        placeholder="12345678901"
        error={errors.clientCpf?.message}
        {...register('clientCpf')}
        maxLength={11}
      />
      <Input
        label="Nome do Carro"
        type="text"
        placeholder="Ex: Gol"
        error={errors.carName?.message}
        {...register('carName')}
      />
      <Input
        label="Modelo/Tipo do Carro"
        type="text"
        placeholder="Ex: ECONOMICO"
        error={errors.carModelType?.message}
        {...register('carModelType')}
      />
      <Input
        label="Valor do Aluguel"
        type="number"
        step="0.01"
        placeholder="300.00"
        error={errors.rentValue?.message}
        {...register('rentValue', { valueAsNumber: true })}
      />
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">Criar Aluguel</Button>
      </div>
    </form>
  )
}
