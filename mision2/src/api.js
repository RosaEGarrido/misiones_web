const BASE_URL = "https://openlibrary.org/search.json";
const CAMPOS = "key,title,author_name,first_publish_year,cover_i,edition_count";

export async function buscarLibros(query) {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&fields=${CAMPOS}&limit=24`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`La API respondió con error ${response.status}`);
  }

  const data = await response.json();
  return data.docs.map(normalizarLibro);
}

function normalizarLibro(doc) {
  return {
    id: doc.key,
    titulo: doc.title ?? "Sin título",
    autor: doc.author_name?.[0] ?? "Autor desconocido",
    anio: doc.first_publish_year ?? null,
    portada: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : null,
    ediciones: doc.edition_count ?? 1,
  };
}
