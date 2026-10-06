const CONFIG = {
  nombre: "Aldo Aldair",
  nombreInicio: "Aldo Bustos",

  fechaEvento: "2026-10-25T12:00:00",
  // Zona horaria del evento (CDMX, sin horario de verano desde 2022).
  // Así la cuenta regresiva y el calendario son correctos aunque el invitado esté en otro país.
  zona: "-06:00",
  fechaTexto: "Domingo · 25 de octubre · 2026",
  fechaDetalle: "Domingo 25 de octubre de 2026",
  horaTexto: "12:00 p. m.",

  itinerario: {
    llegada: "12:00 p. m.",
    comida: "2:00 p. m.",
    pastel: "4:00 p. m."
  },

  lugar: {
    nombre: "Parque de los coyotes Palapa 6",
    direccion: "Calzada De La Virgen, Rosa María Sequeira, Coapa, Ex-Ejido de San Pablo Tepetlapa, 04840 Ciudad de México, CDMX",
    maps: "https://maps.app.goo.gl/89LAJ5LPcYw8SaTS9"
  },

  dressCode: "Ven cómodo y listo para la aventura. Estilo casual o inspirado en juguetes.",

  rsvpEndpoint: "https://script.google.com/macros/s/AKfycby2PxLlpUmjLW0lpsnsXYlMq-VefkgrbHGVqH6aRWV4CJQua2616a4tE1B4FQY6UpWm/exec",
  whatsappContacts: [
    { id: "edmundo", name: "Edmundo Bustos", phone: "525522995162" },
    { id: "ana-karen", name: "Ana Karen Muñoz", phone: "525537365974" }
  ]
};

const $ = (id) => document.getElementById(id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const eventDate = () => new Date(CONFIG.fechaEvento + CONFIG.zona);
let countdownTimer = null;

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

  const welcomeParts = CONFIG.nombreInicio.trim().split(/\s+/);
  const welcomeNames = [welcomeParts[0], welcomeParts[1], welcomeParts.slice(2).join(" ")].filter(Boolean);
  $("welcomeTitle").replaceChildren(...welcomeNames.map((name, index) => {
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

function createWhatsAppUrl(phone, message){
  let digits = String(phone || "").replace(/\D/g, "");
  if(digits.length === 10) digits = `52${digits}`;
  if(!/^52\d{10}$/.test(digits)) return "";
  return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`;
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

  // Flash de luz (como cuando Buzz dice "¡Al infinito y más allá!")
  const flash = document.createElement("div");
  flash.style.cssText = "position:fixed;inset:0;background:radial-gradient(circle at 50% 30%,rgba(255,215,0,.95),rgba(255,215,0,.3) 35%,transparent);z-index:3500;pointer-events:none;animation:flashBoom .6s ease-out forwards;";
  burst.appendChild(flash);
  setTimeout(() => flash.remove(), 700);

  // Texto "¡Al infinito y más allá!" que aparece brevemente
  const phrase = document.createElement("div");
  phrase.style.cssText = "position:fixed;left:50%;top:45%;transform:translate(-50%,-50%);z-index:3501;pointer-events:none;font-family:Luckiest Guy,cursive;font-size:clamp(1.5rem,8vw,3.2rem);color:#fff;text-shadow:0 3px 0 #0e3f85,0 6px 0 #054aa8,0 12px 20px rgba(0,0,0,.4);text-align:center;letter-spacing:1px;animation:infinityPhrase .9s ease-out forwards;";
  phrase.textContent = "¡Al infinito y más allá!";
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
  welcome.querySelectorAll(".box-character").forEach((character) => {
    character.classList.add("is-emerging");
  });
  if(navigator.vibrate) navigator.vibrate([30,50,30]);

  playBackgroundMusic();

  // Da tiempo para ver el nombre antes del difuminado y deja terminar la apertura.
  const delay = reduceMotion ? 1100 : 1500;

  setTimeout(() => {
    // Al quitar "locked" arranca toda la coreografía del hero (ver CSS)
    document.body.classList.remove("locked");
    const mainContent = $("mainContent");
    const floatingActions = document.querySelector(".floating-actions");
    mainContent.inert = false;
    mainContent.removeAttribute("inert");
    floatingActions.inert = false;
    floatingActions.removeAttribute("inert");
    floatingActions.removeAttribute("aria-hidden");
    welcome.classList.add("hidden");
    mainContent.focus({preventScroll: true});
    setTimeout(() => {
      welcome.remove();
      window.scrollTo({top: 0, behavior: "auto"});
    }, 800);
  }, delay);
}

function updateCountdown(){
  const remaining = eventDate().getTime() - Date.now();
  const diff = Math.max(0, remaining);

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  $("days").textContent = String(d).padStart(2, "0");
  $("hours").textContent = String(h).padStart(2, "0");
  $("minutes").textContent = String(m).padStart(2, "0");
  $("seconds").textContent = String(s).padStart(2, "0");

  const eventFinished = remaining <= 0;
  $("countdown").hidden = eventFinished;
  $("countdownStatus").hidden = !eventFinished;
  if(eventFinished && countdownTimer){
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function downloadICS(){
  const start = eventDate();
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const formatDate = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const escapeICS = (value) => value.replace(/[\\,;]/g, (character) => `\\${character}`);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Aldo Aldair Toy Invitation//ES",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@invitacion-aldo`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(start)}`,
    `DTEND:${formatDate(end)}`,
    `SUMMARY:${escapeICS(`2 años de ${CONFIG.nombre}`)}`,
    `DESCRIPTION:${escapeICS(`Fiesta de cumpleaños de ${CONFIG.nombre}`)}`,
    `LOCATION:${escapeICS(`${CONFIG.lugar.nombre} - ${CONFIG.lugar.direccion}`)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], {type:"text/calendar;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url;
  link.download = `Cumple-${CONFIG.nombre.replaceAll(" ", "-")}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("Abre el archivo .ics con tu aplicación de calendario preferida.");
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

function saveRsvp(name, count, website){
  return new Promise((resolve, reject) => {
    const requestId = `rsvp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const frame = document.createElement("iframe");
    const form = document.createElement("form");
    frame.name = requestId;
    frame.hidden = true;
    form.hidden = true;
    form.method = "post";
    form.action = CONFIG.rsvpEndpoint;
    form.target = requestId;

    const fields = { requestId, name, count: String(count), website };
    for(const [key, value] of Object.entries(fields)){
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }

    const cleanup = () => {
      window.removeEventListener("message", onMessage);
      clearTimeout(timeout);
      frame.remove();
      form.remove();
    };
    const onMessage = (event) => {
      if(event.source !== frame.contentWindow || event.data?.type !== "rsvp-result" || event.data.requestId !== requestId) return;
      cleanup();
      if(event.data.ok) resolve();
      else reject(new Error("No se pudo guardar la confirmación. Inténtalo de nuevo."));
    };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("No recibimos respuesta de Google Sheets. Revisa la conexión e inténtalo de nuevo."));
    }, 20000);

    window.addEventListener("message", onMessage);
    document.body.append(frame, form);
    form.submit();
  });
}

async function rsvpSubmit(e){
  e.preventDefault();
  const name = $("guestName").value.trim();
  const count = Number($("guestCount").value);
  const website = $("guestWebsite").value.trim();
  const contactId = e.submitter?.dataset.contact;
  const contact = CONFIG.whatsappContacts.find((item) => item.id === contactId);

  if(!name){
    $("guestName").focus();
    showToast("Escribe tu nombre para confirmar.");
    return;
  }

  if(!contact){
    showToast("Elige el número de WhatsApp al que quieres confirmar.");
    return;
  }

  if(!CONFIG.rsvpEndpoint){
    showToast("Falta conectar el formulario con Google Sheets.");
    return;
  }

  const msg =
    `¡Hola! Soy ${name}. Confirmo nuestra asistencia a los 2 años de ` +
    `${CONFIG.nombre}. Asistiremos ${count} ${count === 1 ? "persona" : "personas"}. ` +
    `🎉`;
  const url = createWhatsAppUrl(contact.phone, msg);
  if(!url){
    showToast(`El número configurado para ${contact.name} no es válido.`);
    return;
  }
  const whatsappWindow = window.open(url, "_blank");
  if(!whatsappWindow){
    showToast("Permite las ventanas emergentes para abrir WhatsApp.");
    return;
  }
  whatsappWindow.opener = null;

  const buttons = [...$("rsvpForm").querySelectorAll("button[type='submit']")];
  buttons.forEach((button) => { button.disabled = true; });
  try{
    await saveRsvp(name, count, website);
    showToast(`Confirmación guardada. Continúa por WhatsApp con ${contact.name}.`);
  }catch(error){
    showToast(`WhatsApp se abrió, pero no se guardó la confirmación: ${error.message}`);
  }finally{
    buttons.forEach((button) => { button.disabled = false; });
  }
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

function playBackgroundMusic(){
  const audio = $("bgMusic");
  const btn = $("musicBtn");

  if(!audio){
    showToast("No se encontró el archivo de música.");
    return;
  }

  audio.play().then(() => {
    btn.classList.add("playing");
    btn.setAttribute("aria-label", "Pausar música");
    btn.setAttribute("aria-pressed", "true");
  }).catch(() => {
    btn.setAttribute("aria-pressed", "false");
    showToast("No se pudo iniciar la música. Toca ♫ para volver a intentarlo.");
  });
}

function toggleMusic(){
  const audio = $("bgMusic");
  const btn = $("musicBtn");

  if(!audio){
    showToast("No se encontró el archivo de música.");
    return;
  }

  if(audio.paused){
    playBackgroundMusic();
  }else{
    audio.pause();
    btn.classList.remove("playing");
    btn.setAttribute("aria-label", "Reproducir música");
    btn.setAttribute("aria-pressed", "false");
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
if(eventDate().getTime() > Date.now()) countdownTimer = setInterval(updateCountdown, 1000);
observeReveal();
updateProgressBar();
updateRocket();
initTilt();
initSticky();

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
