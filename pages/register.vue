<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 relative px-4">
        <div class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
            <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 text-red-600">Daftar</h2>
            <form @submit.prevent="handleRegister">
                <div class="mb-4 relative">
                    <label for="name" class="block text-sm font-medium text-gray-700">Nama</label>
                    <input type="text" id="name" v-model="name"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4"
                        required />
                </div>
                <div class="mb-4 relative">
                    <label for="email" class="block text-sm font-medium text-gray-700">E-mail</label>
                    <input type="email" id="email" v-model="email"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
                        required />
                    <Icon v-if="email.value" :name="isEmailValid ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="isEmailValid ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="mb-4 relative">
                    <label for="whatsapp" class="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                    <input type="text" id="whatsapp" v-model="whatsapp"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
                        required />
                    <p class="text-gray-500 text-sm mt-1">Contoh Nomor Whatsapp: 08123456789</p>
                    <Icon v-if="whatsapp.value" :name="isWhatsappValid ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="isWhatsappValid ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="mb-4 relative">
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
                        required />
                    <Icon v-if="password.value" :name="isPasswordValid ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="isPasswordValid ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="mb-6 relative">
                    <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Konfirmasi
                        Password</label>
                    <input :type="showPassword ? 'text' : 'password'" id="confirmPassword" v-model="confirmPassword"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
                        required />
                    <Icon v-if="confirmPassword.value"
                        :name="!passwordMismatch ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="!passwordMismatch ? 'text-green-500' : 'text-red-500'" />
                </div>
                <button type="submit"
                    class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Daftar
                </button>
            </form>
            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
            <div class="mt-4 text-center">
                <a href="#" @click.prevent="redirectToLogin" class="text-sm text-red-500 hover:underline">Wes nduwe akun
                    SC</a>
            </div>

            <!-- Success/Failure Popup -->
            <div v-if="showPopup"
                class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg shadow-lg">
                <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                    <p class="mb-4">{{ popupMessage }}</p>
                    <button @click="closePopup" class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRuntimeConfig } from '#app'

const name = ref('')
const email = ref('')
const whatsapp = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const showPopup = ref(false)
const popupMessage = ref('')

const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const whatsappPattern = /^08\d*$/

const isEmailValid = computed(() => emailPattern.test(email.value))
const isWhatsappValid = computed(() => whatsappPattern.test(whatsapp.value))
const isPasswordValid = computed(() => password.value.length >= 6)
const passwordMismatch = computed(() => password.value !== confirmPassword.value)

async function handleRegister() {
    if (!isEmailValid.value) {
        errorMessage.value = 'Tolong masukkan alamat email yang bener.'
        return
    }
    if (!isWhatsappValid.value) {
        errorMessage.value = 'Tolong masukkan nomor WhatsApp yang bener.'
        return
    }
    if (!isPasswordValid.value) {
        errorMessage.value = 'Password minimal 6 karakter, lho.'
        return
    }
    if (passwordMismatch.value) {
        errorMessage.value = 'Password-nya kok nggak sama?'
        return
    }

    try {
        await $fetch(`${ipBE}/api/auth/register`, {
            method: 'POST',
            body: { name: name.value, email: email.value, whatsapp: whatsapp.value, password: password.value }
        })
        popupMessage.value = 'Registration successful!'
        showPopup.value = true
    } catch (error) {
        popupMessage.value = 'Failed to register. Please try again.'
        showPopup.value = true
        console.error('Registration error:', error)
    }
}

async function closePopup() {
    showPopup.value = false
    if (popupMessage.value === 'Registration successful!') {
        await navigateTo({
            path: '/login'
        })
    }
}

async function redirectToLogin() {
    await navigateTo({
        path: '/login'
    })
}
</script>

<style scoped></style>