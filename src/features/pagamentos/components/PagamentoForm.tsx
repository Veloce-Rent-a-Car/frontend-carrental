import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Select } from '@/components'
import { pagamentoSchema, type PagamentoForm } from '@/lib/validation'
import { useCriarPagamento } from '../hooks/usePagamentos'
import { useAlugueis } from '@/features/alugueis/hooks/useAlugueis'
import { useToast } from '@/components'
import { formatCurrency, formatDate, getStatusLabel } from '@/lib/formatters'

interface PagamentoFormProps {
  onClose: () => void
}

export function PagamentoForm({ onClose }: PagamentoFormProps) {
  const criarPagamento = useCriarPagamento()
  const { data: alugueis } = useAlugueis()
  const { showToast } = useToast()

  const alugueisPendentes = (alugueis || []).filter(a => a.status === 'PENDING' || a.status === 'ACTIVE' || a.status === 'CONFIRMED')
  const aluguelOptions = alugueisPendentes.map(a => ({ 
    value: String(a.id), 
    label: `#${a.id} - ${a.client.name} - ${a.car.modelo} - ${formatCurrency(a.rentValue)}` 
  }))

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<PagamentoForm>({
    resolver: zodResolver(pagamentoSchema),
  })

  const rentId = watch('rentId')
  const selectedAluguel = alugueis?.find(a => a.id === Number(rentId))

  const onSubmit = async (data: PagamentoForm) => {
    try {
      await criarPagamento.mutateAsync(data)
      showToast('Pagamento registrado com sucesso', 'success')
      onClose()
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } }
      showToast(error.data?.message || 'Erro ao registrar pagamento', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Select
        label="Aluguel"
        placeholder="Selecione um aluguel pendente"
        options={aluguelOptions}
        error={errors.rentId?.message}
        {...register('rentId')}
      />
      {selectedAluguel && (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <p className="text-sm text-slate-600"><strong>Cliente:</strong> {selectedAluguel.client.name}</p>
          <p className="text-sm text-slate-600"><strong>Carro:</strong> {selectedAluguel.car.modelo}</p>
          <p className="text-sm text-slate-600"><strong>Período:</strong> {formatDate(selectedAluguel.startDate)} a {selectedAluguel.endDate ? formatDate(selectedAluguel.endDate) : '—'}</p>
          <p className="text-sm text-slate-600"><strong>Total do Aluguel:</strong> {formatCurrency(selectedAluguel.rentValue)}</p>
          <p className="text-sm text-slate-600"><strong>Status:</strong> <span className="font-medium">{getStatusLabel(selectedAluguel.status)}</span></p>
        </div>
      )}
      <Input
        label="Valor Pago"
        type="number"
        step="0.01"
        placeholder="0.00"
        error={errors.valorPago?.message}
        {...register('valorPago', { valueAsNumber: true })}
      />
      <Select
        label="Método de Pagamento"
        placeholder="Selecione"
        options={[
          { value: 'PIX', label: 'PIX' },
          { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
        ]}
        error={errors.metodoPagamento?.message}
        {...register('metodoPagamento')}
      />
      <div className="flex gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
        <Button type="submit" loading={isSubmitting} className="flex-1">Registrar Pagamento</Button>
      </div>
    </form>
  )
}
