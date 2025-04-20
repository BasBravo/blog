<script setup>
// DATA //////////////////////////////////////////

const route = useRoute();
const slug = route.params.slug;

// Obtener el post de la API
// Asumiendo que la API devuelve 'readingTime' como en index.vue
const { data: post, refresh, pending, error } = await useFetch(`/api/notion/posts/${slug}`);

// Redireccionar si el post no existe
if (error.value && error.value.statusCode === 404) {
    // Usar navigateTo para una redirección del lado del cliente a la página 404 o al índice
    await navigateTo('/', { replace: true }); // O a una página 404 dedicada
} else if (error.value) {
    // Lanzar un error fatal para otros tipos de errores
    throw createError({ statusCode: 500, statusMessage: 'Error al cargar el artículo' });
}

// Formatear la fecha como en la imagen (ej: 18 March, 2023)
const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-US', options); // Usar 'es-ES' para formato español si se prefiere
};

// Configuración de meta tags para SEO (sin cambios)
useSeoMeta({
    title: post.value?.title || 'Artículo',
    description: post.value?.seoKeywords || '',
    ogTitle: post.value?.title || 'Artículo',
    ogDescription: post.value?.seoKeywords || '',
    ogImage: post.value?.featuredImageUrl || '',
    ogType: 'article',
    twitterCard: 'summary_large_image',
    twitterTitle: post.value?.title || 'Artículo',
    twitterDescription: post.value?.seoKeywords || '',
    twitterImage: post.value?.featuredImageUrl || '',
});
</script>

<template>
    <div class="min-h-screen">
        <!-- Color de fondo y texto base -->
        <div class="max-w-3xl mx-auto px-4 py-8">
            <!-- Contenido principal del post -->
            <main>
                <!-- Estado de carga -->
                <div v-if="pending" class="flex justify-center py-20">
                    <p>Loading article...</p>
                    <!-- Placeholder simple para carga -->
                </div>

                <!-- Mensaje de error (manejado en script setup con redirección o error fatal) -->
                <!-- Se podría añadir un mensaje aquí si no se usa error fatal -->

                <!-- Contenido del post -->
                <article v-if="post && !pending">
                    <!-- Botón Volver y Título/Metadatos -->
                    <div class="mb-10">
                        <NuxtLink to="/" class="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                            <!-- No text needed based on image -->
                        </NuxtLink>

                        <h1 class="text-4xl font-serif font-medium mb-3">{{ post.title }}</h1>
                        <div class="text-sm text-gray-500">
                            <span>{{ formatDate(post.publishDate) }}</span>
                            <span v-if="post.readingTime">· {{ post.readingTime }} min read</span>
                            <!-- Asumiendo que readingTime existe -->
                        </div>
                    </div>

                    <!-- Contenido del post (Notion Blocks) -->
                    <!-- Aplicar estilos base para el contenido, prose puede ser un buen punto de partida -->
                    <!-- Los estilos específicos (ej. CHAPTER 1) deben manejarse dentro de NotionBlock/subcomponentes o con overrides de prose -->
                    <div
                        class="prose prose-lg max-w-none font-sans prose-headings:font-serif prose-h2:text-xl prose-h2:font-medium prose-p:text-gray-700 prose-p:leading-relaxed">
                        <template v-if="post.content && post.content.length > 0">
                            <NotionBlock v-for="block in post.content" :key="block.id" :block="block" />
                        </template>
                        <div v-else class="my-10 text-center text-gray-500">No content available for this article.</div>
                    </div>
                </article>
            </main>
        </div>
    </div>
</template>

<style>
/* Importar fuentes si es necesario y no están en Tailwind config */
/* @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&family=Inter:wght@400;500&display=swap'); */

/* Aplicar fuentes base si se importan */
/* body { font-family: 'Inter', sans-serif; } */
/* .font-serif { font-family: 'Lora', serif; } */

/* Estilos específicos para los bloques de Notion si no se manejan en componentes */
/* .prose .notion-heading-1, .prose .notion-heading-2, .prose .notion-heading-3 { font-family: 'Lora', serif; } */

/* Estilo específico para "CHAPTER X" como en la imagen (requiere estructura específica en Notion o post-procesamiento) */
/* .prose p.chapter-indicator { text-transform: uppercase; font-size: 0.8em; color: #a0aec0; margin-bottom: 0.25rem; } */
</style>
