import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, ArrowLeft, Trash2, Shield, Users, GraduationCap, Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
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

type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  phone: string | null;
  created_at: string;
};

type UserRole = {
  id: string;
  user_id: string;
  role: "aluno" | "professor" | "admin";
};

const ROLE_LABELS: Record<string, string> = {
  aluno: "Aluno",
  professor: "Professor",
  admin: "Admin",
};

const ROLE_COLORS: Record<string, string> = {
  aluno: "secondary",
  professor: "default",
  admin: "destructive",
} as const;

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
  const { user, roles, loading, signOut } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmRemoveRole, setConfirmRemoveRole] = useState<{ id: string; role: string; userName: string } | null>(null);
  const [confirmDeleteProfile, setConfirmDeleteProfile] = useState<{ id: string; userName: string } | null>(null);
  const fetchData = async () => {
    setLoadingData(true);
    const [profilesRes, rolesRes] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
    ]);
    if (profilesRes.data) setProfiles(profilesRes.data);
    if (rolesRes.data) setUserRoles(rolesRes.data as UserRole[]);
    setLoadingData(false);
  };

  useEffect(() => {
    if (user && roles.includes("admin")) {
      fetchData();
    }
  }, [user, roles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  const getRolesForUser = (userId: string) =>
    userRoles.filter((r) => r.user_id === userId);

  const handleAddRole = async (userId: string, role: string) => {
    const existing = userRoles.find((r) => r.user_id === userId && r.role === role);
    if (existing) {
      toast.info("Usuário já possui esse papel.");
      return;
    }
    const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: role as "aluno" | "professor" | "admin" });
    if (error) {
      toast.error("Erro ao adicionar papel: " + error.message);
    } else {
      toast.success(`Papel ${ROLE_LABELS[role]} adicionado.`);
      fetchData();
    }
  };

  const handleRemoveRole = async (roleId: string, roleName: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", roleId);
    if (error) {
      toast.error("Erro ao remover papel: " + error.message);
    } else {
      toast.success(`Papel ${ROLE_LABELS[roleName]} removido.`);
      fetchData();
    }
    setConfirmRemoveRole(null);
  };

  const handleDeleteProfile = async (profileId: string) => {
    const { error } = await supabase.from("profiles").delete().eq("id", profileId);
    if (error) {
      toast.error("Erro ao excluir perfil: " + error.message);
    } else {
      toast.success("Perfil excluído.");
      fetchData();
    }
    setConfirmDeleteProfile(null);
  };

  const handleExportCSV = () => {
    const headers = ["Nome", "Telefone", "Papéis", "Criado em"];
    const rows = filteredProfiles.map((profile) => {
      const uRoles = getRolesForUser(profile.user_id).map((r) => ROLE_LABELS[r.role]).join("; ");
      return [
        profile.full_name,
        profile.phone || "",
        uRoles,
        new Date(profile.created_at).toLocaleDateString("pt-BR"),
      ];
    });
    const csvContent = [headers, ...rows].map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exportado com sucesso!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user || !roles.includes("admin")) {
    return <Navigate to="/dashboard" replace />;
  }

  const totalAlunos = new Set(userRoles.filter((r) => r.role === "aluno").map((r) => r.user_id)).size;
  const totalProfessores = new Set(userRoles.filter((r) => r.role === "professor").map((r) => r.user_id)).size;
  const totalAdmins = new Set(userRoles.filter((r) => r.role === "admin").map((r) => r.user_id)).size;

  const filteredProfiles = profiles.filter((profile) => {
    const matchesSearch = profile.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "todos" || getRolesForUser(profile.user_id).some((r) => r.role === roleFilter);
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredProfiles.length / ITEMS_PER_PAGE);
  const paginatedProfiles = filteredProfiles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <span className="font-heading font-black text-2xl tracking-tight">
              <span className="text-foreground">Lo</span>
              <span className="text-primary">ten</span>
              <span className="text-secondary">go</span>
            </span>
            <Badge variant="outline" className="ml-2">Admin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="font-heading font-bold text-3xl mb-1">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie usuários e papéis do sistema.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Alunos</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalAlunos}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Professores</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalProfessores}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{totalAdmins}</div></CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Usuários</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportCSV} disabled={filteredProfiles.length === 0}>
              <Download className="h-4 w-4 mr-2" /> Exportar CSV
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Filtrar papel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="aluno">Alunos</SelectItem>
                  <SelectItem value="professor">Professores</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            ) : filteredProfiles.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Nenhum usuário encontrado.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Papéis</TableHead>
                      <TableHead>Adicionar Papel</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedProfiles.map((profile) => {
                      const uRoles = getRolesForUser(profile.user_id);
                      return (
                        <TableRow key={profile.id}>
                          <TableCell className="font-medium">{profile.full_name}</TableCell>
                          <TableCell>{profile.phone || "—"}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {uRoles.map((r) => (
                                <Badge
                                  key={r.id}
                                  variant={ROLE_COLORS[r.role] as "default" | "secondary" | "destructive"}
                                  className="cursor-pointer gap-1"
                                  onClick={() => setConfirmRemoveRole({ id: r.id, role: r.role, userName: profile.full_name })}
                                  title="Clique para remover"
                                >
                                  {ROLE_LABELS[r.role]} ×
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select onValueChange={(val) => handleAddRole(profile.user_id, val)}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Papel..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aluno">Aluno</SelectItem>
                                <SelectItem value="professor">Professor</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setConfirmDeleteProfile({ id: profile.id, userName: profile.full_name })}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProfiles.length)} de {filteredProfiles.length}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Dialog: Remover papel */}
      <AlertDialog open={!!confirmRemoveRole} onOpenChange={(open) => !open && setConfirmRemoveRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover papel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o papel <strong>{confirmRemoveRole ? ROLE_LABELS[confirmRemoveRole.role] : ""}</strong> de <strong>{confirmRemoveRole?.userName}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmRemoveRole && handleRemoveRole(confirmRemoveRole.id, confirmRemoveRole.role)}
            >
              Remover papel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Excluir perfil */}
      <AlertDialog open={!!confirmDeleteProfile} onOpenChange={(open) => !open && setConfirmDeleteProfile(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir perfil</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o perfil de <strong>{confirmDeleteProfile?.userName}</strong>? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => confirmDeleteProfile && handleDeleteProfile(confirmDeleteProfile.id)}
            >
              Excluir perfil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
