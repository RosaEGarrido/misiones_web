import "./style.css";
import { obtenerDetalle } from "./api.js";
import { leerCache, guardarCache } from "./cache.js";
import {
  obtenerBiblioteca,
  guardarEnBiblioteca,
  quitarDeBiblioteca,
  puntuarLibro,
  agregarComentario,
  borrarComentario,
} from "./library.js";
import { calcularEstadisticas } from "./stats.js";
import {
  renderBiblioteca,
  renderDetalle,
  renderExtra,
  renderEstadisticas,
} from "./ui.js";

const contenedor = document.querySelector("#biblioteca");
const pestanas = document.querySelectorAll(".pestana");
const detalle = document.querySelector("#detalle");
const filtroTexto = document.querySelector("#filtro-texto");
const selectOrden = document.querySelector("#orden-biblioteca");
const selectNota = document.querySelector("#filtro-nota");
const cajaNota = document.querySelector("#filtro-nota-caja");

let pestanaActiva = "quiero";
let libroAbiertoId = null;
let extraActual = { estado: "cargando" };
let ultimaCarga = 0;

function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function aplicarVista(items) {
  const buscado = normalizar(filtroTexto.value.trim());
  const notaMinima = pestanaActiva === "leido" ? Number(selectNota.value) : 0;

  let lista = items.filter((libro) => {
    const comentarios = (libro.comentarios ?? []).map((c) => c.texto).join(" ");
    const textoLibro = normalizar(`${libro.titulo} ${libro.autor} ${comentarios}`);

    return (
      textoLibro.includes(buscado) && (libro.puntuacion ?? 0) >= notaMinima
    );
  });

  switch (selectOrden.value) {
    case "titulo":
      lista = [...lista].sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
      break;
    case "nota":
      lista = [...lista].sort(
        (a, b) => (b.puntuacion ?? 0) - (a.puntuacion ?? 0)
      );
      break;
    default:
      lista = [...lista].reverse();
  }

  return lista;
}

function pintar() {
  const biblioteca = obtenerBiblioteca();

  pestanas.forEach((pestana) => {
    pestana.querySelector(".contador").textContent = biblioteca.filter(
      (libro) => libro.estado === pestana.dataset.tab
    ).length;
  });

  cajaNota.hidden = pestanaActiva !== "leido";
  renderEstadisticas(calcularEstadisticas(biblioteca));

  const deLaPestana = biblioteca.filter(
    (libro) => libro.estado === pestanaActiva
  );
  renderBiblioteca(aplicarVista(deLaPestana), pestanaActiva, deLaPestana.length > 0);
}

function pintarFicha() {
  const libro = obtenerBiblioteca().find((l) => l.id === libroAbiertoId);
  if (libro) renderDetalle(libro, extraActual);
}

function refrescarDetalle() {
  pintarFicha();
  pintar();
}

async function cargarExtra(id) {
  const numero = ++ultimaCarga;
  extraActual = { estado: "cargando" };
  renderExtra(extraActual);

  try {
    const clave = `detalle:${id}`;
    let datos = leerCache(clave);

    if (!datos) {
      datos = await obtenerDetalle(id);
      guardarCache(clave, datos);
    }

    if (numero !== ultimaCarga) return;
    extraActual = { estado: "ok", datos };
  } catch (error) {
    if (numero !== ultimaCarga) return;
    console.error(error);
    extraActual = { estado: "error" };
  }

  renderExtra(extraActual);
}

function abrirDetalle(id) {
  const libro = obtenerBiblioteca().find((l) => l.id === id);
  if (!libro) return;

  libroAbiertoId = id;
  extraActual = { estado: "cargando" };
  pintarFicha();
  detalle.showModal();
  cargarExtra(id);
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

  if (e.target.closest("[data-reintentar]")) {
    cargarExtra(libroAbiertoId);
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

filtroTexto.addEventListener("input", pintar);
selectOrden.addEventListener("change", pintar);
selectNota.addEventListener("change", pintar);

pestanas.forEach((pestana) => {
  pestana.addEventListener("click", () => {
    pestanaActiva = pestana.dataset.tab;
    pestanas.forEach((p) => p.classList.toggle("activa", p === pestana));
    pintar();
  });
});

pintar();