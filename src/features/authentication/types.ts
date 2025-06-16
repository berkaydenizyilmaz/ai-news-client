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

// Şifre değiştirme isteği yükü
export interface ChangePasswordRequest {
  // Mevcut şifre
  currentPassword: string;
  // Yeni şifre
  newPassword: string;
}

// Profil güncelleme isteği yükü
export interface UpdateProfileRequest {
  // Opsiyonel e-posta adresi
  email?: string;
  // Opsiyonel kullanıcı adı
  username?: string;
  // Opsiyonel avatar URL'si
  avatar_url?: string;
}

// Sunucudan gelen kimlik doğrulama yanıtı
export interface AuthResponse {
  // Kimlik doğrulanmış kullanıcı verisi
  user: User;
  // JWT kimlik doğrulama token'ı
  token: string;
} 