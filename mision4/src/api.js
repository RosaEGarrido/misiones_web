import { aspiranteSchema } from './schemas'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

async function http(path, options) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) throw new Error(`El servidor respondió ${res.status}`)
  return res.json()
}

export const aspirantesKey = ['aspirantes']

export async function listarAspirantes() {
  const raw = await http('/aspirantes')
  if (!Array.isArray(raw)) throw new Error('Respuesta inesperada del servidor')

  const validos = []
  const descartados = []
  for (const item of raw) {
    const r = aspiranteSchema.safeParse(item)
    if (r.success) validos.push(r.data)
    else descartados.push({ item, issues: r.error.issues })
  }
  return { validos, descartados }
}

export async function crearAspirante(datos) {
  const existentes = await http(`/aspirantes?email=${encodeURIComponent(datos.email)}`)
  if (existentes.length > 0) throw new Error('Ese email ya está inscrito en el gremio')
  return http('/aspirantes', { method: 'POST', body: JSON.stringify(datos) })
}