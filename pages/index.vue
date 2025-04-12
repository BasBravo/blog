<script setup>
const { data: posts } = await useFetch('/api/posts')
</script>

<template>
  <div>
    <h1>Lista de Posts</h1>
    <ul>
      <li v-for="post in posts" :key="post.id">
        <NuxtLink :to="`/posts/${post.slug}`">{{ post.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>