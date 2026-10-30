const VISTAS = [
  {
    id: "buscar",
    nombre: "Buscar",
    descripcion: "Busca un libro y guárdalo en tu biblioteca.",
  },
  {
    id: "biblioteca",
    nombre: "Mi biblioteca",
    descripcion: "Los libros que has guardado y los que ya has leído.",
  },
];

export default function Cabecera({ vista, onCambiarVista }) {
  const actual = VISTAS.find((v) => v.id === vista);

  return (
    <header className="cabecera">
      <div className="cabecera__interior">
        <h1>Estantería</h1>
        <p>{actual.descripcion}</p>
        <nav className="nav">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-current={v.id === vista ? "page" : undefined}
              onClick={() => onCambiarVista(v.id)}
            >
              {v.nombre}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}