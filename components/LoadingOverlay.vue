<template>
    <div v-if="isLoading" class="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div class="text-center">
        <div class="loader"></div>
        <p class="text-red-600 mt-4">{{ message }}</p>
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
    border: 4px solid rgba(239, 68, 68, 0.3); /* Light red */
    border-radius: 50%;
    border-top: 4px solid #ef4444; /* Red */
    width: 50px;
    height: 50px;
    animation: spin 0.8s linear infinite;
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