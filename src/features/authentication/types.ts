// ==================== AUTH TYPES ====================

// Kullanıcı varlık arayüzü
export interface User {
  // Benzersiz kullanıcı tanımlayıcısı
  id: string;
  // Kullanıcının e-posta adresi
  email: string;
  // Kullanıcının görünen adı
  username: string;
  // Kullanıcının sistemdeki rolü
  role: 'visitor' | 'user' | 'moderator' | 'admin';
  // Opsiyonel avatar resim URL'si
  avatar_url?: string;
  // Kullanıcı hesabının aktif olup olmadığı
  is_active: boolean;
  // Hesap oluşturma zaman damgası
  created_at: string;
  // Son güncelleme zaman damgası
  updated_at: string;
}

// Giriş isteği yükü
export interface LoginRequest {
  // Kullanıcının e-posta adresi
  email: string;
  // Kullanıcının şifresi
  password: string;
}

// Kayıt isteği yükü
export interface RegisterRequest {
  // Kullanıcının e-posta adresi
  email: string;
  // Kullanıcının şifresi
  password: string;
  // İstenilen kullanıcı adı
  username: string;
}

// Sunucudan gelen kimlik doğrulama yanıtı
export interface AuthResponse {
  // Kimlik doğrulanmış kullanıcı verisi
  user: User;
  // JWT kimlik doğrulama token'ı
  token: string;
} 