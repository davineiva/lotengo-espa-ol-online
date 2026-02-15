import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContatoSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ nome: "", email: "", mensagem: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve.",
    });
    setFormData({ nome: "", email: "", mensagem: "" });
  };

  return (
    <section id="contato" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary font-heading font-semibold text-sm mb-4 uppercase tracking-wide">
              Contato
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Fale <span className="text-primary">conosco</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Tire suas dúvidas ou agende uma aula experimental. Estamos prontos para te ajudar!
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary" />
                <span>contato@lotengo.com.br</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>(11) 99999-9999</span>
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white font-heading font-semibold rounded-xl px-8 py-6"
            >
              <a
                href="https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre as aulas de espanhol."
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar pelo WhatsApp
              </a>
            </Button>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl p-8 shadow-sm border space-y-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div>
              <label className="text-sm font-medium mb-1.5 block">Nome</label>
              <Input
                placeholder="Seu nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">E-mail</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Mensagem</label>
              <Textarea
                placeholder="Sua mensagem..."
                rows={4}
                value={formData.mensagem}
                onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                required
                className="rounded-lg resize-none"
              />
            </div>
            <Button type="submit" className="w-full font-heading font-semibold rounded-xl py-5">
              Enviar mensagem
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContatoSection;
