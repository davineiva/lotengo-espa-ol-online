import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Upload, ClipboardList, Users, Clock } from "lucide-react";
import { Navigate } from "react-router-dom";
import UploadMaterialTab from "@/components/teacher/UploadMaterialTab";
import CriarTarefaTab from "@/components/teacher/CriarTarefaTab";
import GerenciarAlunosTab from "@/components/teacher/GerenciarAlunosTab";
import HorariosTab from "@/components/teacher/HorariosTab";

const TeacherDashboard = () => {
  const { user, roles, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes("professor")) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <span className="font-heading font-black text-2xl tracking-tight">
            <span className="text-foreground">Lo</span>
            <span className="text-primary">ten</span>
            <span className="text-secondary">go</span>
            <span className="text-muted-foreground text-sm font-medium ml-2">Professor</span>
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

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-heading font-bold text-3xl mb-1">Área do Professor 📚</h1>
        <p className="text-muted-foreground mb-6">
          Gerencie materiais, tarefas e alunos.
        </p>

        <Tabs defaultValue="material" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto gap-1">
            <TabsTrigger value="material" className="gap-2 text-xs sm:text-sm py-2">
              <Upload className="w-4 h-4" /> Material
            </TabsTrigger>
            <TabsTrigger value="tarefas" className="gap-2 text-xs sm:text-sm py-2">
              <ClipboardList className="w-4 h-4" /> Tarefas
            </TabsTrigger>
            <TabsTrigger value="alunos" className="gap-2 text-xs sm:text-sm py-2">
              <Users className="w-4 h-4" /> Alunos
            </TabsTrigger>
            <TabsTrigger value="horarios" className="gap-2 text-xs sm:text-sm py-2">
              <Clock className="w-4 h-4" /> Horários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="material"><UploadMaterialTab /></TabsContent>
          <TabsContent value="tarefas"><CriarTarefaTab /></TabsContent>
          <TabsContent value="alunos"><GerenciarAlunosTab /></TabsContent>
          <TabsContent value="horarios"><HorariosTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
