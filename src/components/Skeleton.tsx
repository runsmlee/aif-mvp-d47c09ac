/**
 * Skeleton loading states for Suspense fallbacks.
 * Replaces spinner with perceptually faster skeleton screens.
 */

function SkeletonLine({ width = '100%' }: { width?: string }) {
  return (
    <div
      data-testid="skeleton-line"
      className="animate-pulse bg-gray-800/60 rounded-md"
      style={{ width, height: '12px' }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="metric-card animate-pulse"
    >
      <div className="flex flex-col gap-3">
        <SkeletonLine width="40%" />
        <SkeletonLine width="70%" />
        <SkeletonLine width="55%" />
        <SkeletonLine width="90%" />
      </div>
      <span className="sr-only">Loading content...</span>
    </div>
  );
}

export function SkeletonCodeBlock() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="code-panel p-4 animate-pulse"
    >
      <span className="sr-only">Loading code snippet...</span>
      <div className="flex flex-col gap-2.5">
        <SkeletonLine width="60%" />
        <SkeletonLine width="85%" />
        <SkeletonLine width="75%" />
        <SkeletonLine width="90%" />
        <SkeletonLine width="50%" />
        <SkeletonLine width="80%" />
        <SkeletonLine width="65%" />
        <SkeletonLine width="70%" />
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="flex flex-col gap-4 animate-pulse"
    >
      <span className="sr-only">Loading form...</span>
      <div className="flex flex-col gap-2">
        <SkeletonLine width="25%" />
        <SkeletonLine width="100%" />
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonLine width="30%" />
        <SkeletonLine width="100%" />
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonLine width="20%" />
        <SkeletonLine width="100%" />
      </div>
      <div className="flex flex-col gap-2">
        <SkeletonLine width="35%" />
        <SkeletonLine width="100%" />
      </div>
    </div>
  );
}

export function SkeletonMetricCards() {
  return (
    <div role="status" aria-label="Loading" className="animate-pulse">
      <span className="sr-only">Loading analytics data...</span>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="metric-card">
            <div className="flex flex-col gap-3">
              <SkeletonLine width="60%" />
              <SkeletonLine width="40%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
