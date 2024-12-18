<template>
    <div>
        <LoadingOverlay />
        <router-view />
    </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import LoadingOverlay from '~/components/LoadingOverlay.vue'

// Create global loading state
const isLoading = ref(false)
const loadingMessage = ref('Enteni Diluk...')

// Provide the loading state globally
provide('isLoading', isLoading)
provide('loadingMessage', loadingMessage)
</script>