export function calcularEstadisticas(biblioteca) {
  const leidos = biblioteca.filter((libro) => libro.estado === "leido");
  const porLeer = biblioteca.filter((libro) => libro.estado === "quiero");
  const puntuados = leidos.filter((libro) => libro.puntuacion > 0);

  const notaMedia = puntuados.length
    ? puntuados.reduce((suma, libro) => suma + libro.puntuacion, 0) /
      puntuados.length
    : null;

  const librosPorAutor = leidos
    .filter((libro) => libro.autor !== "Autor desconocido")
    .reduce((conteo, libro) => {
      conteo[libro.autor] = (conteo[libro.autor] ?? 0) + 1;
      return conteo;
    }, {});

  const [autorTop, librosAutorTop] = Object.entries(librosPorAutor).sort(
    (a, b) => b[1] - a[1]
  )[0] ?? [null, 0];

  const comentarios = biblioteca.reduce(
    (total, libro) => total + (libro.comentarios?.length ?? 0),
    0
  );

  return {
    leidos: leidos.length,
    porLeer: porLeer.length,
    notaMedia,
    autorTop,
    librosAutorTop,
    comentarios,
  };
}