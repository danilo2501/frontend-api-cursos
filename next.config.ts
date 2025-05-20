// frontend-cursos/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Asegúrate de que este array contenga el dominio de tus imágenes externas
    domains: ['via.placeholder.com'], // ¡Esta línea es CRÍTICA!
  },
};

export default nextConfig;