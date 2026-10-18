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

function estrellasHTML(puntuacion = 0) {
  const estrellas = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button class="estrella ${n <= puntuacion ? "llena" : ""}" data-estrella="${n}" aria-label="${n} de 5 estrellas">★</button>`
    )
    .join("");

  return `<div class="estrellas" role="group" aria-label="Puntuación">${estrellas}</div>`;
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
        <article class="libro" data-id="${escapar(libro.id)}">
          ${portadaHTML(libro)}
          <div class="libro__cuerpo">
            <h3 class="libro__titulo">${escapar(libro.titulo)}</h3>
            <p class="libro__meta">${escapar(libro.autor)}</p>
            ${pestana === "leido" ? estrellasHTML(libro.puntuacion) : ""}
            <div class="libro__acciones">
              <button class="btn" data-accion="${otra}">${textoOtra}</button>
              <button class="btn" data-accion="quitar">Quitar</button>
              ${pestana === "leido" ? `<button class="btn btn--ancho" data-accion="abrir">Comentarios${libro.comentarios?.length ? ` (${libro.comentarios.length})` : ""}</button>` : ""}
            </div>
          </div>
        </article>`;
    })
    .join("");
}

export function renderDetalle(libro) {
  const comentarios = [...(libro.comentarios ?? [])].reverse();

  document.querySelector("#detalle-titulo").textContent = libro.titulo;
  document.querySelector("#detalle-contenido").innerHTML = `
    <div class="detalle__cuerpo">
      ${portadaHTML(libro)}
      <div>
        <p class="libro__meta">${escapar(libro.autor)}${libro.anio ? ` · ${libro.anio}` : ""}</p>
        ${estrellasHTML(libro.puntuacion)}
      </div>
    </div>

    <h3 class="detalle__subtitulo">Mis comentarios (${comentarios.length})</h3>
    <ul class="comentarios">
      ${
        comentarios.length === 0
          ? `<li class="comentarios__vacio">Aún no has escrito ningún comentario.</li>`
          : comentarios
              .map(
                (c) => `
        <li class="comentario">
          <p>${escapar(c.texto)}</p>
          <div class="comentario__pie">
            <time>${new Date(c.fecha).toLocaleDateString("es-ES")}</time>
            <button class="btn-texto" data-borrar="${c.fecha}">Borrar</button>
          </div>
        </li>`
              )
              .join("")
      }
    </ul>

    <form id="form-comentario" class="form-comentario">
      <label for="texto-comentario">Añadir comentario</label>
      <textarea id="texto-comentario" rows="3" maxlength="500" required></textarea>
      <button type="submit" class="btn btn--lleno">Guardar comentario</button>
    </form>`;
}