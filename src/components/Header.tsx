"use client";
// frontend-cursos/src/components/Header.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredCursos, setFilteredCursos] = useState<any[]>([]);
  const [allCursos, setAllCursos] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY > lastScrollY && currentScrollY > 60) {
            setShow(false);
          } else {
            setShow(true);
          }
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    fetch('http://localhost:4000/api/cursos')
      .then(res => res.json())
      .then(data => setAllCursos(data))
      .catch(() => setAllCursos([]));
  }, []);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
      setFilteredCursos(
        allCursos.filter(curso =>
          curso.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setShowSuggestions(false);
      setFilteredCursos([]);
    }
  }, [searchTerm, allCursos]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredCursos.length > 0) {
      router.push(`/cursos/${filteredCursos[0].codigo}`);
      setShowSuggestions(false);
      setSearchTerm('');
    }
  };

  const handleSuggestionClick = (codigo: string) => {
    router.push(`/cursos/${codigo}`);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  return (
    <header
      className={`w-full bg-gradient-to-r from-gray-950 via-gray-900 to-black border-b border-gray-800 shadow-md py-4 px-6 flex items-center justify-between gap-4 z-20 fixed top-0 left-0 transition-transform duration-300 ${show ? 'translate-y-0' : '-translate-y-full'}`}
      style={{ willChange: 'transform' }}
    >
      <div className="flex items-center gap-4">
        <img
          src="https://sergio.ec/wp-content/uploads/2025/05/sergiojmazure_13132_file-1536x1536.jpeg"
          alt="Logo DevCursos"
          className="w-10 h-10 object-contain rounded-full shadow-xl-neon"
        />
        <Link href="/" className="text-2xl font-bold text-teal-400 hover:text-teal-300 transition-colors">
          DevCursos
        </Link>
      </div>
      {/* Barra de búsqueda funcional justo debajo del logo/título */}
      <div className="w-full flex justify-center mt-2 mb-2">
        <div className="relative w-80 max-w-xs group">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            placeholder="Buscar cursos..."
            className="w-full px-4 py-2 rounded-full bg-gray-800 border border-gray-700 text-teal-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-300 shadow-xl-neon animate-glow-button"
            aria-label="Buscar cursos"
            autoComplete="off"
            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
          <svg className="absolute right-3 top-2.5 w-5 h-5 text-pink-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          {/* Sugerencias */}
          {showSuggestions && filteredCursos.length > 0 && (
            <ul className="absolute z-30 left-0 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl-neon animate-fade-in overflow-hidden">
              {filteredCursos.slice(0, 6).map((curso) => (
                <li
                  key={curso.codigo}
                  className="px-4 py-2 cursor-pointer hover:bg-gradient-to-r hover:from-teal-700 hover:to-purple-700 text-teal-200 hover:text-white transition-colors duration-200"
                  onMouseDown={() => handleSuggestionClick(curso.codigo)}
                  tabIndex={0}
                  aria-label={`Ir a ${curso.titulo}`}
                >
                  <span className="font-semibold text-pink-300">{curso.titulo}</span>
                  <span className="ml-2 text-xs text-gray-400">({curso.codigo})</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <nav className="container mx-auto flex justify-between items-center">
        

        <div className="flex items-center space-x-6">
          {/* Ejemplo de botón de navegación con nueva paleta */}
          <Link
            href="/cursos"
            className="bg-gradient-to-r from-teal-500 to-purple-600 hover:from-teal-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-base"
          >
            Catálogo
          </Link>
          <Link
            href="/cursos/nuevo"
            className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-6 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-base"
          >
            Nuevo Curso
          </Link>
        </div>
      </nav>
      <div className="flex gap-2 items-center">
        <a
          href="https://github.com/tuusuario"
          className="bg-gradient-to-r from-purple-700 to-pink-500 hover:from-purple-800 hover:to-pink-600 text-white rounded-full p-2 transition-all duration-300 shadow-xl-neon focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-110"
          title="GitHub"
          target="_blank" rel="noopener noreferrer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.66-.22.66-.48 0-.24-.01-.87-.01-1.7-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0112 6.8c.85.004 1.71.12 2.51.35 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.33-.01 2.4-.01 2.73 0 .27.16.58.67.48A10.01 10.01 0 0022 12c0-5.52-4.48-10-10-10z" /></svg>
        </a>
        <a
          href="https://twitter.com/tuusuario"
          className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-full p-2 transition-all duration-300 shadow-xl-neon focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-110"
          title="X / Twitter"
          target="_blank" rel="noopener noreferrer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.59-2.47.7a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04A4.28 4.28 0 0016.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 9.13 4.07 7.38 1.64 4.77c-.37.64-.58 1.38-.58 2.17 0 1.5.76 2.82 1.92 3.6-.7-.02-1.36-.21-1.94-.53v.05c0 2.1 1.5 3.85 3.5 4.25-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.1 2.94 3.95 2.97A8.6 8.6 0 012 19.54c-.29 0-.57-.02-.85-.05A12.13 12.13 0 007.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0024 4.59a8.36 8.36 0 01-2.54.7z" /></svg>
        </a>
        <a
          href="https://linkedin.com/in/tuusuario"
          className="bg-gradient-to-r from-blue-800 to-purple-600 hover:from-blue-900 hover:to-purple-700 text-white rounded-full p-2 transition-all duration-300 shadow-xl-neon focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 hover:scale-110"
          title="LinkedIn"
          target="_blank" rel="noopener noreferrer"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.38v4.59h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z" /></svg>
        </a>
        {/* Botón de login moderno */}
        <Link
          href="/login"
          className="ml-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white font-bold py-2 px-6 rounded-full shadow-xl-neon transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 text-base animate-glow-button"
        >
          Login
        </Link>
      </div>
    </header>
  );
};

export default Header;