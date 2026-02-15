import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-heading font-black text-2xl tracking-tight">
          <span className="text-foreground">Lo</span>
          <span className="text-primary">ten</span>
          <span className="text-secondary">go</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#metodologia" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Metodologia
          </a>
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sobre
          </a>
          <a href="#contato" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm" className="font-heading font-semibold">
            <Link to="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm" className="font-heading font-semibold rounded-lg">
            <Link to="/cadastro">Cadastre-se</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-background border-b px-4 pb-4 space-y-3">
          <a href="#metodologia" onClick={() => setOpen(false)} className="block text-sm font-medium py-2">Metodologia</a>
          <a href="#sobre" onClick={() => setOpen(false)} className="block text-sm font-medium py-2">Sobre</a>
          <a href="#contato" onClick={() => setOpen(false)} className="block text-sm font-medium py-2">Contato</a>
          <div className="flex gap-3 pt-2">
            <Button asChild variant="outline" size="sm" className="flex-1">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link to="/cadastro">Cadastre-se</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
