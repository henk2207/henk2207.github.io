document.documentElement.classList.add('motion-ready');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionTargets = [
  ...document.querySelectorAll('.statement-grid > *, .section-heading > *, .project-shell, .ecosystem-heading > *, .module, .skill-grid article, .journey-intro, .timeline li, .lesson-grid article, .contact > *')
];

motionTargets.forEach((element, index) => {
  element.classList.add('motion-item');
  element.style.setProperty('--motion-delay', `${(index % 4) * 70}ms`);
});

if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
  motionTargets.forEach((element) => revealObserver.observe(element));
} else {
  motionTargets.forEach((element) => element.classList.add('motion-visible'));
}

const progressBar = document.querySelector('.scroll-progress span');
const timeline = document.querySelector('.timeline');

function updateScrollEffects() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.min(progress * 100, 100)}%`;
  document.querySelector('.site-header').classList.toggle('is-scrolled', window.scrollY > 40);

  if (timeline) {
    const rect = timeline.getBoundingClientRect();
    const travelled = Math.min(Math.max(window.innerHeight * 0.65 - rect.top, 0), rect.height);
    timeline.style.setProperty('--timeline-progress', `${(travelled / rect.height) * 100}%`);
  }
}

window.addEventListener('scroll', updateScrollEffects, { passive: true });
updateScrollEffects();

if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  const heroVisual = document.querySelector('.hero-visual');
  document.querySelector('.hero').addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    heroVisual.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  document.querySelectorAll('.module').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
      const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('#site-nav a')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { threshold: [0.25, 0.55] });
  sections.forEach((section) => sectionObserver.observe(section));
}
