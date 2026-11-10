export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

export interface User {
  id: number
  nome: string
  email: string
  role: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface RegisterRequest {
  nome: string
  email: string
  senha: string
}

export interface Carro {
  id: number
  marca: string
  modelo: string
  ano: number
  placa: string
  cor: string
  valorDiaria: number
  disponivel: boolean
  createdAt: string
  updatedAt: string
}

export interface CarroRequest {
  marca: string
  modelo: string
  ano: number
  placa: string
  cor: string
  valorDiaria: number
}

export interface Cliente {
  id: number
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
  createdAt: string
  updatedAt: string
}

export interface ClienteRequest {
  nome: string
  cpf: string
  email: string
  telefone: string
  endereco: string
}

export interface Aluguel {
  id: number
  cliente: Cliente
  carro: Carro
  dataInicio: string
  dataFim: string
  valorTotal: number
  status: 'PENDENTE' | 'ATIVO' | 'FINALIZADO' | 'CANCELADO'
  createdAt: string
  updatedAt: string
}

export interface AluguelRequest {
  clienteId: number
  carroId: number
  dataInicio: string
  dataFim: string
}

export interface Pagamento {
  id: number
  aluguel: Aluguel
  valorPago: number
  metodoPagamento: 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'TRANSFERENCIA'
  status: 'PENDENTE' | 'CONFIRMADO' | 'RECUSADO' | 'ESTORNADO'
  dataPagamento: string
  createdAt: string
  updatedAt: string
}

export interface PagamentoRequest {
  aluguelId: number
  valorPago: number
  metodoPagamento: 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'TRANSFERENCIA'
}

export interface RelatorioCliente {
  clienteId: number
  clienteNome: string
  totalAlugueis: number
  valorTotal: number
}

export interface RelatorioCarro {
  carroId: number
  carroMarca: string
  carroModelo: string
  carroPlaca: string
  totalAlugueis: number
  valorTotal: number
}

export interface CsvImportResult {
  totalLinhas: number
  linhasValidas: number
  linhasDuplicadas: number
  linhasInvalidas: number
  erros: string[]
}
