import { clsx } from 'clsx'

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('bg-bark-100 rounded-xl animate-pulse', className)} />
  )
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-bark-200 p-5 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} className={`h-3 w-${i === lines - 2 ? '1/2' : 'full'}`} />
      ))}
    </div>
  )
}
