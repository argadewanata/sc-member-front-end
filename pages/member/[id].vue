<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative px-4">
        <div v-if="isLoading" class="text-center text-lg sm:text-xl md:text-2xl font-bold text-red-600">
            Loading...
        </div>
        <div v-else-if="hasPermission"
            class="bg-white p-6 sm:p-10 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg">
            <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-6 text-red-600">Member Details</h2>
            <div v-if="member" class="space-y-4">
                <div class="flex justify-between">
                    <span><strong>ID:</strong></span>
                    <span>{{ member.id }}</span>
                </div>
                <div class="flex justify-between">
                    <span><strong>Name:</strong></span>
                    <span>{{ member.nama_lengkap || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                    <span><strong>Email:</strong></span>
                    <span>{{ member.email || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                    <span><strong>WhatsApp:</strong></span>
                    <span>{{ member.nomor_whatsapp || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                    <span><strong>Province:</strong></span>
                    <span>{{ member.provinsi || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                    <span><strong>City:</strong></span>
                    <span>{{ member.kota || 'N/A' }}</span>
                </div>
                <div class="flex justify-between">
                    <span><strong>Verified:</strong></span>
                    <span v-if="!isEditMode">{{ member.is_verified ? 'Yes' : 'No' }}</span>
                    <input v-else type="checkbox" v-model="member.is_verified" />
                </div>
                <div class="flex justify-between">
                    <span><strong>Active:</strong></span>
                    <span v-if="!isEditMode">{{ member.is_active ? 'Yes' : 'No' }}</span>
                    <input v-else type="checkbox" v-model="member.is_active" />
                </div>
            </div>
            <div class="flex justify-between mt-6">
                <button @click="toggleEditMode"
                    class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none">
                    {{ isEditMode ? 'Save' : 'Edit' }}
                </button>
                <button @click="goBack"
                    class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
                    Back
                </button>
            </div>
        </div>
        <div v-else class="bg-white p-6 sm:p-10 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg text-center">
            <h2 class="text-xl font-bold mb-4 text-red-600">You don't have permission to access this page.</h2>
            <button @click="goBack"
                class="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
                Back
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig, useRouter, useRoute } from '#app'

const member = ref(null)
const isLoading = ref(true)
const hasPermission = ref(false)
const isEditMode = ref(false)
const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE
const router = useRouter()
const route = useRoute()

onMounted(async () => {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }
        const user = await $fetch(`${ipBE}/api/member/card`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        hasPermission.value = user.is_admin
        if (hasPermission.value) {
            const response = await $fetch(`${ipBE}/api/member/detail/${route.params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            member.value = response
        }
    } catch (error) {
        console.error('Error fetching member details:', error)
        await router.push('/login')
    } finally {
        isLoading.value = false
    }
})

async function toggleEditMode() {
    if (isEditMode.value) {
        try {
            const token = localStorage.getItem('access_token')
            if (!token) {
                throw new Error('No token found')
            }
            await $fetch(`${ipBE}/api/member/update/${route.params.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: { is_verified: member.value.is_verified, is_active: member.value.is_active }
            })
            alert('Member updated successfully')
        } catch (error) {
            console.error('Error updating member:', error)
            alert('Failed to update member')
        }
    }
    isEditMode.value = !isEditMode.value
}

function goBack() {
    router.push('/admin')
}
</script>

<style scoped>
.space-y-4>*+* {
    margin-top: 1rem;
}
</style>