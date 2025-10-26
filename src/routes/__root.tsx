import {
  Outlet,
  createRootRoute,
  redirect,
  useMatchRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const Route = createRootRoute({
  beforeLoad: () => {
    if (location.pathname === '/login') return

    // To avoid flashing, check for auth token before loading any protected route
    const token = localStorage.getItem('auth_token')
    if (!token) {
      return redirect({ to: '/login' })
    }
  },
  component: () => {
    const matchRoute = useMatchRoute()
    const isLoginPage = matchRoute({ to: '/login' })

    return (
      <div className="min-h-screen flex flex-col">
        {!isLoginPage && <Header />}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
        {!isLoginPage && <Footer />}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </div>
    )
  },
})
