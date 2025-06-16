// Ortam yapılandırma nesnesi
// Uygulama genelinde kullanılan tüm ortam değişkenlerini içerir
const env = {
  // API istekleri için temel URL
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  // Mevcut ortam (development, production, vb.)
  NODE_ENV: import.meta.env.NODE_ENV || 'development',
  // Uygulamanın geliştirme modunda çalışıp çalışmadığı
} as const

export default env 