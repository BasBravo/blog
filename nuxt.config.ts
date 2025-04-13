// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    ssr: true,
    modules: ['@nuxt/ui'],
    css: ['~/app/assets/css/main.css'],

    runtimeConfig: {
        // Las claves secretas estarán disponibles solo en el servidor
        stripeSecretKey: process.env.NUXT_STRIPE_SECRET_KEY,
        cryptoKey: process.env.NUXT_CRYPTO_KEY,
        notionSecretKey: 'ntn_B141562676676dYESdte9gK8YFhUPgfe0TEONbhxoUF5Ta', // Secret key para la API de Notion
        notionBlogDatabaseId: process.env.NUXT_NOTION_BLOG_DATABASE_ID || '', // ID de la base de datos de los posts
        // Las claves públicas estarán disponibles en el cliente
        public: {
            appUrl: process.env.NUXT_APP_URL,
            appName: process.env.NUXT_APP_NAME,
            appDescription: process.env.NUXT_APP_DESCRIPTION,
            providerData: process.env.NUXT_PROVIDER_DATA,
            appKey: process.env.NUXT_APP_KEY,
            authDomain: process.env.NUXT_AUTH_DOMAIN,
            projectId: process.env.NUXT_PROJECT_ID,
            storageBucket: process.env.NUXT_STORAGE_BUCKET,
            storageUrl: process.env.NUXT_STORAGE_URL,
            functionsUrl: process.env.NUXT_FUNCTIONS_URL,
            authUrl: process.env.NUXT_AUTH_URL,
            messagingSenderId: process.env.NUXT_MESSAGING_SENDER_ID,
            appId: process.env.NUXT_APP_ID,
            measurementId: process.env.NUXT_MEASUREMENT_ID,
            googleGtagId: process.env.NUXT_GOOGLE_GTAG_ID,
            mapboxApiKey: process.env.NUXT_MAPBOX_API_KEY,
            stripePublicKey: process.env.NUXT_STRIPE_PUBLIC_KEY,
        },
    },

    nitro: {
        preset: 'firebase',
        firebase: { nodeVersion: '20', gen: 2, httpsOptions: { region: 'europe-west3', maxInstances: 3 } },
        replace: {
            [`as server } from './chunks/`]: `as server_blog } from './chunks/`,
            [`functions.https.onRequest`]: `functions.region('europe-west3').https.onRequest`,
        },
    },
});
