

# Lotengo - Escola de Espanhol Online

## 1. Landing Page Pública
Página inicial com design nas cores **branca, vermelha e laranja**, contendo:
- **Hero Section**: Nome "Lotengo", slogan, botão de login e de cadastro
- **Metodologia**: Seção explicando as aulas online via Zoom, abordagem pedagógica
- **Sobre a Escola**: História e diferenciais da Lotengo
- **Contato/WhatsApp**: Formulário simples de contato e link direto para WhatsApp

## 2. Sistema de Autenticação e Cadastro
- **Cadastro de aluno**: Aluno se registra pelo site com nome, email, telefone e senha
- **Cadastro de professor**: Feito por um administrador no painel
- **Login**: Tela de login com email e senha
- **Papéis**: Sistema de roles (aluno, professor, admin) com segurança no backend
- **Conformidade LGPD**: Termo de consentimento no cadastro, dados criptografados, política de privacidade

## 3. Área do Aluno (após login)
Dashboard com 4 abas principais:

### 📚 Material de Aula
- Lista de materiais organizados por data/tema
- Download de arquivos enviados pelo professor (individuais ou por turma)

### 📝 Tarefas
- Lista de tarefas pendentes e concluídas
- Download de materiais de tarefa enviados pelo professor

### 📊 Exames
- **Teste de nivelamento** e exames semestrais feitos dentro do site (questões de múltipla escolha e/ou dissertativas)
- Histórico de notas com detalhamento por semestre e tipo de exame
- Correção automática para questões objetivas

### 📅 Agenda do Aluno
- Tabela semanal (segunda a sábado) com slots de 1 hora
- Aluno marca os horários em que tem disponibilidade
- Visualização clara do que está marcado

## 4. Área do Professor (após login)
Dashboard com funcionalidades:

### Upload de Materiais
- Enviar **material de aula**, **tarefas** e **exames** para alunos específicos ou turmas inteiras
- Organização por aluno/turma

### Criação de Exames
- Criar provas com questões (múltipla escolha e/ou dissertativas)
- Definir pontuação e respostas corretas para correção automática
- Registrar notas manualmente quando necessário

### Cruzamento de Horários
- Selecionar um grupo de alunos
- Visualizar tabela com sobreposição de disponibilidades
- Identificar janelas de horário comuns para montar turmas

### Gerenciamento de Turmas
- Criar turmas individuais ou em grupo
- Vincular alunos às turmas

## 5. Painel Administrativo (básico)
- Cadastrar e gerenciar professores
- Visualizar lista de alunos cadastrados
- Gerenciar turmas

## 6. Backend (Supabase/Lovable Cloud)
- Banco de dados com tabelas: perfis, turmas, materiais, tarefas, exames, notas, disponibilidade de horários, roles
- Storage para upload de arquivos (materiais, tarefas)
- Segurança com Row-Level Security (RLS) — cada usuário acessa apenas seus dados
- Conformidade LGPD: consentimento registrado, dados pessoais protegidos

## 7. Design
- Paleta: **branco** (fundo), **vermelho** (destaques/CTAs), **laranja** (acentos/gradientes)
- Layout responsivo (desktop e mobile)
- Interface limpa e moderna

