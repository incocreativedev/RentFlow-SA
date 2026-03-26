import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Landing from '@/pages/Landing'
import Dashboard from '@/pages/Dashboard'
import Properties from '@/pages/Properties'
import Tenants from '@/pages/Tenants'
import Leases from '@/pages/Leases'
import Payments from '@/pages/Payments'
import Arrears from '@/pages/Arrears'
import Notifications from '@/pages/Notifications'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Marketing landing page */}
        <Route path="/" element={<Landing />} />

        {/* App dashboard routes */}
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<Properties />} />
          <Route path="tenants" element={<Tenants />} />
          <Route path="leases" element={<Leases />} />
          <Route path="payments" element={<Payments />} />
          <Route path="arrears" element={<Arrears />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
