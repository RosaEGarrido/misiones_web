export default function Estadisticas({ stats }) {
  const nota =
    stats.notaMedia === null ? "–" : stats.notaMedia.toFixed(1).replace(".", ",");
  const autor = stats.autorTop
    ? `${stats.autorTop} (${stats.librosAutorTop})`
    : "–";

  const datos = [
    { etiqueta: "Leídos", valor: stats.leidos },
    { etiqueta: "Por leer", valor: stats.porLeer },
    { etiqueta: "Nota media", valor: nota },
    { etiqueta: "Autor más leído", valor: autor, texto: true },
    { etiqueta: "Comentarios", valor: stats.comentarios },
  ];

  return (
    <section className="estadisticas" aria-label="Estadísticas">
      {datos.map(({ etiqueta, valor, texto }) => (
        <div className="stat" key={etiqueta}>
          <span className={`stat__valor ${texto ? "stat__valor--texto" : ""}`}>
            {valor}
          </span>
          <span className="stat__etiqueta">{etiqueta}</span>
        </div>
      ))}
    </section>
  );
}