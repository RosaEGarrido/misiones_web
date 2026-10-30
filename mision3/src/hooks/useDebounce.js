import { useEffect, useState } from "react";

export default function useDebounce(valor, retardo = 400) {
  const [valorRetardado, setValorRetardado] = useState(valor);

  useEffect(() => {
    const temporizador = setTimeout(() => setValorRetardado(valor), retardo);
    return () => clearTimeout(temporizador);
  }, [valor, retardo]);

  return valorRetardado;
}