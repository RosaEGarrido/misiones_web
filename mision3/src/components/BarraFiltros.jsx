export default function BarraFiltros({
  soloPortada,
  onSoloPortada,
  orden,
  onOrden,
}) {
  return (
    <div className="barra">
      <label className="check">
        <input
          type="checkbox"
          checked={soloPortada}
          onChange={(e) => onSoloPortada(e.target.checked)}
        />
        Solo con portada
      </label>
      <label className="orden">
        Ordenar por
        <select value={orden} onChange={(e) => onOrden(e.target.value)}>
          <option value="relevancia">Relevancia</option>
          <option value="anio-desc">Más recientes</option>
          <option value="anio-asc">Más antiguos</option>
          <option value="ediciones">Más ediciones</option>
        </select>
      </label>
    </div>
  );
}