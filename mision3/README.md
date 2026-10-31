# Estantería - React

Esta es la misma app de libros de la misión 2 (Open Library), rehecha con React 19 y Vite. Se pueden buscar libros, guardarlos en una biblioteca propia, ponerles nota, escribir comentarios y ver unas estadísticas.

## Qué hace

- Busca libros por título o autor mientras se escribe (espera un poco antes de lanzar la petición).
- Se pueden elegir varios idiomas a la vez.
- En los resultados se puede filtrar para ver solo los que tienen portada y ordenarlos por relevancia, año o número de ediciones.
- Muestra un mensaje mientras carga, otro si hay un error (con botón para reintentar) y otro si no hay resultados.
- La biblioteca tiene dos listas, "Quiero leer" y "Leídos". Se guarda en el navegador, así que sigue ahí al recargar.
- A los libros leídos se les puede poner de 1 a 5 estrellas y escribir comentarios.
- Al abrir un libro leído sale una ficha con descripción, temas y valoración de Open Library, que se piden aparte a la API.
- En la biblioteca hay estadísticas (leídos, por leer, nota media, autor más leído y comentarios) y se puede buscar, ordenar y filtrar por nota.

## Cómo ejecutarlo

Hace falta tener Node.js instalado.

```bash
cd mision3
npm install
npm run dev
```

Se abre en el navegador la dirección que sale en la terminal (normalmente `http://localhost:5173`).

## Estructura

```
mision3/
├── index.html
└── src/
    ├── main.jsx            monta la app
    ├── App.jsx             guarda la biblioteca y qué vista se ve
    ├── index.css           estilos
    ├── components/         piezas reutilizables (tarjetas, estrellas, filtros, ficha...)
    ├── views/              VistaBuscar y VistaBiblioteca
    ├── hooks/              useFetch, useLocalStorage y useDebounce
    ├── services/           api.js (peticiones) y cache.js (caché en localStorage)
    └── utils/              stats.js (estadísticas) y filtros.js (filtrar y ordenar)
```

## Cómo está montado

- **Estado:** la biblioteca vive en `App` porque la usan las dos vistas. Cada vista guarda solo lo que escribe el usuario (texto, filtros, pestaña) y el `id` del libro abierto.
- **Valores derivados:** los resultados filtrados, las estadísticas, los contadores de las pestañas y el libro abierto se calculan al pintar, sin guardarlos en un `useState`.
- **Efectos:** los uso solo para sincronizar con algo de fuera de React: la petición a la API, `localStorage`, el temporizador de la búsqueda y abrir o cerrar el `<dialog>` de la ficha.
- **Hooks propios (bonus):**
  - `useFetch(clave, fetcher)` hace la petición, usa la caché, cancela la anterior con `AbortController` y devuelve `datos`, `estado` y `reintentar`.
  - `useLocalStorage(clave, inicial)` funciona como `useState` pero guardando el valor en el navegador.
  - `useDebounce(valor, retardo)` espera a que se deje de escribir antes de actualizar el valor.
- **Listas:** cada elemento lleva una `key` estable (el `id` del libro, el código del idioma, etc.).

## Uso de IA

Para esta misión he usado IA: Claude, de Anthropic, a través de su chat web. Parte del código lo ha escrito la IA, y lo declaro aquí.

**Qué le he delegado**

- Plantear cómo pasar la web de la mision anterior a React
- Escribir el código de los componentes y los tres hooks.
- Ayuda con los errores al ejecutar el proyecto.
- Un borrador de este README.

**Prompts clave**

1. "Reconstruye (o reinventa) tu app de la misión anterior en React 19: componentes, props, estado y efectos. La UI debe reaccionar al estado, no al revés." (con el enunciado y la rúbrica pegados)
2. "como quedaria cada archivo?"

**Cómo he verificado lo generado**

- He ejecutado el proyecto con `npm.cmd run dev` y he corregido los errores que salieron al arrancar (ver la autopsia).
- He pasado la revisión automática de la misión y he tenido en cuenta sus comentarios.

**Qué he hecho yo a mano**

- Crear el proyecto con Vite y colocar los archivos en las carpetas.
- Arreglar los nombres de carpetas y archivos para que coincidieran con los imports.
- Arreglar fallos que daba, cambiar el estilo.

## Autopsia

**1. La app no arrancaba: "Failed to resolve import"**
Al ejecutar el proyecto salía un error de Vite diciendo que no encontraba `./components/Cabecera.jsx` ni los archivos de `./views/`. Los imports del código usaban los nombres en inglés (`components`, `services`, `views`), pero yo había creado las carpetas en español (`componentes`, `servicios`, `vistas`). Lo vi en el error de Vite y en la estructura de carpetas, y lo arreglé renombrando las carpetas. Me quedo con que el nombre de cada carpeta y archivo tiene que coincidir exactamente con lo que se escribe en el `import`.

**2. Un archivo con las mayúsculas mal**
La revisión automática avisó de que el archivo se llamaba `Filtroidiomas.jsx` y el import decía `FiltroIdiomas.jsx`. En Windows funciona igual, pero en Linux (en un servidor o en la integración continua) son archivos distintos y el build habría fallado. Lo arreglé renombrando el archivo y comprobando que Git registraba el cambio. Me quedo con que Windows no distingue mayúsculas y por eso no me di cuenta yo sola.