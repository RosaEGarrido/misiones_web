import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { registroSchema, CLASES } from './schemas'
import { crearAspirante, aspirantesKey } from './api'

const valoresIniciales = {
  nombre: '',
  email: '',
  edad: undefined,
  clase: '',
  password: '',
  confirmar: '',
  terminos: false,
}

function Campo({ id, label, error, children }) {
  return (
    <div className="campo">
      <label htmlFor={id}>{label}</label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="error">
          {error.message}
        </p>
      )}
    </div>
  )
}

export default function RegistroForm() {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registroSchema),
    defaultValues: valoresIniciales,
    mode: 'onTouched',
  })

  const mutation = useMutation({
    mutationFn: crearAspirante,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: aspirantesKey })
      reset(valoresIniciales)
    },
  })

  const onSubmit = ({ nombre, email, edad, clase }) => {
    mutation.mutate({ nombre, email, edad, clase })
  }

  const props = (name) => ({
    id: name,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2>Inscripción</h2>

      <Campo id="nombre" label="Nombre" error={errors.nombre}>
        <input type="text" autoComplete="name" {...props('nombre')} {...register('nombre')} />
      </Campo>

      <Campo id="email" label="Email" error={errors.email}>
        <input type="email" autoComplete="email" {...props('email')} {...register('email')} />
      </Campo>

      <Campo id="edad" label="Edad" error={errors.edad}>
        <input type="number" {...props('edad')} {...register('edad', { valueAsNumber: true })} />
      </Campo>

      <Campo id="clase" label="Clase" error={errors.clase}>
        <select {...props('clase')} {...register('clase')}>
          <option value="">Elige una clase…</option>
          {CLASES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </Campo>

      <Campo id="password" label="Contraseña" error={errors.password}>
        <input type="password" autoComplete="new-password" {...props('password')} {...register('password')} />
      </Campo>

      <Campo id="confirmar" label="Repite la contraseña" error={errors.confirmar}>
        <input type="password" autoComplete="new-password" {...props('confirmar')} {...register('confirmar')} />
      </Campo>

      <div className="campo check">
        <label htmlFor="terminos">
          <input type="checkbox" {...props('terminos')} {...register('terminos')} />
          Acepto el juramento del gremio
        </label>
        {errors.terminos && (
          <p id="terminos-error" role="alert" className="error">
            {errors.terminos.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={isSubmitting || mutation.isPending}>
        {mutation.isPending ? 'Inscribiendo…' : 'Inscribirme'}
      </button>

      <div aria-live="polite">
        {mutation.isError && <p role="alert" className="error">{mutation.error.message}</p>}
        {mutation.isSuccess && <p role="status" className="ok">¡Bienvenido al gremio, {mutation.data.nombre}!</p>}
      </div>
    </form>
  )
}