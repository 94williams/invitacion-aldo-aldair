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
  rsvpEndpoint: "",
  whatsappContacts: [
    { id: "edmundo", name: "Edmundo Bustos", phone: "525522995162" },
    { id: "ana-karen", name: "Ana Karen Muñoz", phone: "525537365974" }
  ]
};
```

After deploying the Apps Script below, paste its `/exec` URL into `rsvpEndpoint`.

## Música

La invitación reproduce `assets/yo-soy-tu-amigo-fiel.mp3` al pulsar «Abrir invitación». El botón flotante permite pausarlo o reanudarlo. Si el navegador bloquea el inicio, el invitado puede volver a intentarlo con el botón de música.

```html
<audio id="bgMusic" src="assets/yo-soy-tu-amigo-fiel.mp3" loop preload="none"></audio>
```

## Confirmaciones compartidas en Google Sheets

El formulario ofrece dos botones de WhatsApp. Antes de abrir el chat, guarda una fila por familia en Google Sheets; si el mismo nombre confirma otra vez, actualiza esa fila. La pestaña `Resumen` calcula las familias y personas confirmadas.

1. Crea una hoja de cálculo privada en Google Sheets.
2. Desde la hoja, abre **Extensiones > Apps Script** y copia el contenido de `GoogleAppsScript.gs` en el editor.
3. En Apps Script, selecciona **Implementar > Nueva implementación > Aplicación web**. Elige ejecutar como tú y permite el acceso a cualquiera para que los invitados puedan confirmar. Implementa y copia la URL de la aplicación web que termina en `/exec`.
4. En `script.js`, pega esa URL en `CONFIG.rsvpEndpoint`. Sin una URL válida, el formulario avisa y no registra ni abre WhatsApp.
5. Mantén la hoja privada: los invitados envían confirmaciones, pero no necesitan acceso a la hoja.

La aplicación usa los números configurados en `CONFIG.whatsappContacts` (México, prefijo `52`). Cambia ahí los contactos si fuera necesario. La URL de Apps Script es pública para recibir envíos; no compartas la URL de la hoja.

## Archivos

- `index.html`
- `styles.css`
- `script.js`
- `GoogleAppsScript.gs` (backend para guardar y resumir confirmaciones)
- `assets/` con fotos y SVGs

## Recomendación

Si después quieres, el siguiente paso ideal sería:
- colocar la **fecha y sede reales**,
- añadir una canción,
- y publicar el sitio en **Netlify o GitHub Pages**.
