import { z } from 'zod'

export const CLASES = ['guerrero', 'mago', 'picaro', 'clerigo']

const registroBase = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'El nombre necesita al menos 2 caracteres')
    .max(40, 'Máximo 40 caracteres'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email('Introduce un email válido')),
  edad: z
    .number({ error: 'La edad debe ser un número' })
    .int('La edad debe ser un entero')
    .min(16, 'Hay que tener 16 años como mínimo')
    .max(99, 'Edad máxima: 99'),
  clase: z.enum(CLASES, { error: 'Elige una clase' }),
  password: z
    .string()
    .min(8, 'Mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Incluye una mayúscula')
    .regex(/\d/, 'Incluye un número'),
  confirmar: z.string().min(1, 'Repite la contraseña'),
  terminos: z.literal(true, { error: 'Debes aceptar el juramento del gremio' }),
})

export const registroSchema = registroBase.refine(
  (d) => d.password === d.confirmar,
  { path: ['confirmar'], error: 'Las contraseñas no coinciden' }
)

export const aspiranteSchema = z.object({
  id: z.number(),
  nombre: z.string().min(2),
  email: z.email(),
  edad: z.number().int().min(16).max(99),
  clase: z.enum(CLASES),
})
