import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/70 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <Link to="/" className="font-heading font-black text-2xl tracking-tight">
              <span className="text-background">Lo</span>
              <span className="text-primary">ten</span>
              <span className="text-secondary">go</span>
            </Link>
            <p className="text-sm mt-2">Escola de Espanhol Online</p>
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/politica-privacidade" className="hover:text-background transition-colors">
              Política de Privacidade
            </Link>
            <a href="#contato" className="hover:text-background transition-colors">
              Contato
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-background/10 text-center text-sm">
          © {new Date().getFullYear()} Lotengo. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
