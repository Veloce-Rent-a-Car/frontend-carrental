import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CarrosPage } from '@/features/carros/pages/CarrosPage'
import { AlugueisPage } from '@/features/alugueis/pages/AlugueisPage'
import { PagamentosPage } from '@/features/pagamentos/pages/PagamentosPage'
import { RelatoriosPage } from '@/features/relatorios/pages/RelatoriosPage'
import Layout from '@/components/Layout'
import { createElement } from 'react'

// Create the layout element using createElement to avoid JSX type issues
const PrivateLayoutElement = createElement(
  Layout,
  null,
  createElement(ProtectedRoute, null, createElement(Outlet))
)

export const router = createBrowserRouter([
  {
    path: '/login',
    element: createElement(LoginPage),
  },
  {
    element: PrivateLayoutElement,
    children: [
      { index: true, element: createElement(Navigate, { to: '/carros', replace: true }) },
      { path: 'carros', element: createElement(CarrosPage) },
      { path: 'alugueis', element: createElement(AlugueisPage) },
      { path: 'pagamentos', element: createElement(PagamentosPage) },
      { path: 'relatorios', element: createElement(RelatoriosPage) },
    ],
  },
])
