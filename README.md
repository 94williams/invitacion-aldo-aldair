# Invitación Toy Story — 2 años de Aldo Aldair

Esta versión fue rehecha con una dirección visual mucho más cercana a la **idea de Toy Story**,
sin copiar logos oficiales de manera literal.

## Qué cambió

- portada inspirada en **la habitación de Andy**;
- letras estilo juguete con **amarillo + azul + sombra roja**;
- paleta visual mucho más reconocible;
- tipografías nuevas: **Bungee + Luckiest Guy + Nunito**;
- iconos reemplazados por **SVGs propios** (cohete, sombrero, estrella sheriff, bloques, pastel, mapa, regalos, calendario, WhatsApp);
- animación de apertura tipo **caja de juguetes**;
- cohete **realmente funcional** con movimiento basado en el scroll;
- estrellas que aparecen durante el desplazamiento;
- galería tipo pared con fotografías estilo Polaroid;
- mantiene cuenta regresiva, calendario, ubicación, WhatsApp y compartir.

## Personalización rápida

Abre `script.js` y cambia únicamente el bloque `CONFIG`.

```js
const CONFIG = {
  nombre: "Aldo Aldair",
  fechaEvento: "2026-10-17T15:00:00",
  fechaTexto: "Sábado · 17 de octubre · 2026",
  fechaDetalle: "Sábado 12 de octubre de 2026",
  horaTexto: "3:00 p. m.",
  lugar: {
    nombre: "Nombre del salón",
    direccion: "Dirección completa",
    maps: "URL de Google Maps"
  },
  whatsapp: "525512345678"
};
```

## Música opcional

1. Guarda una canción como `assets/musica.mp3`
2. En `index.html`, descomenta la línea:

```html
<audio id="bgMusic" src="assets/musica.mp3" loop preload="auto"></audio>
```

## Archivos

- `index.html`
- `styles.css`
- `script.js`
- `assets/` con fotos y SVGs

## Recomendación

Si después quieres, el siguiente paso ideal sería:
- colocar la **fecha y sede reales**,
- añadir una canción,
- y publicar el sitio en **Netlify o GitHub Pages**.
