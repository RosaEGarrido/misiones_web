const ORIGEN = "https://openlibrary.org";
const BASE_URL = `${ORIGEN}/search.json`;
const CAMPOS =
  "key,title,author_name,first_publish_year,cover_i,edition_count,editions,editions.title,editions.cover_i";

async function pedirJSON(url, signal) {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`La API respondió con error ${response.status}`);
  }

  return response.json();
}

function normalizarLibro(doc) {
  const edicion = doc.editions?.docs?.[0];
  const idPortada = edicion?.cover_i ?? doc.cover_i;

  return {
    id: doc.key,
    titulo: edicion?.title ?? doc.title ?? "Sin título",
    autor: doc.author_name?.[0] ?? "Autor desconocido",
    anio: doc.first_publish_year ?? null,
    portada: idPortada
      ? `https://covers.openlibrary.org/b/id/${idPortada}-M.jpg`
      : null,
    ediciones: doc.edition_count ?? 1,
  };
}

async function pedir(query, idioma, signal) {
  const consulta = idioma ? `${query} language:${idioma}` : query;
  const url = `${BASE_URL}?q=${encodeURIComponent(consulta)}&fields=${CAMPOS}&limit=24`;

  const data = await pedirJSON(url, signal);
  return data.docs.map(normalizarLibro);
}

export async function buscarLibros(query, idiomas = [], signal) {
  if (idiomas.length === 0) return pedir(query, undefined, signal);

  const listas = await Promise.all(
    idiomas.map((idioma) => pedir(query, idioma, signal))
  );

  const unicos = new Map(listas.flat().map((libro) => [libro.id, libro]));
  return [...unicos.values()];
}

function limpiarDescripcion(descripcion) {
  if (!descripcion) return null;

  const texto = typeof descripcion === "string" ? descripcion : descripcion.value;
  return texto?.split(/\n-{5,}/)[0].trim() || null;
}

export async function obtenerDetalle(id, signal) {
  const [obra, valoracion] = await Promise.allSettled([
    pedirJSON(`${ORIGEN}${id}.json`, signal),
    pedirJSON(`${ORIGEN}${id}/ratings.json`, signal),
  ]);

  if (obra.status === "rejected") throw obra.reason;

  const resumen =
    valoracion.status === "fulfilled" ? valoracion.value.summary : null;

  return {
    descripcion: limpiarDescripcion(obra.value.description),
    temas: obra.value.subjects?.slice(0, 6) ?? [],
    valoracion: resumen?.average ?? null,
    votos: resumen?.count ?? 0,
  };
}