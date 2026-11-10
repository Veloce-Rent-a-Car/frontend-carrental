import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/components'
import { loginSchema, type LoginForm } from '@/lib/validation'
import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const { login } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.senha)
    } catch (err) {
      // Error is handled by the auth context redirect
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
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
        autoComplete="current-password"
      />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Entrar
      </Button>
    </form>
  )
}
