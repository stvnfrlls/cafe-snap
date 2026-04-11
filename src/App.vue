<template>
  <component :is="currentView" />
</template>

<script setup>
import { computed } from 'vue'
import LandingPage from './components/LandingPage.vue'

/**
 * Simple hash-based routing — no vue-router needed yet.
 * / or #/         → LandingPage
 *
 * When you're ready to add login/register, swap this out
 * for vue-router and add route guards using the auth store.
 */

import { ref, onMounted, onBeforeUnmount } from 'vue'

const hash = ref(window.location.hash)

function onHashChange() {
  hash.value = window.location.hash
}

onMounted(() => window.addEventListener('hashchange', onHashChange))
onBeforeUnmount(() => window.removeEventListener('hashchange', onHashChange))

const currentView = computed(() => {
  return LandingPage
})
</script>

<style>
/* Fonts — also add these to your index.html <head> */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');

/* Global resets and font imports — scoped styles live inside each component */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}
</style>