// frontend-cursos/src/app/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import ContentCard from '../components/ContentCard';
import { useRouter } from 'next/navigation';
import AnimatedBackground from './AnimatedBackground'; // Asegúrate de que esta ruta sea correcta
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Interfaces ---
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

// --- Constantes de la API ---
const API_URL_DIRECT = 'http://localhost:4000/api';

// Esta función se puede mantener fuera del componente si es puramente utilitaria
async function fetchCursosData(nivelFiltro?: 'básico' | 'intermedio' | 'avanzado' | 'todos'): Promise<Curso[]> {
  try {
    let url = `${API_URL_DIRECT}/cursos`;
    if (nivelFiltro && nivelFiltro !== 'todos') {
      url = `${API_URL_DIRECT}/cursos?nivel=${nivelFiltro}`;
    }

    const res = await fetch(url, {
      cache: 'no-store'
    });
    if (!res.ok) {
      // Intenta obtener un mensaje de error más específico del backend
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(`Error al obtener los cursos: ${res.statusText} - ${errorData.message || 'Error desconocido del servidor'}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    // Propagamos el error para que loadCursos pueda manejarlo y establecer el estado de error
    throw error;
  }
}

// Carrusel de imágenes promocionales
const promoImages = [
  {
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    alt: "Aprende a programar desde cero"
  },
  {
    url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    alt: "Cursos de desarrollo web modernos"
  },
  {
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Certifícate y potencia tu carrera"
  }
];

// Datos para los filtros de nivel (extraídos para limpieza)
const NIVEL_FILTERS = [
  {
    nivel: 'todos',
    label: 'Todos',
    icon: (
      <svg className='inline w-5 h-5 mr-2 -mt-1' fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M8 12h8" /><path d="M12 8v8" /></svg>
    ),
  },
  {
    nivel: 'básico',
    label: 'Básico',
    icon: (
      <svg className='inline w-5 h-5 mr-2 -mt-1 text-green-400' fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" /></svg>
    ),
  },
  {
    nivel: 'intermedio',
    label: 'Intermedio',
    icon: (
      <svg className='inline w-5 h-5 mr-2 -mt-1 text-yellow-400' fill="currentColor" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" /></svg>
    ),
  },
  {
    nivel: 'avanzado',
    label: 'Avanzado',
    icon: (
      <svg className='inline w-5 h-5 mr-2 -mt-1 text-pink-400' fill="currentColor" viewBox="0 0 20 20"><polygon points="10,2 2,18 18,18" /></svg>
    ),
  },
];

export default function HomePage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroNivel, setFiltroNivel] = useState<'básico' | 'intermedio' | 'avanzado' | 'todos'>('todos');
  const router = useRouter();

  // Usamos useCallback para memoizar loadCursos
  const loadCursos = useCallback(async (nivel?: 'básico' | 'intermedio' | 'avanzado' | 'todos') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCursosData(nivel);
      setCursos(data);
    } catch (err: any) {
      console.error("Error al cargar cursos:", err);
      setError(err.message || "Ocurrió un error desconocido al cargar los cursos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCursos(filtroNivel);
  }, [filtroNivel, loadCursos]);

  const handleFilterClick = (nivel: 'básico' | 'intermedio' | 'avanzado' | 'todos') => {
    setFiltroNivel(nivel);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este programa de estudio? Esta acción no se puede deshacer.')) {
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
      alert('Programa de estudio desintegrado con éxito!');
    } catch (err: any) {
      alert(`Error al desintegrar el programa de estudio: ${err.message}`);
      console.error("Error deleting course:", err);
    }
  };

  const handleInscribir = async (cursoId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Usuario no autenticado');
  
      const res = await fetch(`${API_URL_DIRECT}/inscribir`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cursoId }),
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al inscribir en el curso');
      }
  
      toast.success('Inscripción realizada con éxito');
    } catch (err: any) {
      toast.error(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-gray-400">
        <p className="text-3xl animate-pulse-light">Cargando DevCursos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono text-red-500">
        <p className="text-3xl animate-pulse-fade">Error al cargar: {error}</p>
      </div>
    );
  }

  const publishedCursos = cursos.filter(curso => curso.publicado); // Filtrar cursos publicados

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
      <div className="relative py-8 bg-gradient-to-br from-gray-950 via-gray-900 to-black font-mono min-h-screen text-gray-200 overflow-x-hidden">
        <AnimatedBackground />

        <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-pink-400 to-purple-400 leading-tight drop-shadow-lg animate-pulse-light">
          Bienvenido a <span className="text-teal-400">DevCursos</span>:
        </h1>

        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/cursos/nuevo')}
            className="bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600
                      text-white font-bold py-3 px-8 rounded-full shadow-xl-neon transition-all duration-300 ease-in-out text-xl
                      transform hover:scale-110 active:scale-95 animate-glow-button focus:outline-none focus:ring-4 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 mx-auto"
            title="Crear un nuevo programa de estudios"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
            <span>Activar Nuevo Programa de Estudios</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/mis-cursos')}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-3 px-8 rounded-full shadow-xl-neon transition-all duration-300 ease-in-out text-xl transform hover:scale-110 active:scale-95 animate-glow-button focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 mx-auto"
            title="Ir a Mis Cursos"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" />
            </svg>
            <span>Mis Cursos</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <span className="block text-3xl md:text-4xl font-bold text-white/80 animate-fade-in-up">Explora nuestro catálogo estelar</span>
        </div>

        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M4 15h16M4 9h16" /></svg>
            <span className="text-lg font-semibold text-teal-300">Filtrar programas por nivel</span>
          </div>
          <div className="flex justify-center flex-wrap gap-4 p-2 rounded-xl bg-gray-900 shadow-lg border border-gray-700 mx-auto max-w-fit">
            {NIVEL_FILTERS.map(({ nivel, label, icon }) => ( // Usamos `label` de NIVEL_FILTERS
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
                title={`Filtrar por nivel: ${label}`}
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
          {publishedCursos.length > 0 ? (
            publishedCursos.map((curso, idx) => (
              <div key={curso._id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 60}ms` }}>
                <ContentCard
                  title={curso.titulo}
                  description={curso.descripcion || 'Sin descripción disponible.'}
                  imageUrl={curso.imageUrl || 'https://via.placeholder.com/400x200.png?text=DevCurso'}
                  link={`/cursos/${curso.codigo}`}
                  tags={[
                    <span key="nivel" className={`badge ${
                      curso.nivel === 'básico' ? 'bg-green-900 text-green-300 border-green-500' :
                      curso.nivel === 'intermedio' ? 'bg-yellow-900 text-yellow-200 border-yellow-400' :
                      'bg-pink-900 text-pink-200 border-pink-400'
                    }`}>
                      {curso.nivel.charAt(0).toUpperCase() + curso.nivel.slice(1)}
                    </span>,
                    <span key="duracion" className="badge bg-gray-800 text-gray-200 border-gray-500">
                      {curso.duracionHoras}h
                    </span>,
                    <span key="publicado" className={`badge ${curso.publicado ? 'bg-teal-900 text-teal-300 border-teal-500' : 'bg-gray-700 text-gray-400 border-gray-500'}`}>
                      {curso.publicado ? 'Publicado' : 'Borrador'}
                    </span>
                  ]}
                >
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/cursos/editar/${curso._id}`);
                      }}
                      className="group/button bg-gradient-to-r from-blue-800 to-indigo-700 hover:from-blue-900 hover:to-indigo-800 text-white font-bold py-2 px-4 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 text-base animate-glow-button"
                      title="Editar curso"
                    >
                      <svg className="w-5 h-5 mr-1 opacity-80 group-hover/button:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z" />
                      </svg>
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(curso._id);
                      }}
                      className="group/button bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white font-bold py-2 px-4 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 text-base animate-glow-button"
                      title="Eliminar curso"
                    >
                      <svg className="w-5 h-5 mr-1 opacity-80 group-hover/button:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M6 19a2 2 0 002 2h8a2 2 0 002-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                      <span>Eliminar</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInscribir(curso._id);
                      }}
                      className="group/button bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-2 px-4 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 text-base animate-glow-button"
                      title="Inscribir curso"
                    >
                      <svg className="w-5 h-5 mr-1 opacity-80 group-hover/button:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Inscribir</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/cursos/${curso.codigo}`);
                      }}
                      className="group/button bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-bold py-2 px-4 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2 text-base animate-glow-button"
                      title="Ver curso"
                    >
                      <svg className="w-5 h-5 mr-1 opacity-80 group-hover/button:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M15 12h7M15 12l-3-3m3 3l-3 3" />
                      </svg>
                      <span>Ver</span>
                    </button>
                  </div>
                </ContentCard>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-xl py-12 animate-pulse-fade">
              No hay cursos disponibles para este filtro.
            </div>
          )}
        </div>
      </div>
    </>
  );
}