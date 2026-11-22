import { useQuery } from '@tanstack/react-query'
import { listarAspirantes, aspirantesKey } from './api'

export default function Listado() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: aspirantesKey,
    queryFn: listarAspirantes,
  })

  return (
    <section>
      <h2>Aspirantes {isFetching && !isPending && <small>(actualizando…)</small>}</h2>

      {isPending && <p>Cargando aspirantes…</p>}

      {isError && (
        <div role="alert" className="error">
          <p>No se pudo cargar la lista: {error.message}</p>
          <button onClick={() => refetch()}>Reintentar</button>
        </div>
      )}

      {data && (
        <>
          {data.descartados.length > 0 && (
            <p role="status" className="aviso">
              ⚠ {data.descartados.length} registro(s) corrupto(s) descartado(s) por no pasar la validación del API.
            </p>
          )}
          {data.validos.length === 0 ? (
            <p>Aún no hay aspirantes.</p>
          ) : (
            <ul className="lista">
              {data.validos.map((a) => (
                <li key={a.id}>
                  <strong>{a.nombre}</strong> · {a.clase} · {a.edad} años
                  <br />
                  <span>{a.email}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
