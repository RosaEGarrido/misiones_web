# Estantería - M2 Async Odyssey

Para esta misión he hecho una web para buscar libros con la API de Open Library. Se pueden guardar en una biblioteca propia, ponerles nota y escribir comentarios. Está hecha con Vite y JavaScript, sin frameworks.

## Qué hace

- Busca libros por título o autor y muestra portada, autor, año y número de ediciones.
- Se pueden elegir varios idiomas a la vez (español, inglés, francés, alemán y catalán).
- En los resultados se puede filtrar para que salgan solo los que tienen portada y ordenarlos por relevancia, año o número de ediciones.
- Mientras carga sale un mensaje de "cargando", y si falla la petición o no hay resultados sale un aviso.
- La biblioteca está en otra página, con dos listas: "Quiero leer" y "Leídos".
- A los libros leídos se les puede dar de 1 a 5 estrellas y añadir comentarios.
- Al abrir un libro leído se ve una ficha con la descripción, los temas y la valoración de Open Library. Estos datos salen de una segunda petición a la API.
- En la biblioteca hay unas estadísticas (libros leídos, por leer, nota media, autor más leído y comentarios) y se puede buscar, ordenar y filtrar por nota.
- Bonus: he hecho una caché en localStorage para no repetir las mismas peticiones. Cada búsqueda se guarda 10 minutos.

## API

Uso Open Library, que no necesita clave:

- Búsqueda: `https://openlibrary.org/search.json`
- Datos de un libro: `https://openlibrary.org/works/{id}.json`
- Valoración: `https://openlibrary.org/works/{id}/ratings.json`
- Portadas: `https://covers.openlibrary.org/b/id/{cover_i}-M.jpg`

## Cómo ejecutarlo

Hace falta tener Node.js instalado.

```bash
cd mision2
npm install
npm run dev
```

Después se abre en el navegador la dirección que sale en la terminal (normalmente `http://localhost:5173`).

Para generar la versión final: `npm run build`.

## Archivos

```
mision2/
├── index.html          página de búsqueda
├── biblioteca.html     página de la biblioteca
├── vite.config.js      para que el build incluya las dos páginas
└── src/
    ├── main.js         lógica de la búsqueda
    ├── biblioteca.js   lógica de la biblioteca, la ficha y los filtros
    ├── api.js          peticiones a la API
    ├── cache.js        caché en localStorage
    ├── library.js      guardar libros, notas y comentarios
    ├── stats.js        estadísticas
    ├── ui.js           pintar cosas en el DOM
    └── style.css       estilos
```

## Cosas a tener en cuenta del código

- `fetch` no da error cuando la respuesta es un 404 o un 500, así que compruebo `response.ok` y lanzo el error yo.
- Si haces varias búsquedas seguidas, una respuesta antigua podía llegar tarde y tapar la nueva. Lo he resuelto con un contador (`ultimaBusqueda`) para ignorar las que ya no son la última.
- Cuando se eligen varios idiomas uso `Promise.all` para hacer todas las peticiones a la vez.
- En la ficha uso `Promise.allSettled` para pedir la descripción y la valoración a la vez. Así, si falla una, la otra se sigue mostrando.
- La caché guarda la fecha de cada entrada y, pasados 10 minutos, la descarta y vuelve a pedir los datos.
- He usado `map`, `filter`, `reduce`, `sort`, `find` y `flat` para preparar los datos, filtrar, ordenar y calcular las estadísticas.
- Los textos que vienen de la API y los comentarios se escapan antes de meterlos en el HTML.