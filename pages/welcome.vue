<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white p-16 rounded-lg shadow-lg w-full max-w-lg text-center">
        <h2 class="text-2xl font-bold mb-4 text-red-600">Welcome</h2>
        <p>Halo, {{ name }} {{ email }} {{ id }}</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  console.log(route.query)
  const name = ref(route.query.name || '')
  const email = ref(route.query.email || '')
  const id = ref(route.query.id || '')
  </script>
  
  <style scoped>
  </style>