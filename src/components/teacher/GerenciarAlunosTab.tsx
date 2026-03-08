import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Users, Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentProfile {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  user_id: string;
}

interface StudentNote {
  id: string;
  content: string;
  created_at: string;
}

const GerenciarAlunosTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Notes modal state
  const [notesOpen, setNotesOpen] = useState(false);
  const [activeStudent, setActiveStudent] = useState<StudentProfile | null>(null);
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "aluno");

      if (!roleData || roleData.length === 0) {
        setLoading(false);
        return;
      }

      const studentIds = roleData.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", studentIds)
        .order("full_name");

      if (profiles) setStudents(profiles);
      setLoading(false);
    };

    fetchStudents();
  }, []);

  const openNotes = async (student: StudentProfile) => {
    setActiveStudent(student);
    setNotesOpen(true);
    setNotesLoading(true);
    setNewNote("");

    const { data } = await supabase
      .from("student_notes")
      .select("id, content, created_at")
      .eq("student_id", student.user_id)
      .order("created_at", { ascending: false });

    if (data) setNotes(data);
    setNotesLoading(false);
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !user || !activeStudent) return;
    setSaving(true);

    const { error } = await supabase.from("student_notes").insert({
      teacher_id: user.id,
      student_id: activeStudent.user_id,
      content: newNote.trim(),
    });

    if (error) {
      toast({ title: "Erro ao salvar nota", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Nota adicionada!" });
      setNewNote("");
      // Refresh notes
      const { data } = await supabase
        .from("student_notes")
        .select("id, content, created_at")
        .eq("student_id", activeStudent.user_id)
        .order("created_at", { ascending: false });
      if (data) setNotes(data);
    }
    setSaving(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!activeStudent) return;
    await supabase.from("student_notes").delete().eq("id", noteId);
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    toast({ title: "Nota removida." });
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading flex items-center gap-2">
            <Users className="w-5 h-5" />
            Alunos cadastrados
            {!loading && (
              <Badge variant="secondary" className="ml-2">
                {students.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : students.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-4">
              Nenhum aluno cadastrado ainda.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cadastro</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.full_name}</TableCell>
                      <TableCell>{s.phone || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(s.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openNotes(s)}
                        >
                          <MessageSquare className="w-4 h-4 mr-1" /> Notas
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notes Dialog */}
      <Dialog open={notesOpen} onOpenChange={setNotesOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-heading">
              Notas — {activeStudent?.full_name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-3 py-2">
            {notesLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : notes.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma nota registrada para este aluno.
              </p>
            ) : (
              notes.map((n) => (
                <div key={n.id} className="border rounded-md p-3 text-sm space-y-1 group">
                  <p>{n.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {new Date(n.created_at).toLocaleString("pt-BR")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteNote(n.id)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Escreva uma nota sobre o aluno..."
              rows={2}
            />
            <Button
              onClick={handleAddNote}
              disabled={saving || !newNote.trim()}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Adicionar nota
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GerenciarAlunosTab;
