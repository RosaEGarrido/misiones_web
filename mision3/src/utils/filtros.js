export function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function filtrarResultados(libros, soloPortada, orden) {
  const lista = libros.filter((libro) => !soloPortada || libro.portada);

  switch (orden) {
    case "anio-desc":
      return [...lista].sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0));
    case "anio-asc":
      return [...lista].sort((a, b) => (a.anio ?? 9999) - (b.anio ?? 9999));
    case "ediciones":
      return [...lista].sort((a, b) => b.ediciones - a.ediciones);
    default:
      return lista;
  }
}

export function filtrarBiblioteca(libros, { texto, orden, notaMinima }) {
  const buscado = normalizar(texto.trim());

  const lista = libros.filter((libro) => {
    const comentarios = (libro.comentarios ?? []).map((c) => c.texto).join(" ");
    const contenido = normalizar(`${libro.titulo} ${libro.autor} ${comentarios}`);

    return contenido.includes(buscado) && (libro.puntuacion ?? 0) >= notaMinima;
  });

  switch (orden) {
    case "titulo":
      return [...lista].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
    case "nota":
      return [...lista].sort((a, b) => (b.puntuacion ?? 0) - (a.puntuacion ?? 0));
    default:
      return [...lista].reverse();
  }
}