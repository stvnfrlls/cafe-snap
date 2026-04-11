import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import LandingPage from '@/components/LandingPage.vue'
import AuthPage from '@/components/AuthPage.vue'
import MapView from '@/components/MapView.vue'

const routes = [
    {
        path: '/',
        component: LandingPage,
        meta: { guestOnly: false },
    },
    {
        path: '/auth',
        component: AuthPage,
        meta: { guestOnly: true },   // logged-in users shouldn't see this
    },
    {
        path: '/map',
        component: MapView,
        meta: { requiresAuth: true }, // must be logged in
    },
]

const router = createRouter({
    history: createWebHashHistory(), // hash mode → no server config needed
    routes,
})

// ─── Auth guard ───────────────────────────────────────────────────────────────
router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // Wait for Supabase session to be resolved on first load
    if (!auth.resolved) await auth.init()

    if (to.meta.requiresAuth && !auth.user) {
        return { path: '/auth' }
    }

    if (to.meta.guestOnly && auth.user) {
        return { path: '/map' }
    }
})

export default router