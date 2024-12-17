<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="bg-white p-16 rounded-lg shadow-lg w-full max-w-lg text-center">
            <h2 class="text-2xl font-bold mb-4 text-red-600">Welcome</h2>
            <p>ID: {{ id }}</p>
            <p>Nama: {{ name }}</p>
            <p>Email: {{ email }}</p>
        </div>
    </div>
</template>

<script setup>
import { useRoute } from '#app'

const route = useRoute()
const name = route.query.name || ''
const email = route.query.email || ''
const id = route.query.id || ''
</script>

<style scoped></style>