import { type Suggestion } from '../service/address/types';

export function parseToSuggestions(data: Suggestion[]) {
  if (!data.length) {
    return [];
  } else {
    return data.map((suggestion) => ({
      key: suggestion.placePrediction.placeId,
      label: suggestion.placePrediction.text.text,
    }));
  }
}
