import { notFound } from 'next/navigation';
import { fetchPlaceDetails } from '@/lib/placeApi';
import BookingWidget from './BookingWidget';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PlaceDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) notFound();

  const pageData = await fetchPlaceDetails(slug);

  if (!pageData) notFound();
    const id = pageData?.attributes?.place?.data?.id;

console.log("place data------",pageData,id );

  const place = pageData.attributes.place.data;

  return (
    <main className="px-4 py-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-2">
        {place.attributes.name}
      </h1>

      <p className="text-gray-700 mb-4">
        {place.attributes.description}
      </p>

      <BookingWidget bookable={place.attributes.bookable} />
    </main>
  );
}
