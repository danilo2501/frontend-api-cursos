// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'via.placeholder.com',
      'educapption.com',
      'media.istockphoto.com',
      'd1ub0o53i85pdh.cloudfront.net',
      'fitls.com',
      'qualitygb.com', // <--- ¡Añade este nuevo dominio aquí!
      // ¡Asegúrate de añadir cualquier otro dominio que uses en el futuro!
    ],
  },
  // Otros ajustes de tu next.config.js si los tienes
};

module.exports = nextConfig;