import { useState } from "react";
import Cabecera from "./components/Cabecera.jsx";
import VistaBuscar from "./views/VistaBuscar.jsx";
import VistaBiblioteca from "./views/VistaBiblioteca.jsx";
import useLocalStorage from "./hooks/useLocalStorage.js";

function App() {
  const [vista, setVista] = useState("buscar");
  const [biblioteca, setBiblioteca] = useLocalStorage("ol-biblioteca", []);

  function guardarLibro(libro, estado) {
    setBiblioteca((actual) => {
      const existente = actual.find((l) => l.id === libro.id);
      const resto = actual.filter((l) => l.id !== libro.id);
      return [...resto, { ...libro, ...existente, estado }];
    });
  }

  function quitarLibro(id) {
    setBiblioteca((actual) => actual.filter((l) => l.id !== id));
  }

  function actualizarLibro(id, calcularCambios) {
    setBiblioteca((actual) =>
      actual.map((l) => (l.id === id ? { ...l, ...calcularCambios(l) } : l))
    );
  }

  function cambiarEstado(libro, estado) {
    const actual = biblioteca.find((l) => l.id === libro.id);

    if (actual?.estado === estado) {
      quitarLibro(libro.id);
    } else {
      guardarLibro(libro, estado);
    }
  }

  return (
    <>
      <Cabecera vista={vista} onCambiarVista={setVista} />
      <main className="layout">
        <div hidden={vista !== "buscar"}>
          <VistaBuscar
            biblioteca={biblioteca}
            onCambiarEstado={cambiarEstado}
          />
        </div>
        <div hidden={vista !== "biblioteca"}>
          <VistaBiblioteca
            biblioteca={biblioteca}
            onCambiarEstado={cambiarEstado}
            onQuitar={quitarLibro}
            onActualizar={actualizarLibro}
          />
        </div>
      </main>
    </>
  );
}

export default App;