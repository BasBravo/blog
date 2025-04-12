import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Determinar si estamos en el servidor
const isServer = typeof window === 'undefined';

// Firebase config para servidor (usando variables de entorno directamente)
const serverFirebaseConfig = {
    apiKey: process.env.NUXT_APP_KEY,
    authDomain: process.env.NUXT_AUTH_DOMAIN,
    projectId: process.env.NUXT_PROJECT_ID,
    storageBucket: process.env.NUXT_STORAGE_BUCKET,
    messagingSenderId: process.env.NUXT_MESSAGING_SENDER_ID,
    appId: process.env.NUXT_APP_ID,
};

// Inicializar Firebase en el servidor si es aplicable
let firebaseApp;
let db;

if (isServer) {
    firebaseApp = initializeApp(serverFirebaseConfig);
    db = getFirestore(firebaseApp);
}

// Función para inicializar Firebase en el cliente
export function initializeFirebase() {
    // Si ya se inicializó o estamos en el servidor, devolvemos las instancias existentes
    if (db) {
        return { db };
    }

    // En el cliente usamos useRuntimeConfig()
    const config = useRuntimeConfig();

    const clientFirebaseConfig = {
        apiKey: config.public.appKey,
        authDomain: config.public.authDomain,
        projectId: config.public.projectId,
        storageBucket: config.public.storageBucket,
        messagingSenderId: config.public.messagingSenderId,
        appId: config.public.appId,
    };

    firebaseApp = initializeApp(clientFirebaseConfig);
    db = getFirestore(firebaseApp);

    return { db };
}

// Función para obtener db sin necesidad de inicializar (útil en componentes)
export function useDb() {
    if (!db && !isServer) {
        // Si no se ha inicializado y estamos en el cliente, inicializamos
        initializeFirebase();
    }
    return db;
}

// Exportar db directamente para mantener compatibilidad con código existente
export { db };
