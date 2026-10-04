import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../environments/environment';

export interface SeoConfig {
  title: string;
  description: string;
  path: string;
  robots?: 'index, follow' | 'noindex, nofollow';
  image?: string;
  jsonLd?: Record<string, unknown> | null;
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  update(page: SeoConfig): void {
    const url = `${environment.siteUrl}${page.path}`;
    const robots = page.robots ?? 'index, follow';

    this.title.setTitle(page.title);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ property: 'og:title', content: page.title });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'es_ES' });

    if (page.image) {
      this.meta.updateTag({ property: 'og:image', content: page.image });
    }

    this.setCanonical(url);
    this.setJsonLd(page.jsonLd ?? null);
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(data: Record<string, unknown> | null): void {
    const existing = this.document.getElementById('seo-jsonld');
    if (!data) {
      existing?.remove();
      return;
    }

    const script = existing ?? this.document.createElement('script');
    script.id = 'seo-jsonld';
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(data);
    if (!existing) {
      this.document.head.appendChild(script);
    }
  }
}
