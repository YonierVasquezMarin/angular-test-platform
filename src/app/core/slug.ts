export interface SlugSource {
  cca3: string;
  name: { common: string };
  translations?: {
    spa?: {
      common?: string;
    };
  };
}

export function spanishName(country: SlugSource): string {
  const translated = country.translations?.spa?.common?.trim();
  return translated || country.name.common;
}

export function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function withSlugs<T extends SlugSource>(countries: readonly T[]): (T & { slug: string })[] {
  const sorted = [...countries].sort((a, b) => a.cca3.localeCompare(b.cca3));
  const used = new Set<string>();

  return sorted.map((country) => {
    const base = toSlug(spanishName(country)) || country.cca3.toLowerCase();
    let slug = base;
    let suffix = 2;

    while (used.has(slug)) {
      slug = `${base}-${country.cca3.toLowerCase()}`;
      if (used.has(slug)) {
        slug = `${base}-${suffix}`;
        suffix += 1;
      }
    }

    used.add(slug);
    return { ...country, slug };
  });
}
