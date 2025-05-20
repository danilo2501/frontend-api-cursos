// frontend-cursos/src/app/page.tsx
import ContentCard from '../components/ContentCard';
import React from 'react'; // Asegúrate de importar React si no lo has hecho

interface Curso {
  _id: string;
  titulo: string;
  descripcion: string;
  nivel: 'básico' | 'intermedio' | 'avanzado';
  duracionHoras: number;
  publicado: boolean;
  fechaCreacion: string;
  codigo: string;
  imageUrl?: string;
}

// *** SOLUCIÓN TEMPORAL: URL DE API CODIFICADA DIRECTAMENTE ***
// Esto bypassa el problema de process.env.NEXT_PUBLIC_API_URL siendo undefined.
const API_URL_DIRECT = 'http://localhost:4000/api';

async function getCursos(): Promise<Curso[]> {
  try {
    // console.log('Valor de API_URL en getCursos (dentro de la función):', API_URL_DIRECT); // Puedes dejar este log si quieres confirmar

    const res = await fetch(`${API_URL_DIRECT}/cursos`, { // <-- Usamos la URL codificada aquí
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`Error al obtener los cursos: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return [];
  }
}

export default async function HomePage() {
  const cursos = await getCursos();

  return (
    <div className="py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-teal-400">
        Bienvenido a DevCursos: Explora nuestro catálogo
      </h1>

      <div className="flex justify-center space-x-4 mb-8">
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Todos</button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Básico</button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Intermedio</button>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors">Avanzado</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <ContentCard
              key={curso._id}
              title={curso.titulo}
              description={curso.descripcion || 'Sin descripción disponible.'}
              imageUrl={curso.imageUrl || 'https://via.placeholder.com/400x200.png?text=Curso'}
              link={`/cursos/${curso.codigo}`}
              tags={[curso.nivel, `Duración: ${curso.duracionHoras}h`]}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-lg">No hay cursos disponibles para mostrar en DevCursos.</p>
        )}
      </div>
    </div>
  );
}