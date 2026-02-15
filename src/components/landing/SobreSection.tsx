import { motion } from "framer-motion";
import { Award, Globe, Heart } from "lucide-react";

const SobreSection = () => {
  return (
    <section id="sobre" className="py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-semibold text-sm mb-4 uppercase tracking-wide">
              Sobre nós
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-6">
              Mais que uma escola, uma <span className="text-secondary">experiência</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              A Lotengo nasceu da paixão pelo espanhol e pela educação de qualidade. 
              Acreditamos que aprender um idioma vai além da gramática — é sobre conexão, 
              cultura e confiança para se comunicar no mundo real.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Com professores experientes e uma metodologia focada na prática, 
              já ajudamos centenas de alunos a conquistarem fluência e oportunidades 
              profissionais em espanhol.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {[
              {
                icon: Globe,
                title: "Alcance Global",
                description: "Alunos de todo o Brasil e do mundo aprendendo espanhol conosco.",
              },
              {
                icon: Award,
                title: "Professores Certificados",
                description: "Equipe de professores com formação e experiência comprovadas.",
              },
              {
                icon: Heart,
                title: "Aprendizado Humanizado",
                description: "Cada aluno é único. Adaptamos o ensino ao seu ritmo e objetivos.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 p-5 rounded-xl bg-muted/50 border hover:border-primary/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SobreSection;
