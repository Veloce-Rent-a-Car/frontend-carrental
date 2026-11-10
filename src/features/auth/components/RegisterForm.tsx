import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components'
import { registerSchema, type RegisterForm } from '@/lib/validation'
import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const { register: registerUser } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data)
    } catch (err) {
      // Error handled by auth context
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="Nome"
        type="text"
        placeholder="Seu nome completo"
        error={errors.nome?.message}
        {...register('nome')}
        autoComplete="name"
        maxLength={100}
      />
      <Input
        label="CPF"
        type="text"
        placeholder="12345678901"
        error={errors.cpf?.message}
        {...register('cpf')}
        maxLength={11}
      />
      <Input
        label="Telefone"
        type="tel"
        placeholder="(11) 99999-9999"
        error={errors.telefone?.message}
        {...register('telefone')}
        autoComplete="tel"
        maxLength={20}
      />
      <Input
        label="Email"
        type="email"
        placeholder="seu@email.com"
        error={errors.email?.message}
        {...register('email')}
        autoComplete="email"
      />
      <Input
        label="Endereço"
        type="text"
        placeholder="Rua, número, bairro, cidade"
        error={errors.endereco?.message}
        {...register('endereco')}
        autoComplete="street-address"
        maxLength={200}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
        autoComplete="new-password"
      />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Cadastrar
      </Button>
    </form>
  )
}
