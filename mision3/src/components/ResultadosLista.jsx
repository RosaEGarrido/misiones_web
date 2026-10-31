import LibroCard from "./LibroCard.jsx";

export default function ResultadosLista({ libros, biblioteca, onCambiarEstado }) {
  const estados = new Map(biblioteca.map((l) => [l.id, l.estado]));

  return (
    <div className="rejilla">
      {libros.map((libro) => {
        const estado = estados.get(libro.id) ?? null;

        return (
          <LibroCard key={libro.id} libro={libro} mostrarMeta>
            <div className="libro__acciones">
              <button
                type="button"
                className={`btn ${estado === "quiero" ? "activo" : ""}`}
                onClick={() => onCambiarEstado(libro, "quiero")}
              >
                Quiero leer
              </button>
              <button
                type="button"
                className={`btn ${estado === "leido" ? "activo" : ""}`}
                onClick={() => onCambiarEstado(libro, "leido")}
              >
                Leído
              </button>
            </div>
          </LibroCard>
        );
      })}
    </div>
  );
}