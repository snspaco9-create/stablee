import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

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
        <div className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wide">
          Built for Nigerian landlords 🇳🇬
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
            {[
              { emoji: '📓', title: 'Paper notebooks', desc: 'Payment records get lost, damaged or forgotten entirely' },
              { emoji: '📱', title: 'WhatsApp chasing', desc: 'Sending "Please have you paid?" to tenants every month' },
              { emoji: '📊', title: 'Excel spreadsheets', desc: 'Manual updates, no reminders, no receipts, one missed entry causes chaos' }
            ].map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl mb-3">{item.emoji}</div>
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
            {[
              { emoji: '🏠', title: 'Property & tenant management', desc: 'Track all your properties, units and tenants in one clean dashboard. See who has paid and who hasn\'t at a glance.' },
              { emoji: '📱', title: 'Automatic SMS reminders', desc: 'Set reminders 30, 14, 7, 3 and 1 day before rent is due. Tenants get reminded automatically — you do nothing.' },
              { emoji: '🧾', title: 'Instant PDF receipts', desc: 'Generate professional PDF receipts for every payment in seconds. No more handwritten receipts.' },
              { emoji: '🔗', title: 'Tenant portal', desc: 'Give tenants a link to view their full payment history and download receipts anytime. No login required.' },
              { emoji: '📊', title: 'Real-time dashboard', desc: 'See expected rent, collected amount and outstanding balance for any month at a glance.' },
              { emoji: '🇳🇬', title: 'Built for Nigeria', desc: 'Supports monthly, quarterly and yearly payment cycles. Naira only. No foreign currency confusion.' }
            ].map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="text-2xl mb-3">{f.emoji}</div>
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
                      <span className="text-green-500 text-xs">✓</span>{f}
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
        <p className="text-center text-xs text-gray-400 mt-6">© 2026 Stablee. All rights reserved. Built in Nigeria 🇳🇬</p>
      </footer>
    </div>
  )
}