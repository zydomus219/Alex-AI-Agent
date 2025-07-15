// Environment configuration
export const config = {
  // Backend API configuration
  backend: {
    url: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000',
  },
  
  // Supabase configuration (if needed)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  },
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Type-safe environment variables
export type Config = typeof config; 