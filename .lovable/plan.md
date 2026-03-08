

## Plano: Paginação/Filtros na Auditoria + Reset de Senha pelo Admin

### 1. Paginação e filtros na aba de Auditoria

Atualmente a aba de auditoria mostra os últimos 50 logs sem filtro nem paginação.

**Alterações em `AdminDashboard.tsx`:**
- Adicionar estados: `auditSearchQuery`, `auditActionFilter`, `auditCurrentPage`
- Filtrar logs por texto (detalhes/nome do admin) e por tipo de ação (`add_role`, `remove_role`, `delete_profile`, `reset_password`)
- Paginar com 10 itens por página, reutilizando o mesmo padrão de paginação da aba de usuários
- Aumentar o limite de busca de 50 para 200 logs

### 2. Reset de senha de usuário pelo admin

Criar uma Edge Function `admin-reset-password` que:
- Valida que o chamador é admin (mesmo padrão da `get-user-emails`)
- Recebe o `user_id` e o `email` do usuário alvo
- Usa `serviceClient.auth.admin.generateLink({ type: 'recovery', email })` para gerar um link de recuperação
- Retorna sucesso (o e-mail de reset é enviado automaticamente pelo sistema de auth)

**Alterações em `AdminDashboard.tsx`:**
- Adicionar botão de "Resetar senha" (ícone `KeyRound`) na coluna de ações de cada usuário
- Adicionar AlertDialog de confirmação antes de disparar o reset
- Ao confirmar, chamar a Edge Function e registrar a ação no log de auditoria
- Toast de sucesso/erro

**Alterações em `supabase/config.toml`:**
- Adicionar `[functions.admin-reset-password]` com `verify_jwt = false`

### Arquivos modificados
- `src/pages/AdminDashboard.tsx` - paginação/filtros de auditoria + botão reset senha
- `supabase/functions/admin-reset-password/index.ts` - nova Edge Function
- `supabase/config.toml` - configuração da nova função

### Sobre o teste de login

Não é possível fazer login automatizado no browser de teste pois ele não compartilha a sessão do preview. Recomendo que você teste manualmente após a implementação.

