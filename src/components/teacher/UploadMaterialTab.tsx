import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Trash2, FileText, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Material {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_type: string;
  created_at: string;
}

interface StudentProfile {
  user_id: string;
  full_name: string;
}

const UploadMaterialTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const fetchMaterials = async () => {
    const { data } = await supabase
      .from("materials")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setMaterials(data);
    setLoading(false);
  };

  const fetchStudents = async () => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "aluno");

    if (!roleData || roleData.length === 0) return;

    const ids = roleData.map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .in("user_id", ids)
      .order("full_name");

    if (profiles) setStudents(profiles);
  };

  useEffect(() => {
    fetchMaterials();
    fetchStudents();
  }, []);

  const toggleStudent = (userId: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const selectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.user_id)));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: storageError } = await supabase.storage
        .from("class-materials")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: urlData } = supabase.storage
        .from("class-materials")
        .getPublicUrl(filePath);

      const fileType = file.type.includes("video") ? "video" : "pdf";

      const { data: materialData, error: dbError } = await supabase
        .from("materials")
        .insert({
          title,
          description: description || null,
          file_url: urlData.publicUrl,
          file_type: fileType,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Assign to selected students
      if (selectedStudents.size > 0 && materialData) {
        const assignments = Array.from(selectedStudents).map((studentId) => ({
          material_id: materialData.id,
          student_id: studentId,
          assigned_by: user.id,
        }));

        const { error: assignError } = await supabase
          .from("material_assignments")
          .insert(assignments);

        if (assignError) throw assignError;
      }

      toast({ title: "Material enviado com sucesso!" });
      setTitle("");
      setDescription("");
      setFile(null);
      setSelectedStudents(new Set());
      fetchMaterials();
    } catch (err: any) {
      toast({ title: "Erro ao enviar", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (material: Material) => {
    const path = material.file_url.split("/class-materials/")[1];
    if (path) {
      await supabase.storage.from("class-materials").remove([path]);
    }
    await supabase.from("materials").delete().eq("id", material.id);
    toast({ title: "Material removido." });
    fetchMaterials();
  };

  return (
    <div className="space-y-6 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-heading">Enviar novo material</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mat-title">Título</Label>
              <Input
                id="mat-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Aula 5 – Present Perfect"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mat-desc">Descrição (opcional)</Label>
              <Textarea
                id="mat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do conteúdo"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mat-file">Arquivo (PDF ou vídeo)</Label>
              <Input
                id="mat-file"
                type="file"
                accept=".pdf,.mp4,.mov,.webm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                required
              />
            </div>

            {/* Student selector */}
            <div className="space-y-2">
              <Label>Atribuir a alunos</Label>
              {students.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhum aluno cadastrado.</p>
              ) : (
                <div className="border rounded-md p-3 space-y-2 max-h-48 overflow-y-auto">
                  <Label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
                    <Checkbox
                      checked={selectedStudents.size === students.length && students.length > 0}
                      onCheckedChange={selectAll}
                    />
                    Selecionar todos
                  </Label>
                  <div className="border-t pt-2 grid grid-cols-2 gap-1">
                    {students.map((s) => (
                      <Label
                        key={s.user_id}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <Checkbox
                          checked={selectedStudents.has(s.user_id)}
                          onCheckedChange={() => toggleStudent(s.user_id)}
                        />
                        {s.full_name}
                      </Label>
                    ))}
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {selectedStudents.size === 0
                  ? "Nenhum aluno selecionado — material ficará visível apenas para professores."
                  : `${selectedStudents.size} aluno(s) selecionado(s).`}
              </p>
            </div>

            <Button type="submit" disabled={uploading || !title || !file}>
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              {uploading ? "Enviando..." : "Enviar material"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-lg">Materiais enviados</h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : materials.length === 0 ? (
          <p className="text-muted-foreground text-sm">Nenhum material enviado ainda.</p>
        ) : (
          <div className="grid gap-3">
            {materials.map((m) => (
              <Card key={m.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {m.file_type === "video" ? (
                    <Video className="w-5 h-5 text-secondary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{m.title}</p>
                    {m.description && (
                      <p className="text-xs text-muted-foreground">{m.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(m)}>
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

export default UploadMaterialTab;
