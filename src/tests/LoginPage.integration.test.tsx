import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginPage } from '@/routes/login'
import { useMutation } from '@tanstack/react-query'
import { LoginPageObject, LoginPageObjectTexts } from './pages/LoginPageObject'
import { renderWithQueryClient } from './setup/test-utils'
import React from 'react'

vi.mock('@/api/authorization', () => ({
  postLogin: vi.fn(),
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useMutation: vi.fn(),
  }
})

vi.mock('@tanstack/react-router', () => ({
  createFileRoute: vi.fn(() => () => ({
    component: vi.fn(),
  })),
  useNavigate: vi.fn(() => vi.fn()),
  Link: ({ children, to, ...props }: any) =>
    React.createElement('a', { href: to, ...props }, children),
  useRouter: vi.fn(() => ({
    navigate: vi.fn(),
    state: {
      location: {
        pathname: '/login',
      },
    },
  })),
}))

describe('LoginPage', () => {
  const mockMutate = vi.fn()
  let page: LoginPageObject

  const renderPage = () => {
    renderWithQueryClient(<LoginPage />)
    page = new LoginPageObject()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useMutation as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      isError: false,
      isSuccess: false,
      data: undefined,
      error: null,
    })

    renderPage()
  })

  it('renders login form correctly', () => {
    page.expectTextInDocument(LoginPageObjectTexts.WELCOME)
    expect(page.emailInput).toBeInTheDocument()
    expect(page.passwordInput).toBeInTheDocument()
    expect(page.signInButton).toBeInTheDocument()
  })

  it('shows validation errors for empty form submission', async () => {
    await page.submit()

    await page.expectTextVisible(LoginPageObjectTexts.EMAIL_ERROR)
    await page.expectTextVisible(LoginPageObjectTexts.PASSWORD_ERROR)
  })

  it('removes validation errors when inputs are correctly filled', async () => {
    await page.submit()

    page.expectTextInDocument(LoginPageObjectTexts.EMAIL_ERROR)
    page.expectTextInDocument(LoginPageObjectTexts.PASSWORD_ERROR)

    await page.fillInput(page.emailInput, 'correctEmail@gmail.com')
    page.expectTextNotVisible(LoginPageObjectTexts.EMAIL_ERROR)

    await page.fillInput(page.passwordInput, 'correctPassword')
    page.expectTextNotVisible(LoginPageObjectTexts.PASSWORD_ERROR)
  })

  it('calls mutate with correct credentials', async () => {
    await page.fillInput(page.emailInput, 'correctEmail@gmail.com')
    await page.fillInput(page.passwordInput, 'correctPassword')
    await page.submit()

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledWith({
      email: 'correctEmail@gmail.com',
      password: 'correctPassword',
    })
  })
})
