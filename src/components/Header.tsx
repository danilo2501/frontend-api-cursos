// frontend-cursos/src/components/Header.tsx
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
          DevCursos
        </Link>
        <div className="flex items-center space-x-6">
          <Link href="/cursos" className="text-gray-300 hover:text-white transition-colors">
            Cursos
          </Link>
          <Link href="/tutoriales" className="text-gray-300 hover:text-white transition-colors">
            Tutoriales
          </Link>
          <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">
            Blog
          </Link>
          {/* Nuevo botón para Crear Curso */}
          <Link href="/cursos/nuevo" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Añadir Curso
          </Link>
          <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            Acceso
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;