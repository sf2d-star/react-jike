//router config

import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'


const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout
  },
  {
    path: '/login',
    Component: Login
  }
])

export default router
