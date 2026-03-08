import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Loader2, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8);

interface StudentProfile {
  id: string;
  full_name: string;
  user_id: string;
}

interface Availability {
  user_id: string;
  day_of_week: number;
  hour: number;
}

const HorariosTab = () => {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "aluno");

      if (!roleData || roleData.length === 0) {
        setLoading(false);
        return;
      }

      const ids = roleData.map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, user_id")
        .in("user_id", ids)
        .order("full_name");

      if (profiles) setStudents(profiles);
      setLoading(false);
    };
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

  const fetchAvailability = async () => {
    if (selectedStudents.size === 0) return;
    setLoadingSlots(true);
    const { data } = await supabase
      .from("student_availability")
      .select("user_id, day_of_week, hour")
      .in("user_id", Array.from(selectedStudents));

    if (data) setAvailability(data);
    setLoadingSlots(false);
  };

  // Count how many selected students are available at each slot
  const getSlotCount = (day: number, hour: number) => {
    return availability.filter(
      (a) => a.day_of_week === day && a.hour === hour
    ).length;
  };

  const totalSelected = selectedStudents.size;

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-primary" />
        <h2 className="font-heading font-bold text-xl">Compatibilidade de Horários</h2>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="p-4 space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4" /> Selecione os alunos para comparar:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
              <Button
                onClick={fetchAvailability}
                disabled={selectedStudents.size === 0 || loadingSlots}
                size="sm"
              >
                {loadingSlots ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Clock className="w-4 h-4 mr-2" />
                )}
                Ver horários em comum
              </Button>
            </CardContent>
          </Card>

          {availability.length > 0 && totalSelected > 0 && (
            <Card>
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm border-collapse min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="p-2 border-b text-left text-muted-foreground font-medium w-20">
                        Hora
                      </th>
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
                          const count = getSlotCount(di, h);
                          const allMatch = count === totalSelected && totalSelected > 0;
                          const someMatch = count > 0 && !allMatch;
                          return (
                            <td key={di} className="border-b p-1 text-center">
                              <div
                                className={cn(
                                  "w-full h-10 rounded-md flex items-center justify-center text-xs font-medium transition-colors",
                                  allMatch
                                    ? "bg-primary text-primary-foreground"
                                    : someMatch
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted/40 text-muted-foreground"
                                )}
                              >
                                {count > 0 ? `${count}/${totalSelected}` : ""}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {availability.length > 0 && totalSelected > 0 && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-primary inline-block" /> Todos disponíveis
              </span>
              <span className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-accent inline-block" /> Parcialmente
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HorariosTab;
