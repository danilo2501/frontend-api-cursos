// Mejoras en la página "Mis Cursos"
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ContentCard from '../../components/ContentCard';

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

export default function MisCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = localStorage.getItem('userToken');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    // Cargar cursos del usuario
    const fetchMisCursos = async () => {
      const isAuthenticated = localStorage.getItem('userToken');
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch(`${API_URL_DIRECT}/mis-cursos`, {
          headers: {
            Authorization: `Bearer ${isAuthenticated}`,
          },
        });
        if (!res.ok) throw new Error('Error al cargar los cursos del usuario.');
        const data = await res.json();
        setCursos(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido.');
      } finally {
        setLoading(false);
      }
    };

    fetchMisCursos();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-gray-400">
        <p className="text-3xl animate-pulse-light">Cargando tus cursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-red-500">
        <p className="text-3xl animate-pulse-fade">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono min-h-screen text-gray-200">
      <h1 className="text-center text-4xl font-bold text-white mb-8">Mis Cursos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {cursos.length > 0 ? (
          cursos.map((curso) => (
            <ContentCard
              key={curso._id}
              title={curso.titulo}
              description={curso.descripcion || 'Sin descripción disponible.'}
              imageUrl={curso.imageUrl || 'https://placehold.co/400x200.png?text=DevCurso'}
              link={`/cursos/${curso.codigo}`}
              tags={[curso.nivel, `Duración: ${curso.duracionHoras}h`]}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400 text-2xl py-10 animate-pulse-fade">
            No tienes cursos inscritos.
          </p>
        )}
      </div>
    </div>
  );
}
