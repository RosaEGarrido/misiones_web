import { useEffect, useRef, useState } from "react";
import { leerCache, guardarCache } from "../services/cache.js";

export default function useFetch(clave, fetcher) {
  const [resultado, setResultado] = useState({
    clave: null,
    datos: null,
    error: null,
  });
  const [intento, setIntento] = useState(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (!clave) return;

    const controlador = new AbortController();

    async function cargar() {
      try {
        let datos = leerCache(clave);

        if (!datos) {
          datos = await fetcherRef.current(controlador.signal);
          guardarCache(clave, datos);
        }

        if (controlador.signal.aborted) return;
        setResultado({ clave, datos, error: null });
      } catch (error) {
        if (error.name === "AbortError" || controlador.signal.aborted) return;
        console.error(error);
        setResultado({ clave, datos: null, error });
      }
    }

    cargar();

    return () => controlador.abort();
  }, [clave, intento]);

  function reintentar() {
    setResultado({ clave: null, datos: null, error: null });
    setIntento((n) => n + 1);
  }

  let estado = "inactivo";

  if (clave) {
    if (resultado.clave !== clave) estado = "cargando";
    else estado = resultado.error ? "error" : "ok";
  }

  return {
    datos: estado === "ok" ? resultado.datos : null,
    estado,
    reintentar,
  };
}