import { type PlacesAutocompleteResponse } from './types';

export const addressService = (() => {
  const GEOCODING_API_KEY = process.env.GEOCODING_API_KEY;

  if (!GEOCODING_API_KEY) {
    throw new Error('API key for geocoding not provided!');
  }

  const PLACES_AUTOCOMPLETE_URL = 'https://places.googleapis.com/v1/places:autocomplete';
  const ADDRESS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?address=';

  const getAddressSuggestions = async (searchPhrase: string): Promise<PlacesAutocompleteResponse> => {
    const response = await fetch(PLACES_AUTOCOMPLETE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GEOCODING_API_KEY,
      },
      body: JSON.stringify({
        input: searchPhrase,
        includedRegionCodes: ['pl'],
        languageCode: 'pl',
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch autocomplete data: ${response.status} ${response.text()}`);
    }
    const data = await response.json();

    return data;
  };

  const getAddressDetails = async (query: string) => {
    const response = await fetch(`${ADDRESS_URL}${query}&key=${GEOCODING_API_KEY}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch address details: ${response.status}, ${response.text()}`);
    }

    const data = await response.json();

    return data;
  };

  return {
    getAddressSuggestions,
    getAddressDetails,
  };
})();
