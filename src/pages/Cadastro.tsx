import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { z } from "zod";

const cadastroSchema = z.object({
  fullName: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres").max(100),
  email: z.string().trim().email("Email inválido").max(255),
  phone: z.string().trim().min(10, "Telefone deve ter pelo menos 10 dígitos").max(20),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  lgpdConsent: z.literal(true, { errorMap: () => ({ message: "Você deve aceitar os termos" }) }),
});

const Cadastro = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = cadastroSchema.safeParse({ fullName, email, phone, password, lgpdConsent });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName,
          phone,
          lgpd_consent: true,
        },
      },
    });

    if (error) {
      toast({
        title: "Erro no cadastro",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cadastro realizado!",
        description: "Verifique seu email para confirmar sua conta.",
      });
      navigate("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/10 px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="block text-center mb-8">
          <span className="font-heading font-black text-4xl tracking-tight">
            <span className="text-foreground">Lo</span>
            <span className="text-primary">ten</span>
            <span className="text-secondary">go</span>
          </span>
        </Link>

        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">Criar Conta</CardTitle>
            <CardDescription>Cadastre-se para começar a aprender espanhol</CardDescription>
          </CardHeader>
          <form onSubmit={handleCadastro}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome completo</Label>
                <Input
                  id="fullName"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone (com DDD)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="lgpd"
                  checked={lgpdConsent}
                  onCheckedChange={(checked) => setLgpdConsent(checked === true)}
                />
                <Label htmlFor="lgpd" className="text-sm leading-snug font-normal">
                  Li e concordo com a{" "}
                  <Link to="/privacidade" className="text-primary hover:underline font-semibold">
                    Política de Privacidade
                  </Link>{" "}
                  e autorizo o tratamento dos meus dados pessoais conforme a LGPD.
                </Label>
              </div>
              {errors.lgpdConsent && <p className="text-sm text-destructive">{errors.lgpdConsent}</p>}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full font-heading font-semibold" size="lg" disabled={loading}>
                <UserPlus className="w-4 h-4 mr-2" />
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Já tem conta?{" "}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Entrar
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
