import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, carroSchema, aluguelSchema, pagamentoSchema } from './validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login', () => {
      const result = loginSchema.safeParse({ cpf: '12345678901', password: 'password123' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid CPF length', () => {
      const result = loginSchema.safeParse({ cpf: '123', password: 'password123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.cpf).toContain('CPF deve ter 11 dígitos')
      }
    })

    it('should reject short password', () => {
      const result = loginSchema.safeParse({ cpf: '12345678901', password: '123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.password).toContain('Senha deve ter pelo menos 6 caracteres')
      }
    })

    it('should reject empty fields', () => {
      const result = loginSchema.safeParse({ cpf: '', password: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate valid register', () => {
      const result = registerSchema.safeParse({
        nome: 'Test User',
        cpf: '12345678901',
        telefone: '11999999999',
        email: 'test@test.com',
        endereco: 'Rua Teste',
        password: 'password123',
      })
      expect(result.success).toBe(true)
    })

    it('should reject short name', () => {
      const result = registerSchema.safeParse({
        nome: 'Ab',
        cpf: '12345678901',
        telefone: '11999999999',
        email: 'test@test.com',
        password: 'password123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.nome).toContain('Nome deve ter pelo menos 3 caracteres')
      }
    })

    it('should reject invalid CPF length', () => {
      const result = registerSchema.safeParse({
        nome: 'Test User',
        cpf: '123',
        telefone: '11999999999',
        email: 'test@test.com',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })

    it('should reject invalid email', () => {
      const result = registerSchema.safeParse({
        nome: 'Test User',
        cpf: '12345678901',
        telefone: '11999999999',
        email: 'invalid',
        password: 'password123',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('carroSchema', () => {
    const validCarro = {
      modelo: 'Gol',
      placa: 'ABC1D23',
      categoria: 'ECONOMICO',
      valorDaDiaria: 150,
      statusDisponibilidade: 'DISPONIVEL' as const,
    }

    it('should validate valid carro', () => {
      const result = carroSchema.safeParse(validCarro)
      expect(result.success).toBe(true)
    })

    it('should reject invalid placa format', () => {
      const result = carroSchema.safeParse({ ...validCarro, placa: 'INVALID' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.placa).toContain('Placa inválida (ex: ABC1D23)')
      }
    })

    it('should reject negative valorDaDiaria', () => {
      const result = carroSchema.safeParse({ ...validCarro, valorDaDiaria: -10 })
      expect(result.success).toBe(false)
    })

    it('should reject invalid status', () => {
      const result = carroSchema.safeParse({ ...validCarro, statusDisponibilidade: 'INVALID' as any })
      expect(result.success).toBe(false)
    })
  })

  describe('aluguelSchema', () => {
    const validAluguel = {
      clientCpf: '12345678901',
      carName: 'Gol',
      carModelType: 'ECONOMICO',
      rentValue: 300,
    }

    it('should validate valid aluguel', () => {
      const result = aluguelSchema.safeParse(validAluguel)
      expect(result.success).toBe(true)
    })

    it('should reject invalid CPF length', () => {
      const result = aluguelSchema.safeParse({ ...validAluguel, clientCpf: '123' })
      expect(result.success).toBe(false)
    })

    it('should reject negative rentValue', () => {
      const result = aluguelSchema.safeParse({ ...validAluguel, rentValue: -10 })
      expect(result.success).toBe(false)
    })
  })

  describe('pagamentoSchema', () => {
    const validPagamento = {
      rentId: 1,
      valorPago: 100,
      metodoPagamento: 'PIX' as const,
    }

    it('should validate valid pagamento', () => {
      const result = pagamentoSchema.safeParse(validPagamento)
      expect(result.success).toBe(true)
    })

    it('should reject invalid metodoPagamento', () => {
      const result = pagamentoSchema.safeParse({ ...validPagamento, metodoPagamento: 'INVALID' as any })
      expect(result.success).toBe(false)
    })

    it('should accept CARTAO_CREDITO', () => {
      const result = pagamentoSchema.safeParse({ ...validPagamento, metodoPagamento: 'CARTAO_CREDITO' as const })
      expect(result.success).toBe(true)
    })
  })
})
