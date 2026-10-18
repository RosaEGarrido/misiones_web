import { estadoDe } from "./library.js";

const estado = document.querySelector("#estado");
const contResultados = document.querySelector("#resultados");
const contBiblioteca = document.querySelector("#biblioteca");

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function portadaHTML(libro) {
  if (libro.portada) {
    return `<img class="portada" src="${libro.portada}" alt="Portada de ${escapar(libro.titulo)}" loading="lazy" />`;
  }
  return `<div class="sin-portada">${escapar(libro.titulo)}</div>`;
}

export function mostrarCargando() {
  estado.className = "estado cargando";
  estado.textContent = "Buscando libros…";
  contResultados.innerHTML = "";
}

export function mostrarError(mensaje) {
  estado.className = "estado error";
  estado.textContent = mensaje;
  contResultados.innerHTML = "";
}

export function mostrarMensaje(mensaje) {
  estado.className = "estado";
  estado.textContent = mensaje;
  contResultados.innerHTML = "";
}

export function limpiarEstado() {
  estado.className = "estado";
  estado.textContent = "";
}

export function renderResultados(libros) {
  contResultados.innerHTML = libros
    .map((libro) => {
      const actual = estadoDe(libro.id);
      const meta = [libro.anio, `${libro.ediciones} ed.`]
        .filter(Boolean)
        .join(" · ");

      return `
        <article class="libro" data-id="${escapar(libro.id)}">
          ${portadaHTML(libro)}
          <div class="libro__cuerpo">
            <h3 class="libro__titulo">${escapar(libro.titulo)}</h3>
            <p class="libro__meta">${escapar(libro.autor)}</p>
            <p class="libro__meta">${meta}</p>
            <div class="libro__acciones">
              <button class="btn ${actual === "quiero" ? "activo" : ""}" data-accion="quiero">Quiero leer</button>
              <button class="btn ${actual === "leido" ? "activo" : ""}" data-accion="leido">Leído</button>
            </div>
          </div>
        </article>`;
    })
    .join("");
}

export function renderBiblioteca(biblioteca, pestana) {
  const items = biblioteca.filter((libro) => libro.estado === pestana);

  if (items.length === 0) {
    contBiblioteca.innerHTML = `<p class="lista__vacia">${
      pestana === "quiero"
        ? "Aún no has guardado libros para leer."
        : "Aún no has marcado ningún libro como leído."
    }</p>`;
    return;
  }

  contBiblioteca.innerHTML = items
    .map((libro) => {
      const otra = pestana === "quiero" ? "leido" : "quiero";
      const textoOtra = pestana === "quiero" ? "Ya lo leí" : "Quiero leer";

      return `
        <div class="item" data-id="${escapar(libro.id)}">
          ${portadaHTML(libro)}
          <div>
            <p class="item__titulo">${escapar(libro.titulo)}</p>
            <p class="item__autor">${escapar(libro.autor)}</p>
          </div>
          <div class="item__acciones">
            <button class="btn" data-accion="${otra}">${textoOtra}</button>
            <button class="btn" data-accion="quitar">Quitar</button>
          </div>
        </div>`;
    })
    .join("");
}
