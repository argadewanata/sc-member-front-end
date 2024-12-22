<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative px-4">
        <div class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg">
            <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 text-red-600">Add New Member</h2>
            <form @submit.prevent="addMember">
                <div class="mb-4 relative">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" v-model="name"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-12 px-4"
                        required />
                </div>
                <div class="mb-4 relative">
                    <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" v-model="email"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-12 px-4 pr-10"
                        required />
                    <Icon v-if="email.value" :name="isEmailValid ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="isEmailValid ? 'text-green-500' : 'text-red-500'" />
                </div>
                <div class="mb-4 relative">
                    <label for="whatsapp" class="block text-sm font-medium text-gray-700">Nomor WhatsApp</label>
                    <input type="text" id="whatsapp" v-model="whatsapp"
                        class="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-12 px-4 pr-10"
                        required />
                    <p class="text-gray-500 text-sm mt-1">Contoh Nomor Whatsapp: 08123456789</p>
                    <Icon v-if="whatsapp.value" :name="isWhatsappValid ? 'mdi-check-circle' : 'mdi-close-circle'"
                        class="absolute right-3 top-10 text-xl"
                        :class="isWhatsappValid ? 'text-green-500' : 'text-red-500'" />
                </div>
                <button type="submit"
                    class="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Add Member
                </button>
            </form>
            <button @click="goBack"
                class="mt-4 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none">
                Back
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRuntimeConfig, useRouter } from '#app'

const name = ref('')
const email = ref('')
const whatsapp = ref('')
const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE
const router = useRouter()

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const whatsappPattern = /^08\d*$/

const isEmailValid = computed(() => emailPattern.test(email.value))
const isWhatsappValid = computed(() => whatsappPattern.test(whatsapp.value))

async function addMember() {
    if (!isEmailValid.value) {
        alert('Please enter a valid email address.')
        return
    }
    if (!isWhatsappValid.value) {
        alert('Please enter a valid WhatsApp number.')
        return
    }

    try {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }
        await $fetch(`${ipBE}/api/member/add`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: { nama_lengkap: name.value, email: email.value, nomor_whatsapp: whatsapp.value }
        })
        alert('Member added successfully')
        router.push('/admin')
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert('Email already exists')
        } else {
            console.error('Error adding member:', error)
            alert('Failed to add member')
        }
    }
}

function goBack() {
    router.push('/admin')
}
</script>

<style scoped></style>