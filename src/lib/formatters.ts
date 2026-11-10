export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatCpf(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return cpf
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export function formatPlaca(placa: string): string {
  const cleaned = placa.toUpperCase().replace(/[^A-Z0-9]/g, '')
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
  }
  return placa.toUpperCase()
}

export function getStatusBadgeClass(status: string): string {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'disponivel':
    case 'aprovado':
    case 'active':
    case 'confirmed':
    case 'finished':
      return 'badge-success'
    case 'pendente':
    case 'pending':
    case 'alugado':
      return 'badge-warning'
    case 'finalizado':
    case 'recusado':
    case 'cancelado':
    case 'cancelled':
    case 'manutencao':
      return 'badge-danger'
    default:
      return 'badge-secondary'
  }
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DISPONIVEL: 'Disponível',
    ALUGADO: 'Alugado',
    MANUTENCAO: 'Manutenção',
    PENDING: 'Pendente',
    CONFIRMED: 'Confirmado',
    ACTIVE: 'Ativo',
    FINISHED: 'Finalizado',
    CANCELLED: 'Cancelado',
    PENDENTE: 'Pendente',
    APROVADO: 'Aprovado',
    RECUSADO: 'Recusado',
  }
  return labels[status] || status
}
