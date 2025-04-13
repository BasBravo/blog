// Eliminamos las importaciones de @notionhq/client
// Ahora usaremos el backend propio en NUXT_FUNCTIONS_URL

/**
 * Obtiene la URL base para las llamadas a la API del backend
 */
function getApiBaseUrl() {
    const config = useRuntimeConfig();
    return `${config.public.functionsUrl}/api/notion` || '';
}

/**
 * Recupera todos los posts desde el backend
 */
export async function getPosts() {
    try {
        const baseUrl = getApiBaseUrl();
        const response = await $fetch(`${baseUrl}/articles`, {
            method: 'GET',
        });

        if (response.success && response.articles) {
            // Transformamos la respuesta al formato que espera el frontend
            return response.articles.map(article => ({
                id: article.id,
                slug: article.title
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, '-'),
                title: article.title,
                category: article.category,
                publishDate: article.publishDate,
                tags: article.tags,
                author: article.author,
                seoKeywords: article.seoKeywords,
                featuredImageUrl: article.featuredImage,
            }));
        }

        return [];
    } catch (error) {
        console.error('Error al obtener posts desde la API:', error);
        return [];
    }
}

/**
 * Obtiene un post específico por su slug
 */
export async function getPostBySlug(slug: string) {
    try {
        const baseUrl = getApiBaseUrl();

        // Primero obtenemos todos los artículos para encontrar el ID correspondiente al slug
        const allPosts = await getPosts();
        const post = allPosts.find(p => p.slug === slug);

        if (!post || !post.id) {
            return null;
        }

        // Una vez que tenemos el ID, obtenemos el artículo completo
        const articleResponse = await $fetch(`${baseUrl}/articles/${post.id}`, {
            method: 'GET',
        });

        if (!articleResponse.success || !articleResponse.article) {
            return null;
        }

        // Obtenemos también los comentarios
        const commentsResponse = await getPageComments(post.id);

        // Devolvemos el artículo con el formato que espera el frontend
        return {
            id: articleResponse.article.id,
            slug,
            title: articleResponse.article.title,
            category: articleResponse.article.category,
            publishDate: articleResponse.article.publishDate,
            tags: articleResponse.article.tags,
            author: articleResponse.article.author,
            seoKeywords: articleResponse.article.seoKeywords,
            featuredImageUrl: articleResponse.article.featuredImage,
            content: articleResponse.article.content,
            comments: commentsResponse,
        };
    } catch (error) {
        console.error(`Error al obtener post con slug ${slug} desde la API:`, error);
        return null;
    }
}

/**
 * Obtiene todos los bloques de contenido de una página
 */
export async function getPageBlocks(pageId: string) {
    try {
        const baseUrl = getApiBaseUrl();
        const response = await $fetch(`${baseUrl}/blocks/${pageId}`, {
            method: 'GET',
        });

        return response;
    } catch (error) {
        console.error(`Error al obtener bloques para la página ${pageId}:`, error);
        return [];
    }
}

/**
 * Obtiene los comentarios de una página
 */
export async function getPageComments(pageId: string) {
    try {
        const baseUrl = getApiBaseUrl();
        const response = await $fetch(`${baseUrl}/articles/${pageId}/comments`, {
            method: 'GET',
        });

        if (response.success && response.comments) {
            return response.comments;
        }

        return [];
    } catch (error) {
        console.error(`Error al obtener comentarios para la página ${pageId}:`, error);
        return [];
    }
}

/**
 * Añade un comentario a una página
 */
export async function addCommentToPage(pageId: string, comment: string) {
    try {
        const baseUrl = getApiBaseUrl();
        const response = await $fetch(`${baseUrl}/articles/${pageId}/comments`, {
            method: 'POST',
            body: {
                text: comment,
                // Si tienes un sistema de autenticación, puedes añadir el userId aquí
                userId: 'anonymous',
            },
        });

        return response;
    } catch (error) {
        console.error(`Error al añadir comentario a la página ${pageId}:`, error);
        throw error;
    }
}
