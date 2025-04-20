<script setup>
// Importación eliminada, NotionBlock se auto-importa

defineProps({
    // ...existing code...
});
</script>

<template>
    <div>
        <NotionBlock v-for="block in blocks" :key="block.id" :block="block" />
    </div>
</template>

<style scoped>
/* ...existing styles... */
</style>
