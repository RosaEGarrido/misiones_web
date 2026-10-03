const imgJugador = document.getElementById("imgJugador");
const imgMaquina = document.getElementById("imgMaquina");
const textoResultado = document.getElementById("resultado");
const titulo = document.getElementById("titulo");

const reglasClasico = { piedra: ["tijera"], papel: ["piedra"], tijera: ["papel"] };
const reglasExtendido = {
    piedra: ["tijera", "lagarto"],
    papel: ["piedra", "spock"],
    tijera: ["papel", "lagarto"],
    lagarto: ["spock", "papel"],
    spock: ["tijera", "piedra"]
};

let modoExtendido = false;

document.addEventListener("keydown", (event) => {
    if (event.key === "d" || event.key === "m") {
        document.body.classList.toggle("oscuro");
    }
});

document.querySelectorAll(".boton").forEach((boton) => {
    boton.addEventListener("click", () => seleccionar(boton.id));
});

document.getElementById("cambiarModo").addEventListener("click", () => {
    modoExtendido = !modoExtendido;
    document.body.classList.toggle("modoExtendido", modoExtendido);
    document.getElementById("lagarto").classList.toggle("oculto", !modoExtendido);
    document.getElementById("spock").classList.toggle("oculto", !modoExtendido);
    document.getElementById("cambiarModo").textContent = modoExtendido
        ? "Jugar clásico"
        : "Jugar con Lagarto y Spock";
    titulo.textContent = modoExtendido
        ? "Piedra, Papel, Tijera, Lagarto, Spock"
        : "Piedra, Papel o Tijera";
});

function calcularResultado(jugador, pc) {
    const reglas = modoExtendido ? reglasExtendido : reglasClasico;
    if (jugador === pc) return "Empate";
    return reglas[jugador].includes(pc) ? "Ganaste" : "Perdiste";
}

function seleccionar(jugador) {
    const opciones = modoExtendido
        ? ["piedra", "papel", "tijera", "lagarto", "spock"]
        : ["piedra", "papel", "tijera"];
    const pc = opciones[Math.floor(Math.random() * opciones.length)];

    const sufijo = modoExtendido ? "-bigbang" : "";
    imgJugador.src = `${jugador}${sufijo}.png`;
    imgMaquina.src = `${pc}${sufijo}.png`;
    imgJugador.style.display = "block";
    imgMaquina.style.display = "block";

    textoResultado.textContent = calcularResultado(jugador, pc);
}

document.getElementById("verInstrucciones").addEventListener("click", () => {
    document.getElementById("instrucciones").classList.remove("oculto");
});

document.getElementById("cerrarInstrucciones").addEventListener("click", () => {
    document.getElementById("instrucciones").classList.add("oculto");
});