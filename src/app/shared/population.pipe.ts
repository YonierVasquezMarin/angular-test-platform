import { Pipe, PipeTransform } from '@angular/core';

const numberFormat = new Intl.NumberFormat('es-ES');

@Pipe({ name: 'population' })
export class PopulationPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null || !Number.isFinite(value)) {
      return 'Sin datos';
    }

    return numberFormat.format(value);
  }
}
