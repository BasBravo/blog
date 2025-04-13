import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Determinar si estamos en el servidor
const isServer = typeof window === 'undefined';

/**
 * Obtiene la configuración de Firebase para el entorno actual (servidor o cliente)
 * @param config Configuración de runtime de Nuxt (solo para cliente)
 * @returns Configuración de Firebase
 */
export function getFirebaseConfig(config = null) {
    if (isServer) {
        // En el servidor, usamos variables de entorno directamente
        return {
            apiKey: process.env.NUXT_APP_KEY,
            authDomain: process.env.NUXT_AUTH_DOMAIN,
            projectId: process.env.NUXT_PROJECT_ID,
            storageBucket: process.env.NUXT_STORAGE_BUCKET,
            messagingSenderId: process.env.NUXT_MESSAGING_SENDER_ID,
            appId: process.env.NUXT_APP_ID,
        };
    } else if (config) {
        // En el cliente, usamos el runtimeConfig
        return {
            apiKey: config.public.appKey,
            authDomain: config.public.authDomain,
            projectId: config.public.projectId,
            storageBucket: config.public.storageBucket,
            messagingSenderId: config.public.messagingSenderId,
            appId: config.public.appId,
        };
    } else {
        throw new Error('Se requiere el parámetro config para el entorno de cliente');
    }
}

// Inicializar Firebase en el servidor si es aplicable
export let firebaseApp;
export let db;

if (isServer) {
    const serverConfig = getFirebaseConfig();
    firebaseApp = initializeApp(serverConfig);
    db = getFirestore(firebaseApp);
}
