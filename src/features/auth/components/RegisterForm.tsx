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
      await registerUser(data.nome, data.email, data.senha)
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
        label="Senha"
        type="password"
        placeholder="••••••••"
        error={errors.senha?.message}
        {...register('senha')}
        autoComplete="new-password"
      />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Cadastrar
      </Button>
    </form>
  )
}
