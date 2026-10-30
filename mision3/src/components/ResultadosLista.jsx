import LibroCard from "./LibroCard.jsx";

export default function ResultadosLista({ libros, biblioteca, onCambiarEstado }) {
  return (
    <div className="rejilla">
      {libros.map((libro) => {
        const estado = biblioteca.find((l) => l.id === libro.id)?.estado ?? null;

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