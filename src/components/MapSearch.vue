<template>
    <div class="map-search" :class="{ focused: isFocused, 'has-results': results.length > 0 }">

        <!-- Input -->
        <div class="search-input-wrap">
            <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>

            <input ref="inputEl" v-model="query" type="text" placeholder="Search for a city, street, or place…"
                autocomplete="off" spellcheck="false" @focus="isFocused = true" @blur="onBlur"
                @keydown.down.prevent="highlightNext" @keydown.up.prevent="highlightPrev"
                @keydown.enter.prevent="selectHighlighted" @keydown.escape="close" />

            <!-- Clear button -->
            <button v-if="query" class="clear-btn" @mousedown.prevent @click="clear">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                </svg>
            </button>

            <!-- Spinner -->
            <span v-if="loading" class="search-spinner"></span>
        </div>

        <!-- Dropdown -->
        <Transition name="dropdown">
            <ul v-if="results.length > 0 && isFocused" class="search-results" role="listbox">
                <li v-for="(result, i) in results" :key="result.place_id" class="search-result-item"
                    :class="{ highlighted: i === highlightedIndex }" role="option" @mousedown.prevent
                    @click="selectResult(result)">
                    <span class="result-icon">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                        </svg>
                    </span>
                    <span class="result-text">
                        <span class="result-name">{{ result.name }}</span>
                        <span class="result-detail">{{ result.detail }}</span>
                    </span>
                </li>
            </ul>
        </Transition>

        <!-- No results -->
        <Transition name="dropdown">
            <div v-if="showNoResults" class="search-empty">
                No places found for "{{ lastQuery }}"
            </div>
        </Transition>

    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const emit = defineEmits(['fly-to'])

// ─── State ─────────────────────────────────────────────────────────────────
const inputEl = ref(null)
const query = ref('')
const results = ref([])
const loading = ref(false)
const isFocused = ref(false)
const highlightedIndex = ref(-1)
const showNoResults = ref(false)
const lastQuery = ref('')

// ─── Debounce ──────────────────────────────────────────────────────────────
let debounceTimer = null

watch(query, (val) => {
    clearTimeout(debounceTimer)
    showNoResults.value = false
    highlightedIndex.value = -1

    const trimmed = val.trim()

    if (!trimmed || trimmed.length < 2) {
        results.value = []
        loading.value = false
        return
    }

    loading.value = true
    debounceTimer = setTimeout(() => search(trimmed), 400)
})

// ─── Nominatim search ──────────────────────────────────────────────────────
// Free, no API key. Rate limit: 1 req/sec — the debounce handles this.
// Docs: https://nominatim.org/release-docs/latest/api/Search/
async function search(q) {
    try {
        const params = new URLSearchParams({
            q,
            format: 'jsonv2',
            addressdetails: '1',
            limit: '6',
            'accept-language': 'en',
        })

        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
            headers: {
                // Nominatim requires a descriptive User-Agent
                'User-Agent': 'CafeSnap/1.0 (portfolio project)',
            },
        })

        const data = await res.json()

        lastQuery.value = q
        results.value = data.map(formatResult)
        showNoResults.value = results.value.length === 0
    } catch (err) {
        console.error('Nominatim error:', err)
        results.value = []
    } finally {
        loading.value = false
    }
}

// ─── Format Nominatim result into something readable ───────────────────────
function formatResult(item) {
    const addr = item.address ?? {}

    // Primary name: the thing itself
    const name =
        item.name ||
        addr.road ||
        addr.neighbourhood ||
        addr.suburb ||
        item.display_name.split(',')[0]

    // Detail line: city + country
    const city = addr.city || addr.town || addr.municipality || addr.county || ''
    const country = addr.country || ''
    const detail = [city, country].filter(Boolean).join(', ')

    return {
        place_id: item.place_id,
        name,
        detail,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
    }
}

// ─── Keyboard navigation ───────────────────────────────────────────────────
function highlightNext() {
    if (!results.value.length) return
    highlightedIndex.value = (highlightedIndex.value + 1) % results.value.length
}

function highlightPrev() {
    if (!results.value.length) return
    highlightedIndex.value =
        highlightedIndex.value <= 0
            ? results.value.length - 1
            : highlightedIndex.value - 1
}

function selectHighlighted() {
    if (highlightedIndex.value >= 0 && results.value[highlightedIndex.value]) {
        selectResult(results.value[highlightedIndex.value])
    }
}

// ─── Select a result ───────────────────────────────────────────────────────
function selectResult(result) {
    query.value = result.name
    results.value = []
    showNoResults.value = false
    isFocused.value = false
    inputEl.value?.blur()

    // Emit coordinates up to MapView
    emit('fly-to', { lat: result.lat, lon: result.lon })
}

// ─── Helpers ───────────────────────────────────────────────────────────────
function onBlur() {
    // Small delay so clicks on results register before blur hides the list
    setTimeout(() => {
        isFocused.value = false
    }, 150)
}

function clear() {
    query.value = ''
    results.value = []
    showNoResults.value = false
    inputEl.value?.focus()
}

function close() {
    isFocused.value = false
    inputEl.value?.blur()
}
</script>

<style scoped>
.map-search {
    --espresso: #2c1a0e;
    --cream: #f0e6d3;
    --cream-dark: #ddd0b8;
    --gold: #c8a97a;
    --muted: #7a6550;
    --paper: #faf6f0;

    position: relative;
    width: 420px;
    max-width: calc(100vw - 32px);
    font-family: 'DM Sans', sans-serif;
}

/* ─── Input wrap ─────────────────────────────────────────────────────────── */
.search-input-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(250, 246, 240, 0.97);
    border: 1px solid var(--cream-dark);
    border-radius: 10px;
    padding: 0 14px;
    height: 44px;
    box-shadow: 0 4px 20px rgba(44, 26, 14, 0.12);
    transition: border-color 0.2s, box-shadow 0.2s;
}

.map-search.focused .search-input-wrap {
    border-color: var(--gold);
    box-shadow: 0 4px 24px rgba(44, 26, 14, 0.16), 0 0 0 3px rgba(200, 169, 122, 0.15);
}

.map-search.has-results .search-input-wrap {
    border-radius: 10px 10px 0 0;
    border-bottom-color: transparent;
    box-shadow: 0 -2px 20px rgba(44, 26, 14, 0.1);
}

.search-icon {
    color: var(--muted);
    flex-shrink: 0;
}

input {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    font-size: 14px;
    font-family: inherit;
    color: var(--espresso);
    min-width: 0;
}

input::placeholder {
    color: var(--muted);
    opacity: 0.7;
}

/* ─── Clear button ───────────────────────────────────────────────────────── */
.clear-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
    padding: 2px;
    border-radius: 4px;
    transition: color 0.15s;
    flex-shrink: 0;
}

.clear-btn:hover {
    color: var(--espresso);
}

/* ─── Spinner ────────────────────────────────────────────────────────────── */
.search-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--cream-dark);
    border-top-color: var(--gold);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ─── Results dropdown ───────────────────────────────────────────────────── */
.search-results {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(250, 246, 240, 0.97);
    border: 1px solid var(--gold);
    border-top: none;
    border-radius: 0 0 10px 10px;
    list-style: none;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(44, 26, 14, 0.14);
    z-index: 20;
}

.search-result-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    transition: background 0.15s;
    border-top: 1px solid rgba(221, 208, 184, 0.5);
}

.search-result-item:first-child {
    border-top: none;
}

.search-result-item:hover,
.search-result-item.highlighted {
    background: rgba(200, 169, 122, 0.12);
}

.result-icon {
    color: var(--gold);
    flex-shrink: 0;
    margin-top: 2px;
}

.result-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.result-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--espresso);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.result-detail {
    font-size: 11px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* ─── No results ─────────────────────────────────────────────────────────── */
.search-empty {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(250, 246, 240, 0.97);
    border: 1px solid var(--gold);
    border-top: none;
    border-radius: 0 0 10px 10px;
    padding: 12px 14px;
    font-size: 13px;
    color: var(--muted);
    box-shadow: 0 8px 24px rgba(44, 26, 14, 0.14);
    z-index: 20;
}

/* ─── Transitions ────────────────────────────────────────────────────────── */
.dropdown-enter-active {
    transition: opacity 0.15s, transform 0.15s;
}

.dropdown-leave-active {
    transition: opacity 0.1s;
}

.dropdown-enter-from {
    opacity: 0;
    transform: translateY(-4px);
}

.dropdown-leave-to {
    opacity: 0;
}
</style>