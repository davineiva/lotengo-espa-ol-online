

## Respostas e Plano

### 1. LGPD -- Estado atual e pendencias

O site ja possui:
- Checkbox obrigatorio de consentimento no cadastro
- Registro do timestamp de consentimento no banco (`lgpd_consent`, `lgpd_consent_at`)
- RLS protegendo dados pessoais

**Pendencias para conformidade real:**
- O link "Politica de Privacidade" no cadastro aponta para `/privacidade`, que retorna 404. No footer aponta para `/politica-privacidade`, tambem 404. E necessario criar uma pagina real com a politica.
- Falta uma pagina de Termos de Uso.
- Falta mecanismo para o usuario solicitar exclusao dos seus dados (direito de eliminacao LGPD Art. 18).
- Recomenda-se identificar um Encarregado de Dados (DPO) e exibir contato na politica.

**Resumo: o site tem a base tecnica, mas precisa da pagina de politica de privacidade real para ir a producao.**

### 2. Limites de alunos

Nao ha limite tecnico imposto pelo sistema. O banco suporta milhares de registros sem problemas. O unico limite pratico e o do plano Lovable/infraestrutura (armazenamento de arquivos, volume de requisicoes).

### 3. Plano: Gestao avancada de alunos pelo Admin

Adicionar ao painel administrativo funcionalidades para controle de alunos ativos, pagamentos e atribuicao de professor.

#### Banco de dados -- nova tabela

**`student_management`**:
- `id` uuid PK
- `student_id` uuid NOT NULL (referencia ao user_id do aluno)
- `assigned_teacher_id` uuid NULL (user_id do professor atribuido)
- `is_active` boolean DEFAULT true
- `payment_status` text DEFAULT 'pendente' (pendente, pago, atrasado, isento)
- `payment_due_date` date NULL
- `notes` text NULL (observacoes do admin)
- `created_at` timestamptz DEFAULT now()
- `updated_at` timestamptz DEFAULT now()
- UNIQUE(student_id)
- RLS: apenas admins podem CRUD

#### Alteracoes no AdminDashboard

Adicionar uma **terceira aba "Gestao de Alunos"** com:
- Tabela mostrando: Nome do aluno, Professor atribuido (select para trocar), Status ativo/inativo (toggle), Status pagamento (select: pendente/pago/atrasado/isento), Data vencimento, Observacoes
- Filtros por: status ativo/inativo, status pagamento, professor
- Indicadores no topo: total ativos, total inadimplentes, total sem professor

#### Pagina de Politica de Privacidade

Criar `/privacidade` com texto padrao LGPD cobrindo: dados coletados, finalidade, base legal, direitos do titular, contato do responsavel. Corrigir o link do footer para apontar para a mesma rota.

#### Arquivos criados/modificados

- **Migracao SQL**: criar tabela `student_management` com RLS, trigger de `updated_at`
- `src/pages/PoliticaPrivacidade.tsx` -- pagina da politica
- `src/pages/AdminDashboard.tsx` -- adicionar aba "Gestao de Alunos"
- `src/components/admin/GestaoAlunosTab.tsx` -- componente da nova aba
- `src/App.tsx` -- adicionar rota `/privacidade`
- `src/components/landing/Footer.tsx` -- corrigir link

