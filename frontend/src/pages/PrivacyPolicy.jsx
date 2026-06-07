import { useNavigate } from 'react-router-dom'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 hover:underline">← Back</button>
        <span className="text-base font-bold text-gray-900">Privacy Policy</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-xs text-gray-400">Last updated: June 2026</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Who we are</h2>
            <p className="text-sm text-gray-600">Stablee is a rent management platform for Nigerian landlords. We help landlords manage properties, tenants, payments and send automated reminders.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. What data we collect</h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Landlord name, email and phone number</li>
              <li>Property and unit information</li>
              <li>Tenant names and phone numbers</li>
              <li>Payment records</li>
              <li>Usage data to improve the app</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. How we use your data</h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>To provide rent management services</li>
              <li>To send SMS reminders to tenants on your behalf</li>
              <li>To generate PDF receipts</li>
              <li>To improve our platform</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Data sharing</h2>
            <p className="text-sm text-gray-600">We do not sell your data. We share data only with:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside mt-2">
              <li>Termii — for SMS delivery</li>
              <li>Paystack — for payment processing</li>
              <li>Supabase — for secure data storage</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Data security</h2>
            <p className="text-sm text-gray-600">All data is encrypted in transit and at rest. We use industry-standard security practices including JWT authentication and row-level security.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Your rights</h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Access your data at any time</li>
              <li>Update or correct your information</li>
              <li>Delete your account and all associated data</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Tenant data</h2>
            <p className="text-sm text-gray-600">Landlords are responsible for obtaining consent from tenants before adding their information to Stablee. Tenant data is only used to facilitate rent management and reminders.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Contact us</h2>
            <p className="text-sm text-gray-600">For privacy concerns, contact us at: <span className="text-blue-600">hello@stablee.app</span></p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center">© 2026 Stablee. All rights reserved.</p>
      </div>
    </div>
  )
}