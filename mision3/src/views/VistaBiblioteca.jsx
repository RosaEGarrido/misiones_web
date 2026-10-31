import { useState } from "react";
import Estadisticas from "../components/Estadisticas.jsx";
import BarraBiblioteca from "../components/BarraBiblioteca.jsx";
import LibroCard from "../components/LibroCard.jsx";
import Estrellas from "../components/Estrellas.jsx";
import FichaLibro from "../components/FichaLibro.jsx";
import { calcularEstadisticas } from "../utils/stats.js";
import { filtrarBiblioteca } from "../utils/filtros.js";

const PESTANAS = [
  { id: "quiero", nombre: "Quiero leer" },
  { id: "leido", nombre: "Leídos" },
];

export default function VistaBiblioteca({
  biblioteca,
  onCambiarEstado,
  onQuitar,
  onActualizar,
}) {
  const [pestana, setPestana] = useState("quiero");
  const [texto, setTexto] = useState("");
  const [orden, setOrden] = useState("reciente");
  const [notaMinima, setNotaMinima] = useState(0);
  const [abiertoId, setAbiertoId] = useState(null);

  const stats = calcularEstadisticas(biblioteca);
  const deLaPestana = biblioteca.filter((l) => l.estado === pestana);
  const visibles = filtrarBiblioteca(deLaPestana, {
    texto,
    orden,
    notaMinima: pestana === "leido" ? notaMinima : 0,
  });
  const libroAbierto = biblioteca.find((l) => l.id === abiertoId) ?? null;

  const mensajeVacio =
    deLaPestana.length > 0
      ? "Ningún libro coincide con la búsqueda o los filtros."
      : pestana === "quiero"
        ? "Aún no has guardado libros para leer."
        : "Aún no has marcado ningún libro como leído.";

  function puntuar(id, puntuacion) {
    onActualizar(id, () => ({ puntuacion }));
  }

  function comentar(id, textoComentario) {
  const nuevo = {
    id: crypto.randomUUID(),
    texto: textoComentario,
    fecha: Date.now(),
  };
  onActualizar(id, (libro) => ({
    comentarios: [...(libro.comentarios ?? []), nuevo],
  }));
}

function borrarComentario(id, idComentario) {
  onActualizar(id, (libro) => ({
    comentarios: (libro.comentarios ?? []).filter(
      (c) => (c.id ?? c.fecha) !== idComentario
    ),
  }));
}

  return (
    <>
      <Estadisticas stats={stats} />

      <div className="pestanas" role="tablist">
        {PESTANAS.map(({ id, nombre }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={pestana === id}
            className={`pestana ${pestana === id ? "activa" : ""}`}
            onClick={() => setPestana(id)}
          >
            {nombre}{" "}
            <span className="contador">
              {biblioteca.filter((l) => l.estado === id).length}
            </span>
          </button>
        ))}
      </div>

      <BarraBiblioteca
        texto={texto}
        onTexto={setTexto}
        orden={orden}
        onOrden={setOrden}
        notaMinima={notaMinima}
        onNotaMinima={setNotaMinima}
        mostrarNota={pestana === "leido"}
      />

      <div className="rejilla">
        {visibles.length === 0 && <p className="lista__vacia">{mensajeVacio}</p>}

        {visibles.map((libro) => (
          <LibroCard key={libro.id} libro={libro}>
            {pestana === "leido" && (
              <Estrellas
                valor={libro.puntuacion ?? 0}
                onChange={(n) => puntuar(libro.id, n)}
              />
            )}
            <div className="libro__acciones">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  onCambiarEstado(libro, pestana === "quiero" ? "leido" : "quiero")
                }
              >
                {pestana === "quiero" ? "Ya lo leí" : "Quiero leer"}
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => onQuitar(libro.id)}
              >
                Quitar
              </button>
              {pestana === "leido" && (
                <button
                  type="button"
                  className="btn btn--ancho"
                  onClick={() => setAbiertoId(libro.id)}
                >
                  Comentarios
                  {libro.comentarios?.length ? ` (${libro.comentarios.length})` : ""}
                </button>
              )}
            </div>
          </LibroCard>
        ))}
      </div>

      <FichaLibro
        libro={libroAbierto}
        onCerrar={() => setAbiertoId(null)}
        onPuntuar={puntuar}
        onComentar={comentar}
        onBorrarComentario={borrarComentario}
      />
    </>
  );
}