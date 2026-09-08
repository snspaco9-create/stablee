import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Property & tenant management',
      desc: 'Track all your properties, units and tenants in one clean dashboard. See who has paid and who hasn\'t at a glance.'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      title: 'Automatic SMS reminders',
      desc: 'Set reminders 30, 14, 7, 3 and 1 day before rent is due. Tenants get reminded automatically — you do nothing.'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'Instant PDF receipts',
      desc: 'Generate professional PDF receipts for every payment in seconds. No more handwritten receipts.'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      title: 'Tenant portal',
      desc: 'Give tenants a link to view their full payment history and download receipts anytime. No login required.'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Real-time dashboard',
      desc: 'See expected rent, collected amount and outstanding balance for any month at a glance.'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Built for Nigeria',
      desc: 'Supports monthly, quarterly and yearly payment cycles. Naira only. No foreign currency confusion.'
    }
  ]

  const problems = [
    {
      icon: (
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Paper notebooks',
      desc: 'Payment records get lost, damaged or forgotten entirely'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: 'WhatsApp chasing',
      desc: 'Sending "Please have you paid?" to tenants every month'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18M10 6v12M6 6v12" />
        </svg>
      ),
      title: 'Excel spreadsheets',
      desc: 'Manual updates, no reminders, no receipts, one missed entry causes chaos'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="px-6 py-4 flex justify-between items-center border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">Stablee</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-sm text-gray-600 hover:text-gray-900">Sign in</button>
          <button onClick={() => navigate('/register')} className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get started free</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Built for Nigerian landlords
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
          Manage your properties.<br />
          <span className="text-blue-600">Stop chasing tenants.</span>
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Stablee helps Nigerian landlords track rent payments, send automatic SMS reminders, generate PDF receipts and give tenants a portal to view their payment history — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Start for free — no credit card
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Sign in
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-4">Free plan available · No setup fee · Cancel anytime</p>
      </section>

      {/* Problem */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sound familiar?</h2>
          <p className="text-gray-500 mb-10">This is how most Nigerian landlords manage rent today</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mb-3 mx-auto">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Everything you need to manage rent</h2>
            <p className="text-gray-500">Built specifically for how Nigerian landlords work</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Simple, honest pricing</h2>
            <p className="text-gray-500">Start free. Upgrade when you're ready.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Free',
                price: '₦0',
                period: 'forever',
                color: 'border-gray-200',
                features: ['1 property', '5 units', '10 tenants', 'Payment tracking', 'Dashboard'],
                cta: 'Get started free',
                highlight: false
              },
              {
                name: 'Starter',
                price: '₦3,500',
                period: 'per month',
                color: 'border-blue-500',
                features: ['5 properties', '30 units', 'Unlimited tenants', 'SMS reminders', 'PDF receipts', 'Tenant portal'],
                cta: 'Start Starter',
                highlight: true
              },
              {
                name: 'Pro',
                price: '₦8,000',
                period: 'per month',
                color: 'border-purple-500',
                features: ['Unlimited properties', 'Unlimited units', 'Unlimited tenants', 'Unlimited SMS', 'All features', 'Priority support'],
                cta: 'Go Pro',
                highlight: false
              }
            ].map(plan => (
              <div key={plan.name} className={`bg-white rounded-2xl p-6 border-2 ${plan.color} relative`}>
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Most popular
                  </div>
                )}
                <h3 className="font-bold text-gray-900 text-lg mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">{plan.price}</p>
                <p className="text-xs text-gray-400 mb-4">/{plan.period}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to modernize your rent collection?</h2>
          <p className="text-gray-500 mb-8">Join landlords across Nigeria who use Stablee to manage their properties smarter.</p>
          <button
            onClick={() => navigate('/register')}
            className="bg-blue-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Get started for free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-bold text-gray-900">Stablee</span>
            <span className="text-gray-400 text-sm">· Rent management for Nigerian landlords</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <button onClick={() => navigate('/privacy')} className="hover:text-gray-600">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-gray-600">Terms of Service</button>
            <a href="mailto:hello@stablee.app" className="hover:text-gray-600">Contact</a>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Stablee. All rights reserved. Built in Nigeria
          <svg className="inline-block w-4 h-4 mx-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </p>
      </footer>
    </div>
  )
}