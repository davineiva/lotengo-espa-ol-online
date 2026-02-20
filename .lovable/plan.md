
## RLS para Admin + Dialogs de Confirmação no Painel Admin

### O que será feito

**1. Corrigir e reforçar as políticas de banco de dados (RLS)**

Situação atual:
- Admins não têm política de SELECT para ver todos os perfis (só professores têm)
- Admins não têm política de DELETE em `profiles`
- Admins não têm política de INSERT ou DELETE em `user_roles` — as operações do painel admin estão falhando no banco

Políticas a serem adicionadas via migração SQL:

Em `profiles`:
- Admins podem SELECT todos os perfis
- Admins podem DELETE qualquer perfil

Em `user_roles`:
- Admins podem INSERT novos papéis
- Admins podem DELETE papéis existentes

Obs: As políticas de SELECT dos professores em `profiles` e `user_roles` serão mantidas, pois o painel do professor (GerenciarAlunosTab) também depende delas para listar alunos.

**2. Substituir confirmações nativas por AlertDialog**

Substituir o `confirm()` nativo do browser e o clique direto no badge por dialogs visuais usando o componente `AlertDialog` já disponível no projeto.

Dois dialogs serão adicionados ao `AdminDashboard`:

Dialog de remoção de papel:
- Disparado ao clicar no badge de um papel
- Exibe o nome do papel e do usuário
- Botões: "Cancelar" e "Remover papel" (vermelho)

Dialog de exclusão de perfil:
- Disparado ao clicar no ícone de lixeira
- Exibe o nome do usuário
- Avisa que a ação não pode ser desfeita
- Botões: "Cancelar" e "Excluir perfil" (vermelho)

### Detalhes técnicos

**Migração SQL:**

```sql
-- Admins podem ver todos os perfis
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem excluir perfis
CREATE POLICY "Admins can delete profiles"
  ON public.profiles FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem inserir papéis
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem deletar papéis
CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));
```

**Alterações em `src/pages/AdminDashboard.tsx`:**
- Adicionar imports: `AlertDialog`, `AlertDialogAction`, `AlertDialogCancel`, `AlertDialogContent`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogHeader`, `AlertDialogTitle`
- Adicionar estado: `confirmRemoveRole` (guarda `{ id, role, userName }` ou null) e `confirmDeleteProfile` (guarda `{ id, userName }` ou null)
- Substituir `onClick` do badge por `setConfirmRemoveRole({...})`
- Substituir `handleDeleteProfile` com `confirm()` por `setConfirmDeleteProfile({...})`
- Adicionar dois `AlertDialog` no JSX, controlados pelo estado acima, com as ações reais de DELETE ao confirmar
