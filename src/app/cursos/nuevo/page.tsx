// frontend-cursos/src/app/cursos/nuevo/page.tsx
'use client'; // Esto es necesario para usar hooks de React como useState y useRouter

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importa useRouter de next/navigation

const API_URL_DIRECT = 'http://localhost:4000/api'; // Asegúrate de que esta URL sea la correcta para tu API

const NuevoCursoPage: React.FC = () => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('básico');
  const [duracionHoras, setDuracionHoras] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const router = useRouter(); // Inicializa el router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

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
          duracionHoras: Number(duracionHoras), // Asegúrate de enviar como número
          codigo,
          imageUrl,
          publicado: false, // Por defecto, puedes ajustar esto si quieres
          fechaCreacion: new Date().toISOString(), // Fecha actual
        }),
      });

      if (!res.ok) {
        // Intenta leer el mensaje de error del backend si está disponible
        const errorData = await res.json();
        throw new Error(errorData.mensaje || `Error al crear el curso: ${res.statusText}`);
      }

      const newCurso = await res.json();
      setMensaje(`Curso "${newCurso.titulo}" creado con éxito!`);
      // Limpiar formulario después del éxito
      setTitulo('');
      setDescripcion('');
      setNivel('básico');
      setDuracionHoras(0);
      setCodigo('');
      setImageUrl('');

      // Redirige a la página principal después de un breve retraso
      setTimeout(() => {
        router.push('/');
      }, 2000); // Espera 2 segundos para que el usuario vea el mensaje de éxito
    } catch (err: any) {
      setError(err.message || 'Error desconocido al crear el curso.');
      console.error("Error creating course:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl mt-8">
      <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">Crear Nuevo Curso</h1>

      {mensaje && (
        <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-center">
          {mensaje}
        </div>
      )}
      {error && (
        <div className="bg-red-600 text-white p-3 rounded-md mb-4 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="titulo" className="block text-gray-300 text-sm font-bold mb-2">Título:</label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-gray-300 text-sm font-bold mb-2">Descripción:</label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            rows={4}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          ></textarea>
        </div>
        <div>
          <label htmlFor="nivel" className="block text-gray-300 text-sm font-bold mb-2">Nivel:</label>
          <select
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 text-white"
          >
            <option value="básico">Básico</option>
            <option value="intermedio">Intermedio</option>
            <option value="avanzado">Avanzado</option>
          </select>
        </div>
        <div>
          <label htmlFor="duracionHoras" className="block text-gray-300 text-sm font-bold mb-2">Duración (horas):</label>
          <input
            type="number"
            id="duracionHoras"
            value={duracionHoras}
            onChange={(e) => setDuracionHoras(Number(e.target.value))}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          />
        </div>
        <div>
          <label htmlFor="codigo" className="block text-gray-300 text-sm font-bold mb-2">Código (único):</label>
          <input
            type="text"
            id="codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className="block text-gray-300 text-sm font-bold mb-2">URL de la Imagen:</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
            placeholder="Ej: https://via.placeholder.com/400x200.png?text=NuevoCurso"
          />
        </div>

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full"
        >
          Crear Curso
        </button>
      </form>
    </div>
  );
};

export default NuevoCursoPage;