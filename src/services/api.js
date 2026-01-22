import axios from 'axios';

const API_BASE_URL = 'https://ec-live-app-99-production.up.railway.app/api/v1';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Add Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor: Handle 401/403 (Token Expiry)
// Response Interceptor: Handle 401/403 (Token Expiry)
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token, force logout
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Call backend to refresh
                // Note: We use axios directly here to avoid interceptor loop if this fails, 
                // OR we can use the same instance but be careful. Using 'axios' default instance is safer for auth calls.
                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
                    refreshToken: refreshToken
                });

                if (response.data.access_token || response.data.accessToken) {
                    const newToken = response.data.access_token || response.data.accessToken;
                    localStorage.setItem('token', newToken);

                    // If backend rotates refresh token
                    if (response.data.refresh_token || response.data.refreshToken) {
                        localStorage.setItem('refreshToken', response.data.refresh_token || response.data.refreshToken);
                    }

                    api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
                    originalRequest.headers['Authorization'] = 'Bearer ' + newToken;

                    processQueue(null, newToken);
                    return api(originalRequest);
                }
            } catch (err) {
                processQueue(err, null);
                // Refresh failed - logout
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;
