import axios from 'axios';
import { supabase } from '../lib/supabase'; // Use existing supabase client if possible

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Inject Supabase Auth Token
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for Global Error Formatting
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Format errors globally
    const formattedError = {
      message: error.response?.data?.error || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      isCancelled: axios.isCancel(error)
    };

    // If 401 Unauthorized, we might want to clear local storage or trigger logout
    if (formattedError.status === 401) {
      console.warn('Unauthorized request. Token might be expired.');
    }

    return Promise.reject(formattedError);
  }
);

// Helper for Cancellable Requests
export const createCancellableRequest = () => {
  const controller = new AbortController();
  return {
    signal: controller.signal,
    cancel: () => controller.abort()
  };
};

export default apiClient;