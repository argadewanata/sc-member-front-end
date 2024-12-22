<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 relative px-4">
        <div class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
            <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 text-red-600">Change Password</h2>
            <form @submit.prevent="handleChangePassword">
                <div class="mb-4 relative">
                    <label for="newPassword" class="block text-sm font-medium text-gray-700">New Password</label>
                    <input :type="showPassword ? 'text' : 'password'" id="newPassword" v-model="newPassword"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
                        required />
                    <Icon v-if="newPassword" :name="isPasswordValid ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="isPasswordValid ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="mb-6 relative">
                    <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700">Confirm New
                        Password</label>
                    <input :type="showPassword ? 'text' : 'password'" id="confirmNewPassword"
                        v-model="confirmNewPassword"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 text-sm h-12 px-4 pr-10"
                        required />
                    <Icon v-if="confirmNewPassword" :name="!passwordMismatch ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="!passwordMismatch ? 'text-green-500' : 'text-red-500'" />
                </div>
                <button type="submit"
                    class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Change Password
                </button>
            </form>
            <p v-if="errorMessage" class="mt-4 text-red-500 text-center">{{ errorMessage }}</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRuntimeConfig, useRouter } from '#app'

const newPassword = ref('')
const confirmNewPassword = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE
const router = useRouter()

const isPasswordValid = computed(() => newPassword.value.length >= 6)
const passwordMismatch = computed(() => newPassword.value !== confirmNewPassword.value)

async function handleChangePassword() {
    if (!isPasswordValid.value) {
        errorMessage.value = 'Password must be at least 6 characters.'
        return
    }
    if (passwordMismatch.value) {
        errorMessage.value = 'Passwords do not match.'
        return
    }

    try {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }
        await $fetch(`${ipBE}/api/auth/change-password`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: { newPassword: newPassword.value }
        })
        await router.push('/welcome')
    } catch (error) {
        errorMessage.value = 'Failed to change password. Please try again.'
        console.error('Change password error:', error)
    }
}
</script>

<style scoped></style>