<script setup>
import { useSeoMeta, ref } from '#imports';
import { useNotion } from '~/composables/useNotion';

const route = useRoute();
const slug = route.params.slug;
const newComment = ref('');
const commentLoading = ref(false);
const commentSuccess = ref(false);
const commentError = ref(null);
const { renderBlock } = useNotion();

// Obtener el post de la API
const { data: post, refresh, pending, error } = await useFetch(`/api/notion/posts/${slug}`);

// Redireccionar si el post no existe
if (error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' });
}

// Formatear la fecha de publicación
const formatDate = dateString => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
};

// Función para enviar un comentario
const submitComment = async () => {
    if (!newComment.value || !post.value?.id) return;

    commentLoading.value = true;
    commentSuccess.value = false;
    commentError.value = null;

    try {
        await $fetch('/api/comments/add', {
            method: 'POST',
            body: {
                pageId: post.value.id,
                comment: newComment.value,
            },
        });

        // Limpiar el campo y mostrar mensaje de éxito
        newComment.value = '';
        commentSuccess.value = true;

        // Refrescar el post para mostrar el nuevo comentario
        setTimeout(() => {
            refresh();
        }, 1000);
    } catch (err) {
        commentError.value = 'Error al enviar el comentario. Por favor, inténtalo de nuevo.';
        console.error('Error al enviar comentario:', err);
    } finally {
        commentLoading.value = false;
    }
};

// Configuración de meta tags para SEO
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
    <div class="container mx-auto px-4 py-8">
        <!-- Estado de carga -->
        <div v-if="pending" class="flex justify-center py-20">
            <ULoading size="lg" />
        </div>

        <!-- Mensaje de error -->
        <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="my-8">
            Error al cargar el artículo. Por favor, intenta nuevamente.
        </UAlert>

        <!-- Contenido del post -->
        <article v-if="post && !pending" class="max-w-4xl mx-auto">
            <!-- Cabecera del post -->
            <header class="mb-8">
                <!-- Imagen de portada -->
                <div v-if="post.featuredImageUrl" class="mb-6">
                    <img :src="post.featuredImageUrl" :alt="post.title" class="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" />
                </div>

                <!-- Metadatos del post -->
                <div class="mb-4">
                    <div class="flex items-center gap-3 text-sm text-gray-500 mb-2">
                        <span>{{ formatDate(post.publishDate) }}</span>
                        <span class="text-xs">•</span>
                        <span>{{ post.author }}</span>
                    </div>

                    <!-- Categoría -->
                    <div class="mb-3">
                        <UBadge color="blue" variant="subtle" size="md">
                            {{ post.category }}
                        </UBadge>
                    </div>

                    <!-- Tags -->
                    <div class="flex flex-wrap gap-2 mb-4">
                        <UBadge v-for="tag in post.tags" :key="tag" color="gray" variant="subtle" size="sm">
                            {{ tag }}
                        </UBadge>
                    </div>
                </div>

                <!-- Título del post -->
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    {{ post.title }}
                </h1>

                <!-- SEO Keywords como subtítulo -->
                <p v-if="post.seoKeywords" class="text-xl text-gray-600">
                    {{ post.seoKeywords }}
                </p>
            </header>

            <!-- Contenido del post -->
            <div class="prose prose-lg max-w-none">
                <!-- Renderizamos cada bloque del contenido de Notion -->
                <template v-if="post.content && post.content.length > 0">
                    <div v-for="block in post.content" :key="block.id">
                        <div v-html="renderBlock(block)"></div>
                    </div>
                </template>
                <div v-else class="my-10 text-center text-gray-500">No hay contenido disponible para este artículo.</div>
            </div>

            <!-- Sección de comentarios -->
            <section class="mt-16 pt-8 border-t border-gray-200">
                <h2 class="text-2xl font-bold mb-6">Comentarios</h2>

                <!-- Lista de comentarios existentes -->
                <div v-if="post.comments && post.comments.length > 0" class="space-y-6 mb-10">
                    <div v-for="comment in post.comments" :key="comment.id" class="bg-gray-50 p-4 rounded-lg">
                        <div class="flex justify-between items-start mb-2">
                            <h4 class="font-medium">{{ comment.user?.name || 'Usuario' }}</h4>
                            <span class="text-sm text-gray-500">{{ formatDate(comment.created_time) }}</span>
                        </div>
                        <p class="text-gray-700">{{ comment.rich_text?.[0]?.plain_text || 'Sin contenido' }}</p>
                    </div>
                </div>
                <div v-else class="text-center text-gray-500 my-8">Aún no hay comentarios. ¡Sé el primero en comentar!</div>

                <!-- Formulario para añadir un nuevo comentario -->
                <div class="bg-gray-50 p-6 rounded-lg">
                    <h3 class="text-xl font-semibold mb-4">Deja un comentario</h3>

                    <UTextarea v-model="newComment" placeholder="Escribe tu comentario aquí..." :rows="4" class="mb-4" :disabled="commentLoading" />

                    <div class="flex justify-between items-center">
                        <UButton @click="submitComment" color="primary" :loading="commentLoading" :disabled="!newComment || commentLoading">Enviar comentario</UButton>

                        <UAlert v-if="commentSuccess" color="green" variant="soft" icon="i-heroicons-check-circle" class="mb-0">Comentario enviado correctamente</UAlert>

                        <UAlert v-if="commentError" color="red" variant="soft" icon="i-heroicons-exclamation-circle" class="mb-0">
                            {{ commentError }}
                        </UAlert>
                    </div>
                </div>
            </section>
        </article>

        <!-- Botón para volver atrás -->
        <div class="max-w-4xl mx-auto mt-8">
            <NuxtLink to="/">
                <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-long-left">Volver a todos los artículos</UButton>
            </NuxtLink>
        </div>
    </div>
</template>
