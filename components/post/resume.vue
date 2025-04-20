<script setup>
// PROPS /////////////////////////////////////////////////

const props = defineProps({
    post: { type: Object, required: true },
});
</script>

<template>
    <article>
        <!-- Categoría -->
        <p class="text-xs uppercase tracking-wider text-yellow-700 mb-1">{{ post.category || 'CATEGORY' }}</p>
        <!-- Color y estilo de categoría -->

        <!-- Título -->
        <NuxtLink :to="`/posts/${post.slug}`" class="block mb-2">
            <h2 class="text-2xl hover:underline">{{ post.title }}</h2>
            <!-- Título del post -->
        </NuxtLink>

        <!-- Descripción -->
        <p class="text-gray-600 mb-3 leading-relaxed">
            {{ post.description || 'Description placeholder...' }}
            <!-- Descripción -->
        </p>

        <!-- Metadatos del Post -->
        <div class="text-sm text-gray-500">
            <span>{{ useFormatDate(post.publishDate) }}</span>
            <span v-if="post.readingTime">· {{ post.readingTime }} min read</span>
            <!-- Tiempo de lectura -->
        </div>
    </article>
</template>
