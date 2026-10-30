export default function Buscador({ valor, onCambiar }) {
  return (
    <form
      className="busqueda"
      role="search"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="search"
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        placeholder="Título o autor"
        aria-label="Buscar libros"
        autoComplete="off"
      />
    </form>
  );
}