import RegistroForm from './RegistroForm'
import Listado from './Listado'

export default function App() {
  return (
    <main>
      <h1>Valida o muere</h1>
      <div className="grid">
        <RegistroForm />
        <Listado />
      </div>
    </main>
  )
}
