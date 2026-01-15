'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-4 text-center text-red-600">
      Failed to load place details.
    </div>
  );
}
