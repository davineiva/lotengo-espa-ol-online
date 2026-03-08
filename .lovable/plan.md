

## Plano

Sobre os testes: nao consigo executar testes de browser ou publicar o site no modo de planejamento. Apos aprovar este plano, farei a implementacao e voce podera testar manualmente. Para publicar, basta clicar no botao **Publish** no canto superior direito do editor.

A pagina de Politica de Privacidade ja existe em `/privacidade` e `/politica-privacidade` -- ambas as rotas estao registradas no App.tsx.

### Implementacao: Solicitacao de exclusao de dados (LGPD Art. 18)

**Nova tabela `data_deletion_requests`:**
- `id` uuid PK
- `user_id` uuid NOT NULL
- `status` text DEFAULT 'pendente' (pendente, aprovado, rejeitado)
- `reason` text NULL
- `admin_notes` text NULL
- `created_at` timestamptz DEFAULT now()
- `resolved_at` timestamptz NULL
- `resolved_by` uuid NULL
- RLS: aluno pode INSERT e SELECT nos proprios; admin pode SELECT e UPDATE todos

**Dashboard do aluno (`src/pages/Dashboard.tsx`):**
- Adicionar secao "Meus Dados" ou botao no header com icone de escudo/lixeira
- Ao clicar, abre dialog com aviso sobre consequencias da exclusao, campo opcional de motivo, e botao de confirmacao
- Mostra status da solicitacao se ja existir uma pendente

**Painel Admin (`src/pages/AdminDashboard.tsx`):**
- Adicionar indicador de solicitacoes pendentes
- Na aba Gestao de Alunos ou nova sub-secao, listar solicitacoes com botoes para aprovar/rejeitar
- Ao aprovar, o admin exclui manualmente os dados ou aciona um processo de exclusao

**Arquivos criados/modificados:**
- Migracao SQL: tabela `data_deletion_requests` com RLS
- `src/pages/Dashboard.tsx` -- adicionar botao e dialog de solicitacao
- `src/components/admin/GestaoAlunosTab.tsx` -- listar e gerenciar solicitacoes de exclusao

