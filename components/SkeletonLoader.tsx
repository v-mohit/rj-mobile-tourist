'use client';

export function SkeletonTicketRow() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-3">
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded w-24 mb-2"></div>
          <div className="h-3 bg-slate-700 rounded w-20"></div>
        </div>
        <div className="text-right">
          <div className="h-4 bg-slate-700 rounded w-16 mb-1"></div>
          <div className="h-3 bg-slate-700 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonPriceBreakdown() {
  return (
    <div className="animate-pulse">
      <div className="space-y-3 mb-4">
        <div className="h-4 bg-slate-700 rounded w-full"></div>
        <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        <div className="h-4 bg-slate-700 rounded w-4/6"></div>
      </div>
      <div className="h-8 bg-slate-700 rounded"></div>
    </div>
  );
}

export function SkeletonModalContent() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="mb-6">
        <div className="h-6 bg-slate-700 rounded w-32 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-48"></div>
      </div>

      {/* Booking Summary Box */}
      <div className="bg-slate-800 rounded-xl p-5 mb-6 border border-slate-700">
        {/* Place */}
        <div className="mb-5 pb-5 border-b border-slate-700">
          <div className="h-3 bg-slate-700 rounded w-20 mb-2"></div>
          <div className="h-6 bg-slate-700 rounded w-40"></div>
        </div>

        {/* Date */}
        <div className="mb-5 pb-5 border-b border-slate-700">
          <div className="h-3 bg-slate-700 rounded w-16 mb-2"></div>
          <div className="h-6 bg-slate-700 rounded w-48"></div>
        </div>

        {/* Tickets */}
        <div className="mb-5 pb-5 border-b border-slate-700">
          <div className="h-3 bg-slate-700 rounded w-16 mb-3"></div>
          <SkeletonTicketRow />
          <SkeletonTicketRow />
        </div>

        {/* Contact */}
        <div>
          <div className="h-3 bg-slate-700 rounded w-16 mb-2"></div>
          <div className="h-6 bg-slate-700 rounded w-40"></div>
        </div>
      </div>

      {/* Price Box */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-700 rounded-xl p-5 mb-6">
        <div className="h-8 bg-slate-600 rounded w-full"></div>
      </div>

      {/* Buttons */}
      <div className="space-y-3">
        <div className="h-14 bg-slate-700 rounded-xl"></div>
        <div className="h-12 bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  );
}
