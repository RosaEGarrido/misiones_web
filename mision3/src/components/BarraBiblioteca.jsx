export default function BarraBiblioteca({
  texto,
  onTexto,
  orden,
  onOrden,
  notaMinima,
  onNotaMinima,
  mostrarNota,
}) {
  return (
    <div className="barra">
      <input
        type="search"
        value={texto}
        onChange={(e) => onTexto(e.target.value)}
        placeholder="Buscar por título, autor o comentario"
        aria-label="Buscar en mi biblioteca"
        autoComplete="off"
      />
      <label className="orden">
        Ordenar por
        <select value={orden} onChange={(e) => onOrden(e.target.value)}>
          <option value="reciente">Añadidos recientemente</option>
          <option value="titulo">Título (A–Z)</option>
          <option value="nota">Mejor nota</option>
        </select>
      </label>
      {mostrarNota && (
        <label className="orden">
          Nota mínima
          <select
            value={notaMinima}
            onChange={(e) => onNotaMinima(Number(e.target.value))}
          >
            <option value={0}>Todas</option>
            <option value={3}>3 estrellas o más</option>
            <option value={4}>4 estrellas o más</option>
            <option value={5}>5 estrellas</option>
          </select>
        </label>
      )}
    </div>
  );
}