// Collections API
export const collections = {
    getAll: () => apiRequest('/api/collections'),
};
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000').replace(/\/$/, '');

// Helper to get auth token from localStorage
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
}

// Helper to set auth token
export function setToken(token: string) {
    localStorage.setItem('token', token);
}

// Helper to remove auth token
export function removeToken() {
    localStorage.removeItem('token');
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return !!getToken();
}

// API request helper with auth
async function apiRequest(endpoint: string, options: RequestInit = {}) {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || 'Request failed');
    }

    return response.json();
}

// Wallet Auth API
export const auth = {
    // Get nonce for wallet to sign
    getNonce: (address: string) =>
        apiRequest(`/api/auth/nonce/${address}`),

    // Verify signature and get JWT
    verify: async (address: string, signature: string) => {
        const data = await apiRequest('/api/auth/verify', {
            method: 'POST',
            body: JSON.stringify({ address, signature }),
        });
        if (data.token) {
            setToken(data.token);
        }
        return data;
    },

    logout: () => {
        removeToken();
    },
};

// User API
export const users = {
    getProfile: () => apiRequest('/api/users/me'),
    updateProfile: (data: { display_name?: string; username?: string; bio?: string }) =>
        apiRequest('/api/users/me', {
            method: 'PATCH',
            body: JSON.stringify(data),
        }),
};

// Assets API
export const assets = {
    getAll: () => apiRequest('/api/assets'),
    getMine: () => apiRequest('/api/assets/mine'),
    listAsset: (id: string, price: string) =>
        apiRequest(`/api/assets/${id}/list`, {
            method: 'PATCH',
            body: JSON.stringify({ price }),
        }),
    getGallery: (params?: { type?: string; rarity?: string; search?: string; limit?: number; collection_id?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.type && params.type !== 'All') searchParams.set('type', params.type);
        if (params?.rarity) searchParams.set('rarity', params.rarity);
        if (params?.search) searchParams.set('search', params.search);
        if (params?.limit) searchParams.set('limit', params.limit.toString());
        if (params?.collection_id) searchParams.set('collection_id', params.collection_id);
        const query = searchParams.toString();
        return apiRequest(`/api/assets/gallery${query ? `?${query}` : ''}`);
    },
    create: (data: { name: string; type: string; value: string; rarity?: string; image?: string }) =>
        apiRequest('/api/assets', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
};

// Health check
export const health = {
    check: () => apiRequest('/health'),
};

export default { auth, users, assets, health };
