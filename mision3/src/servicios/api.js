const BASE_URL = "https://openlibrary.org/search.json";
const CAMPOS =
  "key,title,author_name,first_publish_year,cover_i,edition_count,editions,editions.title,editions.cover_i";
const ORIGEN = "https://openlibrary.org";

export async function buscarLibros(query, idiomas = []) {
  if (idiomas.length === 0) return pedir(query);

  const listas = await Promise.all(
    idiomas.map((idioma) => pedir(query, idioma))
  );

  const unicos = new Map(listas.flat().map((libro) => [libro.id, libro]));
  return [...unicos.values()];
}

async function pedir(query, idioma) {
  const consulta = idioma ? `${query} language:${idioma}` : query;
  const url = `${BASE_URL}?q=${encodeURIComponent(consulta)}&fields=${CAMPOS}&limit=24`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`La API respondió con error ${response.status}`);
  }

  const data = await response.json();
  return data.docs.map(normalizarLibro);
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

async function pedirJSON(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`La API respondió con error ${response.status}`);
  }

  return response.json();
}

function limpiarDescripcion(descripcion) {
  if (!descripcion) return null;

  const texto = typeof descripcion === "string" ? descripcion : descripcion.value;
  return texto?.split(/\n-{5,}/)[0].trim() || null;
}

export async function obtenerDetalle(id) {
  const [obra, valoracion] = await Promise.allSettled([
    pedirJSON(`${ORIGEN}${id}.json`),
    pedirJSON(`${ORIGEN}${id}/ratings.json`),
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
