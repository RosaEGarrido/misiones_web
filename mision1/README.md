# Piedra, Papel o Tijera
Misión M1 · El Despertar del DOM — Web Development I.

## Cómo probarlo
Abre juego.html en el navegador (o con Live Server). Pulsa uno de los tres
botones de abajo (piedra, papel o tijera) para elegir tu jugada. La máquina
elige la suya al azar y en el centro de la pantalla aparecen las dos imágenes,
la tuya y la de la máquina (esta última en espejo), y debajo el resultado:
"Ganaste", "Perdiste" o "Empate".
Además se puede activar el modo oscuro pulsando la tecla "M" o la tecla "D"
del teclado. Vuelve a pulsarla para volver al modo claro.
Los archivos de imagen (piedra.png, papel.png y tijera.png) tienen que estar
en la misma carpeta que juego.html.

## Uso de IA
Usé Claude en la web como ayuda, paso a paso: primero el HTML, luego el CSS
y por último la lógica en JS.
Ejemplo de prompt real: "q antes de mostrar el resultado salga como una imagen
con tu eleccion y otra con la de la maquina y se diga quien gana".
Probé cada cambio en el navegador antes de pedir el siguiente.
Escribí a mano: los colores y tamaños del CSS, los nombres de los archivos, y
el cambio para que el modo oscuro se active con las teclas "M" y "D" en lugar
de con cualquier tecla.

## Autopsia
1. La jugada de la máquina y el resultado se calculan en JavaScript y el HTML
solo los muestra. Descarté escribir el resultado directamente en el HTML o
comprobar qué imagen hay puesta para decidir quién gana, porque el HTML solo
debe ser un reflejo visual del juego, no el lugar donde se guarda la información.

2. El modo oscuro se activa añadiendo una sola clase ("oscuro") al body, y el
CSS se encarga de cambiar los colores. Descarté cambiar el color de cada
elemento desde JavaScript, porque es más limpio y fácil de mantener si se
separa el diseño (CSS) de la lógica (JS).

3. La imagen de la máquina se muestra en espejo con una regla de CSS
(transform: scaleX(-1)) en lugar de tener una segunda imagen invertida. Así
uso los mismos archivos para las dos y no duplico recursos.

4. Las imágenes de resultado están ocultas (display: none) hasta la primera
jugada. Descarté dejarlas visibles con un src vacío porque se verían como
imágenes rotas antes de jugar.