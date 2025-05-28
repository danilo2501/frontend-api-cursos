// Página de detalle para un curso individual
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Definición del tipo de datos de un curso
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

const API_URL_DIRECT = 'http://localhost:4000/api'; // URL base de la API

export default function DetalleCursoPage() {
  // Obtiene el parámetro de la URL (código del curso)
  const { codigo } = useParams();
  const router = useRouter();
  // Estados para el curso, carga y error
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Efecto para cargar el curso al montar el componente
  useEffect(() => {
    if (!codigo) return;
    const fetchCurso = async () => {
      setLoading(true);
      setError(null);
      try {
        // Llama a la API para obtener el curso por código
        const res = await fetch(`${API_URL_DIRECT}/cursos/codigo/${codigo}`);
        if (!res.ok) throw new Error('No se encontró el curso.');
        const data = await res.json();
        setCurso(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar el curso.');
      } finally {
        setLoading(false);
      }
    };
    fetchCurso();
  }, [codigo]);

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-gray-400">
        <p className="text-3xl animate-pulse-light">Cargando información del programa...</p>
      </div>
    );
  }

  // Estado de error o si no se encontró el curso
  if (error || !curso) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-red-500">
        <p className="text-3xl animate-pulse-fade">{error || 'No se encontró el programa.'}</p>
      </div>
    );
  }

  // Render principal del detalle del curso
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black p-4 font-mono">
      <div className="max-w-2xl w-full mx-auto p-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-700">
        {/* Botón para volver atrás */}
        <button
          onClick={() => router.back()}
          className="mb-6 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-gray-200 font-bold py-2 px-6 rounded-full shadow-xl-neon animate-glow-button transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 border border-gray-600"
        >
          ← Volver
        </button>
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Imagen del curso */}
          <img
            src={curso.imageUrl || 'https://via.placeholder.com/400x200.png?text=DevCurso'}
            alt={curso.titulo}
            className="w-full md:w-80 h-48 object-cover rounded-xl border border-gray-700 shadow-md mb-4 md:mb-0"
          />
          <div className="flex-1">
            {/* Título */}
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-pink-400 to-purple-400 mb-4 drop-shadow-lg animate-pulse-light">
              {curso.titulo}
            </h1>
            {/* Descripción */}
            <p className="text-gray-300 text-lg mb-4 whitespace-pre-line">{curso.descripcion}</p>
            {/* Etiquetas de nivel, duración, código y estado */}
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-4 py-2 bg-gray-800 text-teal-300 text-sm font-semibold rounded-full border border-teal-500 shadow-sm">
                Nivel: {curso.nivel.charAt(0).toUpperCase() + curso.nivel.slice(1)}
              </span>
              <span className="px-4 py-2 bg-gray-800 text-purple-300 text-sm font-semibold rounded-full border border-purple-500 shadow-sm">
                Duración: {curso.duracionHoras} horas
              </span>
              <span className="px-4 py-2 bg-gray-800 text-pink-300 text-sm font-semibold rounded-full border border-pink-500 shadow-sm">
                Código: {curso.codigo}
              </span>
              <span className={`px-4 py-2 text-sm font-semibold rounded-full border shadow-sm ${curso.publicado ? 'bg-green-900 text-green-300 border-green-500' : 'bg-gray-700 text-gray-400 border-gray-500'}`}>
                {curso.publicado ? 'Publicado' : 'No publicado'}
              </span>
            </div>
            {/* Fecha de creación */}
            <p className="text-xs text-gray-500">Creado el: {new Date(curso.fechaCreacion).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
