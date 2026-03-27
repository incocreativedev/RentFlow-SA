import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  CreditCard,
  AlertTriangle,
  Bell,
  LogOut,
  Menu,
  X,
  Building2,
  ChevronLeft,
  Search,
} from 'lucide-react'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', group: 'main' },
  { to: '/app/properties', icon: Building, label: 'Properties', group: 'main' },
  { to: '/app/tenants', icon: Users, label: 'Tenants', group: 'main' },
  { to: '/app/leases', icon: FileText, label: 'Leases', group: 'main' },
  { to: '/app/payments', icon: CreditCard, label: 'Payments', group: 'finance' },
  { to: '/app/arrears', icon: AlertTriangle, label: 'Arrears', group: 'finance' },
  { to: '/app/notifications', icon: Bell, label: 'Notifications', group: 'finance' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const { profile, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const initials = profile?.contact_name
    ? profile.contact_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const currentPage = navItems.find(item => item.to === location.pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar-background transition-all duration-300 lg:static",
          collapsed ? "w-[72px]" : "w-[260px]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn("flex h-16 items-center gap-3 border-b border-sidebar-border px-4", collapsed && "justify-center px-2")}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
            <Building2 className="h-5 w-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-white tracking-tight">
              Rent<span className="text-blue-400">Flow</span>
            </span>
          )}
          <button className="ml-auto text-sidebar-foreground hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {!collapsed && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">Management</p>}
            {navItems.filter(i => i.group === 'main').map(item => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "sidebar-nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-sidebar-accent text-white shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-blue-400")} />
                  {!collapsed && item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-6 space-y-1">
            {!collapsed && <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">Finance</p>}
            {navItems.filter(i => i.group === 'finance').map(item => {
              const isActive = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "sidebar-nav-item flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-sidebar-accent text-white shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white"
                  )}
                >
                  <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive && "text-blue-400")} />
                  {!collapsed && item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Collapse toggle (desktop only) */}
        <button
          className="hidden lg:flex items-center justify-center border-t border-sidebar-border py-3 text-sidebar-foreground hover:text-white transition-colors"
          onClick={() => setCollapsed(!collapsed)}
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>

        {/* User info */}
        <div className={cn("border-t border-sidebar-border p-3", collapsed && "px-2")}>
          <div className={cn("flex items-center gap-3 rounded-lg p-2", collapsed && "justify-center p-1")}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-sm font-bold text-white">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-white">{profile?.contact_name || 'User'}</p>
                <p className="truncate text-xs text-sidebar-foreground">{profile?.agency_name || 'Agency'}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn(
              "mt-1 w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-white",
              collapsed ? "justify-center px-2" : "justify-start gap-3"
            )}
            onClick={handleSignOut}
            title={collapsed ? 'Sign Out' : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && 'Sign Out'}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm">
          <button className="lg:hidden rounded-lg p-1.5 hover:bg-muted" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">
              {currentPage?.label || 'RentFlow SA'}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-lg border bg-muted/50 pl-9 pr-4 text-sm outline-none transition-colors focus:border-primary focus:bg-white focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Notifications */}
            <Link to="/app/notifications" className="relative rounded-lg p-2 hover:bg-muted transition-colors">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
            </Link>

            {/* User avatar (mobile/tablet) */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white lg:hidden">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
