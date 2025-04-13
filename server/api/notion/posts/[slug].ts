export default defineEventHandler(async event => {
    const slug = event.context.params?.slug;
    if (!slug) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Slug no proporcionado',
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

        // Hacer la solicitud al backend
        const post = await $fetch(`${baseUrl}/notion/articles/${slug}`, { method: 'GET' });

        if (!post) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Artículo no encontrado',
            });
        }

        return post;
    } catch (error: any) {
        console.error(`Error al obtener post con slug ${slug} desde el backend:`, error);

        // Si ya es un error generado por createError, lo devolvemos
        if (error.statusCode) {
            throw error;
        }

        throw createError({
            statusCode: 500,
            statusMessage: 'Error al cargar el post del blog',
        });
    }
});
