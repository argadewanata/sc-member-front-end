<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 relative px-4">
    <div class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
      <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 text-red-600">Arek Surabaya Community</h2>
      <div class="flex justify-center mb-6">
        <img src="/LogoSC_Hitam.png" alt="Logo" class="h-24 sm:h-32 md:h-40" />
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="email"
            class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4"
            required />
        </div>
        <div class="mb-6 relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
              class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
              required />
            <button type="button" @click="togglePassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
              <Icon :name="showPassword ? 'mdi-eye-off' : 'mdi-eye'" class="text-gray-500" />
            </button>
          </div>
        </div>
        <button type="submit"
          class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
          Mlebu
        </button>
      </form>
      <div class="mt-4 flex justify-between items-center">
        <a href="#" @click.prevent="forgotPassword" class="text-sm text-red-500 hover:underline">Lali Sandi?</a>
        <a href="#" @click.prevent="openRegisterPopup" class="text-sm text-red-500 hover:underline">Nggae Akun Anyar</a>
      </div>
      <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>

      <!-- Forgot Password Popup -->
      <div v-if="showForgotPopup"
        class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg shadow-lg">
        <div class="bg-white p-6 rounded-lg shadow-lg text-center">
          <p class="mb-4">Silakan Kontak Admin</p>
          <button @click="closePopup" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRuntimeConfig } from '#app'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const showForgotPopup = ref(false)
const showRegisterPopup = ref(false)
const user = ref(null)

// Inject the global loading state
const isLoading = inject('isLoading')
const loadingMessage = inject('loadingMessage')

const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE

function togglePassword() {
  showPassword.value = !showPassword.value
}

function forgotPassword() {
  showForgotPopup.value = true
}

async function openRegisterPopup() {
  await navigateTo({
    path: '/register'
  })
}

function closePopup() {
  showForgotPopup.value = false
  showRegisterPopup.value = false
}

async function handleLogin() {
  isLoading.value = true
  loadingMessage.value = 'Enteni Diluk...'
  try {
    const response = await $fetch(`${ipBE}/api/auth/login`, {
      method: 'POST',
      body: { email: email.value, password: password.value }
    })
    const { access_token } = response
    localStorage.setItem('access_token', access_token)

    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('No token found')
    }
    const user = await $fetch(`${ipBE}/api/member/card`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (password.value === user.nomor_whatsapp) {
      await navigateTo('/change-password')
    } else if (user.is_admin) {
      await navigateTo('/admin')
    } else {
      await navigateTo('/welcome')
    }
  } catch (error) {
    errorMessage.value = 'Invalid email or password'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>