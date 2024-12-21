<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-16 rounded-lg shadow-lg w-full max-w-lg text-center">
      <h2 class="text-2xl font-bold mb-4 text-red-600">Welcome</h2>
      <p v-if="user">ID: {{ user.id }}</p>
      <p v-if="user">Name: {{ user.name }}</p>
      <p v-if="user">Email: {{ user.email }}</p>
      <button @click="logout" class="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
        Metu
      </button>
      <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const user = ref(null)
const errorMessage = ref('')
const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE

onMounted(async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No token found')
    }
    user.value = await $fetch(`${ipBE}/api/member/card`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage.value = 'Failed to fetch user information'
    // Redirect to login if there's an error fetching user data
    await navigateTo({
        path: '/login'
    })
  }
})

async function logout() {
  localStorage.removeItem('access_token')
  await navigateTo({
    path: '/login'
  })
}
</script>

<style scoped></style>