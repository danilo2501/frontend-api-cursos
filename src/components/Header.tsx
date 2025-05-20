import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-teal-400">
          DevCursos
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link href="/cursos" className="hover:text-teal-400 transition-colors">
              Cursos
            </Link>
          </li>
          <li>
            <Link href="/tutoriales" className="hover:text-teal-400 transition-colors">
              Tutoriales
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-teal-400 transition-colors">
              Blog
            </Link>
          </li>
        </ul>
        <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
          Acceso
        </button>
      </nav>
    </header>
  );
};

export default Header;