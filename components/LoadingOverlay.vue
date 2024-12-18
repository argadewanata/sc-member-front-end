<template>
    <div v-if="isLoading" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div class="text-center">
            <div class="loader"></div>
            <p class="text-white mt-4">{{ message }}</p>
        </div>
    </div>
</template>

<script setup>
import { inject } from 'vue'

const isLoading = inject('isLoading')
const message = inject('loadingMessage')
</script>

<style scoped>
.loader {
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top: 4px solid white;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>