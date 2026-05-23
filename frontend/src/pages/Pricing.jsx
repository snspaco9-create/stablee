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
        '1 property',
        '5 units',
        '10 tenants',
        'Manual payment recording',
        'Dashboard summary',
        'No SMS reminders',
        'No PDF receipts'
      ],
      cta: 'Current plan',
      disabled: true
    },
    {
      name: 'Starter',
      price: '₦3,500',
      period: 'per month',
      color: 'border-blue-500',
      badge: 'Popular',
      features: [
        '5 properties',
        '30 units',
        'Unlimited tenants',
        'SMS reminders (100/month)',
        'PDF receipts',
        'Tenant portal',
        'Email support'
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
        'Unlimited properties',
        'Unlimited units',
        'Unlimited tenants',
        'Unlimited SMS reminders',
        'PDF receipts',
        'Tenant portal',
        'Bulk reminders',
        'Priority support'
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
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {plan.price}
                    <span className="text-sm font-normal text-gray-400"> /{plan.period}</span>
                  </p>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-500">✓</span>
                    {f}
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