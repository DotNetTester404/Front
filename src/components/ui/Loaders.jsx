import { clsx } from '../../utils/helpers';

export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return (
    <svg
      className={clsx('animate-spin text-primary-400', sizes[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Spinner size="xl" className="text-primary-900" />
        <p className="text-sm text-primary-500">Loading…</p>
      </div>
    </div>
  );
}

export function SkeletonBox({ className = '' }) {
  return <div className={clsx('skeleton', className)} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="card p-0 overflow-hidden">
      <SkeletonBox className="h-52 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-full" />
        <SkeletonBox className="h-3 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <SkeletonBox className="h-5 w-20" />
          <SkeletonBox className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="flex justify-between">
        <SkeletonBox className="h-4 w-32" />
        <SkeletonBox className="h-5 w-20" />
      </div>
      <SkeletonBox className="h-3 w-48" />
      <SkeletonBox className="h-3 w-full" />
      <div className="flex gap-2 pt-1">
        <SkeletonBox className="h-8 w-28" />
        <SkeletonBox className="h-8 w-28" />
      </div>
    </div>
  );
}
