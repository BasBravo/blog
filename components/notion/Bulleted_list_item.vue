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
    return renderRichText(props.block.bulleted_list_item?.rich_text || []);
});
</script>

<template>
    <li class="ml-6 my-1 list-disc">
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

        <!-- Renderizar bloques hijos si existen -->
        <div v-if="block.children && block.children.length > 0" class="ml-4 mt-1">
            <NotionBlock v-for="childBlock in block.children" :key="childBlock.id" :block="childBlock" />
        </div>
    </li>
</template>
