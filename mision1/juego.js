function seleccionar(jugador) {
    const opciones = ["piedra", "papel", "tijera"];
    const pc = opciones[Math.floor(Math.random() * 3)];

    let resultado;

    if (jugador === pc) {
        resultado = "Empate";
    } else if (
        (jugador === "piedra" && pc === "tijera") ||
        (jugador === "papel" && pc === "piedra") ||
        (jugador === "tijera" && pc === "papel")
    ) {
        resultado = "Ganaste";
    } else {
        resultado = "Perdiste";
    }

    const imgJugador = document.getElementById("imgJugador");
    const imgMaquina = document.getElementById("imgMaquina");

    imgJugador.src = jugador + ".png";
    imgMaquina.src = pc + ".png";
    imgJugador.style.display = "block";
    imgMaquina.style.display = "block";

    document.getElementById("resultado").textContent = resultado;
}