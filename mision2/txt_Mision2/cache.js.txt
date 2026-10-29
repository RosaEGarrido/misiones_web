const PREFIJO = "ol-cache2:";
const DURACION_MS = 10 * 60 * 1000;

export function leerCache(clave) {
  try {
    const raw = localStorage.getItem(PREFIJO + clave);
    if (!raw) return null;

    const { guardadoEn, datos } = JSON.parse(raw);

    if (Date.now() - guardadoEn > DURACION_MS) {
      localStorage.removeItem(PREFIJO + clave);
      return null;
    }

    return datos;
  } catch {
    return null;
  }
}

export function guardarCache(clave, datos) {
  try {
    localStorage.setItem(
      PREFIJO + clave,
      JSON.stringify({ guardadoEn: Date.now(), datos })
    );
  } catch {
    return;
  }
}