# Mision 4

App React de registro + listado para el Gremio de Aventureros.
Formulario con React Hook Form, validación con Zod y datos remotos con TanStack Query v5.

## Cómo ejecutarlo

```bash
npm install
npm run api   # json-server en http://localhost:3001
npm run dev   # app en http://localhost:5173
```

## Estructura

- `src/schemas.js`: esquemas Zod (formulario y respuesta del API)
- `src/api.js`: peticiones y validación de respuestas con `safeParse`
- `src/RegistroForm.jsx`: formulario (RHF + `zodResolver` + `useMutation`)
- `src/Listado.jsx`: listado (`useQuery`) con estados de carga, error y vacío
- `db.json`: datos de partida (incluye un registro corrupto a propósito)

## Decisiones

- El esquema Zod es la única fuente de validación; RHF solo lo conecta con `zodResolver`.
- Clave de query `['aspirantes']`; la mutation la invalida en `onSuccess`.
- Bonus: `listarAspirantes` valida cada elemento con `safeParse`, descarta los inválidos y avisa en la UI.
  Se ve con el registro `id: 3` de `db.json`.

## Declaración de uso de IA

- Herramienta: Claude (Anthropic).
- Para qué la usé: generó la estructura inicial del proyecto, el código de los
  componentes, los esquemas Zod y la API local, y me ayudó a diagnosticar errores.
- Lo que hice yo: creé el proyecto, copié e integré los archivos, adapté los nombres
  a mi estructura (por ejemplo, el CSS en App.css), depuré los errores que fueron
  saliendo (ver Autopsia) y probé la app a mano.
- Limitaciones: la mayor parte del código es generada por IA. Estoy preparando
  cambios propios para la presentación.
