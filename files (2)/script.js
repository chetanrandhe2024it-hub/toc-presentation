(() => {
  const slides = [...document.querySelectorAll('.slide')];
  const dotsBox = document.getElementById('dots');
  const counter = document.getElementById('counter');
  const bar = document.querySelector('#progress i');
  let current = 0;

  // Stagger delays for reveal items and edge-draw order
  slides.forEach(s => {
    s.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--r', i));
    s.querySelectorAll('.edge').forEach((el, i) => {
      const len = el.getTotalLength ? Math.ceil(el.getTotalLength()) + 2 : 400;
      el.style.setProperty('--len', len);
      el.style.setProperty('--i', i);
    });
  });

  // Dots
  slides.forEach((s, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', `Go to slide ${i + 1}: ${s.dataset.title || ''}`);
    b.title = s.dataset.title || `Slide ${i + 1}`;
    b.addEventListener('click', () => go(i));
    dotsBox.appendChild(b);
  });

  function go(n) {
    n = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('past', i < n);
    });
    [...dotsBox.children].forEach((d, i) => d.classList.toggle('on', i === n));
    counter.textContent = `${n + 1} / ${slides.length}`;
    bar.style.width = ((n + 1) / slides.length * 100) + '%';
    current = n;
    history.replaceState(null, '', '#' + (n + 1));
  }

  document.getElementById('next').addEventListener('click', () => go(current + 1));
  document.getElementById('prev').addEventListener('click', () => go(current - 1));

  document.addEventListener('keydown', e => {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); go(current + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); go(current - 1); }
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(slides.length - 1);
    else if (e.key === 'f' || e.key === 'F') {
      document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.();
    }
  });

  // Touch swipe
  let x0 = null;
  document.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  // Start from URL hash (#3 opens slide 3)
  const start = parseInt(location.hash.slice(1), 10);
  go(Number.isFinite(start) ? start - 1 : 0);
})();
