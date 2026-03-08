import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Search, ChevronLeft, ChevronRight, Users, AlertTriangle, UserX } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

type StudentManagement = {
  id: string;
  student_id: string;
  assigned_teacher_id: string | null;
  is_active: boolean;
  payment_status: string;
  payment_due_date: string | null;
  notes: string | null;
};

type Profile = {
  user_id: string;
  full_name: string;
};

type Props = {
  profiles: Profile[];
  userRoles: { user_id: string; role: string }[];
};

const ITEMS_PER_PAGE = 10;

const PAYMENT_LABELS: Record<string, string> = {
  pendente: "Pendente",
  pago: "Pago",
  atrasado: "Atrasado",
  isento: "Isento",
};

const PAYMENT_COLORS: Record<string, string> = {
  pendente: "outline",
  pago: "default",
  atrasado: "destructive",
  isento: "secondary",
};

const GestaoAlunosTab = ({ profiles, userRoles }: Props) => {
  const [records, setRecords] = useState<StudentManagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [paymentFilter, setPaymentFilter] = useState("todos");
  const [teacherFilter, setTeacherFilter] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);

  const students = userRoles.filter((r) => r.role === "aluno").map((r) => r.user_id);
  const teachers = userRoles.filter((r) => r.role === "professor").map((r) => r.user_id);

  const getStudentName = (userId: string) => {
    return profiles.find((p) => p.user_id === userId)?.full_name || userId.slice(0, 8);
  };

  const getTeacherName = (userId: string | null) => {
    if (!userId) return "Sem professor";
    return profiles.find((p) => p.user_id === userId)?.full_name || userId.slice(0, 8);
  };

  const fetchRecords = async () => {
    setLoading(true);
    const { data } = await supabase.from("student_management").select("*");
    if (data) setRecords(data as StudentManagement[]);
    setLoading(false);
  };

  // Auto-create records for students without one
  const ensureRecords = async () => {
    const existingIds = records.map((r) => r.student_id);
    const missing = students.filter((s) => !existingIds.includes(s));
    if (missing.length > 0) {
      const inserts = missing.map((student_id) => ({ student_id }));
      await supabase.from("student_management").insert(inserts);
      await fetchRecords();
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    if (!loading && records.length >= 0 && students.length > 0) {
      ensureRecords();
    }
  }, [loading, students.length]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter, paymentFilter, teacherFilter]);

  const handleUpdate = async (id: string, field: string, value: any) => {
    const { error } = await supabase
      .from("student_management")
      .update({ [field]: value } as any)
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar: " + error.message);
    } else {
      toast.success("Atualizado com sucesso!");
      setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
    }
  };

  // Filter
  const filtered = records.filter((r) => {
    const name = getStudentName(r.student_id).toLowerCase();
    const matchSearch = name.includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "todos" || (statusFilter === "ativo" ? r.is_active : !r.is_active);
    const matchPayment = paymentFilter === "todos" || r.payment_status === paymentFilter;
    const matchTeacher = teacherFilter === "todos" || (teacherFilter === "sem" ? !r.assigned_teacher_id : r.assigned_teacher_id === teacherFilter);
    return matchSearch && matchStatus && matchPayment && matchTeacher;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const totalAtivos = records.filter((r) => r.is_active).length;
  const totalInadimplentes = records.filter((r) => r.payment_status === "atrasado").length;
  const totalSemProfessor = records.filter((r) => !r.assigned_teacher_id).length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Alunos Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalAtivos}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inadimplentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-destructive">{totalInadimplentes}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Sem Professor</CardTitle>
            <UserX className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalSemProfessor}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestão de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar aluno..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativo">Ativos</SelectItem>
                <SelectItem value="inativo">Inativos</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Pagamento" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="pago">Pago</SelectItem>
                <SelectItem value="atrasado">Atrasado</SelectItem>
                <SelectItem value="isento">Isento</SelectItem>
              </SelectContent>
            </Select>
            <Select value={teacherFilter} onValueChange={setTeacherFilter}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Professor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sem">Sem professor</SelectItem>
                {teachers.map((tid) => (
                  <SelectItem key={tid} value={tid}>{getTeacherName(tid)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhum aluno encontrado.</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Aluno</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Professor</TableHead>
                      <TableHead>Pagamento</TableHead>
                      <TableHead>Vencimento</TableHead>
                      <TableHead>Observações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginated.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">{getStudentName(record.student_id)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={record.is_active}
                            onCheckedChange={(val) => handleUpdate(record.id, "is_active", val)}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            value={record.assigned_teacher_id || "none"}
                            onValueChange={(val) => handleUpdate(record.id, "assigned_teacher_id", val === "none" ? null : val)}
                          >
                            <SelectTrigger className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Sem professor</SelectItem>
                              {teachers.map((tid) => (
                                <SelectItem key={tid} value={tid}>{getTeacherName(tid)}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={record.payment_status}
                            onValueChange={(val) => handleUpdate(record.id, "payment_status", val)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <Badge variant={PAYMENT_COLORS[record.payment_status] as any}>
                                {PAYMENT_LABELS[record.payment_status] || record.payment_status}
                              </Badge>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="pago">Pago</SelectItem>
                              <SelectItem value="atrasado">Atrasado</SelectItem>
                              <SelectItem value="isento">Isento</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="date"
                            value={record.payment_due_date || ""}
                            onChange={(e) => handleUpdate(record.id, "payment_due_date", e.target.value || null)}
                            className="w-[140px]"
                          />
                        </TableCell>
                        <TableCell>
                          <Textarea
                            value={record.notes || ""}
                            onChange={(e) => handleUpdate(record.id, "notes", e.target.value || null)}
                            placeholder="Observações..."
                            className="min-w-[150px] min-h-[36px] h-9 text-sm resize-none"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm font-medium">{currentPage} / {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GestaoAlunosTab;
