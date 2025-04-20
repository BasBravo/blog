<script setup>
import { computed } from 'vue';
// Importar las utilidades desde el archivo notion.ts
import { mapColorToClass, getRichTextClasses, codeTagClasses, linkClasses } from '~/utils/notion';

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

// Computed property to get classes for the paragraph block itself (for background colors)
const paragraphClasses = computed(() => {
    const blockColor = props.block.paragraph?.color;
    if (blockColor && blockColor.endsWith('_background')) {
        // Add padding and rounding for block-level backgrounds
        // Use the imported mapColorToClass function
        return `${mapColorToClass(blockColor)} p-2 rounded`;
    }
    return '';
});
</script>

<template>
    <p v-if="block.paragraph?.rich_text?.length" :class="paragraphClasses" class="my-1">
        <template v-for="(richText, index) in block.paragraph.rich_text" :key="`${block.id}-${index}`">
            <a v-if="richText.href" :href="richText.href" target="_blank" rel="noopener noreferrer" :class="[getRichTextClasses(richText.annotations), linkClasses]">
                {{ richText.plain_text }}
            </a>
            <code v-else-if="richText.annotations.code" :class="[getRichTextClasses(richText.annotations), codeTagClasses]">
                {{ richText.plain_text }}
            </code>
            <span v-else :class="getRichTextClasses(richText.annotations)">
                {{ richText.plain_text }}
            </span>
        </template>
    </p>
    <!-- Handle empty paragraphs (render a placeholder or an empty line) -->
    <p v-else-if="block.paragraph" class="my-1 h-6">
        <!-- Render a line break for empty paragraphs -->
        &nbsp;
    </p>
</template>
