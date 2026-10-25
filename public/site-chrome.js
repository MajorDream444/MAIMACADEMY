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
  // Progressive enhancement: the original crest remains visible without JS.
  var stage = document.querySelector('[data-academy-motion]');
  if (stage && stage.animate) {
    var preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    var controls = stage.querySelector('.academy-motion-controls');
    var pause = stage.querySelector('[data-motion-pause]');
    var replay = stage.querySelector('[data-motion-replay]');
    var status = stage.querySelector('[data-motion-status]');
    var crest = stage.querySelector('.academy-crest');
    var space = document.createElement('div'); space.className = 'crest-space';
    var tilt = document.createElement('div'); tilt.className = 'crest-tilt';
    var medallion = document.createElement('div'); medallion.className = 'crest-medallion';
    crest.before(space); space.append(tilt); tilt.append(medallion); medallion.append(crest);
    var pieces = [];
    for (var n = 0; n < 8; n++) {
      var piece = document.createElement('span');
      piece.className = 'crest-piece crest-piece-' + n;
      piece.setAttribute('aria-hidden', 'true'); medallion.append(piece); pieces.push(piece);
    }
    var sheen = document.createElement('span'); sheen.className = 'crest-sheen';
    sheen.setAttribute('aria-hidden', 'true'); medallion.append(sheen);
    var light = document.createElement('span'); light.className = 'crest-light'; sheen.append(light);
    var animations = [], userPaused = false, visible = true;
    function resetTilt() { tilt.style.transform = ''; }
    function sync() {
      animations.forEach(function (a) {
        if (a.playState !== 'finished') {
          if (userPaused || !visible || document.hidden) a.pause(); else a.play();
        }
      });
      if (userPaused || !visible || document.hidden) resetTilt();
      pause.textContent = userPaused ? 'Resume graphic' : 'Pause graphic';
    }
    function motion(element, frames, timing) {
      var animation = element.animate(frames, timing); animations.push(animation); return animation;
    }
    function start() {
      animations.forEach(function (a) { a.cancel(); });
      animations = []; userPaused = false; resetTilt();
      controls.hidden = preference.matches;
      if (preference.matches) { status.textContent = ''; return; }
      status.textContent = '';
      var origins = [[-55,-65],[55,-65],[75,-30],[75,40],[45,70],[-45,70],[-75,35],[-75,-35]];
      pieces.forEach(function (piece, index) {
        var origin = origins[index];
        motion(piece, [
          { opacity: 0, transform: 'translate3d(' + origin[0] + 'px,' + origin[1] + 'px,-100px) rotate(' + (index % 2 ? 9 : -9) + 'deg)' },
          { opacity: 1, offset: .22, transform: 'translate3d(' + origin[0] * .7 + 'px,' + origin[1] * .7 + 'px,-55px) rotate(' + (index % 2 ? 5 : -5) + 'deg)' },
          { opacity: 1, offset: .85, transform: 'translate3d(0,0,0) rotate(0deg)' },
          { opacity: 0, transform: 'translate3d(0,0,0) rotate(0deg)' }
        ], { duration: 1900, delay: index * 65, fill: 'both', easing: 'cubic-bezier(.2,.7,.2,1)' });
      });
      var joined = motion(crest, [{ opacity: 0 }, { opacity: 1 }],
        { duration: 350, delay: 1750, fill: 'both' });
      joined.onfinish = function () { status.textContent = 'Crest assembled.'; };
      // Four restrained cycles, then still; pointer interaction remains available.
      motion(medallion, [
        { transform: 'translateY(0) rotateZ(0deg)' },
        { transform: 'translateY(-6px) rotateZ(.6deg)', offset: .5 },
        { transform: 'translateY(0) rotateZ(0deg)' }
      ], { duration: 8000, delay: 2200, iterations: 4, easing: 'ease-in-out' });
      motion(light, [
        { opacity: 0, transform: 'translateX(-125%) skewX(-18deg)' },
        { opacity: 0, transform: 'translateX(-125%) skewX(-18deg)', offset: .1 },
        { opacity: .42, transform: 'translateX(0) skewX(-18deg)', offset: .24 },
        { opacity: 0, transform: 'translateX(125%) skewX(-18deg)', offset: .4 },
        { opacity: 0, transform: 'translateX(125%) skewX(-18deg)' }
      ], { duration: 8000, delay: 2200, iterations: 4 });
      stage.querySelectorAll('.academy-triad i').forEach(function (bar, index) {
        motion(bar, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
          { duration: 700, delay: 1200 + index * 180, fill: 'backwards', easing: 'ease-out' });
      });
      sync();
    }
    space.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch' || preference.matches || userPaused || !visible || document.hidden) return;
      var bounds = space.getBoundingClientRect();
      var x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      var y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      tilt.style.transform = 'rotateX(' + (-y * 7) + 'deg) rotateY(' + (x * 9) + 'deg)';
    });
    space.addEventListener('pointerleave', resetTilt);
    space.addEventListener('pointercancel', resetTilt);
    pause.addEventListener('click', function () { userPaused = !userPaused; sync(); });
    replay.addEventListener('click', start);
    preference.addEventListener('change', start);
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting; sync();
    }).observe(space);
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
