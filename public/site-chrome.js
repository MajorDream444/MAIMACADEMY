// Shared site chrome: mobile menu toggle and the founding-cohort card.
(function () {
  var btn = document.querySelector('.mc-menu');
  var links = document.getElementById('mc-links');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('mc-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
  }
  var teaser = document.querySelector('.mc-teaser video');
  if (teaser && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    teaser.removeAttribute('autoplay'); teaser.pause();
  } else if (teaser) {
    var go = teaser.play && teaser.play(); if (go && go.catch) go.catch(function () {});
  }
  var card = document.getElementById('mc-cohort');
  if (!card) return;
  var KEY = 'maim-cohort-dismissed';
  try { if (localStorage.getItem(KEY) === '1') return; } catch (e) {}
  var start = Date.parse(card.getAttribute('data-start'));
  function tick() {
    var ms = Math.max(0, start - Date.now());
    var d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60;
    card.querySelector('[data-d]').textContent = d;
    card.querySelector('[data-h]').textContent = h;
    card.querySelector('[data-m]').textContent = m;
  }
  tick(); setInterval(tick, 30000);
  card.hidden = false;
  function show() { card.classList.add('mc-in'); }
  // One call to action at a time: where the hero teaser is on screen, the
  // card waits until the teaser scrolls away; everywhere else it comes in at 2s.
  var hero = document.querySelector('.mc-teaser');
  if (hero && 'IntersectionObserver' in window) {
    var seen = false;
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (!e.isIntersecting && seen) show(); if (e.isIntersecting) seen = true; });
    }).observe(hero);
  } else {
    setTimeout(show, 2000);
  }
  card.querySelector('.mc-x').addEventListener('click', function () {
    card.classList.remove('mc-in');
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    setTimeout(function () { card.hidden = true; }, 450);
  });
})();
