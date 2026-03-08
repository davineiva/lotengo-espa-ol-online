import { useState, useEffect } from "react";
import { BookOpen, FileText, Video, Download, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Material {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  created_at: string;
  description: string | null;
}

const MaterialTab = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMaterials = async () => {
      // Get material_ids assigned to this student
      const { data: assignments } = await supabase
        .from("material_assignments")
        .select("material_id")
        .eq("student_id", user.id);

      if (!assignments || assignments.length === 0) {
        setLoading(false);
        return;
      }

      const ids = assignments.map((a) => a.material_id);
      const { data } = await supabase
        .from("materials")
        .select("*")
        .in("id", ids)
        .order("created_at", { ascending: false });

      if (data) setMaterials(data);
      setLoading(false);
    };
    fetchMaterials();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="font-heading font-bold text-xl">Material de Aula</h2>
      </div>

      {materials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum material disponível ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {materials.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {m.file_type === "video" ? (
                    <Video className="w-5 h-5 text-secondary" />
                  ) : (
                    <FileText className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    {m.description && (
                      <p className="text-sm text-muted-foreground">{m.description}</p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(m.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Baixar"
                  asChild
                >
                  <a href={m.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaterialTab;
