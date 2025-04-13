export default defineEventHandler(async () => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.functionsUrl;

    // Validar que la URL base esté definida
    if (!baseUrl) {
        console.error('Error: URL de backend no configurada', {
            configFound: !!config,
            publicConfigFound: !!config?.public,
            functionsUrl: config?.public?.functionsUrl,
            entireConfig: config,
        });
        return {
            success: false,
            error: 'URL de backend no configurada',
            details: 'Verifique la variable de entorno NUXT_FUNCTIONS_URL',
            config: {
                functionsUrl: baseUrl,
            },
        };
    }

    console.log(`Base URL: ${baseUrl}`, `${baseUrl}/notion/articles`);

    try {
        // Obtener los artículos del backend
        const response = await $fetch(`${baseUrl}/notion/articles`, {
            method: 'GET',
        });

        console.log('Respuesta del backend:', response);

        if (response.success && response.articles) {
            // Transformamos la respuesta al formato que espera el frontend
            const formattedArticles = response.articles.map(article => ({
                id: article.id,
                slug: article.title
                    .toLowerCase()
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, '-'),
                title: article.title,
                category: article.category,
                publishDate: article.publishDate,
                tags: article.tags || [],
                author: article.author || '',
                seoKeywords: article.seoKeywords || '',
                featuredImageUrl: article.featuredImage || '', // Nota: Convertimos featuredImage a featuredImageUrl
            }));

            console.log('Artículos formateados:', formattedArticles);
            return formattedArticles;
        }

        console.log('No se encontraron artículos o formato de respuesta incorrecto');
        return [];
    } catch (error: any) {
        console.error('Error al obtener artículos:', error);
        return {
            success: false,
            error: error.message,
            details: error.toString(),
            config: {
                functionsUrl: baseUrl,
            },
        };
    }
});
