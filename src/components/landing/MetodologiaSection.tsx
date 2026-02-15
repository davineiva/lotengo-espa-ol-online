import { motion } from "framer-motion";
import { Video, Users, BookOpen, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Aulas ao vivo pelo Zoom",
    description: "Interação em tempo real com professores qualificados. Nada de vídeos gravados — aqui você pratica de verdade.",
  },
  {
    icon: MessageCircle,
    title: "Fale desde o primeiro dia",
    description: "Nossa abordagem comunicativa prioriza a conversação. Você vai falar espanhol desde a primeira aula.",
  },
  {
    icon: Users,
    title: "Turmas pequenas ou individual",
    description: "Escolha entre aulas individuais para atenção exclusiva ou turmas reduzidas para trocar experiências.",
  },
  {
    icon: BookOpen,
    title: "Material exclusivo",
    description: "Conteúdo próprio atualizado, exercícios interativos e materiais de apoio disponíveis na sua área do aluno.",
  },
];

const MetodologiaSection = () => {
  return (
    <section id="metodologia" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary font-heading font-semibold text-sm mb-4 uppercase tracking-wide">
            Metodologia
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Como funciona a <span className="text-primary">Lotengo</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combinamos tecnologia e pedagogia para uma experiência de aprendizado envolvente e eficiente.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetodologiaSection;
