import { Outlet, Link, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import type { ReactNode } from 'react'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const navItems = [
    { path: '/carros', label: 'Carros' },
    { path: '/alugueis', label: 'Aluguéis' },
    { path: '/pagamentos', label: 'Pagamentos' },
    { path: '/relatorios', label: 'Relatórios' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/carros" className="text-xl font-bold text-blue-600" aria-label="Veloce Rent a Car - Início">
              Veloce Rent a Car
            </Link>
            <nav className="flex items-center gap-6" aria-label="Navegação principal">
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                    aria-current={location.pathname === item.path ? 'page' : undefined}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-600 hidden sm:block">
                  {user?.nome}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                >
                  Sair
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children ?? <Outlet />}
      </main>
    </div>
  )
}

export default Layout
