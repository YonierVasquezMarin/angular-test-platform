export interface CountryName {
  common: string;
  official: string;
}

export interface RawCountry {
  name: CountryName;
  translations?: {
    spa?: {
      common?: string;
      official?: string;
    };
  };
  cca3: string;
  cca2?: string;
  capital?: string[];
  region?: string;
  subregion?: string;
  population?: number;
  area?: number;
  flags?: {
    png?: string;
    svg?: string;
    alt?: string;
  };
  currencies?: Record<string, { name?: string; symbol?: string }>;
  languages?: Record<string, string>;
  borders?: string[];
  latlng?: number[];
  maps?: {
    googleMaps?: string;
    openStreetMaps?: string;
  };
}

export interface Country {
  cca3: string;
  cca2: string;
  slug: string;
  name: string;
  officialName: string;
  capital: string;
  region: string;
  subregion: string;
  population: number;
  area: number | null;
  flagPng: string;
  flagAlt: string;
  currencies: string[];
  languages: string[];
  borders: string[];
  mapUrl: string;
  detailLoaded: boolean;
}
