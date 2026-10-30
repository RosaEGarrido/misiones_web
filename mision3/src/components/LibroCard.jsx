import Portada from "./Portada.jsx";

export default function LibroCard({ libro, mostrarMeta = false, children }) {
  const meta = [libro.anio, `${libro.ediciones} ed.`].filter(Boolean).join(" · ");

  return (
    <article className="libro">
      <Portada libro={libro} />
      <div className="libro__cuerpo">
        <h3 className="libro__titulo">{libro.titulo}</h3>
        <p className="libro__meta">{libro.autor}</p>
        {mostrarMeta && <p className="libro__meta">{meta}</p>}
        {children}
      </div>
    </article>
  );
}