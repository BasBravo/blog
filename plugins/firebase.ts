import { useFirebase } from '~/composables/useFirebase';

export default defineNuxtPlugin(nuxtApp => {
    // Inicializar Firebase al arrancar la aplicación
    const { db } = useFirebase();

    return {
        provide: {
            db: db,
        },
    };
});
