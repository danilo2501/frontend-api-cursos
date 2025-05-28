// Componente de fondo animado sutil (estrellas)
import React from 'react';

const AnimatedBackground: React.FC = () => (
  <div
    aria-hidden="true"
    className="fixed inset-0 z-0 pointer-events-none overflow-hidden animate-bg-move"
    style={{
      background: 'radial-gradient(circle at 20% 30%, rgba(80,255,255,0.08) 0, transparent 70%),\
                  radial-gradient(circle at 80% 70%, rgba(255,80,255,0.08) 0, transparent 70%),\
                  radial-gradient(circle at 50% 50%, rgba(255,255,255,0.10) 0, transparent 80%)',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      minHeight: '100vh',
      minWidth: '100vw',
      transition: 'background-position 2s linear',
    }}
  />
);

export default AnimatedBackground;
