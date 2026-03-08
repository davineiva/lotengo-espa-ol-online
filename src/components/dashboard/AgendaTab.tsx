import { useState, useEffect } from "react";
import { CalendarDays, Loader2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

type SlotKey = `${number}-${number}`;

const AgendaTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selected, setSelected] = useState<Set<SlotKey>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("student_availability")
        .select("day_of_week, hour")
        .eq("user_id", user.id);

      if (data) {
        const keys = new Set<SlotKey>(
          data.map((d) => `${d.day_of_week}-${d.hour}` as SlotKey)
        );
        setSelected(keys);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  const toggle = (day: number, hour: number) => {
    const key: SlotKey = `${day}-${hour}`;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    // Delete all existing and re-insert
    await supabase.from("student_availability").delete().eq("user_id", user.id);

    if (selected.size > 0) {
      const rows = Array.from(selected).map((key) => {
        const [day, hour] = key.split("-").map(Number);
        return { user_id: user.id, day_of_week: day, hour };
      });

      const { error } = await supabase.from("student_availability").insert(rows);
      if (error) {
        toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    toast({ title: "Disponibilidade salva!" });
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-primary" />
          <h2 className="font-heading font-bold text-xl">Agenda – Disponibilidade</h2>
        </div>
        <Button onClick={handleSave} disabled={saving} size="sm">
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Salvar
        </Button>
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
