import { toast } from 'sonner'

// Toast notification hook'u
// Sonner kütüphanesini wrap ederek tutarlı kullanım sağlar
export const useToast = () => {
  return {
    // Başarı mesajı
    success: (message: string, description?: string) => {
      toast.success(message, {
        description,
        duration: 4000,
      })
    },

    // Hata mesajı
    error: (message: string, description?: string) => {
      toast.error(message, {
        description,
        duration: 5000,
      })
    },

    // Bilgi mesajı
    info: (message: string, description?: string) => {
      toast.info(message, {
        description,
        duration: 4000,
      })
    },

    // Uyarı mesajı
    warning: (message: string, description?: string) => {
      toast.warning(message, {
        description,
        duration: 4000,
      })
    },

    // Yükleme mesajı (promise ile)
    loading: (message: string) => {
      return toast.loading(message)
    },

    // Promise toast (otomatik success/error)
    promise: <T>(
      promise: Promise<T>,
      messages: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((error: unknown) => string)
      }
    ) => {
      return toast.promise(promise, messages)
    },

    // Toast'ı kapat
    dismiss: (toastId?: string | number) => {
      toast.dismiss(toastId)
    },
  }
} 