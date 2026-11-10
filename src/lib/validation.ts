import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const registerSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export const carroSchema = z.object({
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano: z.coerce.number().int().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano inválido'),
  placa: z.string().min(1, 'Placa é obrigatória').regex(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/i, 'Placa inválida (ex: ABC1D23)'),
  cor: z.string().min(1, 'Cor é obrigatória'),
  valorDiaria: z.coerce.number().positive('Valor deve ser positivo').max(10000, 'Valor muito alto'),
})

export const aluguelSchema = z.object({
  clienteId: z.coerce.number().int().positive('Selecione um cliente'),
  carroId: z.coerce.number().int().positive('Selecione um carro'),
  dataInicio: z.string().min(1, 'Data de início é obrigatória'),
  dataFim: z.string().min(1, 'Data de fim é obrigatória'),
}).refine((data) => new Date(data.dataFim) > new Date(data.dataInicio), {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['dataFim'],
})

export const pagamentoSchema = z.object({
  aluguelId: z.coerce.number().int().positive('Selecione um aluguel'),
  valorPago: z.coerce.number().positive('Valor deve ser positivo'),
  metodoPagamento: z.enum(['DINHEIRO', 'CARTAO_CREDITO', 'CARTAO_DEBITO', 'PIX', 'TRANSFERENCIA'], {
    required_error: 'Selecione um método de pagamento',
  }),
})

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type CarroForm = z.infer<typeof carroSchema>
export type AluguelForm = z.infer<typeof aluguelSchema>
export type PagamentoForm = z.infer<typeof pagamentoSchema>
