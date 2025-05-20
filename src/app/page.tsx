// frontend-cursos/src/app/page.tsx
'use client';

import ContentCard from '../components/ContentCard';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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

const API_URL_DIRECT = 'http://localhost:4000/api';

async function fetchCursos(): Promise<Curso[]> {
  try {
    const res = await fetch(`${API_URL_DIRECT}/cursos`, {
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

export default function HomePage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCursos();
      setCursos(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCursos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL_DIRECT}/cursos/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || `Error al eliminar el curso: ${res.statusText}`);
      }

      setCursos(prevCursos => prevCursos.filter(curso => curso._id !== id));
      alert('Curso eliminado con éxito!');
    } catch (err: any) {
      alert(`Error al eliminar el curso: ${err.message}`);
      console.error("Error deleting course:", err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400 text-xl py-10">Cargando cursos...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-xl py-10">Error: {error}</p>;
  }

  return (
    <div className="py-8">
      <h1 className="text-5xl font-extrabold text-center mb-12 text-teal-400 leading-tight">
        Bienvenido a <span className="text-purple-500">DevCursos</span>: <br className="md:hidden"/> Explora nuestro catálogo
      </h1>

      <div className="flex justify-center space-x-4 mb-12">
        {/* Botones de filtro existentes */}
        <button className="bg-gray-800 hover:bg-teal-600 text-white px-6 py-3 rounded-full transition-colors duration-300 ease-in-out font-medium text-lg shadow-md">Todos</button>
        <button className="bg-gray-800 hover:bg-teal-600 text-white px-6 py-3 rounded-full transition-colors duration-300 ease-in-out font-medium text-lg shadow-md">Básico</button>
        <button className="bg-gray-800 hover:bg-teal-600 text-white px-6 py-3 rounded-full transition-colors duration-300 ease-in-out font-medium text-lg shadow-md">Intermedio</button>
        <button className="bg-gray-800 hover:bg-teal-600 text-white px-6 py-3 rounded-full transition-colors duration-300 ease-in-out font-medium text-lg shadow-md">Avanzado</button>
      </div>

      {/* Nuevo botón para crear curso - Colocado en la parte superior para fácil acceso */}
      <div className="text-center mb-12">
        <button
          onClick={() => router.push('/cursos/nuevo')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 ease-in-out text-xl"
        >
          + Crear Nuevo Curso
        </button>
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
            >
              <div className="flex justify-around mt-4 space-x-2">
                <button
                  onClick={() => {
                    const editUrl = `/cursos/editar/${curso._id}`;
                    console.log("INTENTO DE NAVEGACIÓN A:", editUrl);
                    router.push(editUrl);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm w-1/2"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(curso._id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors text-sm w-1/2"
                >
                  Eliminar
                </button>
              </div>
            </ContentCard>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-xl py-10">No hay cursos disponibles para mostrar en DevCursos.</p>
        )}
      </div>
    </div>
  );
}