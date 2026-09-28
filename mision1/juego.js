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

    document.getElementById("resultado").textContent = resultado;
}