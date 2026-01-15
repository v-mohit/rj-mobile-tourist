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

  const place = pageData.attributes.place.data;
  const id = place?.id;
  const placeAttributes = place?.attributes;

  // Get first image URL if available
  const imageUrl = placeAttributes?.images?.data?.[0]?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${placeAttributes.images.data[0].attributes.url}`
    : undefined;

  return (
    <TicketSelector
      placeName={placeAttributes?.name || 'Place'}
      strapiPlaceId={Number(id)}
      bookable={placeAttributes?.bookable ?? false}
      placeImage={imageUrl}
      description={placeAttributes?.description}
    />
  );
}
