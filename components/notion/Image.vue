<script setup>
import { computed } from 'vue';

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

// Obtener la URL de la imagen
const imageUrl = computed(() => {
    return props.block.image?.file?.url || props.block.image?.external?.url || '';
});

// Obtener el texto alternativo / leyenda de la imagen
const caption = computed(() => {
    return props.block.image?.caption?.[0]?.plain_text || '';
});
</script>

<template>
    <figure class="my-6">
        <img :src="imageUrl" :alt="caption" class="rounded max-w-full h-auto mx-auto" loading="lazy" />
        <figcaption v-if="caption" class="text-sm text-center mt-2 text-gray-500">
            {{ caption }}
        </figcaption>
    </figure>
</template>
