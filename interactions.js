// Défilement doux à l'ouverture ; un geste du visiteur lui rend le contrôle.
window.startInvitationScroll = function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const speed = 30; // Pixels par seconde : ajustez pour ralentir ou accélérer.
  const controller = new AbortController();
  let running = true;
  let previousTime = null;
  let position = window.scrollY;
  function stop() { running = false; controller.abort(); }
  ['wheel', 'touchstart', 'keydown'].forEach(type => window.addEventListener(type, event => {
    if (type === 'keydown' && !['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Tab'].includes(event.key)) return;
    if (event.target instanceof Element && event.target.closest('#musicToggle')) return;
    stop();
  }, { passive: true, signal: controller.signal }));
  window.addEventListener('pointerdown', event => {
    if (event.target instanceof Element && event.target.closest('#musicToggle')) return;
    stop();
  }, { passive: true, signal: controller.signal });
  function step(time) {
    if (!running) return;
    const elapsed = previousTime === null ? 0 : Math.min(time - previousTime, 50);
    previousTime = time;
    if (!document.hidden) {
      const bottom = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      position = Math.min(bottom, position + speed * elapsed / 1000);
      window.scrollTo({ top: position, behavior: 'instant' });
      if (position >= bottom) { stop(); return; }
    }
    window.requestAnimationFrame(step);
  }
  window.requestAnimationFrame(step);
};

// La galerie conserve ses images en grille si JavaScript est désactivé.
const gallery = document.querySelector('.gallery');
if (gallery) {
  const photos = [...gallery.querySelectorAll('img')];
  const slides = photos.map((photo, index) => {
    const slide = document.createElement('button');
    slide.type = 'button';
    slide.className = 'coverflow-slide';
    slide.setAttribute('aria-label', `Afficher la photo ${index + 1} : ${photo.alt}`);
    gallery.append(slide);
    slide.append(photo);
    slide.addEventListener('click', () => select(index));
    return slide;
  });
  gallery.classList.add('coverflow');
  gallery.setAttribute('role', 'region');
  gallery.setAttribute('aria-roledescription', 'carrousel');
  gallery.setAttribute('aria-label', 'Galerie photos du couple');
  gallery.tabIndex = 0;
  const stage = document.createElement('div');
  stage.className = 'coverflow-stage';
  gallery.before(stage);
  stage.append(gallery);
  const controls = document.createElement('div');
  controls.className = 'coverflow-controls';
  const previous = document.createElement('button');
  previous.type = 'button';
  previous.className = 'gallery-arrow gallery-previous';
  previous.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14 6-6 6 6 6"/></svg>';
  previous.setAttribute('aria-label', 'Photo précédente');
  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'gallery-arrow gallery-next';
  next.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 6 6 6-6 6"/></svg>';
  next.setAttribute('aria-label', 'Photo suivante');
  const dots = document.createElement('div');
  dots.className = 'gallery-dots';
  dots.setAttribute('role', 'group');
  dots.setAttribute('aria-label', 'Choisir une photo');
  const indicators = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery-dot';
    dot.setAttribute('aria-label', `Afficher la photo ${index + 1}`);
    dot.addEventListener('click', () => select(index));
    dots.append(dot);
    return dot;
  });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let automatic = !reducedMotion.matches;
  const rotation = document.createElement('button');
  rotation.type = 'button';
  rotation.className = 'gallery-rotation';
  function updateRotation() {
    rotation.textContent = automatic ? 'Ⅱ' : '▷';
    rotation.setAttribute('aria-label', automatic ? 'Mettre le défilement en pause' : 'Reprendre le défilement');
  }
  rotation.addEventListener('click', () => { automatic = !automatic; updateRotation(); });
  reducedMotion.addEventListener('change', () => { automatic = !reducedMotion.matches; updateRotation(); });
  updateRotation();
  controls.append(dots, rotation);
  stage.append(previous, next);
  stage.after(controls);
  let active = 0;
  function select(index) {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      let offset = (i - active + slides.length) % slides.length;
      if (offset > slides.length / 2) offset -= slides.length;
      slide.style.setProperty('--offset', offset);
      slide.style.setProperty('--distance', Math.abs(offset));
      slide.style.setProperty('--rotation', `${offset === 0 ? 0 : offset > 0 ? -42 : 42}deg`);
      slide.style.zIndex = String(slides.length - Math.abs(offset));
      slide.classList.toggle('is-active', i === active);
      slide.setAttribute('aria-pressed', String(i === active));
      slide.tabIndex = i === active ? 0 : -1;
    });
    indicators.forEach((dot, index) => {
      dot.classList.toggle('is-active', index === active);
      dot.setAttribute('aria-pressed', String(index === active));
    });
  }
  previous.addEventListener('click', () => select(active - 1));
  next.addEventListener('click', () => select(active + 1));
  gallery.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    select(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1));
    slides[active].focus({ preventScroll: true });
  });
  let touchStart = null;
  gallery.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  gallery.addEventListener('touchend', event => {
    if (!touchStart) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) select(active + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  gallery.addEventListener('touchcancel', () => { touchStart = null; });
  if (slides.length) select(0);
  const section = gallery.closest('.gallery-section');
  let touching = false;
  section.addEventListener('touchstart', () => { touching = true; }, { passive: true });
  ['touchend', 'touchcancel'].forEach(type => section.addEventListener(type, () => { touching = false; }, { passive: true }));
  // Une photo par seconde, uniquement quand la galerie est visible et disponible.
  setInterval(() => {
    if (!automatic || slides.length < 2 || document.hidden || touching || section.contains(document.activeElement)) return;
    if (window.matchMedia('(hover: hover)').matches && section.matches(':hover')) return;
    const bounds = gallery.getBoundingClientRect();
    if (bounds.height && bounds.top < window.innerHeight && bounds.bottom > 0) select(active + 1);
  }, 1000);
}

// Réception à 18 h au Québec, indépendamment du fuseau du visiteur.
const receptionCountdown = document.getElementById('receptionCountdown');
const mainCountdown = document.getElementById('countdown');
if (receptionCountdown || mainCountdown) {
  const receptionDate = new Date('2027-01-16T18:00:00-05:00');
  function updateReceptionCountdown() {
    const remaining = Math.max(0, Math.floor((receptionDate - new Date()) / 1000));
    if (!remaining) {
      if (receptionCountdown) receptionCountdown.textContent = 'La réception a commencé !';
      if (mainCountdown) mainCountdown.textContent = 'La réception a commencé !';
      return;
    }
    const days = Math.floor(remaining / 86400);
    const hours = Math.floor(remaining % 86400 / 3600);
    const minutes = Math.floor(remaining % 3600 / 60);
    const seconds = remaining % 60;
    if (receptionCountdown) receptionCountdown.textContent = `${days} jours ${hours} heures ${minutes} min ${seconds} sec`;
    if (mainCountdown) mainCountdown.innerHTML = [[days, 'JOURS'], [hours, 'HEURES'], [minutes, 'MINUTES'], [seconds, 'SECONDES']].map(([value, label]) => `<div class="count"><strong>${value}</strong><span>${label}</span></div>`).join('');
  }
  updateReceptionCountdown();
  setInterval(updateReceptionCountdown, 1000);
}

// Apparition douce des sections au défilement.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('section.content').forEach(section => {
    section.classList.add('reveal-section');
    observer.observe(section);
  });
}
