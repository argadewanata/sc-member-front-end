<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="bg-white p-16 rounded-lg shadow-lg w-full max-w-lg text-center">
            <h2 class="text-2xl font-bold mb-4 text-red-600">Welcome</h2>
            <p v-if="user">ID: {{ user.id }}</p>
            <p v-if="user">Name: {{ user.name }}</p>
            <p v-if="user">Email: {{ user.email }}</p>
            <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useRouter } from '#app'

const user = ref(null)
const errorMessage = ref('')
const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE
const router = useRouter()

onMounted(async () => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No token found')
    }
    console.log(token)
    user.value = await $fetch(`${ipBE}/api/member/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  } catch (error) {
    errorMessage.value = 'Failed to fetch user information'
    console.error('Error fetching user data:', error)
  }
})
</script>

<style scoped></style>