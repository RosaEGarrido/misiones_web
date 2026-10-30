import { useState } from "react";

export default function FormComentario({ onEnviar }) {
  const [texto, setTexto] = useState("");

  function enviar(e) {
    e.preventDefault();

    const limpio = texto.trim();
    if (!limpio) return;

    onEnviar(limpio);
    setTexto("");
  }

  return (
    <form className="form-comentario" onSubmit={enviar}>
      <label htmlFor="texto-comentario">Añadir comentario</label>
      <textarea
        id="texto-comentario"
        rows={3}
        maxLength={500}
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        required
      />
      <button type="submit" className="btn btn--lleno">
        Guardar comentario
      </button>
    </form>
  );
}