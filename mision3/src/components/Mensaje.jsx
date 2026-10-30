export default function Mensaje({ tipo = "info", children }) {
  const clase = tipo === "info" ? "estado" : `estado ${tipo}`;

  return (
    <div className={clase} role="status" aria-live="polite">
      {children}
    </div>
  );
}