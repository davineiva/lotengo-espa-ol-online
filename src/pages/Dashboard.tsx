import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {
  const { user, roles, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <span className="font-heading font-black text-2xl tracking-tight">
            <span className="text-foreground">Lo</span>
            <span className="text-primary">ten</span>
            <span className="text-secondary">go</span>
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="font-heading font-bold text-3xl mb-2">
          Olá, bem-vindo(a)! 👋
        </h1>
        <p className="text-muted-foreground mb-8">
          Seu papel: <span className="font-semibold text-primary capitalize">{roles[0] || "aluno"}</span>
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {["📚 Material de Aula", "📝 Tarefas", "📊 Exames", "📅 Agenda"].map((item) => (
            <div
              key={item}
              className="rounded-xl border bg-card p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h3 className="font-heading font-semibold text-lg">{item}</h3>
              <p className="text-sm text-muted-foreground mt-2">Em breve</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
