# Atlas de países

## 🌍 Descripción del proyecto

Atlas de países es una aplicación Angular para consultar información de los países del mundo y practicar las herramientas habituales del framework. El listado sale del [dataset abierto de países](https://github.com/mledoze/countries), la misma base que alimentaba REST Countries, porque el endpoint público `v3.1` dejó de responder sin clave. La población se completa con la API del [Banco Mundial](https://api.worldbank.org), también pública y sin clave.

Tiene siete páginas:

- Inicio, con regiones y países destacados.
- Listado, con filtro por región y orden.
- Ficha de cada país.
- Búsqueda por nombre, región y población mínima.
- Favoritos guardados en el navegador.
- Planificar, con un formulario de nota de viaje.
- Acerca de, con el mapa de las prácticas que demuestra el proyecto.

## 🛠️ Tecnologías

- Angular 22, componentes standalone y detección de cambios zoneless.
- Router con carga perezosa y render híbrido (prerender, servidor y cliente).
- NgRx: `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity` y `@ngrx/store-devtools`.
- RxJS en los effects (`switchMap`, `exhaustMap`, `catchError`) y en la búsqueda (`debounceTime`, `distinctUntilChanged`).
- HttpClient, interceptor de errores y formularios reactivos.
- ESLint con angular-eslint y pruebas unitarias con Vitest.

## 🔗 URLs amigables

El slug sale del nombre común en español: minúsculas, sin acentos y con guiones.

| Página | Ejemplo |
| --- | --- |
| Inicio | `/` |
| Listado | `/paises` |
| Listado por región | `/paises?region=americas` |
| Ficha | `/paises/colombia` |
| Búsqueda | `/buscar?nombre=colombia&region=americas` |
| Favoritos | `/favoritos` |
| Nota de viaje | `/planificar?pais=colombia` |
| Acerca de | `/acerca` |

## ⚡ Core Web Vitals

- **LCP.** Las páginas públicas se prerenderizan. La bandera de la ficha usa `NgOptimizedImage` con `priority`, y `index.html` hace `preconnect` al CDN de banderas.
- **INP.** La búsqueda espera 300 ms (`debounceTime`) antes de filtrar el store, para no recalcular en cada tecla.
- **CLS.** Las banderas y los esqueletos tienen ancho y alto fijos. El aviso de éxito del formulario reserva su altura en `.form-status`.

## ♿ Accesibilidad y Lighthouse

La interfaz incluye un enlace para saltar al contenido, regiones `header`, `nav`, `main` y `footer`, etiquetas en todos los controles, contraste del texto sobre el fondo y mensajes de error con `aria-invalid` y `aria-describedby`. La carga, los resultados y la confirmación del formulario usan regiones `aria-live`.

Para auditarlo en Chrome:

1. Instala las dependencias y arranca la app con `npm start`.
2. Abre la página que quieras revisar.
3. Abre DevTools y entra en Lighthouse.
4. Ejecuta las categorías Performance, Accessibility, SEO y Best Practices.

Favoritos y Planificar se renderizan en el cliente porque dependen de `localStorage`, y llevan `noindex`.

## 🚀 Puesta en marcha

```bash
npm install
npm start
```

La aplicación queda en `http://localhost:4200`. Las pruebas unitarias se lanzan con `npm test`.
