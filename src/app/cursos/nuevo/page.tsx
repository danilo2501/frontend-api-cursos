// Página para crear un nuevo curso
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isValidImageUrl, generateUniqueCode } from '@/lib/utils';
import AnimatedBackground from '../../AnimatedBackground';

const API_URL_DIRECT = 'http://localhost:4000/api'; // URL base de la API

const NuevoCursoPage: React.FC = () => {
  // Estados para los campos del formulario y mensajes
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState<'básico' | 'intermedio' | 'avanzado'>('básico');
  const [duracionHoras, setDuracionHoras] = useState<string>('0');
  const [codigo, setCodigo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [codigoError, setCodigoError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  // Genera un código único y lo asigna al campo
  const handleGenerateCode = () => {
    const newCode = generateUniqueCode();
    setCodigo(newCode);
    setCodigoError('');
    setMensaje('Código generado: ' + newCode);
    setTimeout(() => setMensaje(''), 1500);
  };

  // Incrementa la duración en 5 horas
  const handleIncrementDuration = () => {
    setDuracionHoras(prev => String(Math.max(0, Number(prev) + 5)));
  };

  // Decrementa la duración en 5 horas
  const handleDecrementDuration = () => {
    setDuracionHoras(prev => String(Math.max(0, Number(prev) - 5)));
  };

  // Maneja el envío del formulario para crear el curso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');
    setCodigoError('');
    setIsSubmitting(true);

    // Validaciones básicas
    if (!codigo.trim()) {
      setCodigoError('El código del programa es obligatorio.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(Number(duracionHoras)) || Number(duracionHoras) < 0) {
        setError('La duración debe ser un número positivo.');
        setIsSubmitting(false);
        return;
    }

    // Validación de imagen
    let finalImageUrl = imageUrl;
    if (imageUrl && !isValidImageUrl(imageUrl)) {
      setError('La URL de la imagen no es válida. Debe terminar en .jpg, .png, .webp, .gif o .svg');
      setIsSubmitting(false);
      return;
    }
    if (!imageUrl) {
      finalImageUrl = 'https://via.placeholder.com/400x200.png?text=DevCurso';
    }

    // Envío de datos a la API
    try {
      const res = await fetch(`${API_URL_DIRECT}/cursos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          nivel,
          duracionHoras: Number(duracionHoras),
          codigo: codigo.trim(),
          imageUrl: finalImageUrl,
          publicado: false,
          fechaCreacion: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.campoDuplicado && errorData.campoDuplicado.codigo) {
            setCodigoError(errorData.mensaje || 'El código del programa ya existe. Por favor, utiliza un código único.');
        } else {
            setError(errorData.mensaje || `Error al crear el programa: ${res.statusText}`);
        }
        setIsSubmitting(false);
        return;
      }

      const newCurso = await res.json();
      setMensaje(`Programa "${newCurso.titulo}" creado con éxito!`);
      setTitulo('');
      setDescripcion('');
      setNivel('básico');
      setDuracionHoras('0');
      setCodigo('');
      setImageUrl('');

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al crear el programa. Revisa tu conexión o el servidor.');
      console.error("Error creating course:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nivelesDificultad = ['básico', 'intermedio', 'avanzado'];

  // Render principal del formulario
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/95 p-4 font-mono overflow-x-hidden">
      <AnimatedBackground />
      <div className="max-w-xl w-full mx-auto p-8 bg-gradient-to-br from-gray-900/80 via-gray-950/80 to-black/90 rounded-2xl shadow-xl border border-gray-700
                    transform hover:scale-105 transition-transform duration-500 ease-in-out
                    relative overflow-hidden
                    before:content-[''] before:absolute before:-inset-0.5 before:bg-gradient-to-br from-purple-400/30 via-pink-300/20 to-teal-200/20 before:animate-spin-slow before:blur-lg before:opacity-40 before:rounded-2xl
                    after:content-[''] after:absolute after:-inset-0.5 after:bg-gray-900/90 after:rounded-2xl after:z-10"> {/* Contenedor principal con efecto neón/glow */}
        <div className="relative z-20"> {/* Contenido del formulario sobre el efecto glow */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-pink-400 to-purple-400 mb-8 text-center drop-shadow-lg animate-pulse-light" role="heading" aria-level={1}>Crear Nuevo Programa de Estudios</h1>

          {mensaje && (
            <div className="bg-gradient-to-r from-green-700 to-green-500 text-white p-4 rounded-lg mb-6 text-center text-lg font-medium animate-fadeInOut border-l-4 border-green-300 shadow-md">
              {mensaje}
            </div>
          )}
          {error && (
            <div className="bg-gradient-to-r from-red-700 to-red-500 text-white p-4 rounded-lg mb-6 text-center text-lg font-medium animate-fadeInOut border-l-4 border-red-300 shadow-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" role="form" aria-label="Formulario para crear programa de estudios">
            {/* Título del Curso */}
            <div>
              <label htmlFor="titulo" className="block text-purple-300 text-sm font-semibold mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">Título del Curso:</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-teal-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ease-in-out transform hover:scale-102 shadow-inner-dark"
                placeholder="Ej: Fundamentos de React.js - Edición 2025"
              />
              <span className="text-gray-400 text-xs mt-1 block opacity-80">Un título claro y descriptivo ayuda a los estudiantes a encontrar tu curso.</span>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-purple-300 text-sm font-semibold mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">Descripción Detallada:</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-teal-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ease-in-out resize-y transform hover:scale-102 shadow-inner-dark"
                placeholder="Describe lo que los estudiantes aprenderán, los temas cubiertos, y los requisitos previos..."
              ></textarea>
              <span className="text-gray-400 text-xs mt-1 block opacity-80">Proporciona una descripción completa para atraer a tus estudiantes.</span>
            </div>

            {/* Nivel de Dificultad */}
            <div>
              <label className="block text-purple-300 text-sm font-semibold mb-2">Nivel de Dificultad:</label>
              <div className="flex flex-wrap gap-3">
                {nivelesDificultad.map((nivelOp) => (
                  <button
                    key={nivelOp}
                    type="button"
                    onClick={() => setNivel(nivelOp as 'básico' | 'intermedio' | 'avanzado')}
                    className={`
                      px-5 py-2 rounded-full transition-all duration-300 ease-in-out
                      font-medium text-sm border-2
                      ${nivel === nivelOp
                        ? 'bg-gradient-to-r from-purple-700 to-pink-500 text-white shadow-xl-neon border-purple-500 animate-pulse-fast' // Seleccionado
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-600 hover:border-teal-400' // No seleccionado
                      }
                      focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900
                    `}
                  >
                    {nivelOp.charAt(0).toUpperCase() + nivelOp.slice(1)}
                  </button>
                ))}
              </div>
              <span className="text-gray-400 text-xs mt-1 block opacity-80">Selecciona el nivel de habilidad apropiado para este curso.</span>
            </div>

            {/* Duración */}
            <div>
              <label htmlFor="duracionHoras" className="block text-purple-300 text-sm font-semibold mb-2">Duración (en horas):</label>
              <div className="flex items-center space-x-3 bg-gray-700 rounded-lg p-2 border border-gray-600 shadow-inner-dark">
                <button
                  type="button"
                  onClick={handleDecrementDuration}
                  className="px-3 py-1 bg-gradient-to-r from-red-600 to-pink-500 hover:from-red-700 hover:to-pink-600 text-white font-bold rounded-full shadow-xl-neon animate-glow-button transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
                >
                  -
                </button>
                <input
                  type="number"
                  id="duracionHoras"
                  value={duracionHoras}
                  onChange={(e) => setDuracionHoras(e.target.value)}
                  required
                  min="0"
                  className="w-24 text-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-teal-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 ease-in-out shadow-inner-dark"
                  placeholder="0"
                />
                <button
                  type="button"
                  onClick={handleIncrementDuration}
                  className="px-3 py-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold rounded-full shadow-xl-neon animate-glow-button transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-lg"
                >
                  +
                </button>
                <span className="text-teal-300 text-sm font-medium ml-2">horas</span>
              </div>
              <span className="text-gray-400 text-xs mt-1 block opacity-80">Ingresa la duración total estimada del curso en horas, o usa los botones para ajustar.</span>
            </div>

            {/* Código del Curso */}
            <div>
              <label htmlFor="codigo" className="block text-purple-300 text-sm font-semibold mb-2 after:content-['*'] after:ml-0.5 after:text-red-500">Código Único del Curso:</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  id="codigo"
                  value={codigo}
                  onChange={(e) => {
                    setCodigo(e.target.value);
                    setCodigoError('');
                  }}
                  required
                  className={`flex-grow px-4 py-3 bg-gray-700 border rounded-lg text-teal-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ease-in-out transform hover:scale-102 shadow-inner-dark
                    ${codigoError ? 'border-red-500' : 'border-gray-600'}`}
                  placeholder="Un código único para identificar el curso (ej: REACT-001)"
                />
                <button
                  type="button"
                  onClick={handleGenerateCode}
                  disabled={!!codigo}
                  className={`px-4 py-3 rounded-full shadow-xl-neon animate-glow-button transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 font-semibold ${codigo ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white'}`}
                >
                  {codigo ? 'Código Generado' : 'Generar Código'}
                </button>
              </div>
              {codigoError && (
                <p className="text-red-400 text-sm mt-2 animate-pulse-fade">{codigoError}</p>
              )}
              <span className="text-gray-400 text-xs mt-1 block opacity-80">Este código debe ser único para cada curso. Puedes generarlo automáticamente o introducirlo manualmente.</span>
            </div>

            {/* URL de Imagen */}
            <div>
              <label htmlFor="imageUrl" className="block text-purple-300 text-sm font-semibold mb-2">URL de la Imagen (Opcional):</label>
              <input
                type="text"
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-teal-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 ease-in-out transform hover:scale-102 shadow-inner-dark"
                placeholder="Ej: https://ejemplo.com/imagen-curso.jpg"
              />
              <span className="text-gray-400 text-xs mt-1 block opacity-80">Añade una URL a una imagen relevante para que el curso se vea mejor.</span>
            </div>

            {/* Botones de Envío y Cancelar */}
            <div className="flex gap-4 w-full">
              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={`flex-1 bg-gradient-to-r from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out text-lg shadow-xl-neon animate-glow-button focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 transition-transform ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Creando...' : 'Crear Programa'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/')}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-gray-200 font-bold py-3 px-6 rounded-full shadow-xl-neon animate-glow-button transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-105 text-lg border border-gray-600"
                aria-label="Cancelar y volver al inicio"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div> {/* Fin del z-20 para el contenido */}
      </div> {/* Fin del contenedor principal */}
    </div>
  );
};

export default NuevoCursoPage;