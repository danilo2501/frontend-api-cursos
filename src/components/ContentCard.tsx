// Componente visual reutilizable para mostrar información de un curso en formato de tarjeta
import React from 'react';
// import Image from 'next/image'; // <--- Eliminar esta importación o comentarla
import Link from 'next/link';

// Props que recibe la tarjeta
interface ContentCardProps {
  title: string; // Título del curso
  description: string; // Descripción breve
  imageUrl: string; // URL de la imagen
  link: string; // Enlace a la vista de detalle
  tags?: (string | React.ReactNode)[]; // Etiquetas opcionales (nivel, duración, etc)
  children?: React.ReactNode; // Para pasar botones de acción
}

// Componente funcional principal
const ContentCard: React.FC<ContentCardProps> = ({ title, description, imageUrl, link, tags, children }) => {
  return (
    <div
      className="
        relative overflow-hidden rounded-xl
        transform transition-transform duration-300 ease-in-out hover:scale-105
        shadow-xl-neon-card hover:shadow-2xl-neon-card
        group animate-fade-in-up
        bg-gradient-to-br from-gray-900/80 via-gray-950/80 to-black/90
        border border-gray-800
      "
    >
      {/* Glow animado alrededor de la tarjeta (menos opacidad) */}
      <div className="
        absolute -inset-0.5 bg-gradient-to-br from-purple-400/30 via-pink-300/20 to-teal-200/20 rounded-xl
        filter blur-lg opacity-40 animate-spin-slow-alt z-0
        group-hover:opacity-60 group-hover:blur-xl
      "></div>
      {/* Contenido real de la tarjeta */}
      <div className="
        relative z-10 h-full flex flex-col justify-between p-6 rounded-xl
      ">
        <div>
          {/* Imagen del curso */}
          <div className="w-full h-48 rounded-md overflow-hidden mb-4 relative">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
            />
          </div>
          {/* Título del curso */}
          <h2 className="text-2xl font-bold mb-2 text-white leading-snug drop-shadow-md">
            {title}
          </h2>
          {/* Separador decorativo */}
          <div className="w-16 h-1 bg-gradient-to-r from-teal-300 via-pink-300 to-purple-300 rounded-full mb-3 mx-auto opacity-60"></div>
          {/* Etiquetas opcionales (nivel, duración, etc) */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge bg-gradient-to-r from-teal-700 via-purple-700 to-pink-700 text-white border-pink-400/40 shadow-md hover:scale-105 transition-transform duration-200 animate-pulse-fast"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {/* Descripción breve */}
          <p className="text-gray-200 text-sm mb-4 line-clamp-3 min-h-[3.5em]">
            {description}
          </p>
        </div>
        {/* Espacio para empujar los botones al final */}
        <div className="flex-grow"></div>
        {/* Botón de "Ver" eliminado para evitar duplicaciones */}
        {/* Slot para otros botones */}
        {children && (
          <div className="mt-4 flex flex-wrap gap-2 [&>button]:hover:scale-110 [&>button]:transition-transform [&>button]:duration-300">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;