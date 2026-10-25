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
  // Finite, optional crest reveal. Default HTML remains fully visible without JS.
  var stage = document.querySelector('[data-academy-motion]');
  if (stage && stage.animate) {
    var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    var controls = stage.querySelector('.academy-motion-controls');
    var pause = stage.querySelector('[data-motion-pause]');
    var replay = stage.querySelector('[data-motion-replay]');
    var status = stage.querySelector('[data-motion-status]');
    var animations = [], userPaused = false, visible = true;
    function sync() {
      animations.forEach(function (a) {
        if (a.playState !== 'finished') {
          if (userPaused || !visible || document.hidden) a.pause(); else a.play();
        }
      });
      pause.textContent = userPaused ? 'Resume graphic' : 'Pause graphic';
    }
    function start() {
      animations.forEach(function (a) { a.cancel(); });
      animations = []; userPaused = false;
      controls.hidden = preference.matches;
      if (preference.matches) return;
      pause.disabled = false; status.textContent = '';
      animations.push(stage.querySelector('.academy-crest').animate([
        { opacity: 0, transform: 'scale(.94)' },
        { opacity: 1, transform: 'scale(1)' }
      ], { duration: 1800, easing: 'cubic-bezier(.2,.7,.2,1)' }));
      stage.querySelectorAll('.academy-triad i').forEach(function (bar, index) {
        animations.push(bar.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
          { duration: 700, delay: 600 + index * 220, fill: 'backwards', easing: 'ease-out' }));
      });
      animations[0].onfinish = function () { pause.disabled = true; status.textContent = 'Graphic complete.'; };
      sync();
    }
    pause.addEventListener('click', function () { userPaused = !userPaused; sync(); });
    replay.addEventListener('click', start);
    preference.addEventListener('change', start);
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting; sync();
    }).observe(stage);
    start();
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
