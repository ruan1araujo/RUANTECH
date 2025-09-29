// RUANTECH V2.0 - Service Worker
// PWA Offline Support e Cache Inteligente

const CACHE_NAME = 'ruantech-v2.0.1';
const STATIC_CACHE = 'ruantech-static-v1';
const DYNAMIC_CACHE = 'ruantech-dynamic-v1';

// Assets estáticos para cache
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/assets/css/advanced.css',
    '/manifest.json',
    // Tailwind CSS CDN
    'https://cdn.tailwindcss.com',
    // Fonts essenciais
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Estratégias de cache
const CACHE_STRATEGIES = {
    'stale-while-revalidate': [
        '/api/',
        '/data/'
    ],
    'cache-first': [
        '/assets/',
        '/images/',
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ],
    'network-first': [
        '/demos/',
        '/services/'
    ]
};

// Instalação do Service Worker
self.addEventListener('install', event => {
    console.log('SW: Installing...');

    event.waitUntil(
        Promise.all([
            // Cache de assets estáticos
            caches.open(STATIC_CACHE).then(cache => {
                console.log('SW: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            }),

            // Pré-carregar dados essenciais
            preloadEssentialData()
        ]).then(() => {
            console.log('SW: Installation complete');
            // Força a ativação imediata
            return self.skipWaiting();
        })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
    console.log('SW: Activating...');

    event.waitUntil(
        Promise.all([
            // Limpar caches antigos
            cleanupOldCaches(),

            // Reivindicar controle de todas as abas
            self.clients.claim()
        ]).then(() => {
            console.log('SW: Activation complete');
        })
    );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requisições não-GET e específicas
    if (request.method !== 'GET' ||
        url.pathname.includes('chrome-extension') ||
        url.pathname.includes('webpack') ||
        request.url.includes('hot-update')) {
        return;
    }

    event.respondWith(handleRequest(request));
});

// Gerenciador principal de requisições
async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
        // Determinar estratégia de cache
        const strategy = getCacheStrategy(request.url);

        switch (strategy) {
            case 'cache-first':
                return await cacheFirst(request);

            case 'network-first':
                return await networkFirst(request);

            case 'stale-while-revalidate':
                return await staleWhileRevalidate(request);

            default:
                return await networkFirst(request);
        }
    } catch (error) {
        console.error('SW: Request failed:', error);
        return await getOfflineFallback(request);
    }
}

// Estratégia: Cache First
async function cacheFirst(request) {
    const cachedResponse = await getCachedResponse(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        return await getOfflineFallback(request);
    }
}

// Estratégia: Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            await cacheResponse(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await getCachedResponse(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        return await getOfflineFallback(request);
    }
}

// Estratégia: Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cachedResponse = await getCachedResponse(request);

    // Buscar em background e atualizar cache
    const fetchAndCache = async () => {
        try {
            const networkResponse = await fetch(request);

            if (networkResponse.ok) {
                await cacheResponse(request, networkResponse.clone());

                // Notificar clientes sobre atualização
                notifyClients('cache-updated', {
                    url: request.url,
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.warn('SW: Background fetch failed:', error);
        }
    };

    // Executar fetch em background
    fetchAndCache();

    // Retornar resposta em cache ou tentar rede
    if (cachedResponse) {
        return cachedResponse;
    }

    return await networkFirst(request);
}

// Obter resposta em cache
async function getCachedResponse(request) {
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const response = await cache.match(request);

        if (response) {
            return response;
        }
    }

    return null;
}

// Armazenar resposta em cache
async function cacheResponse(request, response) {
    const url = new URL(request.url);

    // Determinar cache apropriado
    let cacheName = DYNAMIC_CACHE;

    if (STATIC_ASSETS.includes(url.pathname) ||
        url.hostname !== location.hostname) {
        cacheName = STATIC_CACHE;
    }

    const cache = await caches.open(cacheName);
    await cache.put(request, response);
}

// Determinar estratégia de cache
function getCacheStrategy(url) {
    for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
        for (const pattern of patterns) {
            if (url.includes(pattern)) {
                return strategy;
            }
        }
    }

    return 'network-first'; // Estratégia padrão
}

// Fallback para offline
async function getOfflineFallback(request) {
    const url = new URL(request.url);

    // Página offline
    if (request.destination === 'document') {
        return await caches.match('/offline.html') ||
            createOfflineResponse('Página offline não disponível');
    }

    // Imagem offline
    if (request.destination === 'image') {
        return createOfflineImageResponse();
    }

    // API offline
    if (url.pathname.startsWith('/api/')) {
        return createOfflineAPIResponse();
    }

    // Resposta genérica
    return createOfflineResponse('Recurso não disponível offline');
}

// Criar resposta offline personalizada
function createOfflineResponse(message) {
    return new Response(
        JSON.stringify({
            error: 'offline',
            message: message,
            timestamp: Date.now()
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }
        }
    );
}

// Resposta para imagens offline
function createOfflineImageResponse() {
    // SVG de placeholder
    const svg = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#1f2937"/>
            <text x="100" y="100" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">
                Offline
            </text>
        </svg>
    `;

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'no-store'
        }
    });
}

// Resposta para API offline
function createOfflineAPIResponse() {
    const offlineData = {
        status: 'offline',
        data: [],
        message: 'Dados não disponíveis offline',
        timestamp: Date.now()
    };

    return new Response(JSON.stringify(offlineData), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'
        }
    });
}

// Pré-carregar dados essenciais
async function preloadEssentialData() {
    const essentialUrls = [
        '/api/services/summary',
        '/api/user/preferences'
    ];

    const cache = await caches.open(DYNAMIC_CACHE);

    const preloadPromises = essentialUrls.map(async url => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response);
            }
        } catch (error) {
            console.warn(`SW: Failed to preload ${url}:`, error);
        }
    });

    await Promise.allSettled(preloadPromises);
}

// Limpar caches antigos
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();

    const deletePromises = cacheNames.map(cacheName => {
        if (!cacheName.includes('ruantech') ||
            cacheName === CACHE_NAME ||
            cacheName === STATIC_CACHE ||
            cacheName === DYNAMIC_CACHE) {
            return null;
        }

        console.log('SW: Deleting old cache:', cacheName);
        return caches.delete(cacheName);
    }).filter(Boolean);

    await Promise.all(deletePromises);
}

// Notificar clientes
function notifyClients(type, data) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type,
                data,
                timestamp: Date.now()
            });
        });
    });
}

// Background Sync
self.addEventListener('sync', event => {
    console.log('SW: Background sync:', event.tag);

    switch (event.tag) {
        case 'analytics-sync':
            event.waitUntil(syncAnalytics());
            break;

        case 'preferences-sync':
            event.waitUntil(syncPreferences());
            break;
    }
});

// Sincronizar analytics
async function syncAnalytics() {
    try {
        const analytics = await getStoredAnalytics();

        if (analytics.length > 0) {
            const response = await fetch('/api/analytics/batch', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(analytics)
            });

            if (response.ok) {
                await clearStoredAnalytics();
                console.log('SW: Analytics synced successfully');
            }
        }
    } catch (error) {
        console.error('SW: Analytics sync failed:', error);
    }
}

// Obter analytics armazenados
async function getStoredAnalytics() {
    const stored = await getFromIndexedDB('analytics', 'pending');
    return stored || [];
}

// Limpar analytics sincronizados
async function clearStoredAnalytics() {
    await clearFromIndexedDB('analytics', 'pending');
}

// Push Notifications
self.addEventListener('push', event => {
    const options = {
        body: 'Nova atualização disponível no RUANTECH!',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        tag: 'ruantech-update',
        renotify: true,
        requireInteraction: false,
        actions: [
            {
                action: 'view',
                title: 'Ver Agora'
            },
            {
                action: 'dismiss',
                title: 'Dispensar'
            }
        ]
    };

    if (event.data) {
        const data = event.data.json();
        options.body = data.message || options.body;
        options.data = data;
    }

    event.waitUntil(
        self.registration.showNotification('RUANTECH V2.0', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Utility: IndexedDB helpers
function getFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RuantechDB', 1);

        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const getRequest = store.get(key);

            getRequest.onsuccess = () => resolve(getRequest.result);
            getRequest.onerror = () => reject(getRequest.error);
        };

        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
}

function clearFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('RuantechDB', 1);

        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const deleteRequest = store.delete(key);

            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onerror = () => reject(deleteRequest.error);
        };
    });
}

console.log('SW: Service Worker loaded successfully');