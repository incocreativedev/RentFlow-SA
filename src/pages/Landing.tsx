import { Link } from 'react-router-dom'
import {
  Building2,
  Bell,
  Shield,
  BarChart3,
  MessageSquare,
  Clock,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Zap,
  Users,
  Star,
} from 'lucide-react'

const features = [
  {
    icon: Bell,
    title: 'Automated Reminders',
    description:
      'Pre-due, due date, and overdue alerts sent automatically to tenants via email, SMS, and WhatsApp.',
  },
  {
    icon: MessageSquare,
    title: 'Owner Notifications',
    description:
      'Keep landlords informed in real-time with payment status updates and tenant response tracking.',
  },
  {
    icon: Shield,
    title: 'Guided Escalation',
    description:
      'Structured workflow guiding you from reminders to Letters of Demand to lease termination.',
  },
  {
    icon: BarChart3,
    title: 'Arrears Dashboard',
    description:
      'Visual overview of overdue accounts, payment trends, and collection performance at a glance.',
  },
  {
    icon: Clock,
    title: 'Payment Tracking',
    description:
      'Automatic rent due date tracking across all properties and tenants with zero manual input.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Management',
    description:
      'Manage hundreds of properties and tenants from a single dashboard built for SA agencies.',
  },
]

const steps = [
  {
    step: '01',
    title: 'Add Your Properties',
    description: 'Import or add your rental portfolio with tenant and lease details.',
  },
  {
    step: '02',
    title: 'Automate Communications',
    description: 'Set up reminder schedules and let the system handle tenant follow-ups.',
  },
  {
    step: '03',
    title: 'Track & Escalate',
    description: 'Monitor payments and follow guided escalation steps when rent is overdue.',
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
  { value: '40%', label: 'Faster Rent Collection' },
  { value: '85%', label: 'Reduction in Late Payments' },
  { value: '10hrs', label: 'Saved Per Week on Admin' },
  { value: '99.9%', label: 'System Uptime' },
]

const testimonials = [
  {
    quote: 'RentFlow SA cut our arrears by more than half in just three months. The automated escalation workflow is a game-changer.',
    author: 'Thandi M.',
    role: 'Director, Coastal Property Group',
    rating: 5,
  },
  {
    quote: 'We used to spend hours chasing tenants. Now the system does it for us and landlords are happier than ever.',
    author: 'James P.',
    role: 'Operations Manager, KZN Rentals',
    rating: 5,
  },
  {
    quote: 'The guided escalation feature gives us confidence. We always know the right next step when dealing with arrears.',
    author: 'Naledi K.',
    role: 'Agency Owner, Urban Living Properties',
    rating: 5,
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              RentFlow <span className="text-blue-600">SA</span>
            </span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              How It Works
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Pricing
            </a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
              Testimonials
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-white to-white" />
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-blue-100/40 blur-3xl" />
          <div className="absolute -left-20 top-40 h-[400px] w-[400px] rounded-full bg-indigo-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Zap className="h-3.5 w-3.5" />
              Built for South African Property Managers
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Stop Chasing Rent.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Start Automating.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
              The automated rent tracking and arrears management platform that
              sends reminders, notifies landlords, and guides your agency
              through every escalation step.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
              >
                Start 2-Month Free Trial
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:shadow-md"
              >
                See How It Works
              </a>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              No credit card required. 2 months free, cancel anytime.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-white px-4 py-1 text-xs text-gray-400">
                  app.rentflowsa.co.za
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="grid grid-cols-12 gap-0">
                {/* Sidebar mock */}
                <div className="col-span-3 border-r border-gray-100 bg-gray-50/50 p-4">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-blue-600" />
                    <div className="h-3 w-16 rounded bg-gray-300" />
                  </div>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div
                      key={i}
                      className={`mb-1 flex items-center gap-2 rounded-md px-2 py-2 ${i === 1 ? 'bg-blue-100' : ''}`}
                    >
                      <div className={`h-3 w-3 rounded ${i === 1 ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <div className={`h-2 rounded ${i === 1 ? 'w-14 bg-blue-400' : 'w-12 bg-gray-200'}`} />
                    </div>
                  ))}
                </div>
                {/* Content mock */}
                <div className="col-span-9 p-6">
                  <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
                  <div className="mb-6 grid grid-cols-4 gap-3">
                    {[
                      { color: 'bg-blue-500', value: '142', label: 'Properties' },
                      { color: 'bg-green-500', value: 'R2.1M', label: 'Collected' },
                      { color: 'bg-amber-500', value: '12', label: 'Overdue' },
                      { color: 'bg-purple-500', value: '98%', label: 'Rate' },
                    ].map((card, i) => (
                      <div key={i} className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                        <div className={`mb-2 h-2 w-8 rounded ${card.color} opacity-60`} />
                        <div className="text-lg font-bold text-gray-800">{card.value}</div>
                        <div className="text-[10px] text-gray-400">{card.label}</div>
                      </div>
                    ))}
                  </div>
                  {/* Chart placeholder */}
                  <div className="rounded-lg border border-gray-100 p-4">
                    <div className="mb-3 h-3 w-28 rounded bg-gray-200" />
                    <div className="flex items-end gap-1">
                      {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t bg-blue-400 opacity-80"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-extrabold text-blue-600 sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm font-medium text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to manage rent collection
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From automated reminders to guided escalation workflows, RentFlow SA handles the heavy lifting.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-blue-100 hover:shadow-md hover:shadow-blue-50"
              >
                <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              How It Works
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Up and running in minutes
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to automate your entire rent collection process.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-10 hidden w-full translate-x-1/2 sm:block">
                    <ChevronRight className="mx-auto h-6 w-6 text-gray-300" />
                  </div>
                )}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/25">
                  {step.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Escalation Workflow Highlight */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-orange-600">
                Key Differentiator
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Guided Escalation Workflow
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-gray-600">
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
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Escalation flow visual */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="space-y-4">
                {[
                  { day: 'Day 1', status: 'Rent Overdue', action: 'Tenant notified automatically', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
                  { day: 'Day 1', status: 'Owner Notified', action: '"Tenant has not paid, reminder sent"', color: 'bg-blue-100 text-blue-800 border-blue-200' },
                  { day: 'Day 3', status: 'No Response', action: 'Owner prompted: What would you like to do?', color: 'bg-orange-100 text-orange-800 border-orange-200' },
                  { day: 'Action', status: 'Escalate', action: 'Send Letter of Demand', color: 'bg-red-100 text-red-800 border-red-200' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                      {i + 1}
                    </div>
                    <div className={`flex-1 rounded-lg border p-3 ${item.color}`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold">{item.day} &middot; {item.status}</span>
                      </div>
                      <p className="mt-0.5 text-sm">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Trusted by agencies across South Africa
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 text-sm leading-relaxed text-gray-700">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
              Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start with a 2-month free trial. No credit card required.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-3">
            {plans.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl border p-8 ${
                  plan.popular
                    ? 'border-blue-600 bg-white shadow-xl shadow-blue-100'
                    : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <Link
                  to="/register"
                  className={`mt-6 block w-full rounded-lg py-3 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                      : 'border border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </Link>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
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

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to automate your rent collection?
            </h2>
            <p className="mt-4 text-lg text-blue-100">
              Join agencies across South Africa who are saving time, reducing
              arrears, and keeping landlords happy.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
              >
                Start Your Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-4 text-sm text-blue-200">
              2 months free. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-4">
            <div className="sm:col-span-1">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-lg font-bold text-gray-900">RentFlow SA</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Automated rent tracking and arrears management for South African property managers.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Product</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="#features" className="hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="hover:text-gray-900">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-gray-900">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Company</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">About</a></li>
                <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li><a href="#" className="hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-gray-900">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-900">POPIA Compliance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} RentFlow SA. All rights reserved. Built in Durban, South Africa.
          </div>
        </div>
      </footer>
    </div>
  )
}
