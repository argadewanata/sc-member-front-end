<template>

</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from '#app'

const router = useRouter()

onMounted(() => {
    router.push('/login')
})
</script>

<style scoped></style>