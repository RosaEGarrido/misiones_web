# Piedra, Papel o Tijera
Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre juego.html en el navegador (o con Live Server). Pulsa uno de los
botones de abajo (piedra, papel o tijera) para elegir tu jugada. La máquina
elige la suya al azar y en el centro de la pantalla aparecen las dos imágenes,
la tuya y la de la máquina (esta última en espejo), y debajo el resultado:
"Ganaste", "Perdiste" o "Empate".
Con el botón "Jugar con Lagarto y Spock" se activa un modo extra con dos
jugadas más: cambian las imágenes de los botones, los colores de la página,
el título y las imágenes de resultado.
El botón "?" abre un panel con las reglas de los dos modos (clásico y
Lagarto-Spock); se cierra con el botón "✕".
Además se puede activar el modo oscuro pulsando la tecla "M" o la tecla "D"
del teclado (funciona también dentro del modo Lagarto y Spock). Vuelve a
pulsarla para volver al modo claro.
Los archivos de imagen (piedra.png, papel.png, tijera.png, lagarto.png,
spock.png, piedra-bigbang.png, papel-bigbang.png y tijera-bigbang.png)
tienen que estar en la misma carpeta que juego.html.

## Uso de IA
Usé Claude en la web como ayuda, paso a paso: primero el HTML, luego el CSS
y por último la lógica en JS, y fui pidiendo cada función nueva por separado
(el modo extendido, el panel de instrucciones, los estilos).
Ejemplo de prompt real: "al cabiar de modo puedo cambiar las imagenes de
todos los botones para q se vea la diferecia, el nombre del titulo y los
colores de la pagina".
Probé cada cambio en el navegador antes de pedir el siguiente, incluida la
combinación de modo oscuro + modo extendido a la vez.
Escribí a mano: los colores y tamaños del CSS, los nombres de los archivos,
las teclas del modo oscuro ("M" y "D"), y el texto de las instrucciones de
cada modo.

## Autopsia
1. La jugada de la máquina y el resultado se calculan en JavaScript y el HTML
solo los muestra. Descarté escribir el resultado directamente en el HTML o
comprobar qué imagen hay puesta para decidir quién gana, porque el HTML solo
debe ser un reflejo visual del juego, no el lugar donde se guarda la información.
El cálculo del ganador vive aparte, en calcularResultado(jugador, pc), separado
de la parte que actualiza las imágenes y el texto, para poder razonar esa
lógica sin depender del navegador.

2. El modo oscuro y el modo extendido se activan añadiendo una sola clase
("oscuro" / "modoExtendido") al body, y el CSS se encarga de cambiar colores
e imágenes de fondo. Descarté cambiar esos estilos elemento por elemento
desde JavaScript, porque es más limpio y fácil de mantener si se separa el
diseño (CSS) de la lógica (JS). Para cuando los dos modos están activos a la
vez añadí una regla combinada (body.oscuro.modoExtendido) que tiene prioridad
sobre las de un solo modo, en vez de depender del orden en que están escritas
las reglas en el archivo.

3. Los tres botones de jugar usan addEventListener (uno por botón, buscados
con querySelectorAll(".boton")) en vez de onclick en el HTML. Descarté los
manejadores inline porque mezclan la lógica con la estructura de la página y
además esos tres mismos botones cambian su comportamiento al entrar en el
modo extendido, así que es más fácil manejarlo todo desde JS.

4. La imagen de la máquina se muestra en espejo con una regla de CSS
(transform: scaleX(-1)) en lugar de tener una segunda imagen invertida. Así
uso los mismos archivos para las dos y no duplico recursos.

5. Las imágenes de resultado están ocultas (display: none) hasta la primera
jugada. Descarté dejarlas visibles con un src vacío porque se verían como
imágenes rotas antes de jugar. En el modo extendido, piedra/papel/tijera usan
un archivo distinto (sufijo "-bigbang") pero lagarto y spock no, porque esas
dos jugadas solo existen en ese modo y no necesitan una versión alternativa.