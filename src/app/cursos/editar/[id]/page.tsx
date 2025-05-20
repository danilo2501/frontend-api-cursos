// frontend-cursos/src/app/cursos/editar/[id]/page.tsx
'use client'; // Esto es necesario para usar hooks de React como useState, useEffect y useRouter

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; // Importa useParams para obtener el ID de la URL

console.log("--> Page de Edición cargando (fuera del componente)"); // <--- LÍNEA AÑADIDA PARA DEPURACIÓN

const API_URL_DIRECT = 'http://localhost:4000/api'; // Asegúrate de que esta URL sea la correcta para tu API

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

const EditarCursoPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); // Hook para acceder a los parámetros de la URL
  const { id } = params; // Extrae el 'id' de los parámetros de la URL

  console.log("--> Componente EditarCursoPage montado. ID params:", params); // <--- LÍNEA AÑADIDA PARA DEPURACIÓN
  console.log("--> ID extraído:", id); // <--- LÍNEA AÑADIDA PARA DEPURACIÓN


  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nivel, setNivel] = useState('básico');
  const [duracionHoras, setDuracionHoras] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [publicado, setPublicado] = useState(false); // Nuevo estado para 'publicado'
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Efecto para cargar los datos del curso cuando el componente se monta o el ID cambia
  useEffect(() => {
    console.log("--> useEffect en EditarCursoPage ejecutado. ID en efecto:", id); // <--- LÍNEA AÑADIDA PARA DEPURACIÓN
    if (id) { // Asegúrate de que el ID exista antes de intentar cargar
      console.log("--> Intentando cargar curso con ID:", id); // <--- LÍNEA AÑADIDA PARA DEPURACIÓN
      const fetchCurso = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_URL_DIRECT}/cursos/${id}`);
          if (!res.ok) {
            throw new Error(`Error al obtener el curso: ${res.statusText}`);
          }
          const data: Curso = await res.json();
          // Pre-llenar el formulario con los datos del curso
          setTitulo(data.titulo);
          setDescripcion(data.descripcion);
          setNivel(data.nivel);
          setDuracionHoras(data.duracionHoras);
          setCodigo(data.codigo);
          setImageUrl(data.imageUrl || ''); // Asegúrate de que no sea 'undefined'
          setPublicado(data.publicado); // Cargar el estado de 'publicado'
        } catch (err: any) {
          setError(err.message || 'Error desconocido al cargar el curso.');
          console.error("Error fetching course for edit:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchCurso();
    } else {
      console.log("--> ID es undefined o null en useEffect, no se intenta cargar curso."); // <--- LÍNEA AÑADIDA PARA DEPURACIÓN
      setLoading(false); // Si no hay ID, terminamos la carga para no quedar en bucle
      setError("No se proporcionó un ID de curso para editar.");
    }
  }, [id]); // Dependencia del efecto: se ejecuta cuando 'id' cambia

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    if (!id) {
        setError("No se puede actualizar el curso: ID no disponible.");
        return;
    }

    try {
      const res = await fetch(`${API_URL_DIRECT}/cursos/${id}`, {
        method: 'PUT', // Método HTTP para actualización
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo,
          descripcion,
          nivel,
          duracionHoras: Number(duracionHoras),
          // El código no se debería cambiar, así que no lo enviamos aquí
          imageUrl,
          publicado, // Enviar el estado de 'publicado'
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.mensaje || `Error al actualizar el curso: ${res.statusText}`);
      }

      const updatedCurso = await res.json();
      setMensaje(`Curso "${updatedCurso.titulo}" actualizado con éxito!`);
      // Redirige a la página principal después de un breve retraso
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error desconocido al actualizar el curso.');
      console.error("Error updating course:", err);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-400 text-xl py-10">Cargando datos del curso...</p>;
  }

  if (error && !mensaje) { // Muestra error solo si no hay mensaje de éxito
    return <p className="text-center text-red-500 text-xl py-10">Error: {error}</p>;
  }


  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 rounded-lg shadow-xl mt-8">
      <h1 className="text-3xl font-bold text-teal-400 mb-6 text-center">Editar Curso</h1>

      {mensaje && (
        <div className="bg-green-600 text-white p-3 rounded-md mb-4 text-center">
          {mensaje}
        </div>
      )}
      {error && !mensaje && ( // Muestra error solo si no hay mensaje de éxito
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
            disabled // El código no debería ser editable una vez creado
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
            placeholder="Ej: https://via.placeholder.com/400x200.png?text=CursoEditado"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="publicado"
            checked={publicado}
            onChange={(e) => setPublicado(e.target.checked)}
            className="form-checkbox h-4 w-4 text-teal-600 transition duration-150 ease-in-out"
          />
          <label htmlFor="publicado" className="ml-2 block text-gray-300 text-sm font-bold">Publicado</label>
        </div>


        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors w-full"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarCursoPage;