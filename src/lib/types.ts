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
 * API dokümantasyonuna uygun format
 */
export interface PaginationInfo {
  /** Mevcut sayfa numarası */
  page: number;
  /** Sayfa başına öğe sayısı */
  limit: number;
  /** Tüm sayfalardaki toplam öğe sayısı */
  total: number;
  /** Toplam sayfa sayısı */
  totalPages: number;
  /** Sonraki sayfa olup olmadığı */
  hasNext: boolean;
  /** Önceki sayfa olup olmadığı */
  hasPrev: boolean;
}

// ==================== ERROR TYPES ====================

// Error types artık src/lib/error-service.ts'de tanımlanmıştır 