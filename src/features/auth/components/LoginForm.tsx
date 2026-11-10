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
      await login(data.cpf, data.password)
    } catch (err) {
      // Error handled by auth context redirect
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        label="CPF"
        type="text"
        placeholder="12345678901"
        error={errors.cpf?.message}
        {...register('cpf')}
        autoComplete="username"
        maxLength={11}
      />
      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
        autoComplete="current-password"
      />
      <Button type="submit" className="w-full" loading={isSubmitting}>
        Entrar
      </Button>
    </form>
  )
}
