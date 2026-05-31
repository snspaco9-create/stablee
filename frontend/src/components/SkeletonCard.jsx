export default function SkeletonCard({ lines = 2 }) {
  return (
    <div className="list-item">
      <div className="skeleton h-4 w-32 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 mb-2 ${i === lines - 1 ? 'w-24' : 'w-full'}`} />
      ))}
    </div>
  )
}