<script setup>
import { computed } from 'vue';

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

// Obtener el texto del código
const codeText = computed(() => {
    return props.block.code?.rich_text?.[0]?.plain_text || '';
});

// Obtener el lenguaje de programación
const language = computed(() => {
    return props.block.code?.language || 'plain text';
});
</script>

<template>
    <pre class="bg-gray-800 text-white p-4 rounded my-4 overflow-x-auto">
    <code :class="`language-${language}`">{{ codeText }}</code>
  </pre>
</template>
