import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ClipboardList, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Assignment {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  created_at: string;
}

const CriarTarefaTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const fetchAssignments = async () => {
    const { data } = await supabase
      .from("assignments")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setAssignments(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("assignments").insert({
        title,
        description: description || null,
        due_date: dueDate ? new Date(dueDate).toISOString() : null,
        created_by: user.id,
      });

      if (error) throw error;

      toast({ title: "Tarefa criada com sucesso!" });
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchAssignments();
    } catch (err: any) {
      toast({ title: "Erro ao criar tarefa", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await supabase.from("assignments").delete().eq("id", id);
    toast({ title: "Tarefa removida." });
    fetchAssignments();
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Nova tarefa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="task-title">Título</Label>
              <Input
                id="task-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Exercício – Modal Verbs"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-desc">Descrição</Label>
              <Textarea
                id="task-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instruções da tarefa"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task-due">Data de entrega</Label>
              <Input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={saving || !title}>
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {saving ? "Salvando..." : "Criar tarefa"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-lg">Tarefas criadas</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : assignments.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhuma tarefa criada ainda.</p>
        ) : (
          <div className="grid gap-3">
            {assignments.map((a) => (
              <Card key={a.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{a.title}</p>
                    {a.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{a.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {a.due_date
                        ? `Entrega: ${new Date(a.due_date).toLocaleDateString("pt-BR")}`
                        : "Sem prazo definido"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CriarTarefaTab;
