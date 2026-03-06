export type Feature = {
  id: string;
  bbox: [number, number, number, number];
  center: [number, number];
  place_name: string;
  place_name_en: string;
  place_name_pl: string;
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
};

export type AddressResult = {
  type: 'FeatureCollection';
  features: Feature[];
  query: string[];
};

export type GoogleGeocodingResponse = {
  results: GoogleGeocodingResult[];
  status: string;
};

export type GoogleGeocodingResult = {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: {
    bounds?: Bounds;
    location: LatLng;
    location_type: string;
    viewport: Bounds;
  };
  place_id: string;
  plus_code?: {
    compound_code: string;
    global_code: string;
  };
  types: string[];
  partial_match?: boolean;
};

export type AddressComponent = {
  long_name: string;
  short_name: string;
  types: string[];
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Bounds = {
  northeast: LatLng;
  southwest: LatLng;
};

export type MatchOffset = {
  startOffset?: number;
  endOffset: number;
};

export type FormattedText = {
  text: string;
  matches: MatchOffset[];
};

export type StructuredFormat = {
  mainText: FormattedText;
  secondaryText: {
    text: string;
  };
};

export type PlacePrediction = {
  place: string;
  placeId: string;
  text: FormattedText;
  structuredFormat: StructuredFormat;
  types: string[];
};

export type Suggestion = {
  placePrediction: PlacePrediction;
};

export type PlacesAutocompleteResponse = {
  suggestions: Suggestion[];
};
