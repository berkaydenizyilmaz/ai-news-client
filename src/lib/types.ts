// ==================== GLOBAL API TYPES ====================

/**
 * Genel API yanıt yapısı
 * @template T - Veri yükünün tipi
 */
export interface ApiResponse<T> {
  /** İsteğin başarılı olup olmadığını belirtir */
  success: boolean;
  /** Yanıt veri yükü */
  data?: T;
  /** Başarı veya bilgilendirme mesajı */
  message?: string;
  /** Hata mesajı */
  error?: string;
  /** Alan bazlı doğrulama hatalarının dizisi */
  errors?: Array<{
    /** Hatası olan alan adı */
    field: string;
    /** Alan için hata mesajı */
    message: string;
  }>;
}

/**
 * Sayfalanmış API yanıtları için sayfalama bilgileri
 */
export interface PaginationInfo {
  /** Mevcut sayfa numarası */
  current_page: number;
  /** Toplam sayfa sayısı */
  total_pages: number;
  /** Tüm sayfalardaki toplam öğe sayısı */
  total_items: number;
  /** Sayfa başına öğe sayısı */
  items_per_page: number;
  /** Sonraki sayfa olup olmadığı */
  has_next: boolean;
  /** Önceki sayfa olup olmadığı */
  has_prev: boolean;
}

// ==================== ERROR TYPES ====================

// Error types artık src/lib/error-service.ts'de tanımlanmıştır 