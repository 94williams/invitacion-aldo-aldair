const CONFIG = {
  nombre: "Aldo Bustos",

  fechaEvento: "2026-10-17T15:00:00",
  // Zona horaria del evento (CDMX, sin horario de verano desde 2022).
  // Así la cuenta regresiva y el calendario son correctos aunque el invitado esté en otro país.
  zona: "-06:00",
  fechaTexto: "Sábado · 25 de octubre · 2026",
  fechaDetalle: "Sábado 2 de octubre de 2026",
  horaTexto: "12:00 p. m.",

  itinerario: {
    llegada: "12:00 p. m.",
    comida: "2:00 p. m.",
    pastel: "4:00 p. m."
  },

  lugar: {
    nombre: "Parque de los coyotes",
    direccion: "Calzada De La Virgen, Rosa María Sequeira, Coapa, Ex-Ejido de San Pablo Tepetlapa, 04840 Ciudad de México, CDMX",
    maps: "https://maps.app.goo.gl/YbArgWhZQG2ytATbA"
  },

  dressCode: "Ven cómodo y listo para la aventura. Estilo casual o inspirado en juguetes.",

  // México: 52 + número de 10 dígitos
  whatsapp: "525500000000"
};

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const eventDate = () => new Date(CONFIG.fechaEvento + CONFIG.zona);

function setConfig(){
  document.title = `Mis 2 años · ${CONFIG.nombre}`;

  const parts = CONFIG.nombre.trim().split(/\s+/);
  $("heroName1").textContent = parts[0] || CONFIG.nombre;
  $("heroName2").textContent = parts[1] || "";

  const surnames = parts.slice(2).join(" ");
  let heroSurnames = document.querySelector(".hero-logo .name-surnames");
  if(!heroSurnames){
    heroSurnames = document.createElement("span");
    heroSurnames.className = "name-surnames";
    $("heroName2").after(heroSurnames);
  }
  heroSurnames.textContent = surnames;
  heroSurnames.hidden = !surnames;

  const welcomeTitle = $("welcomeTitle");
  welcomeTitle.replaceChildren(...[parts[0], parts[1], surnames].filter(Boolean).map((name, index) => {
    const span = document.createElement("span");
    span.textContent = name;
    if(index === 2) span.className = "name-surnames";
    return span;
  }));

  $("eventDateText").textContent = CONFIG.fechaTexto;
  $("eventTimeText").textContent = CONFIG.horaTexto;
  $("detailDate").textContent = CONFIG.fechaDetalle;
  $("detailTime").textContent = CONFIG.horaTexto;

  $("arrivalTime").textContent = CONFIG.itinerario.llegada;
  $("foodTime").textContent = CONFIG.itinerario.comida;
  $("cakeTime").textContent = CONFIG.itinerario.pastel;

  $("venueName").textContent = CONFIG.lugar.nombre;
  $("venueAddress").textContent = CONFIG.lugar.direccion;
  $("mapsBtn").href = CONFIG.lugar.maps;
  $("dressCode").textContent = CONFIG.dressCode;

}

function showToast(text){
  const toast = $("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2600);
}

function openBurst(){
  if(reduceMotion) return;
  const burst = $("burst");
  const colors = ["#ffd84c","#1661c7","#d73a32","#2ecc71","#9b59b6"];
  const total = 56;

  for(let i = 0; i < total; i++){
    const piece = document.createElement("i");
    piece.className = "piece";
    piece.style.background = colors[i % colors.length];

    const angle = (Math.PI * 2 * i) / total + Math.random() * .28;
    const distance = 120 + Math.random() * 320;
    piece.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
    piece.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    piece.style.setProperty("--s", `${.7 + Math.random() * .6}`);
    piece.style.animationDelay = `${.2 + Math.random() * .2}s`;

    burst.appendChild(piece);
    setTimeout(() => piece.remove(), 1900);
  }

  // Flash de luz (como cuando Buzz dice "¡A la infinito y más allá!")
  const flash = document.createElement("div");
  flash.style.cssText = "position:fixed;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,215,0,.95),rgba(255,215,0,.3) 35%,transparent);z-index:3500;pointer-events:none;animation:flashBoom .6s ease-out forwards;";
  burst.appendChild(flash);
  setTimeout(() => flash.remove(), 700);

  // Texto "¡A la infinito y más allá!" que aparece brevemente
  const phrase = document.createElement("div");
  phrase.style.cssText = "position:fixed;left:50%;top:45%;transform:translate(-50%,-50%);z-index:3501;pointer-events:none;font-family:Luckiest Guy,cursive;font-size:clamp(1.5rem,8vw,3.2rem);color:#fff;text-shadow:0 3px 0 #0e3f85,0 6px 0 #054aa8,0 12px 20px rgba(0,0,0,.4);text-align:center;letter-spacing:1px;animation:infinityPhrase .9s ease-out forwards;";
  phrase.textContent = "¡A la infinito y más allá!";
  burst.appendChild(phrase);
  setTimeout(() => phrase.remove(), 1100);
}

function openInvitation(){
  const welcome = $("welcome");
  if(welcome.classList.contains("opening")) return;

  // Temblor de la caja: efecto de sorpresa
  const box = welcome.querySelector(".toybox-wrap");
  if(box){
    box.style.animation = "none";
    setTimeout(() => {
      box.style.animation = "boxShake .6s ease-out .1s forwards";
    }, 10);
  }



  openBurst();
  welcome.classList.add("opening");
  if(navigator.vibrate) navigator.vibrate([30,50,30]);

  const audio = $("bgMusic");
  if(audio){
    audio.play().then(() => $("musicBtn").classList.add("playing")).catch(() => {});
  }

  // Tiempo para que se vea la tapa (1s) y las nubes (1.1s) antes de revelar el hero
  const delay = reduceMotion ? 120 : 1250;

  setTimeout(() => {
    // Al quitar "locked" arranca toda la coreografía del hero (ver CSS)
    document.body.classList.remove("locked");
    welcome.classList.add("hidden");
    setTimeout(() => {
      welcome.remove();
      window.scrollTo({top: 0, behavior: "auto"});
    }, 800);
  }, delay);
}

function updateCountdown(){
  const diff = Math.max(0, eventDate().getTime() - Date.now());

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  $("days").textContent = String(d).padStart(2, "0");
  $("hours").textContent = String(h).padStart(2, "0");
  $("minutes").textContent = String(m).padStart(2, "0");
  $("seconds").textContent = String(s).padStart(2, "0");
}

function downloadICS(){
  const start = eventDate();
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);

  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (t) => t.replace(/[\\,;]/g, (c) => "\\" + c);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aldo Aldair Toy Invitation//ES",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@invitacion-aldo`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${esc(`2 años de ${CONFIG.nombre}`)}`,
    `DESCRIPTION:${esc(`Fiesta de cumpleaños de ${CONFIG.nombre}`)}`,
    `LOCATION:${esc(`${CONFIG.lugar.nombre} - ${CONFIG.lugar.direccion}`)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Cumple-${CONFIG.nombre.replaceAll(" ", "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Evento listo para agregar a tu calendario.");
}


function observeReveal(){
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: .12});

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

function updateProgressBar(){
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  $("progressBar").style.width = `${progress}%`;
}

let lastStar = 0;
function starTrail(){
  if(reduceMotion) return;
  const hero = document.querySelector(".hero");
  if(hero && window.scrollY > hero.offsetHeight * .85) return; // solo en el hero
  const now = performance.now();
  if(now - lastStar < 220) return;
  lastStar = now;

  const trail = $("starTrail");
  const star = document.createElement("span");
  star.className = "star-pop";
  star.textContent = Math.random() > .5 ? "★" : "✦";

  const onLeft = Math.random() > .5;
  const x = onLeft
    ? 8 + Math.random() * (window.innerWidth * .18)
    : window.innerWidth - 8 - Math.random() * (window.innerWidth * .18);

  star.style.left = `${x}px`;
  star.style.top = `${30 + Math.random() * (window.innerHeight - 80)}px`;
  star.style.fontSize = `${11 + Math.random() * 13}px`;
  trail.appendChild(star);
  setTimeout(() => star.remove(), 950);
}

function updateRocket(){
  const track = $("rocketTrack");
  const rocket = $("scrollRocket");
  const fire = rocket.querySelector(".rocket-fire");
  const rect = track.getBoundingClientRect();
  const vh = window.innerHeight;
  const travelWindow = Math.max(vh * .85, 420);
  const progress = reduceMotion ? 0 : Math.min(Math.max((vh - rect.top) / travelWindow, 0), 1);
  const eased = progress * progress * (3 - 2 * progress);
  const startY = rect.height - rocket.offsetHeight * .78;
  const endY = -rocket.offsetHeight - 40;
  const y = startY + (endY - startY) * eased;
  const fadeIn = Math.min(progress / .1, 1);
  const fadeOut = Math.min((1 - progress) / .08, 1);

  rocket.style.opacity = reduceMotion ? ".9" : String(Math.max(0, Math.min(fadeIn, fadeOut)));
  rocket.style.transform = `translate3d(-50%, ${y}px, 0)`;
  fire.style.height = `${reduceMotion ? 42 : 52 + eased * 92}px`;
  fire.style.opacity = reduceMotion ? ".55" : String(.7 + progress * .3);
}

/* ---------- Inclinación 3D del hero ----------
   Escritorio: sigue al mouse.
   Móvil: se inclina suavemente con el scroll (no hay mouse). */
const scene = document.querySelector(".hero-inner");

function setTilt(x, y){
  scene.style.setProperty("--rx", x.toFixed(2));
  scene.style.setProperty("--ry", y.toFixed(2));
}

function initTilt(){
  if(!scene || reduceMotion || !finePointer) return;
  let raf = 0;
  scene.addEventListener("pointermove", (e) => {
    if(e.pointerType === "touch") return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = scene.getBoundingClientRect();
      setTilt(((e.clientX - r.left) / r.width - .5) * 14,
              ((e.clientY - r.top) / r.height - .5) * 10);
    });
  });
  scene.addEventListener("pointerleave", () => setTilt(0, 0));
}

function scrollTilt(){
  if(!scene || reduceMotion || finePointer) return;
  setTilt(0, Math.min(window.scrollY / window.innerHeight, 1) * 8);
}

function rsvpSubmit(e){
  e.preventDefault();
  const name = $("guestName").value.trim();
  const count = $("guestCount").value;

  if(!name){
    $("guestName").focus();
    showToast("Escribe tu nombre para confirmar.");
    return;
  }

  if(CONFIG.whatsapp === "525500000000"){
    showToast("Cambia el número de WhatsApp en script.js antes de publicarla.");
    return;
  }

  const msg =
    `¡Hola! Soy ${name}. Confirmo nuestra asistencia a los 2 años de ` +
    `${CONFIG.nombre}. Asistiremos ${count} ${count === "1" ? "persona" : "personas"}. ` +
    `🎉`;

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank", "noopener");
}

async function shareInvitation(){
  const data = {
    title: `Mis 2 años · ${CONFIG.nombre}`,
    text: `¡Te invito a celebrar los 2 años de ${CONFIG.nombre}!`,
    url: window.location.href
  };

  try{
    if(navigator.share){
      await navigator.share(data);
    }else if(navigator.clipboard){
      await navigator.clipboard.writeText(window.location.href);
      showToast("Enlace copiado al portapapeles.");
    }else{
      showToast("Copia el enlace del navegador para compartirlo.");
    }
  }catch(_){}
}

function toggleMusic(){
  const audio = $("bgMusic");
  const btn = $("musicBtn");

  if(!audio){
    showToast("Si quieres música, agrega assets/musica.mp3 y habilita el <audio> en index.html.");
    return;
  }

  if(audio.paused){
    audio.play().then(() => btn.classList.add("playing")).catch(() => {
      showToast("Toca nuevamente para reproducir la música.");
    });
  }else{
    audio.pause();
    btn.classList.remove("playing");
  }
}

/* ---------- Botón fijo "Confirmar asistencia" ---------- */
let stickyBtn;
function initSticky(){
  stickyBtn = document.createElement("a");
  stickyBtn.className = "btn btn-primary rsvp-sticky";
  stickyBtn.href = "#rsvp";
  stickyBtn.tabIndex = -1;
  stickyBtn.textContent = "Confirmar asistencia";
  document.body.appendChild(stickyBtn);
  updateSticky();
}

function updateSticky(){
  if(!stickyBtn) return;
  const hero = document.querySelector(".hero");
  const pastHero = window.scrollY > hero.offsetHeight * .8;
  const atRsvp = $("rsvp").getBoundingClientRect().top < window.innerHeight * .65;
  const show = pastHero && !atRsvp;
  stickyBtn.classList.toggle("show", show);
  stickyBtn.tabIndex = show ? 0 : -1;
}

let ticking = false;
function onScroll(){
  if(ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateProgressBar();
    starTrail();
    updateRocket();
    scrollTilt();
    updateSticky();
    ticking = false;
  });
}

setConfig();
updateCountdown();
observeReveal();
updateProgressBar();
updateRocket();
initTilt();
initSticky();
setInterval(updateCountdown, 1000);

$("openBtn").addEventListener("click", openInvitation);
$("calendarBtn").addEventListener("click", downloadICS);
$("rsvpForm").addEventListener("submit", rsvpSubmit);
$("shareBtn").addEventListener("click", shareInvitation);
$("musicBtn").addEventListener("click", toggleMusic);

window.addEventListener("scroll", onScroll, {passive: true});
window.addEventListener("resize", () => {
  updateProgressBar();
  updateRocket();
  updateSticky();
}, {passive: true});
