import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { useMutation } from '@tanstack/react-query'
import { postLogin } from '@/api/authorization'
import type { LoginRequest } from '@/types/login.types'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import FormInput from '@/components/forms/FormInput'
import SubmitButton from '@/components/forms/SubmitButton'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { useEffect, useState } from 'react'

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(4, 'Password must be at least 4 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

export function LoginPage() {
  const navigate = useNavigate()
  const [wasUnauthorized, setWasUnauthorized] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('was_unauthorized')) {
      setWasUnauthorized(true)
      localStorage.removeItem('was_unauthorized')
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => postLogin(credentials),
    onSuccess: (data) => {
      console.log('Login successful:', data)
      navigate({ to: '/' })
    },
  })

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <div className="bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12 min-h-screen">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your account to continue shopping
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            {wasUnauthorized && (
              <ErrorMessage
                headerMessage="Authorization required"
                message="Your session has expired or you were not logged in. Please log in again to continue."
              />
            )}

            {loginMutation.isError && (
              <ErrorMessage
                headerMessage=""
                message="Invalid email or password. Please try again."
              />
            )}

            <FormInput
              label="Email Address"
              id="email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              isLoading={loginMutation.isPending}
              placeholder="john@mail.com"
            />

            <FormInput
              label="Password"
              id="password"
              type="password"
              {...register('password')}
              error={errors.password?.message}
              isLoading={loginMutation.isPending}
              placeholder="••••••••"
            />

            <SubmitButton isLoading={loginMutation.isPending}>
              Sign In
            </SubmitButton>
          </form>
        </div>
      </div>
    </div>
  )
}
