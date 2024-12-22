<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative px-4">
        <div v-if="isLoading" class="text-center text-lg sm:text-xl md:text-2xl font-bold text-red-600">
            Loading...
        </div>
        <div v-else-if="hasPermission" class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg">
            <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 text-red-600">Member Details</h2>
            <div v-if="member">
                <p><strong>ID:</strong> {{ member.id }}</p>
                <p><strong>Name:</strong> {{ member.nama_lengkap || 'N/A' }}</p>
                <p><strong>Email:</strong> {{ member.email || 'N/A' }}</p>
                <p><strong>WhatsApp:</strong> {{ member.nomor_whatsapp || 'N/A' }}</p>
                <p><strong>Province:</strong> {{ member.provinsi || 'N/A' }}</p>
                <p><strong>City:</strong> {{ member.kota || 'N/A' }}</p>
                <p><strong>District:</strong> {{ member.kecamatan || 'N/A' }}</p>
                <p><strong>Sub-district:</strong> {{ member.kelurahan || 'N/A' }}</p>
                <p><strong>Full Address:</strong> {{ member.alamat_lengkap || 'N/A' }}</p>
                <p><strong>Gender:</strong> {{ member.jenis_kelamin || 'N/A' }}</p>
                <p><strong>Date of Birth:</strong> {{ member.tanggal_lahir || 'N/A' }}</p>
                <p><strong>Last Education:</strong> {{ member.pendidikan_terakhir || 'N/A' }}</p>
                <p><strong>Profession:</strong> {{ member.profesi || 'N/A' }}</p>
                <p><strong>Reference:</strong> {{ member.referensi || 'N/A' }}</p>
                <p><strong>Expectation:</strong> {{ member.harapan || 'N/A' }}</p>
                <p><strong>Verified:</strong> {{ member.is_verified ? 'Yes' : 'No' }}</p>
                <p><strong>Active:</strong> {{ member.is_active ? 'Yes' : 'No' }}</p>
                <p><strong>Admin:</strong> {{ member.is_admin ? 'Yes' : 'No' }}</p>
            </div>
            <button @click="goBack"
                class="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
                Back
            </button>
        </div>
        <div v-else class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-lg text-center">
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

function goBack() {
    router.push('/admin')
}
</script>

<style scoped></style>