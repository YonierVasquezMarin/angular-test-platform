import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Seo } from '../../core/seo.service';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.component.html',
})
export class About {
  constructor() {
    inject(Seo).update({
      title: 'Acerca de | Atlas de países',
      description:
        'Cómo está hecho Atlas de países: Angular, NgRx, SEO, Core Web Vitals y accesibilidad.',
      path: '/acerca',
      jsonLd: null,
    });
  }
}
