const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  DEV: import.meta.env.DEV,
} as const

export default env 