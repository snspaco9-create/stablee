import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Pricing() {
  const navigate = useNavigate()
  const { landlord } = useAuth()

  const plans = [
    {
      name: 'Free',
      price: '₦0',
      period: 'forever',
      color: 'border-gray-200',
      badge: null,
      features: [
        { text: '1 property', included: true },
        { text: '5 units', included: true },
        { text: '10 tenants', included: true },
        { text: 'Manual payment recording', included: true },
        { text: 'Dashboard summary', included: true },
        { text: 'SMS reminders', included: false },
        { text: 'PDF receipts', included: false },
        { text: 'Tenant portal', included: false }
      ],
      cta: 'Current plan',
      disabled: true,
      plan: 'free'
    },
    {
      name: 'Starter',
      price: '₦3,500',
      period: 'per month',
      color: 'border-blue-500',
      badge: 'Popular',
      features: [
        { text: '5 properties', included: true },
        { text: '30 units', included: true },
        { text: 'Unlimited tenants', included: true },
        { text: 'SMS reminders (100/month)', included: true },
        { text: 'PDF receipts', included: true },
        { text: 'Tenant portal', included: true },
        { text: 'Email support', included: true }
      ],
      cta: 'Upgrade to Starter',
      disabled: false,
      plan: 'starter'
    },
    {
      name: 'Pro',
      price: '₦8,000',
      period: 'per month',
      color: 'border-purple-500',
      badge: null,
      features: [
        { text: 'Unlimited properties', included: true },
        { text: 'Unlimited units', included: true },
        { text: 'Unlimited tenants', included: true },
        { text: 'Unlimited SMS reminders', included: true },
        { text: 'PDF receipts', included: true },
        { text: 'Tenant portal', included: true },
        { text: 'Bulk reminders', included: true },
        { text: 'Priority support', included: true }
      ],
      cta: 'Upgrade to Pro',
      disabled: false,
      plan: 'pro'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">← Dashboard</button>
        <span className="text-lg font-bold text-blue-600">Plans</span>
        <span></span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Choose your plan</h2>
          <p className="text-sm text-gray-500 mt-2">Upgrade to unlock more properties and features</p>
          <div className="mt-2 inline-block bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
            Current plan: {landlord?.plan?.charAt(0).toUpperCase() + landlord?.plan?.slice(1) || 'Free'}
          </div>
        </div>

        <div className="space-y-4">
          {plans.map(plan => (
            <div key={plan.name} className={`bg-white rounded-2xl border-2 ${plan.color} p-6 relative`}>
              {plan.badge && (
                <span className="absolute top-4 right-4 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  {plan.badge}
                </span>
              )}
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {plan.price}
                  <span className="text-sm font-normal text-gray-400"> /{plan.period}</span>
                </p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f.text} className="flex items-center gap-2 text-sm">
                    <span className={f.included ? 'text-green-500' : 'text-red-400'}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    <span className={f.included ? 'text-gray-600' : 'text-gray-400'}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.disabled || landlord?.plan === plan.plan}
                onClick={() => navigate(`/checkout/${plan.plan}`)}
                className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  plan.disabled || landlord?.plan === plan.plan
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : plan.name === 'Starter'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {landlord?.plan === plan.plan ? 'Current plan' : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}