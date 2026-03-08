import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/landing/Footer";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center h-16">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/" className="font-heading font-black text-2xl tracking-tight ml-2">
            <span className="text-foreground">Lo</span>
            <span className="text-primary">ten</span>
            <span className="text-secondary">go</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="font-heading font-bold text-3xl mb-8">Política de Privacidade</h1>
        <p className="text-muted-foreground text-sm mb-6">Última atualização: {new Date().toLocaleDateString("pt-BR")}</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">1. Introdução</h2>
            <p>
              A <strong>Lotengo – Escola de Espanhol Online</strong> ("nós", "nosso") está comprometida com a proteção dos dados pessoais dos seus usuários, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 – LGPD).
            </p>
            <p>
              Esta Política de Privacidade descreve como coletamos, utilizamos, armazenamos e protegemos as informações pessoais fornecidas por meio da nossa plataforma.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Dados de cadastro:</strong> nome completo, endereço de e-mail e número de telefone.</li>
              <li><strong>Dados de uso:</strong> registros de acesso, horários de disponibilidade e progresso nas atividades.</li>
              <li><strong>Dados de consentimento:</strong> registro do aceite desta política e data/hora do consentimento.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">3. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Criar e gerenciar sua conta na plataforma;</li>
              <li>Facilitar a comunicação entre alunos e professores;</li>
              <li>Gerenciar materiais didáticos, tarefas e agendamentos;</li>
              <li>Enviar comunicações relacionadas ao serviço contratado;</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">4. Base Legal</h2>
            <p>
              O tratamento dos seus dados pessoais é fundamentado no <strong>consentimento do titular</strong> (Art. 7º, I da LGPD), fornecido no momento do cadastro, e na <strong>execução de contrato</strong> (Art. 7º, V) para a prestação dos serviços educacionais.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">5. Compartilhamento de Dados</h2>
            <p>
              Seus dados pessoais <strong>não são vendidos ou compartilhados com terceiros</strong> para fins de marketing. O compartilhamento ocorre apenas:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Com professores designados, para fins pedagógicos;</li>
              <li>Com prestadores de serviços de infraestrutura tecnológica (hospedagem e banco de dados), sob obrigações de confidencialidade;</li>
              <li>Quando exigido por lei ou decisão judicial.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">6. Segurança dos Dados</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito (HTTPS/TLS), controle de acesso baseado em papéis (RLS) e armazenamento seguro de credenciais.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">7. Direitos do Titular (Art. 18 da LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Confirmação da existência de tratamento;</li>
              <li>Acesso aos dados pessoais;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Portabilidade dos dados;</li>
              <li>Eliminação dos dados tratados com consentimento;</li>
              <li>Revogação do consentimento a qualquer momento.</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer um desses direitos, entre em contato pelo e-mail indicado na seção de contato abaixo.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">8. Retenção de Dados</h2>
            <p>
              Seus dados pessoais são mantidos enquanto sua conta estiver ativa ou conforme necessário para cumprir obrigações legais. Após a exclusão da conta, os dados serão eliminados em até 30 dias, exceto quando a retenção for exigida por lei.
            </p>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">9. Contato e Encarregado de Dados (DPO)</h2>
            <p>
              Para dúvidas, solicitações ou exercício dos seus direitos como titular de dados, entre em contato:
            </p>
            <ul className="list-none space-y-1 mt-2">
              <li><strong>E-mail:</strong> privacidade@lotengo.com.br</li>
              <li><strong>Encarregado de Dados (DPO):</strong> Responsável pela proteção de dados da Lotengo</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading font-semibold text-xl mb-3">10. Alterações nesta Política</h2>
            <p>
              Esta política pode ser atualizada periodicamente. Recomendamos que você a consulte regularmente. Alterações significativas serão comunicadas por e-mail ou notificação na plataforma.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;
