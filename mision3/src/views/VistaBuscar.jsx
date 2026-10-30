import { useState } from "react";
import Buscador from "../components/Buscador.jsx";
import FiltroIdiomas from "../components/FiltroIdiomas.jsx";
import BarraFiltros from "../components/BarraFiltros.jsx";
import ResultadosLista from "../components/ResultadosLista.jsx";
import Mensaje from "../components/Mensaje.jsx";
import useFetch from "../hooks/useFetch.js";
import useDebounce from "../hooks/useDebounce.js";
import { buscarLibros } from "../services/api.js";
import { filtrarResultados } from "../utils/filtros.js";

export default function VistaBuscar({ biblioteca, onCambiarEstado }) {
  const [texto, setTexto] = useState("");
  const [idiomas, setIdiomas] = useState([]);
  const [soloPortada, setSoloPortada] = useState(false);
  const [orden, setOrden] = useState("relevancia");

  const consulta = useDebounce(texto.trim(), 400);
  const clave = consulta
    ? `${consulta.toLowerCase()}|${[...idiomas].sort().join(",")}`
    : null;

  const { datos, estado, reintentar } = useFetch(clave, (signal) =>
    buscarLibros(consulta, idiomas, signal)
  );

  const visibles = filtrarResultados(datos ?? [], soloPortada, orden);

  function alternarIdioma(codigo) {
    setIdiomas((actuales) =>
      actuales.includes(codigo)
        ? actuales.filter((i) => i !== codigo)
        : [...actuales, codigo]
    );
  }

  return (
    <>
      <Buscador valor={texto} onCambiar={setTexto} />
      <FiltroIdiomas elegidos={idiomas} onAlternar={alternarIdioma} />
      <BarraFiltros
        soloPortada={soloPortada}
        onSoloPortada={setSoloPortada}
        orden={orden}
        onOrden={setOrden}
      />

      {estado === "inactivo" && (
        <Mensaje>Escribe un título o un autor para empezar.</Mensaje>
      )}
      {estado === "cargando" && <Mensaje tipo="cargando">Buscando libros…</Mensaje>}
      {estado === "error" && (
        <Mensaje tipo="error">
          No se pudieron cargar los libros. Comprueba tu conexión.{" "}
          <button type="button" className="btn-texto" onClick={reintentar}>
            Reintentar
          </button>
        </Mensaje>
      )}
      {estado === "ok" && datos.length === 0 && (
        <Mensaje>No se encontraron libros para «{consulta}».</Mensaje>
      )}
      {estado === "ok" && datos.length > 0 && visibles.length === 0 && (
        <Mensaje>No hay libros que coincidan con los filtros.</Mensaje>
      )}

      <ResultadosLista
        libros={visibles}
        biblioteca={biblioteca}
        onCambiarEstado={onCambiarEstado}
      />
    </>
  );
}