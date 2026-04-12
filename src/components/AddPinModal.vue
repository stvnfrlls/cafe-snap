<template>
    <Transition name="modal">
        <div class="backdrop" @click.self="close">
            <div class="modal">

                <div class="modal__header">
                    <div>
                        <h2 class="modal__title">Drop a pin</h2>
                        <p class="modal__coords">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                <circle cx="12" cy="9" r="2.5" />
                            </svg>
                            {{ props.lat.toFixed(5) }}, {{ props.lng.toFixed(5) }}
                        </p>
                    </div>
                    <button class="modal__close" @click="close" title="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="submit">

                    <div class="field">
                        <label class="field__label">Café name</label>
                        <input v-model="cafeName" type="text" class="field__input" placeholder="e.g. Kape ni Lola"
                            required autofocus />
                    </div>

                    <div class="field">
                        <label class="field__label">Photo</label>
                        <label class="upload" :class="{ 'upload--has-preview': preview }">
                            <input type="file" accept="image/*" @change="onFileChange" required />

                            <div v-if="!preview" class="upload__empty">
                                <div class="upload__icon">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path d="M21 15l-5-5L5 21" />
                                    </svg>
                                </div>
                                <span class="upload__text">Click to upload a photo</span>
                                <span class="upload__hint">JPG, PNG, WEBP</span>
                            </div>

                            <div v-else class="upload__preview">
                                <img :src="preview" alt="Preview" />
                                <div class="upload__change">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    Change photo
                                </div>
                            </div>
                        </label>
                    </div>

                    <p v-if="error" class="error">{{ error }}</p>

                    <div class="modal__actions">
                        <button type="button" class="btn btn--ghost" @click="close">Cancel</button>
                        <button type="submit" class="btn btn--primary" :disabled="loading">
                            <span v-if="loading" class="btn__spinner" />
                            {{ loading ? 'Saving…' : 'Save pin' }}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { usePinsStore } from '@/stores/pins'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
    lat: Number,
    lng: Number,
})

const emit = defineEmits(['close', 'created'])

const pinsStore = usePinsStore()
const auth = useAuthStore()

const cafeName = ref('')
const file = ref(null)
const preview = ref(null)
const loading = ref(false)
const error = ref(null)

function onFileChange(e) {
    const f = e.target.files[0]
    if (!f) return
    file.value = f
    preview.value = URL.createObjectURL(f)
}

function close() {
    emit('close')
}

async function submit() {
    if (!file.value || !cafeName.value) return
    error.value = null
    loading.value = true
    try {
        const newPin = await pinsStore.addPin({
            cafeName: cafeName.value,
            lat: props.lat,
            lng: props.lng,
            imageFile: file.value,
            userId: auth.user.id,
        })
        emit('created', newPin)
        close()
    } catch (err) {
        error.value = err.message
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
/* ── Variables ── */
.backdrop {
    --espresso: #2c1a0e;
    --espresso-light: #5a3820;
    --cream: #f0e6d3;
    --cream-dark: #ddd0b8;
    --gold: #c8a97a;
    --muted: #7a6550;
    --paper: #faf6f0;
    --ink: #1a1008;
}

/* ── Backdrop ── */
.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(26, 16, 8, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 16px;
}

/* ── Modal ── */
.modal {
    width: 100%;
    max-width: 400px;
    background: var(--paper);
    border: 1px solid var(--cream-dark);
    border-radius: 14px;
    box-shadow: 0 24px 48px rgba(26, 16, 8, 0.25), 0 4px 12px rgba(26, 16, 8, 0.1);
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
}

/* ── Header ── */
.modal__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 20px 20px 0;
}

.modal__title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 4px;
}

.modal__coords {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--muted);
}

.modal__close {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid var(--cream-dark);
    border-radius: 6px;
    color: var(--muted);
    cursor: pointer;
    flex-shrink: 0;
    transition: border-color 0.15s, color 0.15s;
}

.modal__close:hover {
    border-color: var(--espresso);
    color: var(--espresso);
}

/* ── Form ── */
form {
    padding: 16px 20px 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field__label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--muted);
}

.field__input {
    width: 100%;
    padding: 9px 12px;
    border: 1px solid var(--cream-dark);
    border-radius: 7px;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
}

.field__input::placeholder {
    color: #b8a898;
}

.field__input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(200, 169, 122, 0.15);
}

/* ── Upload ── */
.upload {
    display: block;
    border: 1.5px dashed var(--cream-dark);
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    transition: border-color 0.15s, background 0.15s;
}

.upload:hover {
    border-color: var(--gold);
    background: rgba(200, 169, 122, 0.04);
}

.upload--has-preview {
    border-style: solid;
    border-color: var(--cream-dark);
}

.upload input {
    display: none;
}

.upload__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 28px 16px;
}

.upload__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(200, 169, 122, 0.12);
    border: 1px solid rgba(200, 169, 122, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    margin-bottom: 4px;
}

.upload__text {
    font-size: 13px;
    color: var(--ink);
    font-weight: 500;
}

.upload__hint {
    font-size: 11px;
    color: var(--muted);
}

.upload__preview {
    position: relative;
}

.upload__preview img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.upload__change {
    position: absolute;
    bottom: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    background: rgba(26, 16, 8, 0.75);
    backdrop-filter: blur(6px);
    border-radius: 5px;
    color: #f0e6d3;
    font-size: 11px;
    font-weight: 500;
}

/* ── Error ── */
.error {
    font-size: 12px;
    color: #c0392b;
    background: rgba(192, 57, 43, 0.07);
    border: 1px solid rgba(192, 57, 43, 0.2);
    border-radius: 6px;
    padding: 8px 12px;
}

/* ── Actions ── */
.modal__actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding-top: 2px;
}

.btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.btn--ghost {
    background: transparent;
    border: 1px solid var(--cream-dark);
    color: var(--muted);
}

.btn--ghost:hover {
    border-color: var(--espresso);
    color: var(--espresso);
}

.btn--primary {
    background: var(--espresso);
    border: 1px solid var(--espresso);
    color: var(--cream);
}

.btn--primary:hover:not(:disabled) {
    background: var(--espresso-light);
    border-color: var(--espresso-light);
}

.btn--primary:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.btn__spinner {
    width: 12px;
    height: 12px;
    border: 2px solid rgba(240, 230, 211, 0.3);
    border-top-color: #f0e6d3;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* ── Modal transition ── */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.97) translateY(8px);
}
</style>