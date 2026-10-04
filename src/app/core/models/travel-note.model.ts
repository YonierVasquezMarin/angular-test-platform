export const TRAVEL_REASONS = ['turismo', 'trabajo', 'estudios', 'otro'] as const;
export const TRAVEL_SEASONS = ['primavera', 'verano', 'otono', 'invierno'] as const;

export type TravelReason = (typeof TRAVEL_REASONS)[number];
export type TravelSeason = (typeof TRAVEL_SEASONS)[number];

export interface TravelNote {
  id: string;
  countryCode: string;
  countrySlug: string;
  countryName: string;
  reason: TravelReason;
  season: TravelSeason;
  comment: string;
  createdAt: string;
}

export const REASON_LABELS: Record<TravelReason, string> = {
  turismo: 'Turismo',
  trabajo: 'Trabajo',
  estudios: 'Estudios',
  otro: 'Otro',
};

export const SEASON_LABELS: Record<TravelSeason, string> = {
  primavera: 'Primavera',
  verano: 'Verano',
  otono: 'Otoño',
  invierno: 'Invierno',
};
