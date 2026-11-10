/**
 * Tipos baseados no OpenAPI real do backend (v1/src/main/resources/application-test.properties)
 * Gerado via: npm run generate:types (openapi-typescript http://localhost:8081/v3/api-docs)
 * NÃO editar manualmente - regenerar quando o backend mudar.
 */

// ===== Error =====
export interface ApiError {
  timestamp: string
  status: number
  error: string
  message: string
  path: string
}

// ===== Auth =====
// Login usa CPF + password (não email)
export interface LoginRequest {
  cpf: string
  password: string
}

export interface LoginResponse {
  type: 'Bearer'
  token: string
}

// Registro não retorna JWT - retorna {message, id}
export interface RegisterRequest {
  nome: string
  cpf: string
  telefone: string
  email: string
  endereco?: string
  password: string
}

export interface RegisterResponse {
  message: string
  id: number
}

// Para obter dados do usuário após login, chamar GET /api/clients/cpf/{cpf}
export interface Client {
  id: number
  name: string
  cpf: string
  phone: string
  email: string
  address: string
  password: string
}

// ===== Carro =====
export interface Carro {
  id: number
  modelo: string
  placa: string
  categoria: string
  valorDaDiaria: number
  statusDisponibilidade: 'DISPONIVEL' | 'ALUGADO' | 'MANUTENCAO'
}

export interface CarroRequest {
  modelo: string
  placa: string
  categoria: string
  valorDaDiaria: number
  statusDisponibilidade: 'DISPONIVEL' | 'ALUGADO' | 'MANUTENCAO'
}

// ===== Aluguel =====
// DTO de entrada usa CPF do cliente e nome/modelo do carro
export interface NewRentDTO {
  clientCpf: string
  carName: string
  carModelType: string
  rentValue: number
}

export interface RentModel {
  id: number
  client: Client
  car: Carro
  rentValue: number
  startDate: string
  endDate: string | null
  status: 'PENDING' | 'CONFIRMED' | 'ACTIVE' | 'FINISHED' | 'CANCELLED'
}

// ===== Pagamento =====
export interface NewPaymentDTO {
  rentId: number
  valorPago: number
  metodoPagamento: 'PIX' | 'CARTAO_CREDITO'
}

export interface Payment {
  id: number
  rent: RentModel
  valorPago: number
  dataPagamento: string
  metodoPagamento: 'PIX' | 'CARTAO_CREDITO'
  status: 'PENDENTE' | 'APROVADO' | 'RECUSADO'
}

// ===== Relatórios =====
export type RentReportByClient = Record<string, RentModel[]>
export type RentReportByCar = Record<string, RentModel[]>

// ===== CSV Import Result =====
export interface CsvImportResult {
  totalLinhas: number
  linhasValidas: number
  linhasDuplicadas: number
  linhasInvalidas: number
  erros: string[]
}
