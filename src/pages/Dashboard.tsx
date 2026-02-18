import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BookOpen, ClipboardList, GraduationCap, CalendarDays } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import MaterialTab from "@/components/dashboard/MaterialTab";
import TarefasTab from "@/components/dashboard/TarefasTab";
import ExamesTab from "@/components/dashboard/ExamesTab";
import AgendaTab from "@/components/dashboard/AgendaTab";

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
            {roles.includes("admin") && (
              <Link to="/admin">
                <Button variant="outline" size="sm">Painel Admin</Button>
              </Link>
            )}
            {roles.includes("professor") && (
              <Link to="/professor">
                <Button variant="outline" size="sm">Área do Professor</Button>
              </Link>
            )}
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-3xl mb-1">
          Olá, bem-vindo(a)! 👋
        </h1>
        <p className="text-muted-foreground mb-6">
          Seu papel: <span className="font-semibold text-primary capitalize">{roles[0] || "aluno"}</span>
        </p>

        <Tabs defaultValue="material" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-1">
            <TabsTrigger value="material" className="gap-2 text-xs sm:text-sm py-2">
              <BookOpen className="w-4 h-4" /> Material
            </TabsTrigger>
            <TabsTrigger value="tarefas" className="gap-2 text-xs sm:text-sm py-2">
              <ClipboardList className="w-4 h-4" /> Tarefas
            </TabsTrigger>
            <TabsTrigger value="exames" className="gap-2 text-xs sm:text-sm py-2">
              <GraduationCap className="w-4 h-4" /> Exames
            </TabsTrigger>
            <TabsTrigger value="agenda" className="gap-2 text-xs sm:text-sm py-2">
              <CalendarDays className="w-4 h-4" /> Agenda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="material"><MaterialTab /></TabsContent>
          <TabsContent value="tarefas"><TarefasTab /></TabsContent>
          <TabsContent value="exames"><ExamesTab /></TabsContent>
          <TabsContent value="agenda"><AgendaTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
