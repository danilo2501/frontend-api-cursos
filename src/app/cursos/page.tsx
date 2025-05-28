// Vista catálogo de todos los cursos
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ContentCard from '../../components/ContentCard'; // Componente visual para mostrar cada curso
import { useRouter } from 'next/navigation'; // Para navegación programática
import AnimatedBackground from '../AnimatedBackground';

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

// Función para obtener cursos desde la API, con filtro opcional por nivel
async function fetchCursosData(nivelFiltro?: 'básico' | 'intermedio' | 'avanzado' | 'todos'): Promise<Curso[]> {
  try {
    let url = `${API_URL_DIRECT}/cursos`;
    if (nivelFiltro && nivelFiltro !== 'todos') {
      url = `${API_URL_DIRECT}/cursos?nivel=${nivelFiltro}`;
    }
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Error al obtener los cursos: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    throw error;
  }
}

// Componente principal de la página de catálogo de cursos
export default function CursosCatalogoPage() {
  // Estados para cursos, carga, error y filtro
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroNivel, setFiltroNivel] = useState<'básico' | 'intermedio' | 'avanzado' | 'todos'>('todos');
  const router = useRouter();

  // Función para cargar cursos según el filtro
  const loadCursos = useCallback(async (nivel?: 'básico' | 'intermedio' | 'avanzado' | 'todos') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCursosData(nivel);
      setCursos(data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error desconocido al cargar los cursos.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto para cargar cursos cuando cambia el filtro
  useEffect(() => {
    loadCursos(filtroNivel);
  }, [filtroNivel, loadCursos]);

  // Cambia el filtro de nivel
  const handleFilterClick = (nivel: 'básico' | 'intermedio' | 'avanzado' | 'todos') => {
    setFiltroNivel(nivel);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-gray-400">
        <p className="text-3xl animate-pulse-light">Cargando catálogo de programas...</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-red-500">
        <p className="text-3xl animate-pulse-fade">Error al cargar: {error}</p>
      </div>
    );
  }

  // Filtrar cursos para mostrar solo los publicados
  const filteredCursos = cursos.filter(curso => curso.publicado);

  // Render principal
  return (
    <div className="relative py-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono min-h-screen text-gray-200 overflow-x-hidden">
      <AnimatedBackground />

      {/* Título secundario debajo del botón y antes del filtro */}
      <div className="text-center mb-8">
        <span className="block text-3xl md:text-4xl font-bold text-white/80 animate-fade-in-up">Explora nuestro catálogo estelar:</span>
      </div>
      {/* Filtros de nivel de curso */}
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M4 15h16M4 9h16" /></svg>
          <span className="text-lg font-semibold text-teal-300">Filtrar programas por nivel</span>
        </div>
        <div className="flex justify-center flex-wrap gap-4 p-2 rounded-xl bg-gray-900 shadow-lg border border-gray-700 mx-auto max-w-fit">
          {[
            { nivel: 'todos', icon: <svg className='inline w-5 h-5 mr-2 -mt-1' fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg> },
            { nivel: 'básico', icon: <svg className='inline w-5 h-5 mr-2 -mt-1 text-green-400' fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /></svg> },
            { nivel: 'intermedio', icon: <svg className='inline w-5 h-5 mr-2 -mt-1 text-yellow-400' fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" /></svg> },
            { nivel: 'avanzado', icon: <svg className='inline w-5 h-5 mr-2 -mt-1 text-pink-400' fill="currentColor" viewBox="0 20 20"><polygon points="10,2 2,18 18,18" /></svg> }
          ].map(({ nivel, icon }) => (
            <button
              key={nivel}
              onClick={() => handleFilterClick(nivel as 'básico' | 'intermedio' | 'avanzado' | 'todos')}
              className={
                `px-6 py-3 rounded-full transition-all duration-300 ease-in-out font-medium text-lg border-2 flex items-center gap-2
                ${filtroNivel === nivel
                  ? 'bg-gradient-to-r from-purple-700 to-pink-500 text-white shadow-xl-neon border-purple-500 animate-pulse-fast ring-2 ring-pink-400'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-600 hover:border-teal-400'
                }
                focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900
                hover:scale-110 transition-transform`
              }
              aria-pressed={filtroNivel === nivel}
              title={`Filtrar por nivel: ${nivel.charAt(0).toUpperCase() + nivel.slice(1)}`}
            >
              {icon}
              <span className="hidden sm:inline">{nivel.charAt(0).toUpperCase() + nivel.slice(1)}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Grilla de cursos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
        {filteredCursos.length > 0 ? (
          filteredCursos.map((curso) => (
            // Cada tarjeta es clickable y tiene botón Ver
            <div key={curso._id} className="cursor-pointer">
              <ContentCard
                title={curso.titulo}
                description={curso.descripcion || 'Sin descripción disponible.'}
                imageUrl={curso.imageUrl || 'https://placehold.co/400x200.png?text=DevCurso'}
                link={`/cursos/${curso.codigo}`}
                tags={[curso.nivel, `Duración: ${curso.duracionHoras}h`]}
              />
            </div>
          ))
        ) : (
          // Si no hay cursos, mensaje amigable
          <p className="col-span-full text-center text-gray-400 text-2xl py-10 animate-pulse-fade">
            No se encontraron programas de estudio publicados.
          </p>
        )}
      </div>
    </div>
  );
}
