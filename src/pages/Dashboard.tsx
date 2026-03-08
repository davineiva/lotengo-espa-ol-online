import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BookOpen, ClipboardList, GraduationCap, CalendarDays, ShieldAlert } from "lucide-react";
import { Navigate, Link } from "react-router-dom";
import MaterialTab from "@/components/dashboard/MaterialTab";
import TarefasTab from "@/components/dashboard/TarefasTab";
import ExamesTab from "@/components/dashboard/ExamesTab";
import AgendaTab from "@/components/dashboard/AgendaTab";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const Dashboard = () => {
  const { user, roles, loading, signOut } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [existingRequest, setExistingRequest] = useState<{ status: string; created_at: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      supabase
        .from("data_deletion_requests")
        .select("status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .then(({ data }) => {
          if (data && data.length > 0) setExistingRequest(data[0]);
        });
    }
  }, [user]);

  const handleRequestDeletion = async () => {
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("data_deletion_requests").insert({
      user_id: user.id,
      reason: deleteReason || null,
    });
    if (error) {
      toast.error("Erro ao enviar solicitação: " + error.message);
    } else {
      toast.success("Solicitação de exclusão enviada com sucesso.");
      setExistingRequest({ status: "pendente", created_at: new Date().toISOString() });
    }
    setSubmitting(false);
    setShowDeleteDialog(false);
    setDeleteReason("");
  };

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

  const STATUS_LABELS: Record<string, string> = {
    pendente: "Pendente",
    aprovado: "Aprovado",
    rejeitado: "Rejeitado",
  };

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
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-heading font-bold text-3xl mb-1">
              Olá, bem-vindo(a)! 👋
            </h1>
            <p className="text-muted-foreground">
              Seu papel: <span className="font-semibold text-primary capitalize">{roles[0] || "aluno"}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {existingRequest && existingRequest.status === "pendente" ? (
              <Badge variant="outline" className="gap-1">
                <ShieldAlert className="w-3 h-3" />
                Exclusão solicitada — {STATUS_LABELS[existingRequest.status]}
              </Badge>
            ) : existingRequest && existingRequest.status === "rejeitado" ? (
              <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <ShieldAlert className="w-4 h-4 mr-2" /> Solicitar exclusão de dados
              </Button>
            ) : !existingRequest || existingRequest.status !== "aprovado" ? (
              <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                <ShieldAlert className="w-4 h-4 mr-2" /> Solicitar exclusão de dados
              </Button>
            ) : null}
          </div>
        </div>

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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Solicitar exclusão de dados pessoais</AlertDialogTitle>
            <AlertDialogDescription className="space-y-3">
              <p>
                Conforme a LGPD (Art. 18), você tem o direito de solicitar a exclusão dos seus dados pessoais.
              </p>
              <p className="font-semibold text-destructive">
                ⚠️ Atenção: Ao solicitar a exclusão, todos os seus dados (materiais, tarefas, notas, perfil) poderão ser permanentemente removidos. Esta ação não pode ser desfeita após aprovação.
              </p>
              <Textarea
                placeholder="Motivo (opcional)..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="mt-2"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleRequestDeletion}
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Confirmar solicitação"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
