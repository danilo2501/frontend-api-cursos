// frontend-cursos/src/components/Footer.tsx
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">DevCursos</h3>
          <p className="text-sm">
            Tu plataforma ideal para aprender y dominar nuevas habilidades de programación.
          </p>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/about" className="hover:text-white transition-colors text-sm">Sobre Nosotros</Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors text-sm">Contacto</Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors text-sm">Política de Privacidad</Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Síguenos</h3>
          <div className="flex space-x-4">
            {/* Aquí podrías añadir iconos de redes sociales */}
            <Link href="https://twitter.com/tuusuario" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm">
              Twitter
            </Link>
            <Link href="https://youtube.com/tuusuario" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-sm">
              YouTube
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} DevCursos. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;