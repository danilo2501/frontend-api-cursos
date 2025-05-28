import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 p-8 mt-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">DevCursos</h4>
          <p className="text-sm">
            Tu plataforma ideal para aprender y dominar nuevas habilidades de programación.
          </p>
        </div>
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-teal-400 transition-colors">Sobre Nosotros</Link></li>
            <li><Link href="/contact" className="hover:text-teal-400 transition-colors">Contacto</Link></li>
            <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Política de Privacidad</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-lg font-semibold mb-4">Síguenos</h4>
          <div className="flex space-x-4">
            <a href="https://twitter.com/tu_twitter" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
              Twitter
            </a>
            <a href="https://github.com/tu_github" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
              GitHub
            </a>
            <a href="https://youtube.com/tu_youtube" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
              YouTube
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
        © {new Date().getFullYear()} DevCursos. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;