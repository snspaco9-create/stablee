import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export function DashboardSkeleton() {
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div className="px-4 pt-6 pb-2">
        <Skeleton width={80} height={14} />
        <Skeleton width={150} height={24} className="mt-1" />
      </div>

      <div className="px-4 mb-4">
        <Skeleton height={180} borderRadius={16} />
      </div>

      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton height={80} borderRadius={16} />
          <Skeleton height={80} borderRadius={16} />
        </div>
      </div>

      <div className="px-4 mb-4">
        <Skeleton height={120} borderRadius={16} />
      </div>
    </SkeletonTheme>
  )
}

export function ListSkeleton({ count = 4 }) {
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <div className="space-y-3">
        {Array(count).fill(0).map((_, i) => (
          <Skeleton key={i} height={100} borderRadius={16} />
        ))}
      </div>
    </SkeletonTheme>
  )
}

export function CardSkeleton() {
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#e0e0e0">
      <Skeleton height={100} borderRadius={16} />
    </SkeletonTheme>
  )
}