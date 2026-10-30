export default function ComentariosLista({ comentarios, onBorrar }) {
  const recientes = [...comentarios].reverse();

  return (
    <>
      <h3 className="detalle__subtitulo">
        Mis comentarios ({comentarios.length})
      </h3>
      <ul className="comentarios">
        {recientes.length === 0 && (
          <li className="comentarios__vacio">
            Aún no has escrito ningún comentario.
          </li>
        )}
        {recientes.map((c) => (
          <li className="comentario" key={c.fecha}>
            <p>{c.texto}</p>
            <div className="comentario__pie">
              <time dateTime={new Date(c.fecha).toISOString()}>
                {new Date(c.fecha).toLocaleDateString("es-ES")}
              </time>
              <button
                type="button"
                className="btn-texto"
                onClick={() => onBorrar(c.fecha)}
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}