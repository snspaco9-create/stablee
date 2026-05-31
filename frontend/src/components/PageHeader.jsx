import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'

export default function PageHeader({ title, backTo, action }) {
  const navigate = useNavigate()

  return (
    <div className="page-header">
      <div className="w-16">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1 text-blue-600 text-sm font-medium"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}
      </div>
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="w-16 flex justify-end">
        {action}
      </div>
    </div>
  )
}