export default defineEventHandler(async event => {
    const slugOrId = event.context.params?.slug;
    if (!slugOrId) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Identificador no proporcionado',
        });
    }

    try {
        // Obtener la URL base desde la configuración
        const config = useRuntimeConfig();
        const baseUrl = config.public.functionsUrl;

        // Validar que la URL base esté definida
        if (!baseUrl) {
            throw new Error('URL de backend no configurada. Verifique la variable de entorno NUXT_FUNCTIONS_URL.');
        }

        // Primero obtener todos los artículos
        const response = await $fetch(`${baseUrl}/notion/articles`, { method: 'GET' });

        if (!response || !response.success || !response.articles || !response.articles.length) {
            throw createError({
                statusCode: 404,
                statusMessage: 'No se encontraron artículos',
            });
        }

        // Buscar el artículo por ID o por slug generado desde el título
        const article = response.articles.find(article => {
            // Comprobar si coincide con el ID directamente
            if (article.id === slugOrId) {
                return true;
            }

            // Generar un slug a partir del título y compararlo
            const generatedSlug = article.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-');

            return generatedSlug === slugOrId;
        });

        if (!article) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Artículo no encontrado',
            });
        }

        // Preparar la respuesta con el formato esperado por el frontend
        return {
            id: article.id,
            slug: article.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
                .replace(/[^\w\s]/g, '')
                .replace(/\s+/g, '-'),
            title: article.title,
            category: article.category,
            publishDate: article.publishDate,
            tags: article.tags || [],
            author: article.author || '',
            seoKeywords: article.seoKeywords || '',
            featuredImageUrl: article.featuredImage || '',
            content: article.content || [],
        };
    } catch (error: any) {
        console.error(`Error al obtener artículo con identificador ${slugOrId} desde el backend:`, error);

        // Si ya es un error generado por createError, lo devolvemos
        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Error al cargar el artículo del blog',
        });
    }
});
