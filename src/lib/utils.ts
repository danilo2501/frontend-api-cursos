// src/lib/utils.ts

// Valida si una URL es una imagen válida (simple, no exhaustivo)
// Retorna true si la URL termina en una extensión de imagen conocida
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
}

// Genera un código único para cursos
// Usa un prefijo, la fecha actual y algunos caracteres aleatorios
export function generateUniqueCode(prefix: string = 'CURSO'): string {
  const timestamp = Date.now().toString(36);
  const randomChars = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}-${randomChars}`.toUpperCase();
}
