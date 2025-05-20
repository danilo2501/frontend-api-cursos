import Image from 'next/image';
import Link from 'next/link';
import React from 'react'; // Asegúrate de importar React

interface ContentCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  tags?: string[];
}

const ContentCard: React.FC<ContentCardProps> = ({ title, description, imageUrl, link, tags }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
      {/* El div padre debe tener posición relativa y un tamaño definido */}
      <div className="relative h-48 w-full">
        <Image
          src={imageUrl}
          alt={title}
          fill // <-- Esta prop hace que la imagen llene el contenedor padre
          className="object-cover rounded-t-lg" // <-- 'object-cover' ahora va en className
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // <-- Añadido para mejor rendimiento y eliminar warnings
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
      </div>
    </div>
  );
};

export default ContentCard;