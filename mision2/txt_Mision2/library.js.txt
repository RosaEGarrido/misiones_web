const CLAVE = "ol-biblioteca";

export function obtenerBiblioteca() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) ?? [];
  } catch {
    return [];
  }
}

function guardar(biblioteca) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(biblioteca));
  } catch {
    return;
  }
}

export function estadoDe(id) {
  return obtenerBiblioteca().find((libro) => libro.id === id)?.estado ?? null;
}

export function guardarEnBiblioteca(libro, estado) {
  const biblioteca = obtenerBiblioteca();
  const existente = biblioteca.find((l) => l.id === libro.id);
  const resto = biblioteca.filter((l) => l.id !== libro.id);
  guardar([...resto, { ...libro, ...existente, estado }]);
}

export function quitarDeBiblioteca(id) {
  guardar(obtenerBiblioteca().filter((libro) => libro.id !== id));
}

export function puntuarLibro(id, puntuacion) {
  guardar(
    obtenerBiblioteca().map((libro) =>
      libro.id === id ? { ...libro, puntuacion } : libro
    )
  );
}

export function agregarComentario(id, texto) {
  guardar(
    obtenerBiblioteca().map((libro) =>
      libro.id === id
        ? {
            ...libro,
            comentarios: [
              ...(libro.comentarios ?? []),
              { texto, fecha: Date.now() },
            ],
          }
        : libro
    )
  );
}

export function borrarComentario(id, fecha) {
  guardar(
    obtenerBiblioteca().map((libro) =>
      libro.id === id
        ? {
            ...libro,
            comentarios: (libro.comentarios ?? []).filter(
              (c) => c.fecha !== fecha
            ),
          }
        : libro
    )
  );
}