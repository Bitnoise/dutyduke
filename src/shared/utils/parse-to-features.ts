import { type GoogleGeocodingResponse, type Feature } from '../service/address/types';
import { type Nullable } from '../types';

export const parseToFeatures = (googleResults: GoogleGeocodingResponse): Nullable<Feature> => {
  if (!googleResults?.results || !Array.isArray(googleResults.results)) {
    return null;
  }

  return googleResults.results.map((result, index): Feature => {
    const location = result.geometry?.location;
    const lat = location?.lat ?? 0;
    const lng = location?.lng ?? 0;

    const bboxPadding = 0.0005; // added small padding
    const bbox: [number, number, number, number] = [
      lng - bboxPadding,
      lat - bboxPadding,
      lng + bboxPadding,
      lat + bboxPadding,
    ];

    return {
      id: result.place_id || `google-${index}`,
      bbox,
      center: [lng, lat],
      place_name: result.formatted_address || '',
      place_name_en: result.formatted_address || '',
      place_name_pl: result.formatted_address || '',
      geometry: {
        type: 'Point',
        coordinates: [lat, lng],
      },
    };
  })[0];
};
