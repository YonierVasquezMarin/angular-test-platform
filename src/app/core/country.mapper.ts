import { Country, RawCountry } from './models/country.model';
import { spanishName } from './slug';

export function mapListCountry(raw: RawCountry & { slug: string }, population = 0): Country {
  const name = spanishName(raw);

  return {
    cca3: raw.cca3,
    cca2: raw.cca2 ?? '',
    slug: raw.slug,
    name,
    officialName: raw.translations?.spa?.official || raw.name.official,
    capital: raw.capital?.[0] ?? 'Sin capital',
    region: raw.region ?? 'Sin región',
    subregion: raw.subregion ?? '',
    population: population || raw.population || 0,
    area: raw.area ?? null,
    flagPng: raw.flags?.png ?? (raw.cca2 ? `https://flagcdn.com/w320/${raw.cca2.toLowerCase()}.png` : ''),
    flagAlt: raw.flags?.alt ?? `Bandera de ${name}`,
    currencies: raw.currencies ? formatCurrencies(raw.currencies) : [],
    languages: raw.languages ? Object.values(raw.languages) : [],
    borders: raw.borders ?? [],
    mapUrl: mapUrl(raw),
    detailLoaded: true,
  };
}

function mapUrl(raw: RawCountry): string {
  if (raw.maps?.googleMaps) {
    return raw.maps.googleMaps;
  }

  if (raw.latlng && raw.latlng.length === 2) {
    return `https://www.google.com/maps?q=${raw.latlng[0]},${raw.latlng[1]}`;
  }

  return '';
}

export function mergeDetail(base: Country, raw: RawCountry): Country {
  const name = raw.name ? spanishName(raw) : base.name;

  return {
    ...base,
    name,
    officialName: raw.translations?.spa?.official || raw.name?.official || base.officialName,
    capital: raw.capital?.[0] ?? base.capital,
    population: raw.population ?? base.population,
    flagPng: raw.flags?.png ?? base.flagPng,
    flagAlt: raw.flags?.alt ?? base.flagAlt,
    currencies: raw.currencies ? formatCurrencies(raw.currencies) : base.currencies,
    languages: raw.languages ? Object.values(raw.languages) : base.languages,
    borders: raw.borders ?? base.borders,
    mapUrl: raw.maps?.googleMaps || mapUrl(raw) || base.mapUrl,
    detailLoaded: true,
  };
}

function formatCurrencies(currencies: NonNullable<RawCountry['currencies']>): string[] {
  return Object.entries(currencies).map(([code, value]) => {
    const label = value.name ?? code;
    return value.symbol ? `${label} (${value.symbol})` : label;
  });
}
