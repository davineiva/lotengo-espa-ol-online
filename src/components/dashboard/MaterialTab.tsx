import { BookOpen, FileText, Video, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const mockMaterials = [
  { id: 1, title: "Unit 1 – Greetings & Introductions", type: "pdf", date: "10/02/2026" },
  { id: 2, title: "Unit 2 – Daily Routines", type: "video", date: "17/02/2026" },
  { id: 3, title: "Vocabulary List – February", type: "pdf", date: "01/02/2026" },
];

const typeIcon = {
  pdf: <FileText className="w-5 h-5 text-primary" />,
  video: <Video className="w-5 h-5 text-secondary" />,
};

const MaterialTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="w-6 h-6 text-primary" />
        <h2 className="font-heading font-bold text-xl">Material de Aula</h2>
      </div>

      {mockMaterials.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum material disponível ainda.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mockMaterials.map((m) => (
            <Card key={m.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  {typeIcon[m.type as keyof typeof typeIcon]}
                  <div>
                    <p className="font-semibold">{m.title}</p>
                    <p className="text-sm text-muted-foreground">Adicionado em {m.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="Baixar">
                  <Download className="w-4 h-4" />
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
