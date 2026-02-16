import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 08:00 – 19:00

type SlotKey = `${number}-${number}`;

const AgendaTab = () => {
  const [selected, setSelected] = useState<Set<SlotKey>>(new Set());

  const toggle = (day: number, hour: number) => {
    const key: SlotKey = `${day}-${hour}`;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CalendarDays className="w-6 h-6 text-primary" />
        <h2 className="font-heading font-bold text-xl">Agenda – Disponibilidade</h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Clique nos horários em que você está disponível para aulas.
      </p>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[600px]">
            <thead>
              <tr>
                <th className="p-2 border-b text-left text-muted-foreground font-medium w-20">Hora</th>
                {DAYS.map((d) => (
                  <th key={d} className="p-2 border-b text-center font-medium text-muted-foreground">
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h}>
                  <td className="p-2 border-b text-muted-foreground font-mono text-xs">
                    {String(h).padStart(2, "0")}:00
                  </td>
                  {DAYS.map((_, di) => {
                    const key: SlotKey = `${di}-${h}`;
                    const isActive = selected.has(key);
                    return (
                      <td key={di} className="border-b p-1 text-center">
                        <button
                          type="button"
                          onClick={() => toggle(di, h)}
                          className={cn(
                            "w-full h-10 rounded-md transition-colors text-xs font-medium",
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted/40 hover:bg-muted text-muted-foreground"
                          )}
                        >
                          {isActive ? "✓" : ""}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgendaTab;
