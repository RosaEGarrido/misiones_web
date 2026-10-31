import LibroCard from "./LibroCard.jsx";
import Estrellas from "./Estrellas.jsx";

export default function TarjetaBiblioteca({
  libro,
  pestana,
  onCambiarEstado,
  onQuitar,
  onPuntuar,
  onAbrir,
}) {
  const leido = pestana === "leido";
  const numComentarios = libro.comentarios?.length ?? 0;

  return (
    <LibroCard libro={libro}>
      {leido && (
        <Estrellas
          valor={libro.puntuacion ?? 0}
          onChange={(n) => onPuntuar(libro.id, n)}
        />
      )}
      <div className="libro__acciones">
        <button
          type="button"
          className="btn"
          onClick={() => onCambiarEstado(libro, leido ? "quiero" : "leido")}
        >
          {leido ? "Quiero leer" : "Ya lo leí"}
        </button>
        <button type="button" className="btn" onClick={() => onQuitar(libro.id)}>
          Quitar
        </button>
        {leido && (
          <button
            type="button"
            className="btn btn--ancho"
            onClick={() => onAbrir(libro.id)}
          >
            Comentarios{numComentarios > 0 ? ` (${numComentarios})` : ""}
          </button>
        )}
      </div>
    </LibroCard>
  );
}