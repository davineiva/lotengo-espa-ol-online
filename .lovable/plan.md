

## Plano: "Esqueci a senha" + Como definir administrador

### 1. Fluxo "Esqueci a senha"

**Criar página `/esqueci-senha`:**
- Formulário com campo de e-mail
- Chama `supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/reset-password' })`
- Mostra mensagem de sucesso após envio

**Criar página `/reset-password`:**
- Detecta o token de recuperação na URL (hash com `type=recovery`)
- Formulário para digitar nova senha (com confirmação)
- Chama `supabase.auth.updateUser({ password })` para salvar
- Redireciona para `/login` após sucesso

**Alterar `Login.tsx`:**
- Adicionar link "Esqueci minha senha" abaixo do campo de senha, apontando para `/esqueci-senha`

**Alterar `App.tsx`:**
- Adicionar rotas `/esqueci-senha` e `/reset-password`

### 2. Como definir o administrador

Para definir o primeiro administrador, é necessário inserir o papel diretamente no banco de dados. Após a implementação, vou executar uma migração SQL que insere o papel `admin` para o seu usuário na tabela `user_roles`. Você precisará me informar o e-mail da conta que será admin, e eu uso uma query para buscar o `user_id` correspondente e inserir o papel.

Depois que o primeiro admin existir, ele pode promover outros usuários pelo painel admin (`/admin`).

### Arquivos modificados
- `src/pages/Login.tsx` — link "Esqueci minha senha"
- `src/pages/EsqueciSenha.tsx` — nova página (formulário de recuperação)
- `src/pages/ResetPassword.tsx` — nova página (definir nova senha)
- `src/App.tsx` — novas rotas

