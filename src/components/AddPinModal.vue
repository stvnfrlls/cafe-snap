<template>
    <div class="backdrop" @click.self="close">
        <div class="modal">

            <div class="header">
                <h2>Add café</h2>
                <button class="close" @click="close">×</button>
            </div>

            <form @submit.prevent="submit">

                <div class="field">
                    <label>Café name</label>
                    <input v-model="cafeName" type="text" placeholder="Kape ni Lola" required />
                </div>

                <div class="field">
                    <label>Photo</label>

                    <label class="upload">
                        <input type="file" accept="image/*" @change="onFileChange" required />

                        <div v-if="!preview" class="empty">
                            Click to upload image
                        </div>

                        <img v-else :src="preview" />
                    </label>

                </div>

                <div class="actions">
                    <button type="button" class="btn" @click="close">
                        Cancel
                    </button>

                    <button type="submit" class="btn primary" :disabled="loading">
                        {{ loading ? 'Saving...' : 'Save pin' }}
                    </button>
                </div>

            </form>

        </div>
    </div>
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

    try {
        loading.value = true

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
        console.error(err)
        alert(err.message)
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.backdrop {
    position: fixed;
    inset: 0;
    background: rgba(26, 16, 8, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

.modal {
    width: 420px;
    background: var(--paper);
    border: 1px solid var(--cream-dark);
    padding: 16px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
}

.header h2 {
    font-family: "Playfair Display", serif;
    font-size: 18px;
    font-weight: 600;
    color: var(--espresso);
}

.close {
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
    color: var(--muted);
    padding: 4px;
}

.field {
    margin-bottom: 12px;
}

label {
    display: block;
    font-size: 11px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 6px;
    font-family: "DM Sans", sans-serif;
}

input[type="text"] {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--cream-dark);
    background: #fff;
    font-family: "DM Sans", sans-serif;
    font-size: 14px;
    outline: none;
}

input[type="text"]:focus {
    border-color: var(--gold);
}

.upload {
    display: block;
    border: 1px solid var(--cream-dark);
    background: #fff;
    cursor: pointer;
}

.upload input {
    display: none;
}

.empty {
    padding: 18px;
    font-size: 13px;
    color: var(--muted);
    font-family: "DM Sans", sans-serif;
}

.upload img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    display: block;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 14px;
}

.btn {
    padding: 8px 10px;
    border: 1px solid var(--cream-dark);
    background: transparent;
    font-family: "DM Sans", sans-serif;
    font-size: 13px;
    cursor: pointer;
    color: var(--muted);
}

.btn.primary {
    background: var(--espresso);
    color: var(--cream);
    border-color: var(--espresso);
}
</style>