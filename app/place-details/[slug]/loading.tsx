export default function Loading() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-lg mx-auto">
        {/* Image Skeleton */}
        <div className="w-full h-64 bg-slate-700 animate-pulse" />

        {/* Content Skeleton */}
        <div className="px-4 pt-6 pb-8">
          {/* Title Skeleton */}
          <div className="h-10 bg-slate-700 rounded animate-pulse mb-3 w-3/4" />

          {/* Badge Skeleton */}
          <div className="h-6 bg-slate-700 rounded-full animate-pulse mb-4 w-32" />

          {/* Description Skeleton */}
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-slate-700 rounded animate-pulse w-full" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6" />
          </div>

          {/* Date Info Skeleton */}
          <div className="bg-slate-700 rounded-lg p-4 mb-6 animate-pulse">
            <div className="h-3 bg-slate-600 rounded w-20 mb-2" />
            <div className="h-6 bg-slate-600 rounded w-40" />
          </div>

          {/* Tickets Skeleton */}
          <div className="mb-6">
            <div className="h-5 bg-slate-700 rounded animate-pulse mb-4 w-32" />
            <div className="space-y-3">
              <div className="h-16 bg-slate-700 rounded-lg animate-pulse" />
              <div className="h-16 bg-slate-700 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="h-14 bg-slate-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
