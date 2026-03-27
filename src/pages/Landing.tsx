import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Bell,
  Shield,
  BarChart3,
  MessageSquare,
  Clock,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  Star,
  Menu,
  X,
  Play,
  Sparkles,
  TrendingUp,
  Lock,
} from 'lucide-react'

const features = [
  {
    icon: Bell,
    title: 'Automated Reminders',
    description: 'Pre-due, due date, and overdue alerts sent automatically to tenants via email, SMS, and WhatsApp.',
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
  },
  {
    icon: MessageSquare,
    title: 'Owner Notifications',
    description: 'Keep landlords informed in real-time with payment status updates and tenant response tracking.',
    gradient: 'from-green-500 to-emerald-500',
    bg: 'bg-green-50',
  },
  {
    icon: Shield,
    title: 'Guided Escalation',
    description: 'Structured workflow guiding you from reminders to Letters of Demand to lease termination.',
    gradient: 'from-orange-500 to-red-500',
    bg: 'bg-orange-50',
  },
  {
    icon: BarChart3,
    title: 'Arrears Dashboard',
    description: 'Visual overview of overdue accounts, payment trends, and collection performance at a glance.',
    gradient: 'from-purple-500 to-pink-500',
    bg: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: 'Payment Tracking',
    description: 'Automatic rent due date tracking across all properties and tenants with zero manual input.',
    gradient: 'from-cyan-500 to-blue-500',
    bg: 'bg-cyan-50',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Management',
    description: 'Manage hundreds of properties and tenants from a single dashboard built for SA agencies.',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
  },
]

const steps = [
  {
    step: '01',
    title: 'Add Your Properties',
    description: 'Import or add your rental portfolio with tenant and lease details.',
    icon: Building2,
  },
  {
    step: '02',
    title: 'Automate Communications',
    description: 'Set up reminder schedules and let the system handle tenant follow-ups.',
    icon: Bell,
  },
  {
    step: '03',
    title: 'Track & Escalate',
    description: 'Monitor payments and follow guided escalation steps when rent is overdue.',
    icon: TrendingUp,
  },
]

const plans = [
  {
    name: 'Starter',
    price: 'R499',
    period: '/month',
    description: 'Perfect for small agencies',
    features: [
      'Up to 30 properties',
      'Automated tenant reminders',
      'Owner notifications',
      'Email & SMS alerts',
      'Basic arrears dashboard',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    price: 'R1,499',
    period: '/month',
    description: 'For growing agencies',
    features: [
      'Up to 150 properties',
      'Everything in Starter',
      'Guided escalation workflow',
      'WhatsApp integration',
      'Advanced reporting',
      'Letter of Demand templates',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large property managers',
    features: [
      'Unlimited properties',
      'Everything in Professional',
      'Custom integrations',
      'Dedicated account manager',
      'API access',
      'Custom branding',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

const stats = [
  { value: '40%', label: 'Faster Rent Collection', icon: Zap },
  { value: '85%', label: 'Reduction in Late Payments', icon: TrendingUp },
  { value: '10hrs', label: 'Saved Per Week on Admin', icon: Clock },
  { value: '99.9%', label: 'System Uptime', icon: Lock },
]

const testimonials = [
  {
    quote: 'RentFlow SA cut our arrears by more than half in just three months. The automated escalation workflow is a game-changer.',
    author: 'Thandi M.',
    role: 'Director, Coastal Property Group',
    rating: 5,
    initials: 'TM',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    quote: 'We used to spend hours chasing tenants. Now the system does it for us and landlords are happier than ever.',
    author: 'James P.',
    role: 'Operations Manager, KZN Rentals',
    rating: 5,
    initials: 'JP',
    color: 'from-green-400 to-emerald-500',
  },
  {
    quote: 'The guided escalation feature gives us confidence. We always know the right next step when dealing with arrears.',
    author: 'Naledi K.',
    role: 'Agency Owner, Urban Living Properties',
    rating: 5,
    initials: 'NK',
    color: 'from-purple-400 to-pink-500',
  },
]

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100/80 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Rent<span className="text-blue-600">Flow</span> <span className="text-sm font-medium text-gray-400">SA</span>
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
              Testimonials
            </a>
          </div>
          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
            >
              Get Started Free
            </Link>
          </div>
          {/* Mobile menu button */}
          <button className="md:hidden rounded-lg p-2 hover:bg-gray-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t bg-white px-4 pb-4 pt-2 md:hidden">
            <div className="space-y-1">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">How It Works</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Pricing</a>
              <a href="#testimonials" onClick={() => setMobileMenuOpen(false)} className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Testimonials</a>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/login" className="rounded-lg border px-4 py-2.5 text-center text-sm font-medium text-gray-700">Sign In</Link>
              <Link to="/register" className="rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">Get Started Free</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white" />
          <div className="absolute right-0 top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-100/60 to-indigo-100/40 blur-3xl" />
          <div className="absolute -left-20 top-60 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/30 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-blue-50/50 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-32 lg:px-8 lg:pt-36">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-4 py-2 text-sm font-medium text-blue-700 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-500" />
              Built for South African Property Managers
              <ArrowRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Stop Chasing Rent.
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Start Automating.
              </span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-gray-500 sm:text-xl">
              The automated rent tracking and arrears management platform that
              sends reminders, notifies landlords, and guides your agency
              through every escalation step.
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-blue-600/25 transition-all hover:shadow-2xl hover:shadow-blue-600/30 active:scale-[0.98]"
              >
                Start 2-Month Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="group inline-flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-white/80 px-8 py-4 text-base font-semibold text-gray-700 shadow-sm backdrop-blur-sm transition-all hover:border-gray-300 hover:bg-white hover:shadow-md"
              >
                <Play className="h-4 w-4 text-blue-600" />
                See How It Works
              </a>
            </div>

            <p className="mt-5 text-sm text-gray-400">
              No credit card required. 2 months free, cancel anytime.
            </p>
          </div>

          {/* Dashboard Preview - Dark theme mock */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-300/30 ring-1 ring-black/5">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/80 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FEBC2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28C840]" />
                </div>
                <div className="ml-4 flex-1 rounded-lg bg-white px-4 py-1.5 text-xs text-gray-400 shadow-inner">
                  app.rentflowsa.co.za/dashboard
                </div>
              </div>
              {/* Mock dashboard */}
              <div className="grid grid-cols-12 gap-0">
                {/* Dark sidebar mock */}
                <div className="col-span-3 border-r bg-[hsl(224,40%,12%)] p-4">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600" />
                    <div className="h-3 w-16 rounded bg-white/20" />
                  </div>
                  <div className="mb-4">
                    <div className="mb-2 h-2 w-14 rounded bg-white/10" />
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className={`mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2 ${i === 1 ? 'bg-white/10' : ''}`}
                      >
                        <div className={`h-3.5 w-3.5 rounded ${i === 1 ? 'bg-blue-400' : 'bg-white/20'}`} />
                        <div className={`h-2 rounded ${i === 1 ? 'w-16 bg-white/60' : 'w-12 bg-white/15'}`} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="mb-2 h-2 w-10 rounded bg-white/10" />
                    {[5, 6, 7].map(i => (
                      <div key={i} className="mb-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2">
                        <div className="h-3.5 w-3.5 rounded bg-white/20" />
                        <div className="h-2 w-12 rounded bg-white/15" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Content mock */}
                <div className="col-span-9 bg-[hsl(220,20%,97%)] p-6">
                  <div className="mb-1 h-5 w-40 rounded bg-gray-300/50" />
                  <div className="mb-5 h-3 w-56 rounded bg-gray-200/60" />
                  <div className="mb-6 grid grid-cols-4 gap-3">
                    {[
                      { gradient: 'from-blue-500 to-indigo-600', value: '142', label: 'Properties' },
                      { gradient: 'from-green-500 to-emerald-600', value: 'R2.1M', label: 'Collected' },
                      { gradient: 'from-purple-500 to-pink-600', value: '12', label: 'Overdue' },
                      { gradient: 'from-red-500 to-orange-500', value: '98%', label: 'Rate' },
                    ].map((card, i) => (
                      <div key={i} className={`rounded-xl bg-gradient-to-br ${card.gradient} p-3.5 text-white shadow-lg`}>
                        <div className="mb-2 h-2 w-12 rounded bg-white/30" />
                        <div className="text-xl font-bold">{card.value}</div>
                        <div className="text-[10px] text-white/70">{card.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Chart mock */}
                  <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-sm">
                    <div className="mb-1 flex items-center justify-between">
                      <div className="h-3 w-28 rounded bg-gray-200" />
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                          <div className="h-2 w-12 rounded bg-gray-200" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-red-400" />
                          <div className="h-2 w-10 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-end gap-[3px]">
                      {[45, 62, 38, 75, 52, 88, 65, 82, 58, 92, 72, 85].map((h, i) => (
                        <div key={i} className="flex flex-1 flex-col gap-[2px]">
                          <div
                            className="w-full rounded-t-sm bg-blue-500"
                            style={{ height: `${h}px` }}
                          />
                          <div
                            className="w-full rounded-t-sm bg-red-300"
                            style={{ height: `${Math.max(10, h * 0.15)}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Redesigned with icons and cards */}
      <section className="relative border-y border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="group rounded-2xl bg-white p-6 text-center shadow-sm transition-all hover:shadow-md">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Redesigned with gradient icons */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              <Sparkles className="h-3.5 w-3.5" />
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Everything you need to
              <br />
              <span className="text-blue-600">manage rent collection</span>
            </h2>
            <p className="mt-5 text-lg text-gray-500">
              From automated reminders to guided escalation workflows, RentFlow SA handles the heavy lifting.
            </p>
          </div>
          <div className="mx-auto mt-20 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/50"
              >
                <div className={`mb-5 inline-flex rounded-2xl ${feature.bg} p-3.5`}>
                  <div className={`rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5 text-white shadow-lg`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Redesigned with connected steps */}
      <section id="how-it-works" className="bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Up and running in <span className="text-blue-600">minutes</span>
            </h2>
            <p className="mt-5 text-lg text-gray-500">
              Three simple steps to automate your entire rent collection process.
            </p>
          </div>
          <div className="mx-auto mt-20 grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-12 hidden w-full translate-x-1/2 sm:block">
                    <div className="mx-auto h-0.5 w-full bg-gradient-to-r from-blue-200 to-transparent" />
                  </div>
                )}
                <div className="relative mx-auto mb-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/25">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-blue-600 shadow-md ring-2 ring-blue-100">
                    {step.step}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escalation Workflow Highlight - Redesigned */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-orange-600">
                <Shield className="h-3.5 w-3.5" />
                Key Differentiator
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Guided Escalation
                <br />
                <span className="text-orange-600">Workflow</span>
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                RentFlow SA doesn't just send messages. It creates a structured
                arrears management workflow, prompting your agency with the right
                action at the right time.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  'Day 1 overdue: Automatic tenant reminder + owner notification',
                  'Day 3: Owner prompted with escalation options',
                  'Guided steps: Send Letter of Demand or begin termination',
                  'Full audit trail of every action taken',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-600/20 transition-all hover:bg-orange-700 hover:shadow-lg"
              >
                Try It Free <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            {/* Escalation flow visual - redesigned */}
            <div className="rounded-3xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/80 p-8 shadow-xl">
              <h4 className="mb-6 text-sm font-semibold text-gray-400 uppercase tracking-wider">Escalation Timeline</h4>
              <div className="relative space-y-0">
                {/* Connecting line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gradient-to-b from-yellow-300 via-orange-300 to-red-400" />
                {[
                  { day: 'Day 1', status: 'Rent Overdue', action: 'Tenant notified automatically', color: 'bg-yellow-500', ring: 'ring-yellow-100', bg: 'bg-yellow-50 border-yellow-100' },
                  { day: 'Day 1', status: 'Owner Notified', action: 'Tenant has not paid, reminder sent', color: 'bg-blue-500', ring: 'ring-blue-100', bg: 'bg-blue-50 border-blue-100' },
                  { day: 'Day 3', status: 'No Response', action: 'Owner prompted: What would you like to do?', color: 'bg-orange-500', ring: 'ring-orange-100', bg: 'bg-orange-50 border-orange-100' },
                  { day: 'Action', status: 'Escalate', action: 'Send Letter of Demand', color: 'bg-red-500', ring: 'ring-red-100', bg: 'bg-red-50 border-red-100' },
                ].map((item, i) => (
                  <div key={i} className="relative flex items-start gap-5 py-3">
                    <div className={`relative z-10 mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.color} ring-4 ${item.ring}`} />
                    <div className={`flex-1 rounded-xl border p-4 ${item.bg} transition-all hover:shadow-sm`}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-900">{item.day}</span>
                        <span className="text-xs text-gray-400">&middot;</span>
                        <span className="text-xs font-semibold text-gray-600">{item.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Redesigned with avatars */}
      <section id="testimonials" className="bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Trusted by agencies across
              <br />
              <span className="text-blue-600">South Africa</span>
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-gray-600">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-sm font-bold text-white`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing - Redesigned */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
              Simple, <span className="text-blue-600">transparent</span> pricing
            </h2>
            <p className="mt-5 text-lg text-gray-500">
              Start with a 2-month free trial. No credit card required.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.popular
                    ? 'border-blue-600 bg-white shadow-xl shadow-blue-100 ring-1 ring-blue-600'
                    : 'border-gray-200 bg-white shadow-sm hover:shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-blue-600 to-indigo-600 px-12 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                    Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-400">{plan.period}</span>
                </div>
                <Link
                  to="/register"
                  className={`mt-6 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20 hover:shadow-lg'
                      : 'border border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Redesigned with gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700" />
        <div className="absolute inset-0">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-white/5" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to automate your
              <br />
              rent collection?
            </h2>
            <p className="mt-5 text-lg text-blue-100/80">
              Join agencies across South Africa who are saving time, reducing
              arrears, and keeping landlords happy.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-xl transition-all hover:bg-blue-50 active:scale-[0.98]"
              >
                Start Your Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="mt-5 text-sm text-blue-200/60">
              2 months free. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Redesigned */}
      <footer className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md">
                  <Building2 className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold text-gray-900">RentFlow SA</span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                Automated rent tracking and arrears management for South African property managers.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li><a href="#features" className="transition-colors hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-gray-900">Pricing</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-gray-900">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li><a href="#" className="transition-colors hover:text-gray-900">About</a></li>
                <li><a href="#" className="transition-colors hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="transition-colors hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li><a href="#" className="transition-colors hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="transition-colors hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="transition-colors hover:text-gray-900">POPIA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} RentFlow SA. All rights reserved. Built in Durban, South Africa.
          </div>
        </div>
      </footer>
    </div>
  )
}
