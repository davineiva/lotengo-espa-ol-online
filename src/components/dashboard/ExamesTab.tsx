import { GraduationCap, FileCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockGrades = [
  { exam: "Teste de Nivelamento", date: "05/01/2026", grade: "B1", status: "concluído" },
  { exam: "Prova Semestral 1", date: "—", grade: "—", status: "agendado" },
];

const ExamesTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="w-6 h-6 text-primary" />
        <h2 className="font-heading font-bold text-xl">Exames</h2>
      </div>

      {/* Placement test card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-secondary" />
            Teste de Nivelamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Resultado: <span className="font-bold text-foreground">B1 – Intermediário</span>
          </p>
          <Badge variant="secondary">Concluído</Badge>
        </CardContent>
      </Card>

      {/* Grade history */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Histórico de Notas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Exame</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Nota / Nível</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGrades.map((g, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{g.exam}</TableCell>
                  <TableCell>{g.date}</TableCell>
                  <TableCell>{g.grade}</TableCell>
                  <TableCell>
                    <Badge variant={g.status === "concluído" ? "default" : "secondary"}>
                      {g.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamesTab;
