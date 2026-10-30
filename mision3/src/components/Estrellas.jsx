export default function Estrellas({ valor = 0, onChange }) {
  return (
    <div className="estrellas" role="group" aria-label="Puntuación">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`estrella ${n <= valor ? "llena" : ""}`}
          aria-label={`${n} de 5 estrellas`}
          onClick={() => onChange(n === valor ? 0 : n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}