import { useEffect, useRef } from "react";
import useFetch from "../hooks/useFetch.js";
import { obtenerDetalle } from "../services/api.js";
import Portada from "./Portada.jsx";
import Estrellas from "./Estrellas.jsx";
import ComentariosLista from "./ComentariosLista.jsx";
import FormComentario from "./FormComentario.jsx";

export default function FichaLibro({
  libro,
  onCerrar,
  onPuntuar,
  onComentar,
  onBorrarComentario,
}) {
  const dialogoRef = useRef(null);
  const id = libro?.id ?? null;

  const { datos, estado, reintentar } = useFetch(
    id ? `detalle:${id}` : null,
    (signal) => obtenerDetalle(id, signal)
  );

  useEffect(() => {
    const dialogo = dialogoRef.current;

    if (id && !dialogo.open) dialogo.showModal();
    if (!id && dialogo.open) dialogo.close();
  }, [id]);

  return (
    <dialog
      ref={dialogoRef}
      className="detalle"
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      {libro && (
        <>
          <div className="detalle__cabecera">
            <h2>{libro.titulo}</h2>
            <button
              type="button"
              className="detalle__cerrar"
              aria-label="Cerrar"
              onClick={onCerrar}
            >
              ×
            </button>
          </div>

          <div className="detalle__contenido">
            <div className="detalle__cuerpo">
              <Portada libro={libro} />
              <div>
                <p className="libro__meta">
                  {libro.autor}
                  {libro.anio ? ` · ${libro.anio}` : ""}
                </p>
                <Estrellas
                  valor={libro.puntuacion ?? 0}
                  onChange={(n) => onPuntuar(libro.id, n)}
                />
              </div>
            </div>

            <div className="detalle__extra">
              {estado === "cargando" && (
                <p className="detalle__estado">Cargando información del libro…</p>
              )}
              {estado === "error" && (
                <p className="detalle__estado error">
                  No se pudo cargar la información extra.{" "}
                  <button type="button" className="btn-texto" onClick={reintentar}>
                    Reintentar
                  </button>
                </p>
              )}
              {estado === "ok" && (
                <>
                  {datos.valoracion !== null && (
                    <p className="libro__meta">
                      Valoración en OpenLibrary:{" "}
                      <strong>
                        {datos.valoracion.toFixed(1).replace(".", ",")} / 5
                      </strong>{" "}
                      ({datos.votos} votos)
                    </p>
                  )}
                  <p className="detalle__descripcion">
                    {datos.descripcion ??
                      "Este libro no tiene descripción en OpenLibrary."}
                  </p>
                  {datos.temas.length > 0 && (
                    <ul className="temas">
                      {datos.temas.map((tema) => (
                        <li key={tema}>{tema}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>

            <ComentariosLista
              comentarios={libro.comentarios ?? []}
              onBorrar={(fecha) => onBorrarComentario(libro.id, fecha)}
            />
            <FormComentario onEnviar={(texto) => onComentar(libro.id, texto)} />
          </div>
        </>
      )}
    </dialog>
  );
}