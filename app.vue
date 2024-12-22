<template>
    <div>
        <LoadingOverlay />
        <NuxtPage/>
    </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import LoadingOverlay from '~/components/LoadingOverlay.vue'

const isLoading = ref(false)
const loadingMessage = ref('Enteni Diluk...')

provide('isLoading', isLoading)
provide('loadingMessage', loadingMessage)
</script>