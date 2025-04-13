export default defineEventHandler(async event => {
    // Obtener los datos del cuerpo de la solicitud
    const body = await readBody(event);
    const { pageId, comment } = body;

    // Validar que los campos requeridos estén presentes
    if (!pageId || !comment) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Se requieren pageId y comment',
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

        // Enviar el comentario al backend
        const result = await $fetch(`${baseUrl}/comments/add`, {
            method: 'POST',
            body: { pageId, comment },
        });

        return { success: true, comment: result };
    } catch (error: any) {
        console.error(`Error al añadir comentario a la página ${pageId}:`, error);
        throw createError({
            statusCode: 500,
            statusMessage: 'Error al añadir el comentario',
        });
    }
});
