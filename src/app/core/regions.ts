export interface RegionOption {
  slug: string;
  label: string;
  apiValue: string;
}

export const REGIONS: readonly RegionOption[] = [
  { slug: 'africa', label: 'África', apiValue: 'Africa' },
  { slug: 'americas', label: 'América', apiValue: 'Americas' },
  { slug: 'asia', label: 'Asia', apiValue: 'Asia' },
  { slug: 'europe', label: 'Europa', apiValue: 'Europe' },
  { slug: 'oceania', label: 'Oceanía', apiValue: 'Oceania' },
  { slug: 'antarctic', label: 'Antártida', apiValue: 'Antarctic' },
];

export function regionLabel(apiValue: string): string {
  return REGIONS.find((region) => region.apiValue === apiValue)?.label ?? apiValue;
}
