const IDIOMAS = [
  { codigo: "spa", nombre: "Español" },
  { codigo: "eng", nombre: "Inglés" },
  { codigo: "fre", nombre: "Francés" },
  { codigo: "ger", nombre: "Alemán" },
  { codigo: "cat", nombre: "Catalán" },
];

export default function FiltroIdiomas({ elegidos, onAlternar }) {
  return (
    <fieldset className="idiomas">
      <legend>Idiomas</legend>
      {IDIOMAS.map(({ codigo, nombre }) => (
        <label key={codigo}>
          <input
            type="checkbox"
            checked={elegidos.includes(codigo)}
            onChange={() => onAlternar(codigo)}
          />{" "}
          {nombre}
        </label>
      ))}
    </fieldset>
  );
}