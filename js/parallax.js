/* ==========================================================================
   Hero Parallax — Multi-layer depth, particles, cinematic scroll
   ========================================================================== */
(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  if (!hero) return;

  // ---- Wait for hero image + fonts before starting animations ----
  var heroImg = hero.querySelector('.hero__bg img');
  var imageReady = false;
  var fontsReady = false;

  function checkReady() {
    if (imageReady && fontsReady) {
      hero.classList.add('hero--ready');
    }
  }

  // Fonts
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      fontsReady = true;
      checkReady();
    });
  } else {
    fontsReady = true;
  }

  // Image
  function onImageDone() {
    imageReady = true;
    checkReady();
  }
  if (heroImg) {
    if (heroImg.complete && heroImg.naturalHeight > 0) {
      onImageDone();
    } else {
      heroImg.addEventListener('load', onImageDone);
      heroImg.addEventListener('error', onImageDone);
    }
  } else {
    onImageDone();
  }

  // Fallback: nach 4s trotzdem anzeigen
  setTimeout(function () {
    if (!hero.classList.contains('hero--ready')) {
      hero.classList.add('hero--ready');
    }
  }, 4000);

  var bg = hero.querySelector('.hero__bg');
  var content = hero.querySelector('.hero__content');
  var scrollIndicator = hero.querySelector('.hero__scroll');
  var depthFar = hero.querySelector('.hero__depth-layer--far');
  var depthMid = hero.querySelector('.hero__depth-layer--mid');
  var depthNear = hero.querySelector('.hero__depth-layer--near');
  var vignette = hero.querySelector('.hero__vignette');
  var lightSweep = hero.querySelector('.hero__light-sweep');

  var isDesktop = window.matchMedia('(min-width: 769px)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- Smooth lerp for buttery motion ----
  var currentValues = { bgY: 0, contentY: 0, contentOp: 1, vigOp: 0, nearScale: 1 };
  var targetValues = { bgY: 0, contentY: 0, contentOp: 1, vigOp: 0, nearScale: 1 };

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ---- Scroll handler — sets targets ----
  function updateTargets() {
    var scrollY = window.scrollY;
    var heroH = hero.offsetHeight;

    if (scrollY > heroH) return;

    var ratio = scrollY / heroH;

    // Each layer moves at different speed = depth illusion
    targetValues.bgY = scrollY * 0.35;
    targetValues.contentY = scrollY * 0.12;
    targetValues.contentOp = Math.max(0, 1 - ratio * 1.4);
    targetValues.vigOp = Math.min(0.8, ratio * 1.5);
    targetValues.nearScale = 1 + ratio * 0.3;
  }

  // ---- Render loop — lerps toward targets ----
  var rafId = null;
  var lerpFactor = 0.08;

  function render() {
    var dirty = false;

    // Lerp all values
    var keys = ['bgY', 'contentY', 'contentOp', 'vigOp', 'nearScale'];
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      var next = lerp(currentValues[k], targetValues[k], lerpFactor);
      if (Math.abs(next - targetValues[k]) > 0.01) dirty = true;
      currentValues[k] = next;
    }

    // Apply transforms
    if (bg) {
      bg.style.transform = 'translate3d(0,' + currentValues.bgY + 'px,0) scale(' + (1 + currentValues.bgY * 0.0003) + ')';
    }

    if (content) {
      content.style.transform = 'translate3d(0,' + currentValues.contentY + 'px,0)';
      content.style.opacity = currentValues.contentOp;
    }

    if (scrollIndicator) {
      scrollIndicator.style.opacity = Math.max(0, currentValues.contentOp * 2 - 1);
    }

    if (depthFar) {
      depthFar.style.transform = 'translate3d(0,' + (currentValues.bgY * 0.2) + 'px,0)';
    }

    if (depthMid) {
      depthMid.style.transform = 'translate3d(0,' + (currentValues.bgY * 0.5) + 'px,0)';
    }

    if (depthNear) {
      depthNear.style.transform = 'translate3d(0,' + (currentValues.bgY * -0.15) + 'px,0) scale(' + currentValues.nearScale + ')';
      depthNear.style.opacity = Math.max(0, 1 - currentValues.vigOp * 1.5);
    }

    if (vignette) {
      vignette.style.opacity = 0.3 + currentValues.vigOp * 0.7;
    }

    if (lightSweep) {
      lightSweep.style.opacity = Math.max(0, 1 - currentValues.vigOp * 2);
    }

    if (dirty) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  }

  function onScroll() {
    updateTargets();
    if (!rafId) {
      rafId = requestAnimationFrame(render);
    }
  }

  // ---- Init ----
  if (!prefersReducedMotion) {
    if (isDesktop) {
      window.addEventListener('scroll', onScroll, { passive: true });
      // Initial call
      updateTargets();
      render();
    }
  }
})();
