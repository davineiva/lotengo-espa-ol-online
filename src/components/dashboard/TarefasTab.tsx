import { ClipboardList, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type TaskStatus = "pendente" | "entregue" | "atrasada";

interface Task {
  id: number;
  title: string;
  dueDate: string;
  status: TaskStatus;
}

const mockTasks: Task[] = [
  { id: 1, title: "Escrever parágrafo sobre hobbies", dueDate: "20/02/2026", status: "pendente" },
  { id: 2, title: "Completar exercícios Unit 1", dueDate: "14/02/2026", status: "entregue" },
  { id: 3, title: "Gravação de áudio – Apresentação pessoal", dueDate: "10/02/2026", status: "atrasada" },
];

const statusConfig: Record<TaskStatus, { icon: React.ReactNode; label: string; variant: "default" | "secondary" | "destructive" }> = {
  pendente: { icon: <Clock className="w-4 h-4" />, label: "Pendente", variant: "secondary" },
  entregue: { icon: <CheckCircle2 className="w-4 h-4" />, label: "Entregue", variant: "default" },
  atrasada: { icon: <AlertCircle className="w-4 h-4" />, label: "Atrasada", variant: "destructive" },
};

const TarefasTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="w-6 h-6 text-primary" />
        <h2 className="font-heading font-bold text-xl">Tarefas</h2>
      </div>

      {mockTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma tarefa disponível.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mockTasks.map((t) => {
            const cfg = statusConfig[t.status];
            return (
              <Card key={t.id} className="hover:shadow-md transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    {cfg.icon}
                    <div>
                      <p className="font-semibold">{t.title}</p>
                      <p className="text-sm text-muted-foreground">Prazo: {t.dueDate}</p>
                    </div>
                  </div>
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TarefasTab;
