import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFirebaseConfig, firebaseApp as serverFirebaseApp, db as serverDb } from '~/utils/firebase';

// Estado compartido para mantener las instancias a través del ciclo de vida de la aplicación
let clientFirebaseApp: any = null;
let clientDb: Firestore | null = null;

/**
 * Composable que proporciona acceso a la instancia de Firebase
 * Diseñado para ser utilizado dentro de componentes Vue o composables
 */
export function useFirebase() {
    // Determinar si estamos en el servidor
    const isServer = typeof window === 'undefined';

    if (isServer) {
        // En el servidor, devolvemos las instancias ya inicializadas
        return {
            app: serverFirebaseApp,
            db: serverDb,
        };
    }

    // En el cliente, inicializamos si aún no se ha hecho
    if (!clientFirebaseApp) {
        const config = useRuntimeConfig();
        const firebaseConfig = getFirebaseConfig(config);

        clientFirebaseApp = initializeApp(firebaseConfig);
        clientDb = getFirestore(clientFirebaseApp);
    }

    return {
        app: clientFirebaseApp,
        db: clientDb,
    };
}

/**
 * Acceso rápido a la base de datos de Firestore
 * Para ser usado en componentes o composables
 */
export function useFirestore() {
    const { db } = useFirebase();
    return db;
}
