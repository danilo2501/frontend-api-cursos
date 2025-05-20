// frontend-cursos/src/components/ContentCard.tsx
// NO NECESITAMOS importar Image de 'next/image' si usamos <img> nativo
import Link from 'next/link';
import React from 'react';

interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags?: string[];
  children?: React.ReactNode;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, description, imageUrl, link, tags, children }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-2xl">
      {/* Reemplazamos el componente Image de Next.js por una etiqueta <img> nativa */}
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover rounded-t-lg w-full h-full" // Asegúrate de que ocupe todo el espacio
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {tags?.map((tag) => (
            <span key={tag} className="bg-teal-700 text-white text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Link href={link} className="block w-full text-center bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Ver Curso
        </Link>
        {children}
      </div>
    </div>
  );
};

export default ContentCard;