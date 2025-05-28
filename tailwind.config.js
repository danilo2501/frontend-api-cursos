// frontend-cursos/tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-background': '#0A0A0A', // Un fondo muy oscuro
        'dark-surface': '#1A1A1A', // Superficie de componentes
        'dark-border': '#333333', // Bordes oscuros
        'neon-blue': '#00F0FF', // Un azul eléctrico
        'neon-purple': '#BF00FF', // Un púrpura vibrante
        'neon-pink': '#FF00A2', // Un rosa intenso
        'neon-green': '#00FF7F', // Un verde esmeralda
      },
      // Definición de las animaciones (keyframes) para el look neón
      keyframes: {
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-slow-alt': { // Para el glow que rota en las tarjetas
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse-light': { // Para texto pulsante
          '0%, 100%': { opacity: '1', textShadow: '0 0 8px rgba(0, 240, 255, 0.4), 0 0 15px rgba(191, 0, 255, 0.4)' },
          '50%': { opacity: '0.8', textShadow: '0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(191, 0, 255, 0.8)' },
        },
        'pulse-fast': { // Para botones/elementos interactivos
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 15px rgba(191, 0, 255, 0.5)' },
          '50%': { transform: 'scale(1.03)', boxShadow: '0 0 30px rgba(191, 0, 255, 0.9)' },
        },
        'glow-button': { // Para botones principales
          '0%, 100%': { boxShadow: '0 0 8px rgba(0, 240, 255, 0.5), 0 0 15px rgba(0, 255, 127, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.9), 0 0 35px rgba(0, 255, 127, 0.9)' },
        },
        'pulse-fade': { // Para mensajes de carga/error
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'fadeInOut': { // Para mensajes que aparecen y desaparecen
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '10%': { opacity: '1', transform: 'translateY(0)' },
          '90%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        },
        'background-pan': { // Para el fondo animado
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      // Asignación de animaciones a las clases de utilidad de Tailwind
      animation: {
        'spin-slow': 'spin-slow 8s linear infinite',
        'spin-slow-alt': 'spin-slow-alt 10s linear infinite reverse',
        'pulse-light': 'pulse-light 4s infinite alternate',
        'pulse-fast': 'pulse-fast 1.5s infinite alternate',
        'glow-button': 'glow-button 3s infinite alternate',
        'pulse-fade': 'pulse-fade 1s infinite alternate',
        'fadeInOut': 'fadeInOut 2s forwards',
        'background-pan': 'background-pan 20s linear infinite',
      },
    },
  },
  plugins: [],
};