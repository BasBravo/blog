<script setup>
import { useSeoMeta } from '#imports'

const route = useRoute()
const slug = route.params.slug

const { data: post } = await useFetch(`/api/posts/${slug}`)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
}

// Configuración de meta tags para SEO
useSeoMeta({
  title: post.value.metaTitle,
  description: post.value.metaDescription,
  keywords: post.value.metaKeywords,
  ogTitle: post.value.metaTitle,
  ogDescription: post.value.metaDescription,
  ogImage: post.value.image,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: post.value.metaTitle,
  twitterDescription: post.value.metaDescription,
  twitterImage: post.value.image
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(post.value.structuredData)
    }
  ]
})
</script>

<template>
  <article v-if="post">
    <h1>{{ post.title }}</h1>
    <p><strong>Autor:</strong> {{ post.author }} | <strong>Fecha:</strong> {{ post.date }}</p>
    <img :src="post.image" :alt="post.title" loading="lazy" width="800" />
    <div v-html="post.content"></div>

    <section>
      <h2>Categorías</h2>
      <ul>
        <li v-for="category in post.categories" :key="category">{{ category }}</li>
      </ul>
    </section>

    <section>
      <h2>Etiquetas</h2>
      <ul>
        <li v-for="tag in post.tags" :key="tag">#{{ tag }}</li>
      </ul>
    </section>
  </article>
</template>