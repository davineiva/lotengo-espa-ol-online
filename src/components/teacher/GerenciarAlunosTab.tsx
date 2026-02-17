import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Loader2 } from "lucide-react";

interface StudentProfile {
  id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
  user_id: string;
}

const GerenciarAlunosTab = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      // Get all user_ids with 'aluno' role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "aluno");

      if (!roleData || roleData.length === 0) {
        setLoading(false);
        return;
      }

      const studentIds = roleData.map((r) => r.user_id);

      // Get profiles for those users
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GerenciarAlunosTab;
