import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null)
    const resolved = ref(false) // true once we've checked Supabase for a session

    // ─── Init: called once by the router guard on first load ───────────────────
    async function init() {
        const { data } = await supabase.auth.getSession()
        user.value = data.session?.user ?? null
        resolved.value = true

        // Keep user in sync when session changes (login, logout, token refresh)
        supabase.auth.onAuthStateChange((_event, session) => {
            user.value = session?.user ?? null
        })
    }

    // ─── Register ──────────────────────────────────────────────────────────────
    async function register(email, password) {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        user.value = data.user
        return data
    }

    // ─── Login ─────────────────────────────────────────────────────────────────
    async function login(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if (error) throw error
    }

    // ─── Logout ────────────────────────────────────────────────────────────────
    async function logout() {
        await supabase.auth.signOut()
        user.value = null
    }

    return { user, resolved, init, register, login, logout }
})