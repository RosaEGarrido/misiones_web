import "./style.css";
import {
  obtenerBiblioteca,
  guardarEnBiblioteca,
  quitarDeBiblioteca,
  puntuarLibro,
} from "./library.js";
import { renderBiblioteca } from "./ui.js";

const contenedor = document.querySelector("#biblioteca");
const pestanas = document.querySelectorAll(".pestana");
let pestanaActiva = "quiero";

function pintar() {
  const biblioteca = obtenerBiblioteca();

  pestanas.forEach((pestana) => {
    pestana.querySelector(".contador").textContent = biblioteca.filter(
      (libro) => libro.estado === pestana.dataset.tab
    ).length;
  });

  renderBiblioteca(biblioteca, pestanaActiva);
}

contenedor.addEventListener("click", (e) => {
  const tarjeta = e.target.closest(".libro");
  if (!tarjeta) return;

  const id = tarjeta.dataset.id;
  const libro = obtenerBiblioteca().find((l) => l.id === id);
  if (!libro) return;

  const estrella = e.target.closest("[data-estrella]");
  if (estrella) {
    const nueva = Number(estrella.dataset.estrella);
    puntuarLibro(id, nueva === (libro.puntuacion ?? 0) ? 0 : nueva);
    pintar();
    return;
  }

  const boton = e.target.closest("[data-accion]");
  if (!boton) return;

  if (boton.dataset.accion === "quitar") {
    quitarDeBiblioteca(id);
  } else {
    guardarEnBiblioteca(libro, boton.dataset.accion);
  }

  pintar();
});

pestanas.forEach((pestana) => {
  pestana.addEventListener("click", () => {
    pestanaActiva = pestana.dataset.tab;
    pestanas.forEach((p) => p.classList.toggle("activa", p === pestana));
    pintar();
  });
});

pintar();