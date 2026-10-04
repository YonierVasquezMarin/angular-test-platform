import { Country } from './models/country.model';

export function cardFlagSrc(country: Country): string {
  if (country.cca2) {
    return `https://flagcdn.com/w160/${country.cca2.toLowerCase()}.png`;
  }

  return country.flagPng;
}

export function heroFlagSrc(country: Country): string {
  if (country.cca2) {
    return `https://flagcdn.com/w320/${country.cca2.toLowerCase()}.png`;
  }

  return country.flagPng;
}
