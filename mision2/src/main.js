import "./style.css";
import { buscarLibros } from "./api.js";
import { leerCache, guardarCache } from "./cache.js";
import {
  obtenerBiblioteca,
  estadoDe,
  guardarEnBiblioteca,
  quitarDeBiblioteca,
} from "./library.js";
import {
  mostrarCargando,
  mostrarError,
  mostrarMensaje,
  limpiarEstado,
  renderResultados,
  renderBiblioteca,
} from "./ui.js";

const form = document.querySelector("#form-busqueda");
const inputQ = document.querySelector("#q");
const checkPortada = document.querySelector("#solo-portada");
const selectOrden = document.querySelector("#orden");
const contResultados = document.querySelector("#resultados");
const contBiblioteca = document.querySelector("#biblioteca");
const pestanas = document.querySelectorAll(".pestana");

let resultados = [];
let pestanaActiva = "quiero";

function aplicarFiltros(libros) {
  let lista = libros.filter((libro) => !checkPortada.checked || libro.portada);

  switch (selectOrden.value) {
    case "anio-desc":
      lista = [...lista].sort((a, b) => (b.anio ?? 0) - (a.anio ?? 0));
      break;
    case "anio-asc":
      lista = [...lista].sort((a, b) => (a.anio ?? 9999) - (b.anio ?? 9999));
      break;
    case "ediciones":
      lista = [...lista].sort((a, b) => b.ediciones - a.ediciones);
      break;
  }

  return lista;
}

function pintarResultados() {
  const lista = aplicarFiltros(resultados);

  if (lista.length === 0) {
    mostrarMensaje("No hay libros que coincidan con los filtros.");
    return;
  }

  limpiarEstado();
  renderResultados(lista);
}

function pintarBiblioteca() {
  renderBiblioteca(obtenerBiblioteca(), pestanaActiva);
}

async function buscar(query) {
  const clave = query.trim().toLowerCase();
  mostrarCargando();

  try {
    let libros = leerCache(clave);

    if (!libros) {
      libros = await buscarLibros(query.trim());
      guardarCache(clave, libros);
    }

    resultados = libros;

    if (resultados.length === 0) {
      mostrarMensaje(`No se encontraron libros para "${query.trim()}".`);
      return;
    }

    pintarResultados();
  } catch (error) {
    console.error(error);
    mostrarError(
      "No se pudieron cargar los libros. Comprueba tu conexión e inténtalo de nuevo."
    );
  }
}

function cambiarEstado(libro, accion) {
  if (accion === "quitar" || estadoDe(libro.id) === accion) {
    quitarDeBiblioteca(libro.id);
  } else {
    guardarEnBiblioteca(libro, accion);
  }

  pintarBiblioteca();
  if (resultados.length > 0) pintarResultados();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputQ.value.trim()) buscar(inputQ.value);
});

checkPortada.addEventListener("change", () => {
  if (resultados.length > 0) pintarResultados();
});

selectOrden.addEventListener("change", () => {
  if (resultados.length > 0) pintarResultados();
});

contResultados.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-accion]");
  if (!boton) return;

  const id = boton.closest(".libro").dataset.id;
  const libro = resultados.find((l) => l.id === id);
  if (libro) cambiarEstado(libro, boton.dataset.accion);
});

contBiblioteca.addEventListener("click", (e) => {
  const boton = e.target.closest("[data-accion]");
  if (!boton) return;

  const id = boton.closest(".item").dataset.id;
  const libro = obtenerBiblioteca().find((l) => l.id === id);
  if (libro) cambiarEstado(libro, boton.dataset.accion);
});

pestanas.forEach((pestana) => {
  pestana.addEventListener("click", () => {
    pestanaActiva = pestana.dataset.tab;
    pestanas.forEach((p) => p.classList.toggle("activa", p === pestana));
    pintarBiblioteca();
  });
});

pintarBiblioteca();
