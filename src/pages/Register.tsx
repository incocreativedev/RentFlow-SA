import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agencyName, setAgencyName] = useState('')
  const [contactName, setContactName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signUp(email, password, { agency_name: agencyName, contact_name: contactName })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to register')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
          <p className="mt-2 text-gray-600">Check your email to confirm your account. Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Brand */}
      <div className="relative hidden w-[480px] shrink-0 overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-blue-800 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-white/5" />

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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-blue-100">
            <Sparkles className="h-3.5 w-3.5" />
            2 months free trial
          </div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Start automating your rent collection today
          </h2>
          <p className="mt-4 text-lg text-blue-100/80">
            Join property agencies across South Africa who are saving 10+ hours per week on admin.
          </p>
        </div>

        <div className="relative z-10 p-10">
          <p className="text-xs text-blue-200/60">No credit card required</p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold">RentFlow SA</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">Get started with a 2-month free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="agencyName" className="text-sm font-medium text-gray-700">Agency Name</Label>
              <Input id="agencyName" value={agencyName} onChange={e => setAgencyName(e.target.value)} required placeholder="Your Real Estate Agency" className="h-11 bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-sm font-medium text-gray-700">Your Name</Label>
              <Input id="contactName" value={contactName} onChange={e => setContactName(e.target.value)} required placeholder="Full name" className="h-11 bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@agency.co.za" className="h-11 bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Min 6 characters" className="h-11 bg-white" />
            </div>

            <Button type="submit" className="h-11 w-full text-sm font-semibold shadow-sm" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Create Account <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
