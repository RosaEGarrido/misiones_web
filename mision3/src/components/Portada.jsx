export default function Portada({ libro }) {
  if (libro.portada) {
    return (
      <img
        className="portada"
        src={libro.portada}
        alt={`Portada de ${libro.titulo}`}
        loading="lazy"
      />
    );
  }

  return <div className="sin-portada">{libro.titulo}</div>;
}