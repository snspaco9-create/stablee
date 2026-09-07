import { useNavigate } from 'react-router-dom'

export default function Terms() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">← Back</button>
        <span className="text-base font-bold text-gray-900">Terms of Service</span>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-xs text-gray-400">Last updated: September 2026</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          {[
            { title: '1. Acceptance of terms', body: 'By accessing or using Stablee, you agree to be bound by these terms. If you do not agree, please do not use the platform.' },
            { title: '2. Description of service', body: 'Stablee is a rent management platform that helps Nigerian landlords track properties, tenants and payments. We provide tools for payment recording, SMS reminders and receipt generation.' },
            { title: '3. User responsibilities', body: 'You are responsible for maintaining the confidentiality of your account credentials. You agree to provide accurate information and to use Stablee only for lawful purposes.' },
            { title: '4. Tenant data', body: 'By adding tenant information to Stablee, you confirm that you have obtained the necessary consent from tenants to store and use their personal information for rent management purposes.' },
            { title: '5. Subscription and payments', body: 'Paid plans are billed monthly. Payments are processed securely via Paystack. Cancellation takes effect at the end of the current billing period. We do not offer refunds for partial months.' },
            { title: '6. Data and privacy', body: 'We handle your data in accordance with our Privacy Policy. We do not sell your data to third parties.' },
            { title: '7. Limitation of liability', body: 'Stablee is provided as-is. We are not liable for any indirect, incidental or consequential damages arising from the use of our platform.' },
            { title: '8. Changes to terms', body: 'We may update these terms at any time. Continued use of Stablee after changes constitutes acceptance of the new terms.' },
            { title: '9. Contact', body: 'For questions about these terms, contact us at hello@stablee.app' }
          ].map(section => (
            <div key={section.title}>
              <h2 className="text-base font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center">© 2026 Stablee. All rights reserved.</p>
      </div>
    </div>
  )
}