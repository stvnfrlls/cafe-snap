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
                <button v-if="isLoggedIn" class="btn-add" @click="onAddPinClick">
                    Add pin
                </button>
                <button v-if="isLoggedIn" class="btn-user" @click="logout" title="Logout">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round">
                        <path d="M16 17l5-5-5-5" />
                        <path d="M21 12H9" />
                        <path d="M12 19v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                </button>

                <button v-else class="btn-user" @click="$router.push('/auth')" title="Login">
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
        <button class="map-locate-btn" @click="showUserLocation" title="Go to my location">
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

    <AddPinModal v-if="showModal" :lat="selectedCoords?.lat" :lng="selectedCoords?.lng" @close="showModal = false"
        @created="onPinCreated" />
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import MapSearch from '@/components/MapSearch.vue'
import AddPinModal from '@/components/AddPinModal.vue'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useAuthStore } from '@/stores/auth'
import { usePinsStore } from '@/stores/pins'

// ─── Auth ─────────────────────────────────────────────────────────────────
const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.user)

// ─── Pins store ───────────────────────────────────────────────────────────
const pinsStore = usePinsStore()

// ─── Refs ──────────────────────────────────────────────────────────────
const mapContainer = ref(null)
const isAddingPin = ref(false)
const showModal = ref(false)
const selectedCoords = ref(null)
let userLocationMarker = null

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

    map.scrollZoom.enable()

    map.on('load', onMapLoad)
    map.on('click', onMapClick)
    map.on('zoom', updateMarkerScale)
})

onBeforeUnmount(() => {
    if (searchMarker) searchMarker.remove()
    for (const marker of pinMarkers.values()) marker.remove()
    pinMarkers.clear()
    map?.remove()
    map = null
})

// ─── Map ready ────────────────────────────────────────────────────────────
async function onMapLoad() {
    applyBrandStyle()
    await pinsStore.fetchPins()
    renderPins(pinsStore.pins)
    updateMarkerScale()
}

// ─── Fly-to + search marker ───────────────────────────────────────────────
let searchMarker = null

function onFlyTo({ lat, lon, displayName }) {
    if (!map) return

    if (searchMarker) {
        searchMarker.remove()
        searchMarker = null
    }

    map.flyTo({
        center: [lon, lat],
        zoom: 14,
        duration: 1600,
        essential: true,
    })

    const el = document.createElement('div')
    el.className = 'search-marker'
    el.innerHTML = `
        <div class="search-marker__pulse"></div>
        <div class="search-marker__dot"></div>
        ${displayName ? `<div class="search-marker__label">${displayName}</div>` : ''}
    `

    searchMarker = new maplibregl.Marker({
        element: el,
        anchor: 'bottom',
    })
        .setLngLat([lon, lat])
        .addTo(map)

    setTimeout(() => {
        if (searchMarker) {
            searchMarker.remove()
            searchMarker = null
        }
    }, 6000)
}

// ─── Brand style overrides ────────────────────────────────────────────────
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
        if (map.getLayer(layer)) map.setPaintProperty(layer, prop, value)
    })
}

// ─── Community pin markers ────────────────────────────────────────────────
const pinMarkers = new Map() // pin.id → maplibregl.Marker

function buildPinElement(pin) {
    const el = document.createElement('div')
    el.className = 'cafe-pin'
    el.innerHTML = `
        <div class="cafe-pin__diamond">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8L7.5 18H16.5L18 8H6Z" stroke="#f0e6d3" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M18 11Q22 11 22 14Q22 17 18 17" stroke="#f0e6d3" stroke-width="1.8" stroke-linecap="round"/>
                <ellipse cx="12" cy="19.5" rx="5" ry="1.2" stroke="#f0e6d3" stroke-width="1.5"/>
                <path d="M10 6Q9.5 4.5 10 3" stroke="#c8a97a" stroke-width="1.4" stroke-linecap="round"/>
                <path d="M14 6Q13.5 4.5 14 3" stroke="#c8a97a" stroke-width="1.4" stroke-linecap="round"/>
            </svg>
        </div>
        <div class="cafe-pin__label">${pin.cafe_name}</div>
    `
    return el
}

function buildPopupHTML(pin) {
    const date = new Date(pin.created_at).toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric'
    })
    return `
        <div class="snap-popup">
            <div class="snap-popup__img-wrap">
                <img src="${pin.image_url}" alt="${pin.cafe_name}" loading="lazy" />
            </div>
            <div class="snap-popup__body">
                <p class="snap-popup__name">${pin.cafe_name}</p>
                <p class="snap-popup__meta">${date}</p>
                <p class="snap-popup__coords">${pin.lat.toFixed(5)}, ${pin.lng.toFixed(5)}</p>
            </div>
        </div>
    `
}

function renderPins(pins) {
    // Remove markers no longer in the store
    for (const [id, marker] of pinMarkers) {
        if (!pins.find(p => p.id === id)) {
            marker.remove()
            pinMarkers.delete(id)
        }
    }
    // Add new markers
    for (const pin of pins) {
        if (pinMarkers.has(pin.id)) continue

        const el = buildPinElement(pin)
        const popup = new maplibregl.Popup({
            offset: 24,
            closeButton: true,
            maxWidth: '260px',
            className: 'snap-popup-wrapper',
        }).setHTML(buildPopupHTML(pin))

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([pin.lng, pin.lat])
            .setPopup(popup)
            .addTo(map)

        pinMarkers.set(pin.id, marker)

        applyScaleToMarker(marker)
    }
}

function onPinCreated(pin) {
    // Optional: fly to new pin
    map?.flyTo({
        center: [pin.lng, pin.lat],
        zoom: 15,
        duration: 1000
    })
}

function updateMarkerScale() {
    for (const marker of pinMarkers.values()) {
        applyScaleToMarker(marker)
    }
}

function applyScaleToMarker(marker) {
    if (!map) return

    const zoom = map.getZoom()
    const scale = Math.max(0.4, Math.min(1, (zoom - 10) / 5))

    const el = marker.getElement()
    const diamond = el.querySelector('.cafe-pin__diamond')
    if (diamond) {
        diamond.style.transform = `rotate(45deg) scale(${scale})`
    }

    const label = el.querySelector('.cafe-pin__label')
    if (label) {
        label.style.display = zoom > 13 ? 'block' : 'none'
    }
}

function showUserLocation() {
    if (!navigator.geolocation || !map) return

    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            const lng = coords.longitude
            const lat = coords.latitude

            // fly to user
            map.flyTo({
                center: [lng, lat],
                zoom: 15,
                duration: 1200
            })

            // remove old marker
            if (userLocationMarker) {
                userLocationMarker.remove()
            }

            // create element
            const el = document.createElement('div')
            el.className = 'user-location-marker'

            // add marker
            userLocationMarker = new maplibregl.Marker({
                element: el,
                anchor: 'center'
            })
                .setLngLat([lng, lat])
                .addTo(map)
        },
        (err) => console.warn('Location error:', err),
        {
            enableHighAccuracy: true
        }
    )
}

// Re-render whenever pins change (e.g. after AddPinModal inserts a new one in Step 4)
watch(
    () => pinsStore.pins,
    (pins) => {
        if (!map) return
        if (!pins || pins.length === 0) return

        renderPins(pins)
    },
    { deep: true, immediate: true }
)

// ─── Map interactions ─────────────────────────────────────────────────────
function onMapClick(e) {
    if (!isAddingPin.value) return

    const { lng, lat } = e.lngLat

    selectedCoords.value = { lat, lng }
    showModal.value = true

    isAddingPin.value = false
    if (map) map.getCanvas().style.cursor = ''
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
    if (map) map.getCanvas().style.cursor = 'crosshair'
}

function cancelAddPin() {
    isAddingPin.value = false
    if (map) map.getCanvas().style.cursor = ''
}

async function logout() {
    await auth.logout()
}

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

.map-container {
    position: absolute;
    inset: 0;
}

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

.banner-enter-active,
.banner-leave-active {
    transition: opacity 0.25s, transform 0.25s;
}

.banner-enter-from,
.banner-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
}

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
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
    width: 420px;
    max-width: calc(100vw - 32px);
}
</style>

<!-- Unscoped: MapLibre injects markers outside Vue's component DOM tree -->
<style>
.cafe-pin {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    filter: drop-shadow(0 2px 6px rgba(44, 26, 14, 0.4));
    transform: scale(var(--pin-scale, 1));
    transition: transform 0.15s;
}

.cafe-pin:hover .cafe-pin__diamond {
    transform: rotate(45deg) scale(1.1);
}

.cafe-pin__diamond {
    width: 36px;
    height: 36px;
    background: #2c1a0e;
    border: 2px solid #c8a97a;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(44, 26, 14, 0.45);
}

.cafe-pin__diamond svg {
    transform: rotate(-45deg);
    flex-shrink: 0;
}

.cafe-pin__label {
    margin-top: 6px;
    padding: 2px 8px;
    background: rgba(44, 26, 14, 0.85);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(200, 169, 122, 0.4);
    border-radius: 4px;
    color: #f0e6d3;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    white-space: nowrap;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

.search-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none;
}

.search-marker__pulse {
    position: absolute;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(200, 169, 122, 0.2);
    border: 1.5px solid rgba(200, 169, 122, 0.45);
    animation: search-pulse 1.8s ease-out infinite;
}

.search-marker__dot {
    position: relative;
    z-index: 1;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    background: #c8a97a;
    border: 2.5px solid #2c1a0e;
    box-shadow: 0 2px 8px rgba(200, 169, 122, 0.55);
}

.search-marker__label {
    margin-top: 8px;
    padding: 3px 10px;
    background: rgba(44, 26, 14, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(200, 169, 122, 0.4);
    border-radius: 4px;
    color: #f0e6d3;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    max-width: 180px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.4;
}

@keyframes search-pulse {
    0% {
        transform: scale(0.6);
        opacity: 0.8;
    }

    100% {
        transform: scale(2.4);
        opacity: 0;
    }
}

.snap-popup-wrapper .maplibregl-popup-content {
    padding: 0;
    background: #faf6f0;
    border: 1px solid #ddd0b8;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(44, 26, 14, 0.18);
    font-family: 'DM Sans', sans-serif;
}

.snap-popup-wrapper .maplibregl-popup-tip {
    border-top-color: #ddd0b8;
}

.snap-popup-wrapper .maplibregl-popup-close-button {
    color: #7a6550;
    font-size: 1rem;
    padding: 4px 8px;
}

.snap-popup__img-wrap {
    width: 260px;
    height: 155px;
    overflow: hidden;
    background: #ddd0b8;
}

.snap-popup__img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.snap-popup__body {
    padding: 10px 14px 12px;
}

.snap-popup__name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: #1a1008;
    margin-bottom: 4px;
}

.snap-popup__meta {
    font-size: 11px;
    color: #7a6550;
    margin-bottom: 2px;
}

.snap-popup__coords {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #a8854f;
}

.user-location-marker {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #4da3ff;
    border: 2px solid white;
    box-shadow: 0 0 0 0 rgba(77, 163, 255, 0.6);
    animation: pulse 1.5s infinite;
}

.user-location-marker::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(77, 163, 255, 0.2);
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(77, 163, 255, 0.5);
    }

    100% {
        box-shadow: 0 0 0 12px rgba(77, 163, 255, 0);
    }
}
</style>