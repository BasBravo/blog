<script setup>
import { computed } from 'vue';

const props = defineProps({
    block: {
        type: Object,
        required: true,
    },
});

// Función para renderizar el texto enriquecido
const renderRichText = richTextArray => {
    if (!richTextArray || richTextArray.length === 0) return '';

    return richTextArray.map(textObj => {
        const text = textObj.plain_text || '';
        const annotations = textObj.annotations || {};

        return {
            text: text,
            bold: annotations.bold || false,
            italic: annotations.italic || false,
            strikethrough: annotations.strikethrough || false,
            underline: annotations.underline || false,
            code: annotations.code || false,
            color: annotations.color !== 'default' ? annotations.color : null,
            href: textObj.href || null,
        };
    });
};

const richText = computed(() => {
    return renderRichText(props.block.quote?.rich_text || []);
});
</script>

<template>
    <blockquote class="pl-4 border-l-4 border-gray-300 italic my-4">
        <template v-for="(textPart, index) in richText" :key="index">
            <span
                :class="{
                    'font-bold': textPart.bold,
                    italic: textPart.italic,
                    'line-through': textPart.strikethrough,
                    underline: textPart.underline,
                    'bg-gray-100 px-1 rounded font-mono': textPart.code,
                }"
                :style="textPart.color ? { color: textPart.color } : {}">
                <a v-if="textPart.href" :href="textPart.href" target="_blank" class="text-blue-600 hover:underline">
                    {{ textPart.text }}
                </a>
                <template v-else>{{ textPart.text }}</template>
            </span>
        </template>
    </blockquote>
</template>
