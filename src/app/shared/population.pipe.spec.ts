import { PopulationPipe } from './population.pipe';

describe('PopulationPipe', () => {
  const pipe = new PopulationPipe();

  it('formatea la población en español', () => {
    expect(pipe.transform(50882884)).toBe('50.882.884');
  });

  it('describe los valores vacíos', () => {
    expect(pipe.transform(null)).toBe('Sin datos');
    expect(pipe.transform(undefined)).toBe('Sin datos');
  });
});
