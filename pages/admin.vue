<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 relative px-4">
        <div v-if="isLoading" class="text-center text-lg sm:text-xl md:text-2xl font-bold text-red-600">
            Loading...
        </div>
        <div v-else>
            <div v-if="hasPermission" class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-3xl">
                <button @click="logout"
                    class="mt-6 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
                    Metu
                </button>
                <h2 class="text-center text-lg sm:text-xl md:text-2xl font-bold mb-4 text-red-600">Admin Dashboard</h2>
                <div class="flex justify-between items-center mb-4">
                    <span class="text-sm text-gray-700">Page {{ page }} of {{ totalPages }}</span>
                    <span class="text-sm text-gray-700">Total Members: {{ totalMembers }}</span>
                    <select v-model="size" @change="fetchMembers" class="border border-gray-300 rounded-lg text-sm">
                        <option v-for="option in pageSizeOptions" :key="option" :value="option">{{ option }} per page
                        </option>
                    </select>
                </div>
                <div class="mb-4 flex">
                    <input v-model="searchQuery" type="text" placeholder="Search by name, email, or phone"
                        class="w-full border border-gray-300 rounded-lg py-2 px-4" />
                    <button @click="searchMembers"
                        class="ml-2 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
                        Search
                    </button>
                </div>
                <div v-if="members.length === 0 && searchQuery !== ''" class="text-center text-red-500 mb-4">
                    Tidak ada member dengan nama/email/nomor berikut "{{ searchQuery }}"
                </div>
                <div class="overflow-x-auto">
                    <table v-if="members.length > 0" class="min-w-full table-fixed divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th scope="col"
                                    class="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ID
                                </th>
                                <th scope="col"
                                    class="w-2/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th scope="col"
                                    class="w-3/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col"
                                    class="w-2/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    WhatsApp
                                </th>
                                <th scope="col"
                                    class="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Verified
                                </th>
                                <th scope="col"
                                    class="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active
                                </th>
                                <th scope="col"
                                    class="w-1/12 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Admin
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="member in members" :key="member.id">
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{ member.id
                                    }}</td>
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{
                                    member.nama_lengkap }}</td>
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{
                                    member.email }}</td>
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{
                                    member.nomor_whatsapp }}</td>
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{
                                    member.is_verified ? 'Yes' : 'No' }}</td>
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{
                                    member.is_active ? 'Yes' : 'No' }}</td>
                                <td class="px-3 py-4 whitespace-nowrap overflow-hidden overflow-ellipsis">{{
                                    member.is_admin ? 'Yes' : 'No' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-if="members.length > 0" class="flex justify-between mt-4">
                    <button @click="previousPage" :disabled="page === 1"
                        class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none disabled:opacity-50">
                        Previous
                    </button>
                    <select v-model="page" @change="fetchMembers" class="border border-gray-300 rounded-lg text-sm">
                        <option v-for="p in totalPages" :key="p" :value="p">Page {{ p }}</option>
                    </select>
                    <button @click="nextPage" :disabled="page === totalPages"
                        class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none disabled:opacity-50">
                        Next
                    </button>
                </div>
            </div>
            <div v-else class="bg-white p-4 sm:p-8 md:p-12 lg:p-16 rounded-lg shadow-lg w-full max-w-3xl text-center">
                <h2 class="text-xl font-bold mb-4 text-red-600">You don't have permission to access this page.</h2>
                <button @click="logout"
                    class="mt-4 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none">
                    Metu
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRuntimeConfig, useRouter } from '#app'

const members = ref([])
const searchQuery = ref('')
const page = ref(1)
const size = ref(5)
const totalPages = ref(1)
const totalMembers = ref(0)
const pageSizeOptions = [5, 10, 20, 50]
const runtimeConfig = useRuntimeConfig()
const ipBE = runtimeConfig.public.ipBE
const router = useRouter()
const hasPermission = ref(false)
const isLoading = ref(true)

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
            await fetchMembers()
        }
    } catch (error) {
        console.error('Error fetching user data:', error)
        await router.push('/login')
    } finally {
        isLoading.value = false
    }
})

// Watch for changes in the searchQuery and reset to default view if cleared
watch(searchQuery, (newQuery) => {
    if (newQuery === '') {
        page.value = 1
        fetchMembers()
    }
})

async function fetchMembers() {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }
        const response = await $fetch(`${ipBE}/api/member/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                page: page.value,
                size: size.value
            }
        })
        members.value = response.members
        totalMembers.value = response.total
        totalPages.value = Math.ceil(response.total / size.value)
    } catch (error) {
        console.error('Error fetching members:', error)
    }
}

async function searchMembers() {
    try {
        const token = localStorage.getItem('access_token')
        if (!token) {
            throw new Error('No token found')
        }
        page.value = 1  // Reset page to 1 when searching
        const response = await $fetch(`${ipBE}/api/member/search`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                search: searchQuery.value,
                page: page.value,
                size: size.value
            }
        })
        members.value = response.members
        totalMembers.value = response.total
        totalPages.value = Math.ceil(response.total / size.value)
    } catch (error) {
        console.error('Error searching members:', error)
    }
}

async function logout() {
    localStorage.removeItem('access_token')
    await router.push('/login')
}

function nextPage() {
    if (page.value < totalPages.value) {
        page.value++
        fetchMembers()
    }
}

function previousPage() {
    if (page.value > 1) {
        page.value--
        fetchMembers()
    }
}
</script>

<style scoped>
.table-fixed {
    table-layout: fixed;
}

.overflow-ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>