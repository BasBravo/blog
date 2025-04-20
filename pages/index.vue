<script setup>
// DATA /////////////////////////////////////////////////
const { data: posts, refresh, pending, error } = await useFetch('/api/notion/posts');
</script>

<template>
    <div class="min-h-screen">
        <!-- Color de fondo y texto base -->
        <div class="max-w-3xl mx-auto px-4 py-8">
            <!-- Contenido principal -->
            <main>
                <!-- Estado de carga -->
                <div v-if="pending" class="flex justify-center py-10">
                    <p>Loading posts...</p>
                    <!-- Placeholder simple para carga -->
                </div>

                <!-- Mensaje de error -->
                <div v-if="error" class="text-red-600 bg-red-100 p-4 rounded mb-6">
                    Error loading posts. Please try again.
                    <!-- Mensaje de error simple -->
                </div>

                <!-- Lista de Posts -->
                <div v-if="posts && posts.length > 0" class="space-y-10">
                    <!-- Espaciado entre posts -->
                    <PostResume v-for="post in posts" :key="post.id" :post="post" />
                </div>

                <!-- Mensaje cuando no hay posts -->
                <div v-if="!pending && !error && (!posts || posts.length === 0)" class="text-center py-10">
                    <p class="text-gray-500">No posts available at the moment.</p>
                </div>
            </main>
        </div>
    </div>
</template>
