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
                <button v-if="isLoggedIn" class="btn-add" @click="onAddPinClick">Add pin</button>
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

        <div ref="mapContainer" class="map-container"></div>

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

        <button class="map-locate-btn" @click="showUserLocation" title="Go to my location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" opacity="0.3" />
            </svg>
        </button>

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

        <!-- Lightbox -->
        <Transition name="lightbox">
            <div v-if="lightbox.open" class="lightbox" @click.self="closeLightbox">
                <button class="lightbox__close" @click="closeLightbox">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
                <div class="lightbox__img-wrap">
                    <img :src="lightbox.src" :alt="lightbox.name" />
                </div>
                <div class="lightbox__meta">
                    <p class="lightbox__name">{{ lightbox.name }}</p>
                    <p class="lightbox__date">{{ lightbox.date }}</p>
                </div>
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

// ─── Refs ─────────────────────────────────────────────────────────────────
const mapContainer = ref(null)
const isAddingPin = ref(false)
const showModal = ref(false)
const selectedCoords = ref(null)
const claimedPinIds = new Set()

// Lightbox state
const lightbox = ref({ open: false, src: '', name: '', date: '' })

let map = null
let userLocationMarker = null

// ─── Map style ────────────────────────────────────────────────────────────
const MAP_STYLE = 'https://tiles.openfreemap.org/styles/positron'
const DEFAULT_CENTER = [120.9842, 14.5995]
const DEFAULT_ZOOM = 13

// ─── Lifecycle ────────────────────────────────────────────────────────────
onMounted(() => {
    map = new maplibregl.Map({
        container: mapContainer.value,
        style: MAP_STYLE,
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        attributionControl: false,
    })
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left')
    map.scrollZoom.enable()
    map.on('load', onMapLoad)
    map.on('click', onMapClick)
})

onBeforeUnmount(() => {
    if (searchMarker) searchMarker.remove()
    if (userLocationMarker) userLocationMarker.remove()
    for (const marker of pinMarkers.values()) marker.remove()
    pinMarkers.clear()
    cleanupOsmLayer()
    map?.remove()
    map = null
})

// ─── Map ready ────────────────────────────────────────────────────────────
async function onMapLoad() {
    applyBrandStyle()
    await pinsStore.fetchPins()
    renderPins(pinsStore.pins)
    initOsmLayer()
}

// ─── Fly-to + search marker ───────────────────────────────────────────────
let searchMarker = null

function onFlyTo({ lat, lon, displayName }) {
    if (!map) return
    if (searchMarker) { searchMarker.remove(); searchMarker = null }

    map.flyTo({ center: [lon, lat], zoom: 14, duration: 1600, essential: true })

    const el = document.createElement('div')
    el.className = 'search-marker'
    el.innerHTML = `
        <div class="search-marker__pulse"></div>
        <div class="search-marker__dot"></div>
        ${displayName ? `<div class="search-marker__label">${displayName}</div>` : ''}
    `

    searchMarker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([lon, lat]).addTo(map)

    setTimeout(() => { if (searchMarker) { searchMarker.remove(); searchMarker = null } }, 6000)
}

// ─── Brand style overrides ────────────────────────────────────────────────
function applyBrandStyle() {
    if (!map || !map.isStyleLoaded()) return

    const overrides = [
        { layer: 'background', prop: 'background-color', value: '#f5f0e8' },
        { layer: 'water', prop: 'fill-color', value: '#ddd5c4' },
        { layer: 'landcover_grass', prop: 'fill-color', value: '#e8e0d0' },
        { layer: 'landcover_wood', prop: 'fill-color', value: '#e0d8c8' },
        { layer: 'building', prop: 'fill-color', value: '#e2d9c8' },
        { layer: 'building', prop: 'fill-outline-color', value: '#d5ccba' },
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
        if (map.getLayer(layer)) {
            try {
                map.setPaintProperty(layer, prop, value)
            } catch (e) {
                console.warn(`Could not set style for ${layer}`)
            }
        }
    })
}

// ─── Haversine distance (meters) ─────────────────────────────────────────
function haversineMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000
    const phi1 = lat1 * Math.PI / 180
    const phi2 = lat2 * Math.PI / 180
    const dPhi = (lat2 - lat1) * Math.PI / 180
    const dLam = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLam / 2) ** 2
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

const MATCH_THRESHOLD = 10 // meters

// Find all user pins within threshold of a coordinate
function matchingUserPins(lat, lon) {
    return pinsStore.pins.filter(p => haversineMeters(lat, lon, p.lat, p.lng) <= MATCH_THRESHOLD)
}

// Find OSM node id within threshold of a user pin coordinate (returns id string or null)
function matchingOsmNode(lat, lon) {
    for (const [id, marker] of osmMarkers) {
        const ll = marker.getLngLat()
        if (haversineMeters(lat, lon, ll.lat, ll.lng) <= MATCH_THRESHOLD) return id
    }
    return null
}

// ─── Lightbox ────────────────────────────────────────────────────────────
function openLightbox(src, name, date) {
    lightbox.value = { open: true, src, name, date }
}

function closeLightbox() {
    lightbox.value = { ...lightbox.value, open: false }
}

// Expose to inline popup onclick handlers
window.__cafeSnapLightbox = openLightbox

// ─── Community pin markers ────────────────────────────────────────────────
const pinMarkers = new Map()

function buildPinElement(label) {
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
        <div class="cafe-pin__label">${label}</div>
    `
    return el
}

function buildSinglePopupHTML(pin) {
    const date = new Date(pin.created_at).toLocaleDateString('en-PH', {
        month: 'short', day: 'numeric', year: 'numeric'
    })
    const dateStr = new Date(pin.created_at).toLocaleDateString('en-PH', {
        month: 'long', day: 'numeric', year: 'numeric'
    })
    return `
        <div class="snap-popup">
            <div class="snap-popup__img-wrap"
                onclick='window.__cafeSnapLightbox(${JSON.stringify(String(pin.image_url))}, ${JSON.stringify(String(pin.cafe_name))}, ${JSON.stringify(String(dateStr))})'
                style="cursor:pointer">
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

function buildGalleryPopupHTML(cafeName, pins) {
    const photos = pins.map(p => {
        const dateStr = new Date(p.created_at).toLocaleDateString('en-PH', {
            month: 'long', day: 'numeric', year: 'numeric'
        })
        return `
            <div class="gallery-grid__item"
                onclick='window.__cafeSnapLightbox(${JSON.stringify(String(p.image_url))}, ${JSON.stringify(String(cafeName))}, ${JSON.stringify(String(dateStr))})'>
                <img src="${p.image_url}" alt="${cafeName}" loading="lazy" />
                <div class="gallery-grid__overlay">
                    <span>${dateStr}</span>
                </div>
            </div>
        `
    }).join('')

    return `
        <div class="gallery-popup">
            <p class="gallery-popup__name">${cafeName}</p>
            <p class="gallery-popup__count">${pins.length} photo${pins.length > 1 ? 's' : ''}</p>
            <div class="gallery-grid">${photos}</div>
        </div>
    `
}

function renderPins(pins) {
    if (!map) return

    for (const [id, marker] of pinMarkers) {
        const stillExists = pins.find(p => p.id === id)
        if (!stillExists || claimedPinIds.has(id)) {
            marker.remove()
            pinMarkers.delete(id)
        }
    }

    for (const pin of pins) {
        if (pinMarkers.has(pin.id) || claimedPinIds.has(pin.id)) continue

        const el = buildPinElement(pin.cafe_name)

        const popup = new maplibregl.Popup({
            offset: 24, closeButton: true, maxWidth: '260px', className: 'snap-popup-wrapper',
        }).setHTML(buildSinglePopupHTML(pin))

        const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
            .setLngLat([pin.lng, pin.lat])
            .setPopup(popup)
            .addTo(map)

        pinMarkers.set(pin.id, marker)
    }
}

function onPinCreated(pin) {
    map?.flyTo({ center: [pin.lng, pin.lat], zoom: 15, duration: 1000 })
}

watch(
    () => pinsStore.pins,
    (pins) => { if (map && pins?.length) renderPins(pins) },
    { deep: true, immediate: true }
)

// ─── OSM Café Layer ───────────────────────────────────────────────────────
const OSM_MIN_ZOOM = 10
const OSM_DEBOUNCE_MS = 1200  // increased from 800ms
const OSM_TILE_SIZE = 0.05  // ~5km grid cells in degrees

const osmMarkers = new Map()  // osm node id (string) → maplibregl.Marker
const osmNodes = new Map()  // osm node id (string) → raw OSM node data
const osmCache = new Map()  // tile key → array of OSM nodes
const osmFetching = new Set()  // tile keys in flight

let osmDebounceTimer = null
let osmFetchController = null

function initOsmLayer() {
    map.on('moveend', onMapMoveEnd)
    map.on('zoomend', onMapZoomEnd)
    if (map.getZoom() >= OSM_MIN_ZOOM) scheduleOsmFetch()
}

function onMapMoveEnd() {
    if (map.getZoom() < OSM_MIN_ZOOM) return
    scheduleOsmFetch()
}

function onMapZoomEnd() {
    if (map.getZoom() < OSM_MIN_ZOOM) {
        hideAllOsmMarkers()
    } else {
        showAllOsmMarkers()
        scheduleOsmFetch()
    }
}

function scheduleOsmFetch() {
    clearTimeout(osmDebounceTimer)
    osmDebounceTimer = setTimeout(fetchOsmCafes, OSM_DEBOUNCE_MS)
}

function tileKey(lat, lon) {
    return `${Math.floor(lat / OSM_TILE_SIZE)}:${Math.floor(lon / OSM_TILE_SIZE)}`
}

function getViewportTileKeys() {
    const b = map.getBounds()
    const keys = new Set()
    for (let lat = Math.floor(b.getSouth() / OSM_TILE_SIZE) * OSM_TILE_SIZE; lat < b.getNorth(); lat += OSM_TILE_SIZE) {
        for (let lon = Math.floor(b.getWest() / OSM_TILE_SIZE) * OSM_TILE_SIZE; lon < b.getEast(); lon += OSM_TILE_SIZE) {
            keys.add(tileKey(lat, lon))
        }
    }
    return keys
}

async function fetchOsmCafes() {
    if (!map) return

    const viewportKeys = getViewportTileKeys()
    const missingKeys = [...viewportKeys].filter(k => !osmCache.has(k) && !osmFetching.has(k))

    // Render cached tiles immediately
    const cachedNodes = [...viewportKeys].filter(k => osmCache.has(k)).flatMap(k => osmCache.get(k))
    renderOsmCafes(cachedNodes)

    if (missingKeys.length === 0) return

    missingKeys.forEach(k => osmFetching.add(k))

    const rows = missingKeys.map(k => parseInt(k.split(':')[0]))
    const cols = missingKeys.map(k => parseInt(k.split(':')[1]))
    const s = (Math.min(...rows) * OSM_TILE_SIZE).toFixed(6)
    const w = (Math.min(...cols) * OSM_TILE_SIZE).toFixed(6)
    const n = ((Math.max(...rows) + 1) * OSM_TILE_SIZE).toFixed(6)
    const e = ((Math.max(...cols) + 1) * OSM_TILE_SIZE).toFixed(6)

    if (osmFetchController) osmFetchController.abort()
    osmFetchController = new AbortController()

    const query = `[out:json][timeout:15];node["amenity"="cafe"](${s},${w},${n},${e});out body;`

    try {
        const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST', body: query, signal: osmFetchController.signal,
        })

        if (res.status === 429) {
            console.warn('Overpass rate limited — retrying in 5s')
            missingKeys.forEach(k => osmFetching.delete(k))
            osmDebounceTimer = setTimeout(fetchOsmCafes, 5000)
            return
        }

        if (!res.ok) throw new Error(`Overpass ${res.status}`)

        const data = await res.json()
        const nodes = data.elements ?? []
        const buckets = new Map()
        missingKeys.forEach(k => buckets.set(k, []))

        for (const node of nodes) {
            const k = tileKey(node.lat, node.lon)
            if (buckets.has(k)) buckets.get(k).push(node)
        }

        buckets.forEach((tileNodes, k) => {
            osmCache.set(k, tileNodes)
            osmFetching.delete(k)
        })

        const allCached = [...getViewportTileKeys()]
            .filter(k => osmCache.has(k))
            .flatMap(k => osmCache.get(k))
        renderOsmCafes(allCached)

    } catch (err) {
        if (err.name === 'AbortError') return
        missingKeys.forEach(k => osmFetching.delete(k))
        console.warn('OSM fetch failed:', err.message)
    }
}

function renderOsmCafes(nodes) {
    if (!map) return

    const incomingIds = new Set(nodes.map(n => String(n.id)))

    claimedPinIds.clear()

    for (const [id, marker] of osmMarkers) {
        if (!incomingIds.has(id)) {
            marker.remove()
            osmMarkers.delete(id)
            osmNodes.delete(id)
        }
    }

    for (const node of nodes) {
        const id = String(node.id)
        osmNodes.set(id, node)

        const matchedPins = matchingUserPins(node.lat, node.lon)

        if (matchedPins.length > 0) {
            matchedPins.forEach(p => claimedPinIds.add(p.id))

            if (!osmMarkers.has(id)) {
                addOsmAsDiamond(id, node, matchedPins)
            } else {
                const marker = osmMarkers.get(id)
                if (marker.getElement().classList.contains('osm-pin')) {
                    upgradeOsmMarker(id)
                }
            }
        } else {
            if (!osmMarkers.has(id)) {
                addOsmAsTeardrop(id, node)
            }
        }
    }

    renderPins(pinsStore.pins)
}

function addOsmAsTeardrop(id, node) {
    const el = document.createElement('div')
    el.className = 'osm-pin'
    el.title = node.tags?.name ?? 'Café'
    el.innerHTML = `
        <svg class="osm-pin__svg" width="20" height="26" viewBox="0 0 20 26" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0C4.477 0 0 4.477 0 10c0 7.5 10 16 10 16S20 17.5 20 10C20 4.477 15.523 0 10 0z"
                fill="#3d2512" fill-opacity="0.7" stroke="#c8a97a" stroke-width="1.2"/>
            <circle cx="10" cy="10" r="3.5" fill="none" stroke="#c8a97a" stroke-width="1.2" opacity="0.8"/>
        </svg>
    `

    const popup = new maplibregl.Popup({
        offset: 10, closeButton: false, maxWidth: '200px', className: 'osm-popup-wrapper',
    }).setHTML(buildOsmPopupHTML(node))

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([node.lon, node.lat])
        .setPopup(popup)
        .addTo(map)

    osmMarkers.set(id, marker)
}

function addOsmAsDiamond(id, node, matchedPins) {
    const name = node.tags?.name ?? matchedPins[0]?.cafe_name ?? 'Café'
    const el = buildPinElement(name)

    const popupHTML = matchedPins.length === 1
        ? buildSinglePopupHTML(matchedPins[0])
        : buildGalleryPopupHTML(name, matchedPins)

    const popupClass = matchedPins.length === 1 ? 'snap-popup-wrapper' : 'gallery-popup-wrapper'

    const popup = new maplibregl.Popup({
        offset: 24, closeButton: true,
        maxWidth: matchedPins.length === 1 ? '260px' : '280px',
        className: popupClass,
    }).setHTML(popupHTML)

    const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([node.lon, node.lat])
        .setPopup(popup)
        .addTo(map)

    osmMarkers.set(id, marker)
}

// Upgrade an existing teardrop to a diamond when a user pin is matched
function upgradeOsmMarker(osmId) {
    const node = osmNodes.get(osmId)
    if (!node) return

    // Remove old teardrop
    const old = osmMarkers.get(osmId)
    if (old) { old.remove(); osmMarkers.delete(osmId) }

    const matched = matchingUserPins(node.lat, node.lon)
    if (matched.length > 0) addOsmAsDiamond(osmId, node, matched)
}

function buildOsmPopupHTML(node) {
    const tags = node.tags ?? {}
    const name = tags.name ?? 'Unknown café'
    const street = tags['addr:street'] ?? ''
    const housenr = tags['addr:housenumber'] ?? ''
    const address = [housenr, street].filter(Boolean).join(' ')
    const hours = tags['opening_hours'] ?? ''

    return `
        <div class="osm-popup">
            <p class="osm-popup__name">${name}</p>
            ${address ? `<p class="osm-popup__detail">${address}</p>` : ''}
            ${hours ? `<p class="osm-popup__hours">${hours}</p>` : ''}
            <p class="osm-popup__source">via OpenStreetMap</p>
        </div>
    `
}

function hideAllOsmMarkers() {
    for (const marker of osmMarkers.values()) marker.getElement().style.display = 'none'
}

function showAllOsmMarkers() {
    for (const marker of osmMarkers.values()) marker.getElement().style.display = ''
}

function cleanupOsmLayer() {
    clearTimeout(osmDebounceTimer)
    if (osmFetchController) osmFetchController.abort()
    for (const marker of osmMarkers.values()) marker.remove()
    osmMarkers.clear()
    osmNodes.clear()
}

// ─── User location ────────────────────────────────────────────────────────
function showUserLocation() {
    if (!navigator.geolocation || !map) return
    navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
            map.flyTo({ center: [coords.longitude, coords.latitude], zoom: 15, duration: 1200 })
            if (userLocationMarker) userLocationMarker.remove()
            const el = document.createElement('div')
            el.className = 'user-location-marker'
            userLocationMarker = new maplibregl.Marker({ element: el, anchor: 'center' })
                .setLngLat([coords.longitude, coords.latitude]).addTo(map)
        },
        (err) => console.warn('Location error:', err),
        { enableHighAccuracy: true }
    )
}

// ─── Map interactions ─────────────────────────────────────────────────────
function onMapClick(e) {
    if (!isAddingPin.value) return
    const { lng, lat } = e.lngLat
    selectedCoords.value = { lat, lng }
    showModal.value = true
    isAddingPin.value = false
    if (map) map.getCanvas().style.cursor = ''
}

function zoomIn() { map?.zoomIn() }
function zoomOut() { map?.zoomOut() }

function onAddPinClick() {
    isAddingPin.value = true
    if (map) map.getCanvas().style.cursor = 'crosshair'
}

function cancelAddPin() {
    isAddingPin.value = false
    if (map) map.getCanvas().style.cursor = ''
}

async function logout() { await auth.logout() }

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
    transition: background 0.2s;
}

.btn-add:hover {
    background: var(--espresso-light);
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

/* ── Lightbox ── */
.lightbox {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: rgba(16, 8, 4, 0.92);
    backdrop-filter: blur(8px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
}

.lightbox__close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: rgba(240, 230, 211, 0.1);
    border: 1px solid rgba(240, 230, 211, 0.2);
    color: #f0e6d3;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
}

.lightbox__close:hover {
    background: rgba(240, 230, 211, 0.2);
}

.lightbox__img-wrap {
    max-width: min(90vw, 680px);
    max-height: 70vh;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.5);
}

.lightbox__img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}

.lightbox__meta {
    text-align: center;
}

.lightbox__name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: #f0e6d3;
    margin-bottom: 4px;
}

.lightbox__date {
    font-size: 12px;
    color: #c8a97a;
    font-family: 'DM Mono', monospace;
}

.lightbox-enter-active,
.lightbox-leave-active {
    transition: opacity 0.2s;
}

.lightbox-enter-from,
.lightbox-leave-to {
    opacity: 0;
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

<style>
/* ── Community diamond pins ── */
.cafe-pin {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    filter: drop-shadow(0 2px 6px rgba(44, 26, 14, 0.4));
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
    transform: rotate(45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(44, 26, 14, 0.45);
    transition: transform 0.15s;
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
    pointer-events: none;
}

/* ── OSM teardrop pins ── */
.osm-pin {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0 1px 3px rgba(44, 26, 14, 0.35));
}

.osm-pin__svg {
    transition: transform 0.15s;
    transform-origin: bottom center;
}

.osm-pin:hover .osm-pin__svg {
    transform: scale(1.25);
}

/* ── OSM teardrop popup ── */
.osm-popup-wrapper .maplibregl-popup-content {
    padding: 10px 13px 11px;
    background: #faf6f0;
    border: 1px solid #ddd0b8;
    border-radius: 8px;
    box-shadow: 0 6px 20px rgba(44, 26, 14, 0.15);
    font-family: 'DM Sans', sans-serif;
}

.osm-popup-wrapper .maplibregl-popup-tip {
    border-top-color: #ddd0b8;
}

.osm-popup__name {
    font-family: 'Playfair Display', serif;
    font-size: 13px;
    font-weight: 600;
    color: #1a1008;
    margin-bottom: 3px;
}

.osm-popup__detail {
    font-size: 11px;
    color: #7a6550;
    margin-bottom: 2px;
}

.osm-popup__hours {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: #a8854f;
    margin-bottom: 4px;
}

.osm-popup__source {
    font-size: 10px;
    color: #b8a898;
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid #ede5d8;
}

/* ── Single photo popup ── */
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

/* ── Gallery popup ── */
.gallery-popup-wrapper .maplibregl-popup-content {
    padding: 0;
    background: #faf6f0;
    border: 1px solid #ddd0b8;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(44, 26, 14, 0.18);
    font-family: 'DM Sans', sans-serif;
}

.gallery-popup-wrapper .maplibregl-popup-tip {
    border-top-color: #ddd0b8;
}

.gallery-popup-wrapper .maplibregl-popup-close-button {
    color: #7a6550;
    font-size: 1rem;
    padding: 4px 8px;
}

.gallery-popup {
    padding: 12px 14px 14px;
}

.gallery-popup__name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: #1a1008;
    margin-bottom: 2px;
}

.gallery-popup__count {
    font-size: 11px;
    color: #7a6550;
    margin-bottom: 10px;
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
}

.gallery-grid__item {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    cursor: pointer;
    background: #ddd0b8;
    border-radius: 3px;
}

.gallery-grid__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.2s;
}

.gallery-grid__item:hover img {
    transform: scale(1.05);
}

.gallery-grid__overlay {
    position: absolute;
    inset: 0;
    background: rgba(44, 26, 14, 0);
    display: flex;
    align-items: flex-end;
    padding: 5px;
    transition: background 0.2s;
}

.gallery-grid__overlay span {
    font-size: 9px;
    color: #f0e6d3;
    line-height: 1.3;
    opacity: 0;
    transition: opacity 0.2s;
    font-family: 'DM Mono', monospace;
}

.gallery-grid__item:hover .gallery-grid__overlay {
    background: rgba(44, 26, 14, 0.4);
}

.gallery-grid__item:hover .gallery-grid__overlay span {
    opacity: 1;
}

/* ── Search marker ── */
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

/* ── User location marker ── */
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