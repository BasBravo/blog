import { initializeFirebase } from '~/utils/firebase';

export default defineNuxtPlugin(nuxtApp => {
    // Inicializar Firebase al arrancar la aplicación
    const { db } = initializeFirebase();

    return {
        provide: {
            db: db,
        },
    };
});
