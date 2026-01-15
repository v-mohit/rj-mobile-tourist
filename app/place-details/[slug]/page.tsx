import { notFound } from 'next/navigation';
import { fetchPlaceDetails } from '@/lib/placeApi';
import TicketSelector from '@/components/booking/TicketSelector';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PlaceDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug) notFound();

  const pageData = await fetchPlaceDetails(slug);

  if (!pageData) notFound();
    const id = pageData?.attributes?.place?.data?.id;


  const place = pageData.attributes.place.data;

  return (
    <TicketSelector
      placeName={place.attributes.name}
      strapiPlaceId={Number(id)}
      bookable={place.attributes.bookable}
    />
  );
}
