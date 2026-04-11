<template>
  <div class="landing">

    <!-- GRAIN OVERLAY -->
    <div class="grain" aria-hidden="true"></div>

    <!-- NAV -->
    <nav :class="{ scrolled: isScrolled }">
      <a href="#" class="nav-logo">
        <CafeSnapLogo :size="32" />
        <span class="nav-logo-text">Cafe Snap</span>
      </a>
      <ul class="nav-links">
        <li><a href="#how">How it works</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#map">Explore</a></li>
        <li><a href="#" class="nav-cta">Get started</a></li>
      </ul>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <p class="hero-eyebrow">Drop a pin. Share the cup.</p>
        <h1 class="hero-title">
          Every café<br>has a<br><em>story</em> to tell.
        </h1>
        <p class="hero-body">
          Snap a photo, drop a pin, and let others find it on the map. Cafe Snap is a living atlas of the world's best
          cups — built by the people who drink them.
        </p>
        <div class="hero-actions">
          <RouterLink to="/auth" class="btn-primary">
            <IconPin /> Start pinning
          </RouterLink>
          <a href="#how" class="btn-ghost">
            See how it works
            <IconArrow />
          </a>
        </div>
        <div class="hero-stat-row">
          <div class="hero-stat">
            <div class="hero-stat-num">Open</div>
            <div class="hero-stat-label">Free to use</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">Public</div>
            <div class="hero-stat-label">Community pins</div>
          </div>
          <div class="hero-stat">
            <div class="hero-stat-num">Live</div>
            <div class="hero-stat-label">Real OSM data</div>
          </div>
        </div>
      </div>

      <div class="hero-right">
        <div class="map-mock">
          <div class="map-grid"></div>
          <div class="map-road h1"></div>
          <div class="map-road h2"></div>
          <div class="map-road h3"></div>
          <div class="map-road v1"></div>
          <div class="map-road v2"></div>
          <div class="map-road v3"></div>
          <div class="map-block" style="top:10%;left:5%;width:22%;height:10%;"></div>
          <div class="map-block" style="top:10%;left:35%;width:18%;height:10%;"></div>
          <div class="map-block" style="top:45%;left:5%;width:20%;height:12%;"></div>
          <div class="map-block" style="top:45%;left:35%;width:18%;height:12%;"></div>
          <div class="map-block" style="top:30%;left:65%;width:24%;height:8%;"></div>
          <div class="map-block" style="top:68%;left:45%;width:20%;height:10%;"></div>
          <div class="map-block" style="top:68%;left:5%;width:20%;height:10%;"></div>
          <div class="map-block" style="top:10%;left:65%;width:22%;height:10%;"></div>

          <div v-for="(pin, i) in heroPins" :key="pin.name" class="pin-group" :class="`p${i + 1}`"
            :style="{ top: pin.top, left: pin.left }">
            <div class="pin-bubble" :class="`pin-fill-${i + 1}`">
              <IconCup />
            </div>
            <span class="pin-label">{{ pin.name }}</span>
          </div>

          <div class="map-popup">
            <div class="popup-img">
              <!--  -->
            </div>
            <div class="popup-body">
              <div class="popup-name">The Daily Grind</div>
              <div class="popup-meta">Pinned by @steve · 2h ago</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="how" id="how">
      <div ref="howHeader" class="reveal">
        <p class="section-tag">How it works</p>
        <h2 class="section-title">Three steps to <em>your</em> first pin.</h2>
      </div>
      <div ref="howSteps" class="steps reveal">
        <div v-for="step in steps" :key="step.num" class="step">
          <div class="step-num">{{ step.num }}</div>
          <div class="step-icon">
            <component :is="step.icon" />
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-body">{{ step.body }}</p>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="features" id="features">
      <div ref="featuresText" class="features-text reveal">
        <p class="section-tag">What you get</p>
        <h2 class="section-title">Built for <em>café hunters.</em></h2>
        <ul class="feature-list">
          <li v-for="f in features" :key="f.title" class="feature-item">
            <div class="feature-dot"></div>
            <div class="feature-item-text">
              <h4>{{ f.title }}</h4>
              <p>{{ f.body }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div ref="featuresVisual" class="features-visual reveal">
        <div class="card-stack">
          <div v-for="card in photoCards" :key="card.name" class="photo-card">
            <div class="photo-card-img" :style="{ background: card.bg }">
              <!--  -->
            </div>
            <div class="photo-card-foot">
              <div class="photo-card-name">{{ card.name }}</div>
              <div class="photo-card-loc">{{ card.loc }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MAP CTA -->
    <section class="map-cta" id="map">
      <div ref="ctaText" class="map-cta-text reveal">
        <p class="section-tag">Explore</p>
        <h2 class="section-title">The map is <em>always</em> growing.</h2>
        <p>Every pin someone drops makes the map a little richer. Log in, drop your first pin, and become part of the
          atlas.</p>
        <RouterLink to="/map" class="btn-primary btn-dark">
          <IconPin /> Open the map
        </RouterLink>
      </div>
      <div ref="ctaMap" class="map-preview reveal">
        <div class="map-preview-grid"></div>
        <div class="map-preview-road" style="top:40%;left:0;right:0;height:12px;"></div>
        <div class="map-preview-road" style="top:65%;left:0;right:0;height:7px;"></div>
        <div class="map-preview-road" style="left:35%;top:0;bottom:0;width:12px;"></div>
        <div class="map-preview-road" style="left:62%;top:0;bottom:0;width:7px;"></div>
        <div class="map-block" style="top:8%;left:5%;width:25%;height:28%;"></div>
        <div class="map-block" style="top:8%;left:40%;width:18%;height:28%;"></div>
        <div class="map-block" style="top:8%;left:67%;width:26%;height:28%;"></div>
        <div class="map-block" style="top:47%;left:5%;width:24%;height:15%;"></div>
        <div class="map-block" style="top:47%;left:40%;width:18%;height:15%;"></div>
        <div class="map-block" style="top:72%;left:5%;width:24%;height:20%;"></div>
        <div class="map-block" style="top:72%;left:40%;width:18%;height:20%;"></div>
        <div class="map-block" style="top:72%;left:67%;width:26%;height:20%;"></div>
        <div class="mini-pin" style="top:18%;left:20%;"></div>
        <div class="mini-pin" style="top:52%;left:48%;"></div>
        <div class="mini-pin" style="top:15%;left:72%;"></div>
        <div class="osm-badge">© OpenStreetMap</div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer>
      <a href="#" class="footer-logo">
        <CafeSnapLogo :size="28" />
        <span class="footer-logo-text">Cafe Snap</span>
      </a>
      <p class="footer-copy">Built with MapLibre, Supabase & too much coffee.</p>
      <ul class="footer-links">
        <li><a href="#">Map</a></li>
        <li><a href="#">Sign in</a></li>
        <li><a href="https://github.com/stvnfrlls/cafe-snap">GitHub</a></li>
      </ul>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// ─── Inline icon components ───────────────────────────────────────────────────

const CafeSnapLogo = {
  props: { size: { type: Number, default: 32 } },
  template: `
    <svg :width="size" :height="size" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="14" fill="#2c1a0e"/>
      <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round" d="M22 22 Q21 18 22 14"/>
      <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round" d="M32 21 Q31 17 32 13"/>
      <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round" d="M42 22 Q41 18 42 14"/>
      <path fill="none" stroke="#f0e6d3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M18 26 L20 46 Q20.5 49 24 49 L40 49 Q43.5 49 44 46 L46 26 Z"/>
      <path fill="none" stroke="#f0e6d3" stroke-width="3" stroke-linecap="round" d="M46 32 Q52 32 52 38 Q52 44 46 44"/>
      <ellipse cx="32" cy="51.5" rx="10" ry="2" fill="none" stroke="#f0e6d3" stroke-width="2.5"/>
      <circle cx="32" cy="37" r="4" fill="#c8a97a"/>
      <path fill="#c8a97a" d="M32 41 L28.5 47.5 Q30.5 46 32 47.5 Q33.5 46 35.5 47.5 Z"/>
    </svg>
  `
}

const IconPin = {
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  `
}

const IconArrow = {
  template: `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  `
}

const IconCup = {
  template: `
    <svg class="pin-icon" viewBox="0 0 24 24" fill="none" stroke="#f0e6d3" stroke-width="1.5" stroke-linecap="round">
      <path d="M6 10 L7.5 18 Q7.7 19 9 19 L15 19 Q16.3 19 16.5 18 L18 10 Z"/>
      <path d="M18 12 Q21 12 21 14.5 Q21 17 18 17"/>
      <ellipse cx="12" cy="20" rx="4" ry="1"/>
      <path d="M9 9 Q8.5 7 9 5.5"/><path d="M12 8.5 Q11.5 6.5 12 5"/><path d="M15 9 Q14.5 7 15 5.5"/>
    </svg>
  `
}

const IconUser = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  `
}

const IconSearch = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  `
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroPins = [
  { name: 'Brewed Awakenings', top: '28%', left: '22%' },
  { name: 'The Daily Grind', top: '50%', left: '50%' },
  { name: 'Kape ni Lola', top: '20%', left: '62%' },
  { name: 'Muni Muni', top: '65%', left: '35%' },
  { name: 'Corner Roast', top: '55%', left: '70%' },
]

const steps = [
  {
    num: '01',
    icon: IconUser,
    title: 'Create an account',
    body: 'Sign up in seconds. Your account ties your pins together so others know who found what — and where.',
  },
  {
    num: '02',
    icon: IconPin,
    title: 'Drop a pin',
    body: 'Click anywhere on the map. Name the café, upload your best shot of the cup, and post it for everyone to find.',
  },
  {
    num: '03',
    icon: IconSearch,
    title: 'Explore the map',
    body: 'Browse every pinned café in your city or across the world. Tap any pin to see the photo and find your next brew.',
  },
]

const features = [
  {
    title: 'Photo-first pins',
    body: 'Every pin carries a real photo from the person who was there. No stock images, no guessing.',
  },
  {
    title: 'Live OSM café layer',
    body: 'Existing cafés from OpenStreetMap show on the map as a reference layer — distinct from community pins.',
  },
  {
    title: 'Flat, minimal map',
    body: 'MapLibre GL with clean, muted tiles that put the pins front and centre — not the cartography.',
  },
  {
    title: 'Public by default',
    body: 'Every pin is visible to everyone. This is a shared map, not a private journal.',
  },
]

const photoCards = [
  { name: 'Muni Muni Café', loc: '14.5995° N, 120.9842° E', bg: '#3d2512' },
  { name: 'Kape ni Lola', loc: '10.3157° N, 123.8854° E', bg: '#5a3820' },
  { name: 'The Daily Grind', loc: '1.3521° N, 103.8198° E', bg: '#2c1a0e' },
]

// ─── Scroll logic ─────────────────────────────────────────────────────────────

const isScrolled = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 40
}

// ─── Reveal on scroll ─────────────────────────────────────────────────────────

let revealObserver = null

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })

  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80)
        revealObserver.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  revealObserver?.disconnect()
})
</script>

<style scoped>
/* ─── Reset & tokens ─────────────────────────────────────────────────────── */
.landing {
  --espresso: #2c1a0e;
  --espresso-mid: #3d2512;
  --espresso-light: #5a3820;
  --cream: #f0e6d3;
  --cream-dark: #ddd0b8;
  --gold: #c8a97a;
  --gold-dark: #a8854f;
  --ink: #1a1008;
  --muted: #7a6550;
  --paper: #faf6f0;

  font-family: 'DM Sans', sans-serif;
  background: var(--paper);
  color: var(--ink);
  overflow-x: hidden;
  position: relative;
}

/* ─── Grain ──────────────────────────────────────────────────────────────── */
.grain {
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 100;
  opacity: 0.4;
}

/* ─── Nav ────────────────────────────────────────────────────────────────── */
nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 48px;
  transition: background 0.4s, backdrop-filter 0.4s;
}

nav.scrolled {
  background: rgba(250, 246, 240, 0.88);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--cream-dark);
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.nav-logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 600;
  color: var(--espresso);
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 36px;
  list-style: none;
}

.nav-links a {
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  color: var(--muted);
  letter-spacing: 0.01em;
  transition: color 0.2s;
}

.nav-links a:hover {
  color: var(--espresso);
}

.nav-cta {
  background: var(--espresso) !important;
  color: var(--cream) !important;
  padding: 9px 20px;
  border-radius: 6px;
  font-weight: 500 !important;
}

.nav-cta:hover {
  background: var(--espresso-light) !important;
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
}

.hero-left {
  background: var(--espresso);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 140px 64px 80px 80px;
  position: relative;
}

.hero-left::after {
  content: '';
  position: absolute;
  top: 0;
  right: -1px;
  bottom: 0;
  width: 80px;
  background: var(--espresso);
  clip-path: polygon(0 0, 0% 100%, 100% 100%);
}

.hero-eyebrow {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 28px;
  opacity: 0;
  animation: fadeUp 0.8s 0.2s forwards;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(48px, 5.5vw, 76px);
  font-weight: 400;
  line-height: 1.08;
  color: var(--cream);
  letter-spacing: -0.02em;
  margin-bottom: 32px;
  opacity: 0;
  animation: fadeUp 0.8s 0.35s forwards;
}

.hero-title em {
  font-style: italic;
  color: var(--gold);
}

.hero-body {
  font-size: 16px;
  line-height: 1.7;
  color: rgba(240, 230, 211, 0.65);
  max-width: 400px;
  margin-bottom: 48px;
  font-weight: 300;
  opacity: 0;
  animation: fadeUp 0.8s 0.5s forwards;
}

.hero-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  opacity: 0;
  animation: fadeUp 0.8s 0.65s forwards;
}

.hero-stat-row {
  margin-top: 64px;
  display: flex;
  gap: 40px;
  opacity: 0;
  animation: fadeUp 0.8s 0.8s forwards;
}

.hero-stat-num {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: 600;
  color: var(--cream);
  letter-spacing: -0.02em;
}

.hero-stat-label {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.05em;
  margin-top: 2px;
}

/* ─── Buttons ─────────────────────────────────────────────────────────────── */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gold);
  color: var(--espresso);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  padding: 14px 28px;
  border-radius: 6px;
  letter-spacing: 0.01em;
  transition: background 0.2s, transform 0.15s;
}

.btn-primary:hover {
  background: var(--cream);
  transform: translateY(-1px);
}

.btn-primary.btn-dark {
  background: var(--espresso);
  color: var(--cream);
}

.btn-primary.btn-dark:hover {
  background: var(--espresso-light);
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(240, 230, 211, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s;
}

.btn-ghost:hover {
  color: var(--cream);
}

/* ─── Map mock ───────────────────────────────────────────────────────────── */
.hero-right {
  background: var(--cream);
  position: relative;
  overflow: hidden;
}

.map-mock {
  position: absolute;
  inset: 0;
}

.map-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--cream-dark) 1px, transparent 1px),
    linear-gradient(90deg, var(--cream-dark) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.5;
}

.map-road {
  position: absolute;
  background: #e2d5be;
}

.map-road.h1 {
  top: 38%;
  left: 0;
  right: 0;
  height: 14px;
}

.map-road.h2 {
  top: 62%;
  left: 0;
  right: 0;
  height: 8px;
}

.map-road.h3 {
  top: 22%;
  left: 0;
  right: 0;
  height: 6px;
}

.map-road.v1 {
  left: 30%;
  top: 0;
  bottom: 0;
  width: 14px;
}

.map-road.v2 {
  left: 58%;
  top: 0;
  bottom: 0;
  width: 8px;
}

.map-road.v3 {
  left: 75%;
  top: 0;
  bottom: 0;
  width: 6px;
}

.map-block {
  position: absolute;
  background: #e8ddc8;
  border-radius: 4px;
}

/* ─── Pins ───────────────────────────────────────────────────────────────── */
.pin-group {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  opacity: 0;
}

.pin-group:hover {
  transform: translateY(-4px) scale(1.05);
}

.pin-group.p1 {
  animation: pinDrop 0.5s 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.pin-group.p2 {
  animation: pinDrop 0.5s 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.pin-group.p3 {
  animation: pinDrop 0.5s 1.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.pin-group.p4 {
  animation: pinDrop 0.5s 2.0s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.pin-group.p5 {
  animation: pinDrop 0.5s 2.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.pin-bubble {
  width: 56px;
  height: 56px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  background: var(--espresso);
  border: 3px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(44, 26, 14, 0.25);
}

.pin-fill-1 {
  background: #8b5e3c;
}

.pin-fill-2 {
  background: #6b3f1a;
}

.pin-fill-3 {
  background: #a07040;
}

.pin-fill-4 {
  background: #5a3010;
}

.pin-fill-5 {
  background: #7a5030;
}

:deep(.pin-icon) {
  transform: rotate(45deg);
  width: 28px;
  height: 28px;
}

.pin-label {
  margin-top: 6px;
  background: var(--espresso);
  color: var(--cream);
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 20px;
  white-space: nowrap;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 8px rgba(44, 26, 14, 0.2);
}

/* ─── Popup ──────────────────────────────────────────────────────────────── */
.map-popup {
  position: absolute;
  top: 12%;
  right: 6%;
  width: 180px;
  background: var(--paper);
  border: 1px solid var(--cream-dark);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(44, 26, 14, 0.15);
  opacity: 0;
  animation: fadeUp 0.6s 2.6s forwards;
}

.popup-img {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #8b5e3c 0%, #5a3010 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-body {
  padding: 10px 12px;
}

.popup-name {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--espresso);
  margin-bottom: 3px;
}

.popup-meta {
  font-size: 10px;
  color: var(--muted);
  font-family: 'DM Mono', monospace;
}

/* ─── How it works ───────────────────────────────────────────────────────── */
.how {
  padding: 120px 80px;
  background: var(--paper);
}

.section-tag {
  font-family: 'DM Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold-dark);
  margin-bottom: 20px;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(32px, 3.5vw, 48px);
  font-weight: 400;
  letter-spacing: -0.02em;
  color: var(--espresso);
  line-height: 1.15;
  max-width: 520px;
  margin-bottom: 80px;
}

.section-title em {
  font-style: italic;
  color: var(--gold-dark);
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  border: 1px solid var(--cream-dark);
  background: var(--cream-dark);
  border-radius: 12px;
  overflow: hidden;
}

.step {
  background: var(--paper);
  padding: 48px 40px;
}

.step-num {
  font-family: 'Playfair Display', serif;
  font-size: 72px;
  font-weight: 600;
  color: var(--cream-dark);
  line-height: 1;
  margin-bottom: 24px;
  letter-spacing: -0.04em;
}

.step-icon {
  width: 40px;
  height: 40px;
  background: var(--espresso);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.step-title {
  font-family: 'Playfair Display', serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--espresso);
  margin-bottom: 12px;
  letter-spacing: -0.01em;
}

.step-body {
  font-size: 14px;
  line-height: 1.7;
  color: var(--muted);
  font-weight: 300;
}

/* ─── Features ───────────────────────────────────────────────────────────── */
.features {
  background: var(--espresso);
  padding: 100px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.features-text .section-tag {
  color: var(--gold);
}

.features-text .section-title {
  color: var(--cream);
  max-width: 440px;
  margin-bottom: 48px;
}

.features-text .section-title em {
  color: var(--gold);
}

.feature-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.feature-dot {
  width: 6px;
  height: 6px;
  background: var(--gold);
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

.feature-item-text h4 {
  font-size: 15px;
  font-weight: 500;
  color: var(--cream);
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.feature-item-text p {
  font-size: 13px;
  line-height: 1.65;
  color: rgba(240, 230, 211, 0.5);
  font-weight: 300;
}

.features-visual {
  position: relative;
  height: 460px;
}

.card-stack {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-card {
  position: absolute;
  background: var(--cream);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.photo-card:nth-child(1) {
  width: 200px;
  height: 260px;
  transform: rotate(-6deg) translate(-80px, 20px);
}

.photo-card:nth-child(2) {
  width: 200px;
  height: 260px;
  transform: rotate(4deg) translate(60px, -10px);
  z-index: 1;
}

.photo-card:nth-child(3) {
  width: 200px;
  height: 260px;
  transform: rotate(-2deg) translate(-10px, 40px);
  z-index: 2;
}

.photo-card-img {
  width: 100%;
  height: 75%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.photo-card-foot {
  padding: 16px 14px;
  background: var(--paper);
}

.photo-card-name {
  font-family: 'Playfair Display', serif;
  font-size: 13px;
  font-weight: 600;
  color: var(--espresso);
}

.photo-card-loc {
  font-size: 10px;
  color: var(--muted);
  font-family: 'DM Mono', monospace;
  margin-top: 2px;
}

/* ─── Map CTA ────────────────────────────────────────────────────────────── */
.map-cta {
  padding: 120px 80px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  background: var(--paper);
}

.map-cta-text .section-title {
  margin-bottom: 24px;
}

.map-cta-text p {
  font-size: 15px;
  line-height: 1.75;
  color: var(--muted);
  font-weight: 300;
  max-width: 400px;
  margin-bottom: 40px;
}

.map-preview {
  background: var(--cream);
  border-radius: 16px;
  overflow: hidden;
  height: 360px;
  position: relative;
  border: 1px solid var(--cream-dark);
  box-shadow: 0 16px 48px rgba(44, 26, 14, 0.1);
}

.map-preview-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--cream-dark) 1px, transparent 1px),
    linear-gradient(90deg, var(--cream-dark) 1px, transparent 1px);
  background-size: 36px 36px;
  opacity: 0.5;
}

.map-preview-road {
  position: absolute;
  background: #e2d5be;
}

.mini-pin {
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 50% 50% 50% 4px;
  transform: rotate(-45deg);
  background: var(--espresso);
  border: 2px solid var(--gold);
  box-shadow: 0 2px 8px rgba(44, 26, 14, 0.3);
}

.osm-badge {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: rgba(250, 246, 240, 0.9);
  border: 1px solid var(--cream-dark);
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 10px;
  font-family: 'DM Mono', monospace;
  color: var(--muted);
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
footer {
  background: var(--espresso);
  padding: 60px 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--espresso-light);
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.footer-logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: var(--cream);
  font-weight: 600;
  letter-spacing: -0.02em;
}

.footer-copy {
  font-size: 12px;
  color: var(--muted);
  letter-spacing: 0.02em;
}

.footer-links {
  display: flex;
  gap: 28px;
  list-style: none;
}

.footer-links a {
  text-decoration: none;
  font-size: 13px;
  color: var(--muted);
  transition: color 0.2s;
}

.footer-links a:hover {
  color: var(--cream);
}

/* ─── Scroll reveal ──────────────────────────────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.reveal.visible {
  opacity: 1;
  transform: none;
}

/* ─── Animations ─────────────────────────────────────────────────────────── */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pinDrop {
  from {
    opacity: 0;
    transform: translateY(-24px) scale(0.7);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 900px) {
  nav {
    padding: 16px 24px;
  }

  .nav-links {
    display: none;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .hero-left {
    padding: 120px 32px 60px;
  }

  .hero-left::after {
    display: none;
  }

  .hero-right {
    height: 400px;
  }

  .how,
  .map-cta {
    padding: 80px 32px;
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .features {
    grid-template-columns: 1fr;
    padding: 80px 32px;
  }

  .features-visual {
    height: 300px;
  }

  .map-cta {
    grid-template-columns: 1fr;
  }

  footer {
    flex-direction: column;
    gap: 24px;
    text-align: center;
    padding: 48px 32px;
  }
}
</style>