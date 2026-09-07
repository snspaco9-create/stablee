import { useNavigate } from 'react-router-dom'

export default function OnboardingBanner({ stats }) {
  const navigate = useNavigate()

  if (stats?.properties > 0) return null

  return (
    <div className="px-4 mb-4">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-blue-900 mb-1">👋 Welcome to Stablee!</h3>
        <p className="text-xs text-blue-700 mb-3">Get started in 3 simple steps:</p>
        <div className="space-y-2 mb-4">
          {[
            { step: '1', text: 'Add your first property', done: false },
            { step: '2', text: 'Add units to your property', done: false },
            { step: '3', text: 'Add your tenants', done: false }
          ].map(s => (
            <div key={s.step} className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">{s.step}</span>
              </div>
              <span className="text-xs text-blue-800">{s.text}</span>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/properties')}
          className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          Add your first property →
        </button>
      </div>
    </div>
  )
}