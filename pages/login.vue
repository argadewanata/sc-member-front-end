<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
      <h2 class="text-center text-2xl font-bold mb-8 text-red-600">Login</h2>
      <div class="flex justify-center mb-6">
        <img src="/LogoSC_Hitam.png" alt="Logo" class="h-40" /> 
      </div>
      <h1 class="text-center text-xl font-semibold mb-2">Surabaya Community </h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Login
        </button>
      </form>
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const config = useRuntimeConfig()

async function handleLogin() {
  try {
    const response = await $fetch(`${config.public.ipBE}/api/auth/login`, {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    // Handle successful login
    console.log('Login successful:', response)
  } catch (error) {
    errorMessage.value = 'Invalid email or password'
    console.error('Login error:', error)
  }
}
</script>

<style scoped>
</style>