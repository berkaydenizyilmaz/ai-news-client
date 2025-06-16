import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// clsx kullanarak birden fazla class adını birleştirir ve Tailwind CSS sınıflarını twMerge ile birleştirir
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
