/* AURÈLE — Premium Magnetic Cursor */

(() => {
  const cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;

  const dot = cursor.querySelector("span");
  if (!dot) return;

  let mouseX = 0;
  let mouseY = 0;
  let circleX = 0;
  let circleY = 0;
  let dotX = 0;
  let dotY = 0;

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.classList.add("is-visible");
  });

  window.addEventListener("mouseout", (event) => {
    if (!event.relatedTarget) {
      cursor.classList.remove("is-visible");
    }
  });

  function animateCursor() {
    circleX += (mouseX - circleX) * 0.16;
    circleY += (mouseY - circleY) * 0.16;

    dotX += (mouseX - dotX) * 0.38;
    dotY += (mouseY - dotY) * 0.38;

    cursor.style.left = `${circleX}px`;
    cursor.style.top = `${circleY}px`;

    const offsetX = Math.max(
      -7,
      Math.min(7, (mouseX - dotX) * 1.5)
    );

    const offsetY = Math.max(
      -7,
      Math.min(7, (mouseY - dotY) * 1.5)
    );

    dot.style.transform =
      `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;

    requestAnimationFrame(animateCursor);
  }

  window.addEventListener("mousemove", (event) => {
    if (circleX === 0 && circleY === 0) {
      circleX = event.clientX;
      circleY = event.clientY;
      dotX = event.clientX;
      dotY = event.clientY;
    }
  });

  animateCursor();
})();

/* ===== STEP 1 (v2) — save as script.js, load at the end of <body> ===== */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Always start from the top on reload, so nothing happens behind the loader */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (typeof Lenis !== 'undefined' && !reduce) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    lenis.stop();
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -40, duration: 1.6 });
      else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Stats count-up: runs only when loaded AND visible ---------- */
  var strip = document.querySelector('.stats');
  var counters = document.querySelectorAll('[data-count]');
  var pageLoaded = false, stripVisible = false, counted = false;

  if (strip && counters.length && !reduce) {
    counters.forEach(function (el) { el.textContent = '0'; });

    new IntersectionObserver(function (entries) {
      stripVisible = entries[0].isIntersecting;
      startCounters();
    }, { threshold: 0.4 }).observe(strip);
  }

  function startCounters() {
    if (counted || !pageLoaded || !stripVisible) return;
    counted = true;
    counters.forEach(function (el, i) {
      var target = Number(el.dataset.count);
      var duration = 2200;
      var delay = i * 150;
      var start = null;
      (function tick(now) {
        if (!start) start = now + delay;
        var t = Math.max(0, Math.min((now - start) / duration, 1));
        var eased = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.round(target * eased).toLocaleString('en-US');
        if (t < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }

  
/* ---------- Scent Materializing Loader ---------- */
var loader = document.querySelector('.loader');
var loaderFrame = null;
var mistProgress = 0;
var pointerX = 0;
var pointerY = 0;
var pointerActive = false;

function initScentMist() {
  if (!loader) return;

  var canvas = loader.querySelector('.loader__canvas');
  var orb = loader.querySelector('.loader__orb');
  var glow = loader.querySelector('.loader__glow');
  var ctx = canvas && canvas.getContext('2d');

  if (!canvas || !ctx || !orb) return;

  var w = 0;
  var h = 0;
  var dpr = 1;
  var particles = [];
  var blobs = [];
  var mobile = window.matchMedia(
    '(max-width: 600px), (pointer: coarse)'
  ).matches;

  var particleCount = mobile ? 22 : 54;
  var blobCount = mobile ? 5 : 9;

  function resize() {
    var rect = canvas.getBoundingClientRect();

    w = rect.width;
    h = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function createParticles() {
    particles = [];

    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: random(0, 1),
        y: random(0, 1),
        radius: random(0.7, 2.1),
        speed: random(0.00012, 0.00038),
        drift: random(-0.00012, 0.00012),
        phase: random(0, Math.PI * 2),
        alpha: random(0.25, 0.8)
      });
    }
  }

  function createBlobs() {
    blobs = [];

    for (var i = 0; i < blobCount; i++) {
      blobs.push({
        x: random(0.22, 0.78),
        y: random(0.22, 0.78),
        radius: random(0.17, 0.34),
        phase: random(0, Math.PI * 2),
        speed: random(0.00015, 0.0004),
        drift: random(0.015, 0.05),
        color: i % 3
      });
    }
  }

  resize();
  createParticles();
  createBlobs();

  var started = performance.now();

  function draw(now) {
    if (!loader || !loader.isConnected) {
      cancelAnimationFrame(loaderFrame);
      return;
    }

    var elapsed = now - started;
    var density = 0.12 + mistProgress * 0.88;

    ctx.clearRect(0, 0, w, h);

    /* Keep all smoke inside the circular orb */
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.485, 0, Math.PI * 2);
    ctx.clip();

    /* A faint central champagne glow */
    var centerGlow = ctx.createRadialGradient(
      w * 0.5, h * 0.48, 0,
      w * 0.5, h * 0.48, w * 0.5
    );

    centerGlow.addColorStop(0, 'rgba(217,195,160,' + (0.035 + density * 0.11) + ')');
    centerGlow.addColorStop(0.5, 'rgba(110,52,40,' + (0.04 + density * 0.13) + ')');
    centerGlow.addColorStop(1, 'rgba(18,12,11,0)');

    ctx.fillStyle = centerGlow;
    ctx.fillRect(0, 0, w, h);

    /* Soft wine and champagne mist blobs */
    ctx.globalCompositeOperation = 'screen';

    blobs.forEach(function (b) {
      var phase = elapsed * b.speed + b.phase;
      var driftX = Math.sin(phase) * b.drift;
      var driftY = Math.cos(phase * 0.8) * b.drift;

      var mx = pointerActive ? pointerX * 0.025 : 0;
      var my = pointerActive ? pointerY * 0.025 : 0;

      var x = (b.x + driftX + mx) * w;
      var y = (b.y + driftY + my) * h;
      var radius = w * b.radius * (0.9 + Math.sin(phase * 1.4) * 0.12);

      var colors = [
        [110, 52, 40],
        [217, 195, 160],
        [74, 36, 32]
      ];

      var color = colors[b.color];

      var mist = ctx.createRadialGradient(x, y, 0, x, y, radius);

      mist.addColorStop(
        0,
        'rgba(' + color.join(',') + ',' + (0.025 + density * 0.13) + ')'
      );

      mist.addColorStop(
        0.48,
        'rgba(' + color.join(',') + ',' + (0.018 + density * 0.075) + ')'
      );

      mist.addColorStop(1, 'rgba(18,12,11,0)');

      ctx.fillStyle = mist;
      ctx.beginPath();
      ctx.ellipse(
        x, y,
        radius * (1 + Math.sin(phase) * 0.12),
        radius * (0.75 + Math.cos(phase) * 0.15),
        phase * 0.25,
        0, Math.PI * 2
      );
      ctx.fill();
    });

    /* Fine gold particles rising through the fragrance */
    ctx.globalCompositeOperation = 'lighter';

    particles.forEach(function (p) {
      p.y -= p.speed * (0.65 + mistProgress * 0.8);
      p.x += p.drift + Math.sin(elapsed * 0.001 + p.phase) * 0.00015;

      if (p.y < -0.04) {
        p.y = 1.04;
        p.x = random(0.12, 0.88);
      }

      if (p.x < 0.08 || p.x > 0.92) {
        p.drift *= -1;
      }

      var shimmer = 0.5 + Math.sin(elapsed * 0.003 + p.phase) * 0.5;
      var alpha = p.alpha * (0.2 + mistProgress * 0.8) * shimmer;

      ctx.beginPath();
      ctx.fillStyle = 'rgba(217,195,160,' + alpha + ')';
      ctx.arc(
        p.x * w,
        p.y * h,
        p.radius * (0.6 + mistProgress * 0.5),
        0, Math.PI * 2
      );
      ctx.fill();
    });

    ctx.restore();

    loaderFrame = requestAnimationFrame(draw);
  }

  loaderFrame = requestAnimationFrame(draw);

  window.addEventListener('resize', resize, { passive: true });

  /* Mouse attraction: desktop only */
  var desktopPointer = window.matchMedia(
    '(hover: hover) and (pointer: fine)'
  ).matches;

  if (desktopPointer) {
    loader.addEventListener('pointermove', function (e) {
      var rect = orb.getBoundingClientRect();

      pointerX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      pointerY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      pointerActive = true;

      if (glow) {
        glow.style.transform =
          'translate(' + (pointerX * 12) + 'px,' +
          (pointerY * 12) + 'px) scale(1.06)';
      }
    });

    loader.addEventListener('pointerleave', function () {
      pointerActive = false;

      if (glow) {
        glow.style.transform = '';
      }
    });
  }
}

function finish() {
  root.classList.add('is-loaded');
  pageLoaded = true;

  if (lenis) lenis.start();

  startCounters();

  document.dispatchEvent(new Event('aurele:loaded'));

  if (loader) {
    loader.classList.add('is-clear');

    setTimeout(function () {
      loader.remove();
    }, 950);
  }
}

function runScentLoader() {
  if (!loader || reduce) {
    finish();
    return;
  }

  var word = loader.querySelector('.loader__word');
  var countEl = loader.querySelector('.loader__count');

  /* Split Aurèle into individual letters */
  if (word) {
    var brandText = word.textContent.trim();

    word.setAttribute('aria-label', brandText);
    word.textContent = '';

    Array.from(brandText).forEach(function (ch, i) {
      var span = document.createElement('span');

      span.className = 'loader__char';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--i', i);
      span.textContent = ch === ' ' ? '\u00A0' : ch;

      word.appendChild(span);
    });
  }

  initScentMist();

  var duration = 3000;
  var startTime = null;
  var windowLoaded = document.readyState === 'complete';
  var exitStarted = false;

  window.addEventListener('load', function () {
    windowLoaded = true;
  }, { once: true });

  function step(now) {
    if (!startTime) startTime = now;

    var t = Math.min((now - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - t, 2.6);

    mistProgress = eased;

    loader.style.setProperty('--p', eased);

    if (countEl) {
      countEl.textContent = Math.min(
        99,
        Math.round(eased * 100)
      );
    }

    if (t < 1 || !windowLoaded) {
      if (t >= 1 && countEl) {
        countEl.textContent = '99';
      }

      requestAnimationFrame(step);
      return;
    }

    if (exitStarted) return;
    exitStarted = true;

    mistProgress = 1;

    if (countEl) countEl.textContent = '100';

    loader.style.setProperty('--p', 1);

    /* Let the full mist and brand settle before the exit */
    setTimeout(function () {
      loader.classList.add('is-pulsing');

      setTimeout(function () {
        loader.classList.add('is-blooming');

        /* Finish after the bloom has expanded */
        setTimeout(finish, 1450);
      }, 900);
    }, 350);
  }

  requestAnimationFrame(step);
}

if (loader && !reduce) {
  runScentLoader();
} else {
  finish();
}




  /* ---------- Nav: stays visible, turns to glass after 60px ---------- */
  var nav = document.querySelector('.nav');
  function navState() { nav.classList.toggle('nav--solid', window.scrollY > 60); }
  window.addEventListener('scroll', navState, { passive: true });
  navState();

  /* ---------- Product cards ---------- */
  var cards = document.querySelectorAll('.product');
  if ('IntersectionObserver' in window && !reduce) {
    cards.forEach(function (c, i) { c.style.setProperty('--d', (i * 140) + 'ms'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || !pageLoaded) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    cards.forEach(function (c) { io.observe(c); });
    /* cards that were already in view when the loader ended */
    document.addEventListener('aurele:loaded', function () {
      cards.forEach(function (c) { io.unobserve(c); io.observe(c); });
    });
  } else {
    cards.forEach(function (c) { c.classList.add('is-in'); });
  }
})();





/* ========== AURÈLE — SHOPPING BAG ========== */
(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  const toggle = $("#cart-toggle");
  const drawer = $("#cart-drawer");
  const overlay = $("#cart-overlay");
  const closeBtn = $("#cart-close");
  const countEl = $("#cart-count");
  const itemsEl = $("#cart-items");
  const emptyEl = $("#cart-empty");
  const summaryEl = $("#cart-summary");
  const subtotalEl = $("#cart-subtotal");
  const toastEl = $("#cart-toast");

  if (
    !toggle || !drawer || !overlay || !closeBtn ||
    !countEl || !itemsEl || !emptyEl || !summaryEl ||
    !subtotalEl || !toastEl
  ) {
    console.warn("AURÈLE cart: required HTML elements were not found.");
    return;
  }

  const STORAGE_KEY = "aurele-shopping-bag-v1";
  const money = amount =>
    "Rs " + Math.round(amount).toLocaleString("en-PK");

  let cart = loadCart();
  let previousFocus = null;
  let toastTimer;
  let lastFocusedItem = null;

  function loadCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

      if (!Array.isArray(saved)) return [];

      return saved.filter(item =>
        item &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Number.isFinite(item.price) &&
        item.price > 0 &&
        Number.isInteger(item.qty) &&
        item.qty > 0 &&
        item.qty <= 99
      );
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      showToast("Your bag could not be saved in this browser.");
    }
  }

  function itemCount() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function subtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");

    toastTimer = setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 2600);
  }

  function setDrawer(open) {
    drawer.classList.toggle("is-open", open);
    overlay.classList.toggle("is-visible", open);
    document.body.classList.toggle("cart-is-open", open);

    drawer.setAttribute("aria-hidden", String(!open));
    drawer.inert = !open;
    overlay.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));

    if (open) {
      previousFocus = document.activeElement;
      requestAnimationFrame(() => closeBtn.focus());
    } else if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  function renderCart() {
    countEl.textContent = itemCount();
    itemsEl.replaceChildren();

    emptyEl.hidden = cart.length > 0;
    summaryEl.hidden = cart.length === 0;

    cart.forEach(item => {
      const row = document.createElement("article");
      row.className = "cart-item";

      const visual = document.createElement("div");
      visual.className = "cart-item__visual";

      const monogram = document.createElement("span");
      monogram.className = "cart-item__monogram";
      monogram.textContent = "A";
      visual.append(monogram);

      const details = document.createElement("div");
      details.className = "cart-item__details";

      const name = document.createElement("h3");
      name.className = "cart-item__name";
      name.textContent = item.name;

      const price = document.createElement("p");
      price.className = "cart-item__price";
      price.textContent = money(item.price);

      const controls = document.createElement("div");
      controls.className = "cart-item__controls";

      const qty = document.createElement("div");
      qty.className = "cart-qty";

      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.dataset.cartAction = "decrease";
      decrease.dataset.id = item.id;
      decrease.setAttribute("aria-label", `Decrease ${item.name} quantity`);
      decrease.textContent = "−";

      const quantity = document.createElement("span");
      quantity.textContent = item.qty;
      quantity.setAttribute("aria-label", "Quantity");

      const increase = document.createElement("button");
      increase.type = "button";
      increase.dataset.cartAction = "increase";
      increase.dataset.id = item.id;
      increase.setAttribute("aria-label", `Increase ${item.name} quantity`);
      increase.textContent = "+";
      increase.disabled = item.qty >= 99;

      qty.append(decrease, quantity, increase);

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "cart-remove";
      remove.dataset.cartAction = "remove";
      remove.dataset.id = item.id;
      remove.textContent = "Remove";

      controls.append(qty, remove);
      details.append(name, price, controls);
      row.append(visual, details);
      itemsEl.append(row);
    });

    subtotalEl.textContent = money(subtotal());
    saveCart();
  }

  function addProduct(product) {
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
      if (existing.qty >= 99) {
        showToast("Maximum quantity reached for this fragrance.");
        return;
      }
      existing.qty += 1;
    } else {
      cart.push({ ...product, qty: 1 });
    }

    renderCart();
    showToast(`${product.name} added to your bag.`);
    setDrawer(true);
  }

  function updateQuantity(id, action) {
    const item = cart.find(entry => entry.id === id);
    if (!item) return;

    if (action === "increase" && item.qty < 99) {
      item.qty += 1;
    } else if (action === "decrease") {
      item.qty -= 1;
      if (item.qty <= 0) {
        cart = cart.filter(entry => entry.id !== id);
      }
    } else if (action === "remove") {
      cart = cart.filter(entry => entry.id !== id);
    }

    renderCart();
  }

  // Reads product names and prices from the existing collection cards.
  function readProduct(card) {
    const nameEl = $(".product__name", card);
    const priceEl = $(".product__price", card);

    if (!nameEl || !priceEl) return null;

    const name = nameEl.textContent.trim();
    const priceText = priceEl.textContent.trim();
    const price = Number(priceText.replace(/[^\d.]/g, ""));

    if (!name || !Number.isFinite(price) || price <= 0) {
      showToast("This fragrance could not be added. Check its price.");
      return null;
    }

    const id = card.dataset.productId ||
      name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    return { id, name, price };
  }

  // Add-to-bag buttons on the existing product cards.
  document.addEventListener("click", event => {
    const button = event.target.closest(".product__button");
    if (!button) return;

    const card = button.closest(".product");
    if (!card) return;

    const product = readProduct(card);
    if (product) addProduct(product);
  });

  // Quantity and remove controls inside the drawer.
  itemsEl.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;

    updateQuantity(button.dataset.id, button.dataset.cartAction);
  });

  toggle.addEventListener("click", () => setDrawer(true));
  closeBtn.addEventListener("click", () => setDrawer(false));
  overlay.addEventListener("click", () => setDrawer(false));

  $("#cart-continue")?.addEventListener("click", () => {
    setDrawer(false);
    $("#collection")?.scrollIntoView({ behavior: "smooth" });
  });

  document.addEventListener("keydown", event => {
    if (!drawer.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      setDrawer(false);
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [
      closeBtn,
      ...drawer.querySelectorAll(
        'button:not(:disabled):not([hidden]), a[href], input:not(:disabled)'
      )
    ].filter(el =>
      el.getClientRects().length > 0 &&
      !el.closest("[hidden]")
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  $("#cart-checkout")?.addEventListener("click", () => {

    if (!cart.length) return;

    window.location.href = "checkout.html";

});

  renderCart();
})();












/* ===== STEP 2 — save as step2.js (loaded after script.js) ===== */
(function () {
  var menu = document.getElementById('menu');
  var openBtn = document.getElementById('menu-toggle');
  var closeBtn = document.getElementById('menu-close');
  if (menu && openBtn && closeBtn) {
    function setMenu(open) {
      menu.classList.toggle('is-open', open);
      menu.inert = !open;
      menu.setAttribute('aria-hidden', String(!open));
      openBtn.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      (open ? closeBtn : openBtn).focus();
    }
    openBtn.addEventListener('click', function () { setMenu(true); });
    closeBtn.addEventListener('click', function () { setMenu(false); });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760 && menu.classList.contains('is-open')) setMenu(false);
    });
  }

  /* Contact form: demo only, nothing is sent anywhere yet */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('contact-status');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = form.checkValidity() && form.email.value.indexOf('@') > 0;
      status.textContent = ok
        ? 'Thank you. This demo form is not connected yet, so nothing was sent.'
        : 'Please fill in your name, a valid email and a message.';
    });
  }
})();










/* ===== STEP 3 — save as step3.js (loaded after step2.js) ===== */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Scroll reveal. Content only hides once this script is running. */
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    document.documentElement.classList.add('reveal-ready');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* Testimonials: auto-rotate, dots, pause on hover/focus */
  var box = document.getElementById('voices');
  if (!box) return;
  var slides = box.querySelectorAll('.voice');
  var dots = box.querySelectorAll('.voices__dots button');
  var current = 0, timer = null;

  function show(n) {
    current = (n + slides.length) % slides.length;
    slides.forEach(function (s, i) {
      s.classList.toggle('is-active', i === current);
      s.setAttribute('aria-hidden', String(i !== current));
    });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
  }
  function play() { if (!reduce) { stop(); timer = setInterval(function () { show(current + 1); }, 6500); } }
  function stop() { clearInterval(timer); }

  dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); play(); }); });
  box.addEventListener('mouseenter', stop);
  box.addEventListener('mouseleave', play);
  box.addEventListener('focusin', stop);
  box.addEventListener('focusout', play);
  play();
})();





