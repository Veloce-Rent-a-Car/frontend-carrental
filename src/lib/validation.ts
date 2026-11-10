import { z } from 'zod'

// Login usa CPF + password
export const loginSchema = z.object({
  cpf: z.string().min(1, 'CPF é obrigatório').length(11, 'CPF deve ter 11 dígitos'),
  password: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Registro: todos os campos obrigatórios conforme backend
export const registerSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cpf: z.string().min(1, 'CPF é obrigatório').length(11, 'CPF deve ter 11 dígitos'),
  telefone: z.string().min(1, 'Telefone é obrigatório').max(20, 'Telefone deve ter no máximo 20 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  endereco: z.string().max(200, 'Endereço deve ter no máximo 200 caracteres').optional(),
  password: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

// Carro: campos conforme modelo do backend
export const carroSchema = z.object({
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  placa: z.string().min(1, 'Placa é obrigatória').regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, 'Placa inválida (ex: ABC1D23)'),
  categoria: z.string().min(1, 'Categoria é obrigatória'),
  valorDaDiaria: z.coerce.number().positive('Valor deve ser positivo').max(10000, 'Valor muito alto'),
  statusDisponibilidade: z.enum(['DISPONIVEL', 'ALUGADO', 'MANUTENCAO'], {
    required_error: 'Selecione um status',
  }),
})

// Novo aluguel: usa CPF do cliente e nome/modelo do carro
export const aluguelSchema = z.object({
  clientCpf: z.string().min(1, 'CPF do cliente é obrigatório').length(11, 'CPF deve ter 11 dígitos'),
  carName: z.string().min(1, 'Nome do carro é obrigatório'),
  carModelType: z.string().min(1, 'Modelo/tipo do carro é obrigatório'),
  rentValue: z.coerce.number().positive('Valor deve ser positivo'),
})

// Pagamento
export const pagamentoSchema = z.object({
  rentId: z.coerce.number().int().positive('Selecione um aluguel'),
  valorPago: z.coerce.number().positive('Valor deve ser positivo'),
  metodoPagamento: z.enum(['PIX', 'CARTAO_CREDITO'], {
    required_error: 'Selecione um método de pagamento',
  }),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type CarroForm = z.infer<typeof carroSchema>
export type AluguelForm = z.infer<typeof aluguelSchema>
export type PagamentoForm = z.infer<typeof pagamentoSchema>
