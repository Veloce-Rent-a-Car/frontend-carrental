import { describe, it, expect } from 'vitest'
import { loginSchema, registerSchema, carroSchema, aluguelSchema, pagamentoSchema } from './validation'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login', () => {
      const result = loginSchema.safeParse({ email: 'test@test.com', senha: 'password123' })
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const result = loginSchema.safeParse({ email: 'invalid', senha: 'password123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.email).toContain('Email inválido')
      }
    })

    it('should reject short password', () => {
      const result = loginSchema.safeParse({ email: 'test@test.com', senha: '123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.senha).toContain('Senha deve ter pelo menos 6 caracteres')
      }
    })

    it('should reject empty fields', () => {
      const result = loginSchema.safeParse({ email: '', senha: '' })
      expect(result.success).toBe(false)
    })
  })

  describe('registerSchema', () => {
    it('should validate valid register', () => {
      const result = registerSchema.safeParse({ nome: 'Test User', email: 'test@test.com', senha: 'password123' })
      expect(result.success).toBe(true)
    })

    it('should reject short name', () => {
      const result = registerSchema.safeParse({ nome: 'Ab', email: 'test@test.com', senha: 'password123' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.nome).toContain('Nome deve ter pelo menos 3 caracteres')
      }
    })
  })

  describe('carroSchema', () => {
    const validCarro = { marca: 'VW', modelo: 'Gol', ano: 2020, placa: 'ABC1D23', cor: 'Prata', valorDiaria: 150 }

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

    it('should reject invalid year', () => {
      const result = carroSchema.safeParse({ ...validCarro, ano: 1800 })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.ano).toContain('Ano inválido')
      }
    })

    it('should reject negative valorDiaria', () => {
      const result = carroSchema.safeParse({ ...validCarro, valorDiaria: -10 })
      expect(result.success).toBe(false)
    })
  })

  describe('aluguelSchema', () => {
    const validAluguel = { clienteId: 1, carroId: 1, dataInicio: '2024-01-01', dataFim: '2024-01-05' }

    it('should validate valid aluguel', () => {
      const result = aluguelSchema.safeParse(validAluguel)
      expect(result.success).toBe(true)
    })

    it('should reject dataFim before dataInicio', () => {
      const result = aluguelSchema.safeParse({ ...validAluguel, dataFim: '2023-12-31' })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.flatten().fieldErrors.dataFim).toContain('Data de fim deve ser posterior à data de início')
      }
    })
  })

  describe('pagamentoSchema', () => {
    const validPagamento = { aluguelId: 1, valorPago: 100, metodoPagamento: 'PIX' }

    it('should validate valid pagamento', () => {
      const result = pagamentoSchema.safeParse(validPagamento)
      expect(result.success).toBe(true)
    })

    it('should reject invalid metodoPagamento', () => {
      const result = pagamentoSchema.safeParse({ ...validPagamento, metodoPagamento: 'INVALID' })
      expect(result.success).toBe(false)
    })
  })
})
