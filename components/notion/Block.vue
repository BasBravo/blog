<script setup>
defineProps({
    block: {
        type: Object,
        required: true,
    },
});
</script>

<template>
    <div>
        <NotionParagraph v-if="block.type === 'paragraph'" :block="block" />
        <!-- <NotionHeading1 v-else-if="block.type === 'heading_1'" :block="block" />
        <NotionHeading2 v-else-if="block.type === 'heading_2'" :block="block" />
        <NotionHeading3 v-else-if="block.type === 'heading_3'" :block="block" />
        <NotionImage v-else-if="block.type === 'image'" :block="block" />
        <NotionColumnList v-else-if="block.type === 'column_list'" :block="block" />
        <NotionColumn v-else-if="block.type === 'column'" :block="block" />
        <NotionBulletedListItem v-else-if="block.type === 'bulleted_list_item'" :block="block" />
        <NotionNumberedListItem v-else-if="block.type === 'numbered_list_item'" :block="block" />
        <NotionQuote v-else-if="block.type === 'quote'" :block="block" />
        <NotionCallout v-else-if="block.type === 'callout'" :block="block" />
        <NotionToggle v-else-if="block.type === 'toggle'" :block="block" />
        <NotionToDo v-else-if="block.type === 'to_do'" :block="block" />
        <NotionDivider v-else-if="block.type === 'divider'" :block="block" />
        <NotionTableOfContents v-else-if="block.type === 'table_of_contents'" :block="block" />
        <NotionTable v-else-if="block.type === 'table'" :block="block" />
        <NotionBreadcrumb v-else-if="block.type === 'breadcrumb'" :block="block" />
        <NotionEmbed v-else-if="block.type === 'embed'" :block="block" />
        <NotionLinkPreview v-else-if="block.type === 'link_preview'" :block="block" />
        <NotionCode v-else-if="block.type === 'code'" :block="block" />
        <NotionFile v-else-if="block.type === 'file'" :block="block" />
        <NotionVideo v-else-if="block.type === 'video'" :block="block" />
        <NotionAudio v-else-if="block.type === 'audio'" :block="block" />
        <NotionBookmark v-else-if="block.type === 'bookmark'" :block="block" /> -->
        <div v-else class="text-gray-500 italic">Bloque sin tipo definido</div>
    </div>
</template>
