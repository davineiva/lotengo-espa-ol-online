

## Plano: Completar perfil Professor com funcionalidades avançadas

O TeacherDashboard ja existe com 3 abas (Material, Tarefas, Alunos). Precisa ser expandido com as funcionalidades solicitadas.

### 1. Banco de dados -- novas tabelas

**`student_notes`** -- notas/comentarios do professor para alunos:
- `id` uuid PK
- `teacher_id` uuid NOT NULL (quem escreveu)
- `student_id` uuid NOT NULL (aluno alvo)
- `content` text NOT NULL
- `created_at` timestamptz DEFAULT now()
- RLS: professor pode CRUD nas proprias notas

**`student_availability`** -- disponibilidade de horarios dos alunos (persistir o que hoje e local no AgendaTab):
- `id` uuid PK
- `user_id` uuid NOT NULL
- `day_of_week` int NOT NULL (0-5, seg-sab)
- `hour` int NOT NULL (8-19)
- `created_at` timestamptz DEFAULT now()
- UNIQUE(user_id, day_of_week, hour)
- RLS: aluno pode CRUD nos proprios; professor pode SELECT todos

**`material_assignments`** -- vincular materiais a alunos especificos:
- `id` uuid PK
- `material_id` uuid FK -> materials
- `student_id` uuid NOT NULL
- `assigned_by` uuid NOT NULL
- `created_at` timestamptz DEFAULT now()
- RLS: professor pode INSERT/DELETE; aluno pode SELECT os proprios

### 2. Alteracoes no TeacherDashboard

Expandir de 3 para 5 abas:

1. **Material** (existente) -- adicionar seletor de alunos ao enviar material (multi-select com checkboxes dos alunos cadastrados). Ao enviar, insere em `material_assignments` para cada aluno selecionado.

2. **Tarefas** (existente) -- manter como esta.

3. **Alunos** (existente) -- adicionar coluna de acoes na tabela, com botao para abrir modal de notas/comentarios por aluno. No modal, listar notas anteriores e formulario para adicionar nova nota.

4. **Horarios** (nova aba) -- professor seleciona um grupo de alunos via checkboxes, e o sistema cruza as disponibilidades salvas em `student_availability`, exibindo uma grade visual com os horarios em comum destacados.

5. **Notas** (nova aba, opcional) -- visao geral de todas as notas/comentarios que o professor adicionou, com filtro por aluno.

### 3. Alteracoes no Dashboard do Aluno

- **AgendaTab**: persistir a disponibilidade no banco (`student_availability`) em vez de manter apenas em estado local.
- **MaterialTab**: trocar mock data por dados reais, filtrando `material_assignments` pelo `student_id` do usuario logado para mostrar apenas materiais atribuidos a ele.

### 4. Arquivos modificados/criados

- **Migracoes SQL**: criar tabelas `student_notes`, `student_availability`, `material_assignments` com RLS
- `src/components/teacher/UploadMaterialTab.tsx` -- adicionar seletor de alunos
- `src/components/teacher/GerenciarAlunosTab.tsx` -- adicionar coluna de notas/comentarios
- `src/components/teacher/HorariosTab.tsx` (novo) -- cruzamento de disponibilidades
- `src/components/dashboard/AgendaTab.tsx` -- persistir no banco
- `src/components/dashboard/MaterialTab.tsx` -- dados reais do banco
- `src/pages/TeacherDashboard.tsx` -- adicionar aba Horarios

