export const capitalizeFirstLetter = (text: string) => {
  if (!text.length) return '';

  const lowerCased = text.toLowerCase();

  return lowerCased[0].toUpperCase() + lowerCased.slice(1);
};
