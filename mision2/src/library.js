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
  const resto = obtenerBiblioteca().filter((l) => l.id !== libro.id);
  guardar([...resto, { ...libro, estado }]);
}

export function quitarDeBiblioteca(id) {
  guardar(obtenerBiblioteca().filter((libro) => libro.id !== id));
}
