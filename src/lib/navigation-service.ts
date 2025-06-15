import { useAuthStore } from '@/store/auth-store'

/**
 * Navigation servis sınıfı
 * Merkezi yönlendirme yönetimi ve auth durumuna göre yönlendirme
 */
class NavigationService {
  /**
   * Auth hatası durumunda logout ve login sayfasına yönlendirme
   */
  handleAuthError(): void {
    // Auth store'dan logout işlemini çağır
    const { clearAuth } = useAuthStore.getState()
    clearAuth()
    
    // Login sayfasına yönlendir (browser navigation kullan)
    // React Router context'i dışında olduğumuz için window.location kullanıyoruz
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  /**
   * Programmatic navigation için yardımcı
   * Component içinde useNavigate kullanılmalı, bu sadece emergency durumlar için
   */
  redirectTo(path: string): void {
    if (typeof window !== 'undefined') {
      window.location.href = path
    }
  }

  /**
   * Mevcut sayfayı yeniler
   */
  reload(): void {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  /**
   * Geri gitme işlemi
   */
  goBack(): void {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back()
    } else {
      this.redirectTo('/')
    }
  }
}

// Singleton instance
export const navigationService = new NavigationService() 