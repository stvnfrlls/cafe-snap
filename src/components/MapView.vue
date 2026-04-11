<template>
    <div class="map-wrapper">

        <!-- Nav bar -->
        <header class="map-nav">
            <a href="#/" class="map-nav-logo">
                <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                    <rect width="64" height="64" rx="14" fill="#2c1a0e" />
                    <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round"
                        d="M22 22 Q21 18 22 14" />
                    <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round"
                        d="M32 21 Q31 17 32 13" />
                    <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round"
                        d="M42 22 Q41 18 42 14" />
                    <path fill="none" stroke="#f0e6d3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                        d="M18 26 L20 46 Q20.5 49 24 49 L40 49 Q43.5 49 44 46 L46 26 Z" />
                    <path fill="none" stroke="#f0e6d3" stroke-width="3" stroke-linecap="round"
                        d="M46 32 Q52 32 52 38 Q52 44 46 44" />
                    <ellipse cx="32" cy="51.5" rx="10" ry="2" fill="none" stroke="#f0e6d3" stroke-width="2.5" />
                    <circle cx="32" cy="37" r="4" fill="#c8a97a" />
                    <path fill="#c8a97a" d="M32 41 L28.5 47.5 Q30.5 46 32 47.5 Q33.5 46 35.5 47.5 Z" />
                </svg>
                <span class="map-nav-name">Cafe Snap</span>
            </a>

            <div class="map-nav-actions">
                <button class="btn-add" @click="onAddPinClick" :disabled="!isLoggedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                        stroke-linecap="round">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Add pin
                </button>
                <button class="btn-user">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </button>
            </div>
        </header>

        <div class="search-bar-wrap">
            <MapSearch @fly-to="onFlyTo" />
        </div>

        <!-- Map container — MapLibre mounts here -->
        <div ref="mapContainer" class="map-container"></div>

        <!-- Map controls -->
        <div class="map-controls">
            <button class="map-ctrl-btn" @click="zoomIn" title="Zoom in">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round">
                    <path d="M12 5v14M5 12h14" />
                </svg>
            </button>
            <div class="map-ctrl-divider"></div>
            <button class="map-ctrl-btn" @click="zoomOut" title="Zoom out">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round">
                    <path d="M5 12h14" />
                </svg>
            </button>
        </div>

        <!-- Locate me button -->
        <button class="map-locate-btn" @click="locateUser" title="Go to my location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" opacity="0.3" />
            </svg>
        </button>

        <!-- "Adding pin" mode instruction banner -->
        <Transition name="banner">
            <div v-if="isAddingPin" class="pin-mode-banner">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    <circle cx="12" cy="9" r="2.5" />
                </svg>
                Click anywhere on the map to place your pin
                <button class="banner-cancel" @click="cancelAddPin">Cancel</button>
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MapSearch from '@/components/MapSearch.vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

// ─── Refs ──────────────────────────────────────────────────────────────────
const mapContainer = ref(null)
const isLoggedIn = ref(false)   // wire to auth store in Step 5
const isAddingPin = ref(false)

let map = null

// ─── Map style ────────────────────────────────────────────────────────────
// OpenFreeMap "Positron" — clean, flat, cream-toned. No API key required.
// Docs: https://openfreemap.org
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'

// Default center: Manila, PH
const DEFAULT_CENTER = [120.9842, 14.5995]
const DEFAULT_ZOOM = 13

// ─── Lifecycle ────────────────────────────────────────────────────────────
onMounted(() => {
    map = new maplibregl.Map({
        container: mapContainer.value,
        style: MAP_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,      // we add a custom one below
    })

    // Custom compact attribution
    map.addControl(
        new maplibregl.AttributionControl({ compact: true }),
        'bottom-left'
    )

    // Disable default zoom buttons — we use our own
    map.scrollZoom.enable()

    map.on('load', onMapLoad)
    map.on('click', onMapClick)
})

onBeforeUnmount(() => {
    map?.remove()
    map = null
})

// ─── Map ready ────────────────────────────────────────────────────────────
function onMapLoad() {
    applyBrandStyle()
    // Step 3: loadPins() goes here
    // Step 4: loadOsmCafes() goes here
}

function onFlyTo({ lat, lon }) {
    map?.flyTo({
        center: [lon, lat],
        zoom: 14,
        duration: 1600,
        essential: true,
    })
}

/**
 * Override a handful of Positron layer paint properties to push
 * the map colours closer to the brand palette (cream + warm tones).
 * We only touch what matters — roads, water, land background.
 */
function applyBrandStyle() {
    if (!map) return

    const overrides = [
        // Land / background
        { layer: 'background', prop: 'background-color', value: '#f5f0e8' },

        // Water
        { layer: 'water', prop: 'fill-color', value: '#ddd5c4' },

        // Parks / green areas — desaturate to warm grey
        { layer: 'landcover_grass', prop: 'fill-color', value: '#e8e0d0' },
        { layer: 'landcover_wood', prop: 'fill-color', value: '#e0d8c8' },

        // Buildings — very subtle
        { layer: 'building', prop: 'fill-color', value: '#e2d9c8' },
        { layer: 'building', prop: 'fill-outline-color', value: '#d5ccba' },

        // Roads — warm neutrals, not harsh grey
        { layer: 'road_motorway', prop: 'line-color', value: '#c8b99a' },
        { layer: 'road_trunk', prop: 'line-color', value: '#c8b99a' },
        { layer: 'road_primary', prop: 'line-color', value: '#d4c8b0' },
        { layer: 'road_secondary', prop: 'line-color', value: '#ddd3bc' },
        { layer: 'road_tertiary', prop: 'line-color', value: '#e4dac5' },
        { layer: 'road_residential', prop: 'line-color', value: '#eae2cf' },
        { layer: 'road_service', prop: 'line-color', value: '#eae2cf' },
        { layer: 'road_path', prop: 'line-color', value: '#e0d8c8' },
    ]

    overrides.forEach(({ layer, prop, value }) => {
        // Only apply if the layer actually exists in this style
        if (map.getLayer(layer)) {
            map.setPaintProperty(layer, prop, value)
        }
    })
}

// ─── Map interactions ─────────────────────────────────────────────────────
function onMapClick(e) {
    if (!isAddingPin.value) return

    const { lng, lat } = e.lngLat
    console.log('Pin coordinates:', { lng, lat })

    // Step 3: open AddPinModal with { lng, lat } here
    isAddingPin.value = false
}

// ─── Controls ─────────────────────────────────────────────────────────────
function zoomIn() { map?.zoomIn() }
function zoomOut() { map?.zoomOut() }

function locateUser() {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            map?.flyTo({
                center: [coords.longitude, coords.latitude],
                zoom: 15,
                duration: 1200,
                essential: true,
            })
        },
        (err) => console.warn('Geolocation error:', err)
    )
}

// ─── Pin mode ─────────────────────────────────────────────────────────────
function onAddPinClick() {
    isAddingPin.value = true
    // Change cursor to crosshair to signal "placement mode"
    if (map) map.getCanvas().style.cursor = 'crosshair'
}

function cancelAddPin() {
    isAddingPin.value = false
    if (map) map.getCanvas().style.cursor = ''
}

// ─── Expose map instance for parent use (optional) ────────────────────────
defineExpose({ map: () => map })
</script>

<style scoped>
.map-wrapper {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;

    --espresso: #2c1a0e;
    --espresso-mid: #3d2512;
    --espresso-light: #5a3820;
    --cream: #f0e6d3;
    --cream-dark: #ddd0b8;
    --gold: #c8a97a;
    --muted: #7a6550;
    --paper: #faf6f0;
}

/* ─── Map fills the viewport ──────────────────────────────────────────── */
.map-container {
    position: absolute;
    inset: 0;
}

/* ─── Nav ─────────────────────────────────────────────────────────────── */
.map-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px;
    background: rgba(250, 246, 240, 0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--cream-dark);
}

.map-nav-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
}

.map-nav-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: var(--espresso);
    letter-spacing: -0.02em;
}

.map-nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
}

.btn-add {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--espresso);
    color: var(--cream);
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
}

.btn-add:hover:not(:disabled) {
    background: var(--espresso-light);
}

.btn-add:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.btn-user {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--cream);
    border: 1px solid var(--cream-dark);
    border-radius: 50%;
    color: var(--muted);
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s;
}

.btn-user:hover {
    border-color: var(--espresso);
    color: var(--espresso);
}

/* ─── Custom zoom controls ────────────────────────────────────────────── */
.map-controls {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background: rgba(250, 246, 240, 0.95);
    border: 1px solid var(--cream-dark);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(44, 26, 14, 0.1);
    display: flex;
    flex-direction: column;
}

.map-ctrl-btn {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
}

.map-ctrl-btn:hover {
    background: var(--cream);
    color: var(--espresso);
}

.map-ctrl-divider {
    height: 1px;
    background: var(--cream-dark);
    margin: 0 8px;
}

/* ─── Locate button ───────────────────────────────────────────────────── */
.map-locate-btn {
    position: absolute;
    right: 16px;
    bottom: 40px;
    z-index: 10;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(250, 246, 240, 0.95);
    border: 1px solid var(--cream-dark);
    border-radius: 8px;
    color: var(--muted);
    cursor: pointer;
    box-shadow: 0 2px 12px rgba(44, 26, 14, 0.1);
    transition: color 0.15s, border-color 0.15s;
}

.map-locate-btn:hover {
    color: var(--espresso);
    border-color: var(--espresso);
}

/* ─── Pin mode banner ─────────────────────────────────────────────────── */
.pin-mode-banner {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--espresso);
    color: var(--cream);
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
    box-shadow: 0 4px 20px rgba(44, 26, 14, 0.3);
}

.banner-cancel {
    background: transparent;
    border: 1px solid rgba(240, 230, 211, 0.3);
    border-radius: 4px;
    color: rgba(240, 230, 211, 0.7);
    font-size: 12px;
    padding: 3px 10px;
    cursor: pointer;
    font-family: inherit;
    transition: border-color 0.2s, color 0.2s;
}

.banner-cancel:hover {
    border-color: var(--cream);
    color: var(--cream);
}

/* ─── Banner transition ───────────────────────────────────────────────── */
.banner-enter-active,
.banner-leave-active {
    transition: opacity 0.25s, transform 0.25s;
}

.banner-enter-from,
.banner-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
}

/* ─── Override MapLibre default attribution style ─────────────────────── */
:deep(.maplibregl-ctrl-attrib) {
    background: rgba(250, 246, 240, 0.85) !important;
    font-size: 10px !important;
    border-radius: 4px !important;
}

:deep(.maplibregl-ctrl-attrib a) {
    color: var(--muted) !important;
}

.search-bar-wrap {
    position: absolute;
    top: 70px;
    /* clears the nav bar */
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 420px;
    max-width: calc(100vw - 32px);
}
</style>