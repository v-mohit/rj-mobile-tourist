import { notFound } from 'next/navigation';
import { fetchPlaceDetails } from '@/lib/placeApi';
import { getBackendPlaceByStrapiId } from '@/lib/api/placeApi';
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
  const strapiPlaceId = Number(place?.id);
  const placeAttributes = place?.attributes;

  // Get first image URL if available
  const imageUrl = placeAttributes?.images?.data?.[0]?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_GRAPHQL_IMG_URL}${placeAttributes.images.data[0].attributes.url}`
    : undefined;

  // Fetch backend place data (DB place info, ticket types, etc.)
  let backendPlace = null;
  try {
    backendPlace = await getBackendPlaceByStrapiId(strapiPlaceId);
  } catch (error) {
    console.error('Failed to fetch backend place data:', error);
    // Continue without backend data - TicketSelector will use defaults
  }

  return (
    <TicketSelector
      placeName={placeAttributes?.name || 'Place'}
      strapiPlaceId={strapiPlaceId}
      backendPlaceId={backendPlace?.id}
      bookable={placeAttributes?.bookable ?? false}
      placeImage={imageUrl}
      description={placeAttributes?.description}
      backendPlaceData={backendPlace}
    />
  );
}
