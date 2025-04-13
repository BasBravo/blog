<script setup>
// Modificamos la línea para acceder a los artículos desde la respuesta
const { data: posts, refresh, pending, error } = await useFetch('/api/notion/posts');
// Computamos los posts a partir de la respuesta

const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};
</script>

<template>
    <div class="container mx-auto px-4 py-8">
        <!-- Encabezado del Blog -->
        <header class="text-center mb-12">
            <h1 class="text-5xl font-bold mb-3">Blog</h1>
            <p class="text-xl text-gray-600">Artículos y reflexiones</p>
        </header>

        <!-- Estado de carga -->
        <div v-if="pending" class="flex justify-center py-10">
            <ULoading />
        </div>

        <!-- Mensaje de error -->
        <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-triangle">Error al cargar los artículos. Por favor, intenta nuevamente.</UAlert>

        <!-- Lista de Posts -->
        <div v-if="posts && posts.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <UCard
                v-for="post in posts"
                :key="post.id"
                :ui="{
                    body: { base: 'flex flex-col flex-1' },
                    footer: { base: 'border-t border-gray-200 pt-4' },
                }">
                <!-- Imagen de portada -->
                <template v-if="post.featuredImageUrl" #header>
                    <img :src="post.featuredImageUrl" :alt="post.title" class="h-48 w-full object-cover" />
                </template>

                <!-- Contenido del post -->
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2 text-sm text-gray-500">
                        <span>{{ formatDate(post.publishDate) }}</span>
                        <span class="text-xs">•</span>
                        <span>{{ post.author }}</span>
                    </div>

                    <h2 class="text-xl font-bold mb-2 line-clamp-2">
                        {{ post.title }}
                    </h2>

                    <div class="mb-2">
                        <UBadge color="blue" variant="subtle">{{ post.category }}</UBadge>
                    </div>
                </div>

                <!-- Footer con tags -->
                <template #footer>
                    <div class="flex flex-wrap gap-2">
                        <UBadge v-for="tag in post.tags" :key="tag" color="gray" variant="subtle" size="sm">
                            {{ tag }}
                        </UBadge>
                    </div>
                </template>

                <!-- Enlace al post completo -->
                <template #action>
                    <NuxtLink :to="`/posts/${post.slug}`">
                        <UButton color="primary" variant="ghost" class="w-full">Leer más</UButton>
                    </NuxtLink>
                </template>
            </UCard>
        </div>

        <!-- Mensaje cuando no hay posts -->
        <div v-else-if="!pending && !error" class="text-center py-10">
            <p class="text-gray-500">No hay artículos disponibles actualmente.</p>
        </div>
    </div>
</template>
