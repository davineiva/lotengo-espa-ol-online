

## Atribuir papel de Admin ao seu usuario

Vou inserir uma entrada na tabela `user_roles` para adicionar o papel `admin` ao seu usuario (DAVI KEGLEVICH NEIVA).

### O que sera feito
- Inserir um registro na tabela `user_roles` com seu `user_id` e o papel `admin`
- Apos isso, voce podera ver o botao "Painel Admin" no Dashboard e acessar a rota `/admin`

### Detalhes tecnicos
- Sera executado um INSERT na tabela `user_roles` usando a ferramenta de dados (nao e uma migracao de schema)
- `user_id`: `8501ddcb-4cbb-4440-b9c7-48c6c48cf986`
- `role`: `admin`
- Voce precisara fazer logout e login novamente (ou recarregar a pagina) para que o novo papel seja reconhecido pela sessao

