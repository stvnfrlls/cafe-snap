<template>
    <div class="auth-page">

        <div class="grain" aria-hidden="true"></div>

        <!-- Left panel — brand -->
        <div class="auth-left">
            <div class="auth-left-inner">
                <RouterLink to="/" class="auth-logo">
                    <svg width="40" height="40" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                        <rect width="64" height="64" rx="14" fill="#3d2512" />
                        <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round"
                            d="M22 22 Q21 18 22 14" />
                        <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round"
                            d="M32 21 Q31 17 32 13" />
                        <path fill="none" stroke="#c8a97a" stroke-width="2" stroke-linecap="round"
                            d="M42 22 Q41 18 42 14" />
                        <path fill="none" stroke="#f0e6d3" stroke-width="3" stroke-linecap="round"
                            stroke-linejoin="round" d="M18 26 L20 46 Q20.5 49 24 49 L40 49 Q43.5 49 44 46 L46 26 Z" />
                        <path fill="none" stroke="#f0e6d3" stroke-width="3" stroke-linecap="round"
                            d="M46 32 Q52 32 52 38 Q52 44 46 44" />
                        <ellipse cx="32" cy="51.5" rx="10" ry="2" fill="none" stroke="#f0e6d3" stroke-width="2.5" />
                        <circle cx="32" cy="37" r="4" fill="#c8a97a" />
                        <path fill="#c8a97a" d="M32 41 L28.5 47.5 Q30.5 46 32 47.5 Q33.5 46 35.5 47.5 Z" />
                    </svg>
                    <span class="auth-logo-text">Cafe Snap</span>
                </RouterLink>

                <div class="auth-brand-copy">
                    <h2 class="auth-brand-title">
                        Every great cup<br>deserves a <em>pin.</em>
                    </h2>
                    <p class="auth-brand-body">
                        Join a community of café hunters pinning their finds on a living, photo-first map.
                    </p>
                </div>

                <div class="auth-deco">
                    <div class="deco-card deco-card-1">
                        <div class="deco-card-img" style="background:#5a3820;"></div>
                        <div class="deco-card-foot">
                            <span class="deco-card-name">Kape ni Lola</span>
                            <span class="deco-card-loc">Cebu City</span>
                        </div>
                    </div>
                    <div class="deco-card deco-card-2">
                        <div class="deco-card-img" style="background:#3d2512;"></div>
                        <div class="deco-card-foot">
                            <span class="deco-card-name">Muni Muni</span>
                            <span class="deco-card-loc">Poblacion, Makati</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right panel — form -->
        <div class="auth-right">
            <div class="auth-form-wrap">

                <div class="auth-tabs">
                    <button class="auth-tab" :class="{ active: mode === 'login' }" @click="switchMode('login')">
                        Sign in
                    </button>
                    <button class="auth-tab" :class="{ active: mode === 'register' }" @click="switchMode('register')">
                        Create account
                    </button>
                </div>

                <Transition name="fade">
                    <div v-if="errorMsg" class="auth-error">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                        </svg>
                        {{ errorMsg }}
                    </div>
                </Transition>

                <Transition name="fade">
                    <div v-if="successMsg" class="auth-success">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <path d="M22 4 12 14.01l-3-3" />
                        </svg>
                        {{ successMsg }}
                    </div>
                </Transition>

                <Transition name="slide" mode="out-in">
                    <!-- LOGIN -->
                    <form v-if="mode === 'login'" key="login" class="auth-form" @submit.prevent="handleLogin">
                        <div class="field">
                            <label for="login-email">Email</label>
                            <input id="login-email" v-model="email" type="email" placeholder="you@email.com"
                                autocomplete="email" required />
                        </div>
                        <div class="field">
                            <label for="login-password">Password</label>
                            <div class="input-wrap">
                                <input id="login-password" v-model="password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="••••••••" autocomplete="current-password" required />
                                <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                                    <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn-submit" :disabled="loading">
                            <span v-if="loading" class="spinner"></span>
                            <span v-else>Sign in</span>
                        </button>
                        <p class="auth-switch">
                            No account?
                            <button type="button" class="link-btn" @click="switchMode('register')">Create one</button>
                        </p>
                    </form>

                    <!-- REGISTER -->
                    <form v-else key="register" class="auth-form" @submit.prevent="handleRegister">
                        <div class="field">
                            <label for="reg-email">Email</label>
                            <input id="reg-email" v-model="email" type="email" placeholder="you@email.com"
                                autocomplete="email" required />
                        </div>
                        <div class="field">
                            <label for="reg-password">Password</label>
                            <div class="input-wrap">
                                <input id="reg-password" v-model="password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="At least 6 characters" autocomplete="new-password" minlength="6"
                                    required />
                                <button type="button" class="toggle-pw" @click="showPassword = !showPassword">
                                    <svg v-if="!showPassword" width="15" height="15" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round">
                                        <path
                                            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M1 1l22 22" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <button type="submit" class="btn-submit" :disabled="loading">
                            <span v-if="loading" class="spinner"></span>
                            <span v-else>Create account</span>
                        </button>
                        <p class="auth-switch">
                            Already have an account?
                            <button type="button" class="link-btn" @click="switchMode('login')">Sign in</button>
                        </p>
                    </form>
                </Transition>

                <p class="auth-footer-note">
                    By continuing you agree that this is a portfolio project<br>and your data is stored securely via
                    Supabase.
                </p>

            </div>
        </div>

    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const mode = ref('login')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

function switchMode(next) {
    mode.value = next
    errorMsg.value = ''
    successMsg.value = ''
}

function clearMessages() {
    errorMsg.value = ''
    successMsg.value = ''
}

async function handleLogin() {
    clearMessages()
    loading.value = true
    try {
        await auth.login(email.value, password.value)
        router.push('/map')
    } catch (err) {
        errorMsg.value = err.message ?? 'Login failed. Please try again.'
    } finally {
        loading.value = false
    }
}

async function handleRegister() {
    clearMessages()
    loading.value = true
    try {
        await auth.register(email.value, password.value)
        successMsg.value = 'Account created! Check your email to confirm, then sign in.'
        mode.value = 'login'
        email.value = ''
        password.value = ''
    } catch (err) {
        errorMsg.value = err.message ?? 'Registration failed. Please try again.'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.auth-page {
    --espresso: #2c1a0e;
    --espresso-mid: #3d2512;
    --espresso-light: #5a3820;
    --cream: #f0e6d3;
    --cream-dark: #ddd0b8;
    --gold: #c8a97a;
    --gold-dark: #a8854f;
    --muted: #7a6550;
    --paper: #faf6f0;

    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 100vh;
    font-family: 'DM Sans', sans-serif;
    position: relative;
}

.grain {
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
}

/* ─── Left ───────────────────────────────────────────────────────────────── */
.auth-left {
    background: var(--espresso);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 56px;
    position: relative;
    overflow: hidden;
}

.auth-left-inner {
    display: flex;
    flex-direction: column;
    gap: 48px;
    max-width: 360px;
    width: 100%;
    position: relative;
    z-index: 1;
}

.auth-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
}

.auth-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 600;
    color: var(--cream);
    letter-spacing: -0.02em;
}

.auth-brand-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 400;
    line-height: 1.15;
    color: var(--cream);
    letter-spacing: -0.02em;
    margin-bottom: 16px;
}

.auth-brand-title em {
    font-style: italic;
    color: var(--gold);
}

.auth-brand-body {
    font-size: 14px;
    line-height: 1.7;
    color: rgba(240, 230, 211, 0.55);
    font-weight: 300;
}

.auth-deco {
    position: relative;
    height: 180px;
}

.deco-card {
    position: absolute;
    width: 160px;
    background: var(--paper);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
}

.deco-card-1 {
    left: 0;
    top: 0;
    transform: rotate(-5deg);
}

.deco-card-2 {
    left: 90px;
    top: 24px;
    transform: rotate(3deg);
    z-index: 1;
}

.deco-card-img {
    width: 100%;
    height: 90px;
}

.deco-card-foot {
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.deco-card-name {
    font-family: 'Playfair Display', serif;
    font-size: 12px;
    font-weight: 600;
    color: var(--espresso);
}

.deco-card-loc {
    font-size: 10px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
}

/* ─── Right ──────────────────────────────────────────────────────────────── */
.auth-right {
    background: var(--paper);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 56px;
}

.auth-form-wrap {
    width: 100%;
    max-width: 360px;
}

/* ─── Tabs ───────────────────────────────────────────────────────────────── */
.auth-tabs {
    display: flex;
    border: 1px solid var(--cream-dark);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 28px;
}

.auth-tab {
    flex: 1;
    padding: 10px 0;
    background: transparent;
    border: none;
    font-family: inherit;
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.auth-tab.active {
    background: var(--espresso);
    color: var(--cream);
}

/* ─── Banners ────────────────────────────────────────────────────────────── */
.auth-error,
.auth-success {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 6px;
    font-size: 13px;
    line-height: 1.5;
    margin-bottom: 20px;
}

.auth-error {
    background: #fdf0ee;
    border: 1px solid #f5c6c0;
    color: #8b3a30;
}

.auth-success {
    background: #eef5f0;
    border: 1px solid #b8d9c0;
    color: #2d6b3f;
}

/* ─── Form ───────────────────────────────────────────────────────────────── */
.auth-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-size: 12px;
    font-weight: 500;
    color: var(--espresso);
    letter-spacing: 0.02em;
}

.field input,
.input-wrap input {
    width: 100%;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid var(--cream-dark);
    border-radius: 6px;
    font-size: 14px;
    font-family: inherit;
    color: var(--espresso);
    outline: none;
    transition: border-color 0.2s;
}

.field input:focus,
.input-wrap input:focus {
    border-color: var(--gold);
}

.input-wrap {
    position: relative;
}

.input-wrap input {
    padding-right: 40px;
}

.toggle-pw {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--muted);
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.2s;
}

.toggle-pw:hover {
    color: var(--espresso);
}

.btn-submit {
    width: 100%;
    padding: 12px;
    background: var(--espresso);
    color: var(--cream);
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
}

.btn-submit:hover:not(:disabled) {
    background: var(--espresso-light);
}

.btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(240, 230, 211, 0.3);
    border-top-color: var(--cream);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.auth-switch {
    text-align: center;
    font-size: 13px;
    color: var(--muted);
    margin-top: 4px;
}

.link-btn {
    background: none;
    border: none;
    color: var(--gold-dark);
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    text-underline-offset: 2px;
}

.link-btn:hover {
    color: var(--espresso);
}

.auth-footer-note {
    margin-top: 32px;
    font-size: 11px;
    line-height: 1.6;
    color: var(--cream-dark);
    text-align: center;
}

/* ─── Transitions ────────────────────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(12px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-12px);
}

/* ─── Responsive ─────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
    .auth-page {
        grid-template-columns: 1fr;
    }

    .auth-left {
        display: none;
    }

    .auth-right {
        padding: 48px 28px;
    }
}
</style>