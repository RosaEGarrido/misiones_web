import "./style.css";
import {
  obtenerBiblioteca,
  guardarEnBiblioteca,
  quitarDeBiblioteca,
  puntuarLibro,
  agregarComentario,
  borrarComentario,
} from "./library.js";
import { renderBiblioteca, renderDetalle } from "./ui.js";

const contenedor = document.querySelector("#biblioteca");
const pestanas = document.querySelectorAll(".pestana");
const detalle = document.querySelector("#detalle");

let pestanaActiva = "quiero";
let libroAbiertoId = null;

function pintar() {
  const biblioteca = obtenerBiblioteca();

  pestanas.forEach((pestana) => {
    pestana.querySelector(".contador").textContent = biblioteca.filter(
      (libro) => libro.estado === pestana.dataset.tab
    ).length;
  });

  renderBiblioteca(biblioteca, pestanaActiva);
}

function abrirDetalle(id) {
  const libro = obtenerBiblioteca().find((l) => l.id === id);
  if (!libro) return;

  libroAbiertoId = id;
  renderDetalle(libro);
  detalle.showModal();
}

function refrescarDetalle() {
  const libro = obtenerBiblioteca().find((l) => l.id === libroAbiertoId);
  if (libro) renderDetalle(libro);
  pintar();
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

  if (boton.dataset.accion === "abrir") {
    abrirDetalle(id);
    return;
  }

  if (boton.dataset.accion === "quitar") {
    quitarDeBiblioteca(id);
  } else {
    guardarEnBiblioteca(libro, boton.dataset.accion);
  }

  pintar();
});

detalle.addEventListener("click", (e) => {
  if (e.target === detalle || e.target.closest("#detalle-cerrar")) {
    detalle.close();
    return;
  }

  const estrella = e.target.closest("[data-estrella]");
  if (estrella) {
    const libro = obtenerBiblioteca().find((l) => l.id === libroAbiertoId);
    const nueva = Number(estrella.dataset.estrella);
    puntuarLibro(libroAbiertoId, nueva === (libro?.puntuacion ?? 0) ? 0 : nueva);
    refrescarDetalle();
    return;
  }

  const borrar = e.target.closest("[data-borrar]");
  if (borrar) {
    borrarComentario(libroAbiertoId, Number(borrar.dataset.borrar));
    refrescarDetalle();
  }
});

detalle.addEventListener("submit", (e) => {
  e.preventDefault();

  const texto = detalle.querySelector("#texto-comentario").value.trim();
  if (!texto) return;

  agregarComentario(libroAbiertoId, texto);
  refrescarDetalle();
  detalle.querySelector("#texto-comentario").focus();
});

pestanas.forEach((pestana) => {
  pestana.addEventListener("click", () => {
    pestanaActiva = pestana.dataset.tab;
    pestanas.forEach((p) => p.classList.toggle("activa", p === pestana));
    pintar();
  });
});

pintar();