import { createRouter, createWebHistory } from 'vue-router'
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
        meta: { requiresAuth: false },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// ─── Auth guard ───────────────────────────────────────────────────────────────
router.beforeEach(async (to) => {
    const auth = useAuthStore()

    // wait until Supabase session is resolved
    if (!auth.resolved) {
        await auth.init()
    }

    const requiresAuth = to.meta.requiresAuth

    // block protected routes
    if (requiresAuth && !auth.user) {
        return '/auth'
    }

    // prevent logged-in users from seeing login page
    if (to.path === '/auth' && auth.user) {
        return '/map'
    }

    return true
})

export default router