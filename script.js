/* =====================================================
   EDIT BAGIAN INI SAJA
   ===================================================== */
var CONFIG = {
  teacher:   "Sir Ang",   // contoh: "Bu Sari"
  sender:    "Totot, Xenon, Darrel",
  className: "",

  // false = animasi SELALU jalan (disarankan).
  // true  = animasi dimatikan kalau HP diatur "Hapus animasi" / mode hemat daya.
  respectReducedMotion: false,

  // Efek suara kecil (dibuat dari kode, bukan file). Ada tombol 🔊 di pojok kanan atas.
  sound: true,

  // Video prank. Ada 2 pilihan:
  // 1) Pakai file video sendiri (berjalan walau file dibuka langsung dari HP/laptop):
  //    taruh file di folder "video", lalu isi, mis. "video/prank.mp4"
  // 2) Kosongkan "" untuk memakai YouTube (butuh internet dan halaman harus online,
  //    mis. lewat GitHub Pages; kalau dibuka langsung dari file, tampil tombol ke YouTube)
  localVideo: "",
  youtubeIds: ["dQw4w9WgXcQ"],

  // Teks loading palsu. {guru} otomatis diganti nama wali kelas.
  loadingMessages: [
    "Menyiapkan hadiah…",
    "Membungkus hadiah pakai pita…",
    "Memeriksa apakah Sir Ang sudah sarapan…",
    "Menghitung PR yang belum dikumpulkan…",
    "Menghapus alasan telat kami…",
    "Hampir selesai…"
  ],

  // Teks papan tulis. emoji = stiker setelah kalimat selesai, shake = layar bergetar
  jokes: [
    { text: "Tenang Sir Ang, ini bukan prank terakhir kok. 😎", emoji: "😎" },
    { text: "Eh bercanda... hadiahnya yang asli ada di bawah. 🤭", emoji: "🤭", shake: true },
    { text: "Maaf ya, kelas kami memang nakal. 😅", emoji: "🙏" },
    { text: "Kalau ada yang bilang kami murid sempurna, itu hoaks wkwkwk 🤣", emoji: "🤣", shake: true },
    { text: "Tapi serius, habis ini siap-siap baper ya. 🥹", emoji: "🥹" }
  ],

  // Isi surat (satu item = satu paragraf)
  letter: [
    "Terima kasih sudah menjadi wali kelas yang sabar membimbing kami, bukan hanya di pelajaran, tapi juga saat kami sedang bingung dan salah arah.",
    "Maaf kalau selama ini kami sering ribut, telat, nakal, atau bikin sir pusing. Di balik itu semua, kami tahu perhatian dan nasihat sir selalu untuk kebaikan kami.",
    "Semoga sir selalu sehat, bahagia, dan dimudahkan urusannya. Ilmu dan kebaikan yang diberikan akan kami bawa terus. Selamat Hari Guru! 💛"
  ],

  // Foto: taruh file di folder "photos" lalu sesuaikan nama dan caption.
  photos: [
    { src: "images/Sir_Ang_Aib1.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib2.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib3.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib4.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib5.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib6.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib7.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib8.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib9.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib10.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Aib11.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Keren1.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Keren2.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Keren3.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_Keren4.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_OSN1.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_OSN2.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_OSN3.png",  caption: "Piket bareng" },
    { src: "images/Sir_Ang_OSN4.png",  caption: "Piket bareng" },
    { src: "Foto_XID1.png",  caption: "Piket bareng" },
    { src: "Foto_XID2.png",  caption: "Piket bareng" },
  ]
};
/* ===================================================== */

var reduceMotion = !!CONFIG.respectReducedMotion &&
  !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
if (reduceMotion) document.documentElement.classList.add('calm');

var $ = function (id) { return document.getElementById(id); };
var esc = function (s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
};
var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
var rand = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
var fillName = function (s) { return String(s).split('{guru}').join(CONFIG.teacher); };

var timers = [];
var runId = 0;
var current = 1;
var busy = false;
var TOTAL_SCENES = 7;

function later(fn, ms) {
  var id = setTimeout(fn, ms);
  timers.push(id);
  return id;
}

/* =====================================================
   Efek suara kecil (WebAudio, tanpa file)
   ===================================================== */
var audioCtx = null;
var soundOn = !!CONFIG.sound;

function ac() {
  if (!soundOn) return null;
  try {
    if (!audioCtx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      audioCtx = new C();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch (e) { return null; }
}
function tone(freq, start, dur, type, vol) {
  var c = ac();
  if (!c) return;
  try {
    var o = c.createOscillator();
    var g = c.createGain();
    var t = c.currentTime + start;
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.1, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  } catch (e) {}
}
var sfx = {
  tap: function () { tone(520, 0, 0.08, 'triangle', 0.07); },
  pop: function () { tone(680, 0, 0.07, 'square', 0.05); tone(900, 0.06, 0.09, 'square', 0.04); },
  boing: function () { tone(260, 0, 0.12, 'sawtooth', 0.07); tone(420, 0.1, 0.15, 'sawtooth', 0.07); },
  error: function () { tone(220, 0, 0.18, 'sawtooth', 0.09); tone(160, 0.2, 0.3, 'sawtooth', 0.09); },
  laugh: function () { for (var i = 0; i < 7; i++) tone(560 + (i % 2) * 140, i * 0.09, 0.07, 'square', 0.04); },
  tada: function () {
    [523, 659, 784, 1047].forEach(function (f, i) { tone(f, i * 0.12, 0.28, 'triangle', 0.1); });
    tone(1319, 0.5, 0.5, 'triangle', 0.1);
  }
};
$('soundBtn').textContent = soundOn ? '🔊' : '🔇';
$('soundBtn').addEventListener('click', function () {
  soundOn = !soundOn;
  $('soundBtn').textContent = soundOn ? '🔊' : '🔇';
  if (soundOn) sfx.pop();
});
document.addEventListener('click', function (e) {
  if (e.target.closest && e.target.closest('button') && e.target.id !== 'soundBtn') sfx.tap();
});

/* =====================================================
   FX: confetti, kembang api, sparkle (canvas)
   ===================================================== */
var fx = $('fx');
var ctx = fx.getContext('2d');
var W = 0, H = 0, parts = [], raf = null;
var COLORS = ['#c0563a', '#e8893a', '#f4c542', '#fffdf8', '#2f4a3e', '#e56b6f'];

function resizeFx() {
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = window.innerWidth;
  H = window.innerHeight;
  fx.width = W * dpr;
  fx.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeFx);
resizeFx();

function addPart(p) {
  if (reduceMotion || parts.length > 700) return;
  parts.push(p);
  if (!raf) raf = requestAnimationFrame(tick);
}

function confetti(x, y, n, o) {
  o = o || {};
  var angle = o.angle !== undefined ? o.angle : -90;
  var spread = o.spread || 70;
  var speed = o.speed || 11;
  for (var i = 0; i < (n || 40); i++) {
    var a = (angle + (Math.random() - 0.5) * spread) * Math.PI / 180;
    var s = speed * (0.5 + Math.random());
    addPart({
      k: 'rect', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.28, drag: 0.985,
      rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6, h: 8 + Math.random() * 8,
      c: rand(COLORS), life: 1, decay: 0.005 + Math.random() * 0.006
    });
  }
}

function emojiBurst(x, y, list, n) {
  for (var i = 0; i < (n || 10); i++) {
    var a = (-90 + (Math.random() - 0.5) * 140) * Math.PI / 180;
    var s = 5 + Math.random() * 9;
    addPart({
      k: 'emoji', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.22, drag: 0.985,
      e: rand(list), size: 20 + Math.random() * 22,
      rot: 0, vr: (Math.random() - 0.5) * 0.2, life: 1, decay: 0.008 + Math.random() * 0.006
    });
  }
}

function firework(x, y) {
  var c = rand(COLORS);
  var n = 48;
  for (var i = 0; i < n; i++) {
    var a = (i / n) * Math.PI * 2;
    var s = 3 + Math.random() * 4.5;
    addPart({
      k: 'spark', x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 0.07, drag: 0.968,
      r: 2 + Math.random() * 2, c: Math.random() > 0.3 ? c : '#fff', life: 1, decay: 0.014
    });
  }
}

function sparkle(x, y) {
  addPart({
    k: 'spark', x: x, y: y, vx: (Math.random() - 0.5) * 1.6, vy: (Math.random() - 0.5) * 1.6 - 0.4,
    g: 0.02, drag: 0.96, r: 2 + Math.random() * 2.5,
    c: rand(['#f4c542', '#e8893a', '#ffffff']), life: 1, decay: 0.03
  });
}

function tick() {
  ctx.clearRect(0, 0, W, H);
  parts = parts.filter(function (p) { return p.life > 0 && p.y < H + 60; });
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    p.vx *= p.drag; p.vy = p.vy * p.drag + p.g;
    p.x += p.vx; p.y += p.vy;
    p.life -= p.decay;
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
    if (p.k === 'rect') {
      p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    } else if (p.k === 'emoji') {
      p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.font = p.size + 'px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(p.e, 0, 0);
      ctx.restore();
    } else {
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
  }
  ctx.globalAlpha = 1;
  raf = parts.length ? requestAnimationFrame(tick) : null;
  if (!parts.length) ctx.clearRect(0, 0, W, H);
}

// Teks lucu yang melayang
var WK = ['WKWKWK', 'HEHEHE', 'HAHAHA', 'CIEEE', 'MANTUL', 'YEAYY', 'ASIK', 'UHUY', 'WKWKWKWK', 'AWOKAWOK'];
function wkPop(text, x, y) {
  if (reduceMotion) return;
  var el = document.createElement('span');
  el.className = 'wk';
  el.textContent = text || rand(WK);
  var px = x !== undefined ? x : 10 + Math.random() * Math.max(10, W - 190);
  var py = y !== undefined ? y : H * 0.12 + Math.random() * H * 0.65;
  el.style.left = Math.max(6, Math.min(px, W - 170)) + 'px';
  el.style.top = py + 'px';
  el.style.setProperty('--rot', (Math.random() * 30 - 15).toFixed(0) + 'deg');
  $('popLayer').appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 2300);
}
setInterval(function () {
  if (current >= 2 && current <= 5 && !document.hidden) wkPop();
}, 2600);

// Jejak sparkle saat jari/kursor bergerak, dan ledakan kecil saat ketuk
var lastSpark = 0;
window.addEventListener('pointermove', function (e) {
  var t = performance.now();
  if (t - lastSpark > 45) { lastSpark = t; sparkle(e.clientX, e.clientY); }
}, { passive: true });

window.addEventListener('pointerdown', function (e) {
  ac(); // membuka izin audio dari sentuhan pertama
  for (var i = 0; i < 8; i++) sparkle(e.clientX, e.clientY);
  if (current === 7 && !(e.target.closest && e.target.closest('button, a'))) firework(e.clientX, e.clientY);
}, { passive: true });

function centerOf(el) {
  var r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

function shakeScene() {
  if (reduceMotion) return;
  var s = document.querySelector('.scene.active');
  if (!s || !s.animate) return;
  s.animate([
    { transform: 'translate(0,0)' },
    { transform: 'translate(-12px,5px) rotate(-1deg)' },
    { transform: 'translate(10px,-6px) rotate(1deg)' },
    { transform: 'translate(-8px,4px)' },
    { transform: 'translate(6px,-3px)' },
    { transform: 'translate(0,0)' }
  ], { duration: 520, easing: 'ease-in-out' });
}

/* =====================================================
   Latar belakang melayang + indikator scene
   ===================================================== */
(function buildBackground() {
  if (reduceMotion) return;
  var bg = $('bg');
  var icons = ['🍎', '✏️', '📚', '⭐', '💛', '🎈', '📏', '🔔', '🧡', '🤣', '🎉'];
  var n = window.innerWidth > 900 ? 30 : 16;
  for (var i = 0; i < n; i++) {
    var s = document.createElement('span');
    s.textContent = rand(icons);
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = (20 + Math.random() * 26) + 'px';
    s.style.setProperty('--r', (Math.random() * 360 - 180) + 'deg');
    s.style.animationDuration = (16 + Math.random() * 16) + 's';
    s.style.animationDelay = (-Math.random() * 30) + 's';
    bg.appendChild(s);
  }
})();

var dotsEl = $('dots');
for (var di = 1; di <= TOTAL_SCENES; di++) dotsEl.appendChild(document.createElement('i'));
function updateDots() {
  for (var i = 0; i < dotsEl.children.length; i++) {
    var d = dotsEl.children[i];
    d.className = (i + 1 < current) ? 'done' : ((i + 1 === current) ? 'on' : '');
  }
}
updateDots();

/* =====================================================
   Isi teks dinamis
   ===================================================== */
Array.prototype.forEach.call(document.querySelectorAll('[data-bind]'), function (el) {
  var v = CONFIG[el.getAttribute('data-bind')];
  el.textContent = v === undefined ? '' : v;
});
$('ytLink').href = 'https://www.youtube.com/watch?v=' + CONFIG.youtubeIds[0];
if (CONFIG.localVideo) $('ytLink').classList.add('hidden');
$('letterTo').textContent = 'Kepada ' + CONFIG.teacher + ',';
$('letterBody').innerHTML = CONFIG.letter.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('');
$('letterSign').innerHTML = 'Dengan hormat,<br>' + esc(CONFIG.sender) + '<small>' + esc(CONFIG.className) + '</small>';

/* =====================================================
   Pindah scene (tirai transisi)
   ===================================================== */
var curtain = $('curtain');
var cdTimer = null;

function goTo(n, opt) {
  if (busy) return;
  var instant = !!(opt && opt.instant);
  var swap = function () {
    var all = document.querySelectorAll('.scene');
    for (var i = 0; i < all.length; i++) all[i].classList.remove('active');
    $('s' + n).classList.add('active');
    current = n;
    updateDots();
    window.scrollTo(0, 0);
    onEnter(n);
  };
  if (instant || reduceMotion) { swap(); return; }
  busy = true;
  curtain.classList.remove('run');
  void curtain.offsetWidth;
  curtain.classList.add('run');
  later(swap, 450);
  later(function () { curtain.classList.remove('run'); busy = false; }, 950);
}

function onEnter(n) {
  if (n !== 1) { clearInterval(cdTimer); cdTimer = null; }
  if (n === 1) startCountdown();
  if (n === 2) runLoader();
  if (n === 4) runJokes();
  if (n === 7) startFinale();
}

/* =====================================================
   Scene 1: umpan + tombol "Nanti saja" yang kabur
   ===================================================== */
function startCountdown() {
  clearInterval(cdTimer);
  var cd = 30;
  var render = function () { $('countdown').textContent = '00:' + String(cd).padStart(2, '0'); };
  render();
  cdTimer = setInterval(function () { cd = cd <= 1 ? 30 : cd - 1; render(); }, 1000);
}
startCountdown();

$('gift').addEventListener('click', function () {
  var g = $('gift');
  if (g.animate && !reduceMotion) {
    g.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.4) rotate(12deg)' }, { transform: 'scale(1)' }], { duration: 350 });
  }
  var c = centerOf(g);
  emojiBurst(c.x, c.y, ['🎁', '✨', '🎉'], 6);
  sfx.pop();
});

var dodgeCount = 0;
var dodgeBtn = $('dodge');
var dodgeMsgs = [
  'Eh, tombolnya kabur 😝',
  'Gak bisa nolak wkwk',
  'Hadiah tidak boleh ditolak! 🤣',
  'Tombolnya capek lari 😮‍💨',
  'Yakin masih mau nolak? 😏',
  'Ya sudah, tombolnya menyerah 🏳️'
];
function resetDodge() {
  dodgeCount = 0;
  dodgeBtn.removeAttribute('data-give');
  dodgeBtn.textContent = 'Nanti saja';
  dodgeBtn.style.transform = '';
  $('dodgeMsg').textContent = 'Ketuk untuk membuka';
}
function dodge(e) {
  if (current !== 1 || dodgeBtn.getAttribute('data-give')) return;
  if (e && e.cancelable) e.preventDefault();
  dodgeCount++;
  $('dodgeMsg').textContent = dodgeMsgs[Math.min(dodgeCount - 1, dodgeMsgs.length - 1)];
  sfx.boing();
  if (dodgeCount >= 6) {
    dodgeBtn.setAttribute('data-give', '1');
    dodgeBtn.textContent = 'Ya sudah, buka deh 😅';
    dodgeBtn.style.transform = '';
    wkPop('WKWKWK');
    return;
  }
  var dx = (Math.random() * 2 - 1) * 100;
  var dy = (Math.random() * 2 - 1) * 60;
  dodgeBtn.style.transform = 'translate(' + dx.toFixed(0) + 'px,' + dy.toFixed(0) + 'px) rotate(' + (Math.random() * 24 - 12).toFixed(0) + 'deg)';
  if (dodgeCount % 2 === 0) wkPop(rand(WK));
}
dodgeBtn.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') dodge(e); });
dodgeBtn.addEventListener('touchstart', function (e) { dodge(e); }, { passive: false });
dodgeBtn.addEventListener('click', function (e) {
  if (dodgeBtn.getAttribute('data-give')) openGift(); else dodge(e);
});

function openGift() {
  if (current !== 1) return;
  var c = centerOf($('openGift'));
  confetti(c.x, c.y, 50, { angle: -90, spread: 120, speed: 12 });
  emojiBurst(c.x, c.y, ['🎁', '✨', '🎉'], 10);
  sfx.pop();
  goTo(2);
}
$('openGift').addEventListener('click', openGift);

/* =====================================================
   Scene 2: loading palsu, macet di 99%, lalu error
   ===================================================== */
function runLoader() {
  var fill = $('barFill'), pct = $('barPct'), msg = $('barMsg');
  var msgs = CONFIG.loadingMessages.map(fillName);
  var p = 0;
  $('errBox').classList.add('hidden');

  function render() {
    var v = Math.floor(p);
    fill.style.width = v + '%';
    pct.textContent = v + '%';
    msg.textContent = msgs[Math.min(msgs.length - 1, Math.floor(v / 100 * msgs.length))];
  }
  function step() {
    if (current !== 2) return;
    p += 2 + Math.random() * 5;
    if (p >= 99) {
      p = 99; render();
      later(showLoadError, 1500);
      return;
    }
    render();
    later(step, 170);
  }
  render();
  later(step, 400);
}

function showLoadError() {
  if (current !== 2) return;
  $('barMsg').textContent = 'Hadiahnya… hilang? 😳';
  $('errBox').classList.remove('hidden');
  sfx.error();
  shakeScene();
  var c = centerOf($('errBox'));
  emojiBurst(c.x, c.y, ['😭', '🤣', '💀'], 10);
  wkPop('WKWKWK');
}

$('retry').addEventListener('click', function () {
  if (current !== 2) return;
  var c = centerOf($('retry'));
  goTo(3, { instant: true });
  startVideo(); // dibuat tepat di dalam ketukan supaya autoplay diizinkan
  confetti(c.x, c.y, 60, { angle: -90, spread: 120, speed: 13 });
  emojiBurst(c.x, c.y, ['🤡', '😆', '🎵', '🕺', '🎶', '🤣'], 14);
  sfx.laugh();
  shakeScene();
  later(function () {
    var b = $('skipPrank');
    b.classList.remove('hidden');
    b.classList.add('fade-in');
  }, 5000);
});

/* =====================================================
   Scene 3: video prank (file sendiri atau YouTube)
   ===================================================== */
var ytPlayer = null, ytFrame = null, ytReady = false, ytStarted = false;
var videoActive = false, videoIdx = 0, localVid = null;

function loadYouTubeApi() {
  if (CONFIG.localVideo) return;
  if (document.getElementById('yt-api') || window.location.protocol === 'file:') return;
  var s = document.createElement('script');
  s.id = 'yt-api';
  s.async = true;
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
}
window.onYouTubeIframeAPIReady = function () {
  ytReady = true;
  if (videoActive && ytFrame && !ytPlayer) attachPlayer(ytFrame);
};
loadYouTubeApi();

function embedUrl(id) {
  var q = 'autoplay=1&playsinline=1&rel=0&enablejsapi=1&modestbranding=1';
  if (window.location.protocol.indexOf('http') === 0) q += '&origin=' + encodeURIComponent(window.location.origin);
  return 'https://www.youtube.com/embed/' + id + '?' + q;
}

function showFallback(reason) {
  var id = CONFIG.youtubeIds[Math.min(videoIdx, CONFIG.youtubeIds.length - 1)];
  var box = $('videoFallback');
  box.style.backgroundImage = 'url(https://img.youtube.com/vi/' + id + '/hqdefault.jpg)';
  $('fbText').textContent = reason === 'file'
    ? 'Video YouTube tidak bisa diputar di dalam halaman kalau file dibuka langsung. Ketuk tombol di bawah untuk menontonnya.'
    : 'Videonya tidak bisa diputar di dalam halaman ini. Ketuk tombol di bawah.';
  $('fbLink').href = 'https://www.youtube.com/watch?v=' + id;
  box.classList.remove('hidden');
  $('playOverlay').classList.add('hidden');
}

function attachPlayer(frame) {
  try {
    ytPlayer = new YT.Player(frame, {
      events: {
        onReady: function () {
          try { ytPlayer.playVideo(); } catch (e) {}
          later(function () { if (videoActive && !ytStarted) $('playOverlay').classList.remove('hidden'); }, 2500);
        },
        onStateChange: function (e) {
          if (e.data === 1 || e.data === 3) { ytStarted = true; $('playOverlay').classList.add('hidden'); }
        },
        onAutoplayBlocked: function () { if (videoActive) $('playOverlay').classList.remove('hidden'); },
        onError: function () { tryNextVideo(); }
      }
    });
  } catch (e) { /* tanpa API, iframe tetap jalan sendiri */ }
}

function tryNextVideo() {
  videoIdx++;
  var next = CONFIG.youtubeIds[videoIdx];
  if (next && ytPlayer) {
    try { ytPlayer.loadVideoById(next); return; } catch (e) {}
  }
  showFallback('error');
}

function startVideo() {
  stopVideo();
  videoActive = true;
  videoIdx = 0;
  $('videoFallback').classList.add('hidden');
  $('playOverlay').classList.add('hidden');

  if (CONFIG.localVideo) {
    var v = document.createElement('video');
    v.src = CONFIG.localVideo;
    v.controls = true;
    v.autoplay = true;
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.addEventListener('error', function () { showFallback('error'); });
    $('ytHolder').appendChild(v);
    localVid = v;
    var pr = v.play();
    if (pr && pr.catch) pr.catch(function () { $('playOverlay').classList.remove('hidden'); });
    return;
  }

  if (window.location.protocol === 'file:') { showFallback('file'); return; }

  var f = document.createElement('iframe');
  f.title = 'Video kejutan';
  f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  f.setAttribute('allowfullscreen', '');
  f.referrerPolicy = 'strict-origin-when-cross-origin';
  f.src = embedUrl(CONFIG.youtubeIds[0]);
  $('ytHolder').appendChild(f);
  ytFrame = f;
  if (ytReady && window.YT && YT.Player) attachPlayer(f);
}

function stopVideo() {
  videoActive = false;
  ytStarted = false;
  try { if (localVid) localVid.pause(); } catch (e) {}
  localVid = null;
  try { if (ytPlayer) ytPlayer.destroy(); } catch (e) {}
  ytPlayer = null;
  ytFrame = null;
  $('ytHolder').innerHTML = '';
}

$('playOverlay').addEventListener('click', function () {
  try {
    if (localVid) localVid.play();
    else { ytPlayer.unMute(); ytPlayer.playVideo(); }
  } catch (e) {}
  $('playOverlay').classList.add('hidden');
});

$('skipPrank').addEventListener('click', function () {
  stopVideo();
  goTo(4);
});

/* =====================================================
   Scene 4: papan tulis, ketik, stiker
   ===================================================== */
function popEmoji(box, emoji) {
  var el = document.createElement('span');
  el.className = 'emoji-pop';
  el.textContent = emoji;
  el.style.fontSize = (40 + Math.random() * 30) + 'px';
  el.style.right = (10 + Math.random() * 30) + '%';
  el.style.bottom = (10 + Math.random() * 35) + '%';
  box.appendChild(el);
  setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 2300);
  var c = centerOf(box);
  emojiBurst(c.x, c.y, [emoji, '✨'], 6);
}

async function runJokes() {
  var id = ++runId;
  var box = $('jokes');
  box.innerHTML = '';
  $('nextJokes').classList.add('hidden');

  for (var k = 0; k < CONFIG.jokes.length; k++) {
    var j = CONFIG.jokes[k];
    if (id !== runId) return;
    var line = fillName(j.text);
    var p = document.createElement('p');
    box.appendChild(p);

    if (reduceMotion) {
      p.textContent = line;
    } else {
      p.classList.add('cursor');
      for (var i = 1; i <= line.length; i++) {
        if (id !== runId) return;
        p.textContent = line.slice(0, i);
        await sleep(38);
      }
      p.classList.remove('cursor');
      sfx.pop();
      if (j.emoji) popEmoji(box, j.emoji);
      if (j.shake) { shakeScene(); wkPop(rand(WK)); }
      await sleep(900);
    }
  }
  if (id !== runId) return;
  var c = centerOf(box);
  confetti(c.x, c.y, 40, { angle: -90, spread: 100, speed: 10 });
  var b = $('nextJokes');
  b.classList.remove('hidden');
  b.classList.add('fade-in');
}
$('nextJokes').addEventListener('click', function () { goTo(5); });

/* =====================================================
   Scene 5: amplop & surat
   ===================================================== */
var stage = $('stage');

function prepareLetter() {
  var items = [$('letterTo')];
  for (var i = 0; i < $('letterBody').children.length; i++) items.push($('letterBody').children[i]);
  items.push($('letterSign'));
  items.forEach(function (el, idx) { el.style.setProperty('--i', idx); });
  return items.length;
}
var letterItems = prepareLetter();

function openEnvelope() {
  if (stage.classList.contains('open')) return;
  stage.classList.add('open');
  $('envHint').classList.add('hidden');
  var c = centerOf(stage);
  later(function () { emojiBurst(c.x, c.y - 40, ['💛', '🧡', '❤️', '✨', '🍎'], 16); }, reduceMotion ? 0 : 600);
  later(function () {
    stage.classList.add('gone');
    $('letter').classList.add('show');
    sfx.tada();
    confetti(window.innerWidth / 2, window.innerHeight * 0.4, 50, { angle: -90, spread: 160, speed: 12 });
    later(function () {
      var b = $('nextLetter');
      b.classList.remove('hidden');
      b.classList.add('fade-in');
    }, reduceMotion ? 0 : letterItems * 450 + 900);
  }, reduceMotion ? 0 : 1300);
}
stage.addEventListener('click', openEnvelope);
stage.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
});
$('nextLetter').addEventListener('click', function () { goTo(6); });

/* =====================================================
   Scene 6: tembok kenangan
   ===================================================== */
var photos = CONFIG.photos;
var missing = {};
var io = null;
var STICKERS = ['😂', '🔥', '💛', '🤣', '✨', '😎', '🥹', '🍎'];

function buildMarquee() {
  var unit = 'TERIMA KASIH ❤ SELAMAT HARI GURU 🍎 WKWKWK 🤣 ' + CONFIG.className.toUpperCase() + ' ❤ ';
  var seg = '';
  for (var i = 0; i < 4; i++) seg += unit;
  $('marquee').innerHTML = '<span>' + esc(seg) + '</span><span>' + esc(seg) + '</span>';
}

function buildGallery() {
  var wall = $('wall');
  wall.innerHTML = '';
  missing = {};
  $('photoCount').textContent = photos.length;
  var tapes = ['rgba(232,137,58,.6)', 'rgba(244,197,66,.65)', 'rgba(229,107,111,.55)', 'rgba(120,170,150,.6)'];

  photos.forEach(function (ph, i) {
    var card = document.createElement('figure');
    card.className = 'polaroid';
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('data-s', rand(STICKERS));
    card.style.setProperty('--rot', (Math.random() * 7 - 3.5).toFixed(1) + 'deg');
    card.style.setProperty('--tr', (Math.random() * 16 - 8).toFixed(1) + 'deg');
    card.style.setProperty('--tape', rand(tapes));

    var img = document.createElement('img');
    img.className = 'photo';
    img.loading = 'lazy';
    img.alt = ph.caption;
    img.src = ph.src;
    img.addEventListener('error', function () {
      missing[i] = true;
      var d = document.createElement('div');
      d.className = 'ph';
      d.textContent = '📷';
      if (img.parentNode) img.parentNode.replaceChild(d, img);
    });

    var cap = document.createElement('figcaption');
    cap.className = 'cap';
    cap.textContent = ph.caption;

    card.appendChild(img);
    card.appendChild(cap);
    card.addEventListener('click', function () { openLightbox(i); });
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter') openLightbox(i); });
    wall.appendChild(card);
  });

  if (io) io.disconnect();
  var cards = wall.querySelectorAll('.polaroid');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(cards, function (c) { c.classList.add('in'); });
    return;
  }
  io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.style.transitionDelay = (Math.random() * 0.25).toFixed(2) + 's';
      en.target.classList.add('in');
      io.unobserve(en.target);
    });
  }, { threshold: 0.1 });
  Array.prototype.forEach.call(cards, function (c) { io.observe(c); });
}
buildMarquee();
buildGallery();

/* ---- Lightbox dengan prev/next & swipe ---- */
var lb = $('lightbox');
var lbIndex = 0;

function showLb(i) {
  lbIndex = (i + photos.length) % photos.length;
  var ph = photos[lbIndex];
  var media = $('lbMedia');
  media.innerHTML = '';
  var placeholder = function () {
    var d = document.createElement('div');
    d.className = 'ph-big';
    d.textContent = '📷';
    return d;
  };
  if (missing[lbIndex]) {
    media.appendChild(placeholder());
  } else {
    var img = document.createElement('img');
    img.src = ph.src;
    img.alt = ph.caption;
    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.replaceChild(placeholder(), img);
    });
    media.appendChild(img);
  }
  $('lbCap').textContent = ph.caption;
  $('lbCount').textContent = (lbIndex + 1) + ' / ' + photos.length;
}
function openLightbox(i) {
  showLb(i);
  lb.classList.add('show');
  lb.setAttribute('aria-hidden', 'false');
  sfx.pop();
}
function closeLightbox() {
  lb.classList.remove('show');
  lb.setAttribute('aria-hidden', 'true');
}
$('lbClose').addEventListener('click', closeLightbox);
$('lbPrev').addEventListener('click', function () { showLb(lbIndex - 1); });
$('lbNext').addEventListener('click', function () { showLb(lbIndex + 1); });
lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', function (e) {
  if (!lb.classList.contains('show')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLb(lbIndex - 1);
  if (e.key === 'ArrowRight') showLb(lbIndex + 1);
});
var touchX = null;
lb.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', function (e) {
  if (touchX === null) return;
  var dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) showLb(lbIndex + (dx < 0 ? 1 : -1));
  touchX = null;
}, { passive: true });

$('nextPhotos').addEventListener('click', function () { goTo(7); });

/* =====================================================
   Scene 7: finale heboh
   ===================================================== */
var fallTimer = null, riseTimer = null, fwTimer = null;
var hearts = 0;

function splitLetters(str, start) {
  var i = start;
  var frag = document.createDocumentFragment();
  var words = str.split(' ');
  words.forEach(function (word, wi) {
    var w = document.createElement('span');
    w.className = 'w';
    Array.from(word).forEach(function (ch) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      s.style.setProperty('--i', i++);
      w.appendChild(s);
    });
    frag.appendChild(w);
    if (wi < words.length - 1) frag.appendChild(document.createTextNode(' '));
    i++;
  });
  return { frag: frag, next: i };
}

function buildTitle() {
  var t = $('thanksTitle');
  t.innerHTML = '';
  t.setAttribute('aria-label', 'Terima kasih, ' + CONFIG.teacher);
  var a = splitLetters('Terima kasih,', 0);
  t.appendChild(a.frag);
  t.appendChild(document.createElement('br'));
  var b = splitLetters(CONFIG.teacher + ' 💛', a.next);
  t.appendChild(b.frag);
}

function startFinale() {
  buildTitle();
  sfx.tada();
  if (reduceMotion) return;

  var w = window.innerWidth, h = window.innerHeight;
  [0, 600, 1200].forEach(function (d) {
    later(function () {
      confetti(0, h, 70, { angle: -60, spread: 50, speed: 17 });
      confetti(w, h, 70, { angle: -120, spread: 50, speed: 17 });
    }, d);
  });
  [300, 900, 1500].forEach(function (d) {
    later(function () { firework(w * (0.15 + Math.random() * 0.7), h * (0.15 + Math.random() * 0.35)); }, d);
  });
  later(function () { wkPop('TERIMA KASIH!', w / 2 - 110, h * 0.25); }, 800);

  var layer = $('fallLayer');
  var items = ['💛', '🧡', '❤️', '🍎', '✨', '🍎', '🤣'];
  var drop = function () {
    var el = document.createElement('span');
    el.className = 'faller';
    el.textContent = rand(items);
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (18 + Math.random() * 22) + 'px';
    el.style.setProperty('--spin', (Math.random() * 360 - 180) + 'deg');
    var dur = 4 + Math.random() * 4;
    el.style.animationDuration = dur + 's';
    layer.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, dur * 1000);
  };
  var balloon = function () {
    var el = document.createElement('span');
    el.className = 'riser';
    el.textContent = '🎈';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (34 + Math.random() * 26) + 'px';
    el.style.setProperty('--sway', (Math.random() * 80 - 40) + 'px');
    el.style.setProperty('--spin', (Math.random() * 30 - 15) + 'deg');
    var dur = 7 + Math.random() * 5;
    el.style.animationDuration = dur + 's';
    layer.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, dur * 1000);
  };
  for (var i = 0; i < 14; i++) setTimeout(drop, i * 120);
  fallTimer = setInterval(drop, 450);
  riseTimer = setInterval(balloon, 1500);
  fwTimer = setInterval(function () {
    firework(w * (0.1 + Math.random() * 0.8), h * (0.12 + Math.random() * 0.4));
  }, 2200);
}

function stopFinale() {
  clearInterval(fallTimer); clearInterval(riseTimer); clearInterval(fwTimer);
  fallTimer = riseTimer = fwTimer = null;
  $('fallLayer').innerHTML = '';
}

$('heartBtn').addEventListener('click', function (e) {
  hearts++;
  $('heartCount').textContent = hearts;
  var c = centerOf(e.currentTarget);
  emojiBurst(c.x, c.y, ['💛', '🧡', '❤️', '🥹', '🤣'], 8);
  sfx.pop();
  if (hearts % 5 === 0) {
    firework(c.x, c.y - 80);
    wkPop(rand(['MAKASIH!!', 'LOVE YOU!', 'WKWKWK', 'GURU TERBAIK!']));
  }
});

/* =====================================================
   Ulangi dari awal
   ===================================================== */
$('restart').addEventListener('click', function () {
  runId++;
  timers.forEach(clearTimeout);
  timers = [];
  busy = false;
  curtain.classList.remove('run');
  stopFinale();
  closeLightbox();
  stopVideo();
  parts = [];
  hearts = 0;
  $('heartCount').textContent = '0';
  $('popLayer').innerHTML = '';

  $('videoFallback').classList.add('hidden');
  $('playOverlay').classList.add('hidden');
  $('skipPrank').classList.add('hidden');
  $('nextJokes').classList.add('hidden');
  $('jokes').innerHTML = '';
  $('errBox').classList.add('hidden');
  $('barFill').style.width = '0%';
  $('barPct').textContent = '0%';
  resetDodge();

  stage.classList.remove('open', 'gone');
  $('letter').classList.remove('show');
  $('envHint').classList.remove('hidden');
  $('nextLetter').classList.add('hidden');

  buildGallery();
  goTo(1, { instant: true });
});
