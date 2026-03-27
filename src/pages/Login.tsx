import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ArrowRight, Shield, CheckCircle2 } from 'lucide-react'
import { isSupabaseConfigured } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/app')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Brand */}
      <div className="relative hidden w-[480px] shrink-0 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:flex lg:flex-col lg:justify-between">
        {/* Decorative elements */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />
        <div className="absolute right-10 top-1/2 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Rent<span className="text-blue-200">Flow</span> SA
            </span>
          </div>
        </div>

        <div className="relative z-10 p-10">
          <h2 className="text-3xl font-bold leading-tight text-white">
            Manage your properties with confidence
          </h2>
          <p className="mt-4 text-lg text-blue-100/80">
            Automated rent tracking, tenant reminders, and escalation workflows for South African property managers.
          </p>

          <div className="mt-8 space-y-4">
            {[
              'Automated tenant reminders',
              'Guided escalation workflows',
              'Real-time owner notifications',
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-200" />
                <span className="text-sm text-blue-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-10">
          <p className="text-xs text-blue-200/60">
            Trusted by property agencies across South Africa
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">RentFlow SA</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isSupabaseConfigured && (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <div className="text-sm text-amber-800">
                  <strong>Setup required:</strong> Add your Supabase URL and Anon Key to the <code className="rounded bg-amber-100 px-1">.env</code> file.
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@agency.co.za"
                className="h-11 bg-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="h-11 bg-white"
              />
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-semibold shadow-sm" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
