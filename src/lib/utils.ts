import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// clsx kullanarak birden fazla class adını birleştirir ve Tailwind CSS sınıflarını twMerge ile birleştirir
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Metindeki \n karakterlerini HTML paragraflarına dönüştürür
 * \n\n -> Yeni paragraf
 * \n -> Satır sonu
 */
export function formatTextWithLineBreaks(text: string): string {
  if (!text) return ''
  
  return text
    // Önce fazla boşlukları temizle
    .trim()
    // \r\n veya \r karakterlerini \n'e dönüştür
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // 3 veya daha fazla \n'i çift \n'e dönüştür (fazla boşlukları önle)
    .replace(/\n{3,}/g, '\n\n')
    // Çift \n'leri paragraf sonuna dönüştür
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
    .map(paragraph => `<p class="mb-4">${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('')
}

/**
 * React component'lerde kullanım için formatlanmış metni string array'e dönüştürür
 */
export function formatTextToParagraphs(text: string): string[] {
  if (!text) return []
  
  return text
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .split('\n\n')
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0)
}
