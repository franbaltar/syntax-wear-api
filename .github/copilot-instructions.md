# Instruções do projeto

## Contexto e documentação

- Esta é uma API de e-commerce Node.js + TypeScript + Fastify, com PostgreSQL acessado por Prisma.
- Consulte [docs/PRD-backend.md](../docs/PRD-backend.md) para objetivos planejados. O PRD contém endpoints e funcionalidades que ainda não existem; antes de implementar ou descrever um contrato, confirme o código atual e o schema Prisma.
- O modelo implementado contém `User` e `Product`. Categorias, pedidos, checkout, frete, newsletter e upload ainda não estão implementados.

## Estrutura

- `src/app.ts`: configura Fastify, plugins, documentação e registro das rotas.
- `src/routes/`: define endpoints e schemas de documentação Fastify.
- `src/controllers/`: valida entradas, chama services e monta respostas HTTP.
- `src/services/`: regras de negócio e operações Prisma.
- `src/middlewares/`: autenticação JWT e tratamento global de erros.
- `src/utils/`: cliente Prisma compartilhado, validadores Zod e erros de domínio.
- `src/types/index.ts`: tipos compartilhados das entradas e filtros.
- `prisma/schema.prisma`, `prisma.config.ts` e `prisma/migrations/`: modelo, configuração e histórico do banco.

## Convenções de alteração

- Preserve a divisão rota -> controller -> service. Coloque regras de negócio e acesso ao banco nos services; não acesse Prisma diretamente nas rotas ou controllers.
- Use o cliente singleton exportado por `src/utils/prisma.ts` na aplicação. O seed é um script isolado e possui seu próprio cliente.
- Para entradas, mantenha alinhados os schemas Zod em `src/utils/validators.ts`, os tipos em `src/types/index.ts`, os handlers/controllers, os services e os schemas OpenAPI das rotas.
- Para mudanças de persistência, atualize `prisma/schema.prisma`, gere uma nova migração e revise o SQL. Não reescreva migrações existentes. Atenção: `prisma/migrations/` está no `.gitignore`; confirme que uma migração nova será incluída no controle de versão.
- Siga TypeScript estrito e o estilo já usado no arquivo que está sendo alterado. Evite refatorações fora do escopo.
- Ao investigar problemas de Prisma, confira em conjunto `prisma.config.ts`, `prisma/schema.prisma`, o adapter `PrismaPg` em `src/utils/prisma.ts` e as versões de `prisma`, `@prisma/client` e `@prisma/adapter-pg`; diferenças entre essas configurações já causaram erros de conexão e migração neste projeto.
- Preserve bcrypt para hashing e verificação de senhas e JWT para autenticação. Nunca inclua `passwordHash` em respostas da API nem exponha segredos ou conteúdo do `.env`.
- Reutilize os erros de domínio em `src/utils/errors.ts` e o handler de `src/middlewares/error.middleware.ts`; respostas de erro não devem expor detalhes internos.
- Verifique explicitamente autenticação e autorização ao alterar endpoints. Atualmente, o hook de `authenticate` protege todas as rotas registradas em `src/routes/products.routes.ts`; não há verificação de papel ADMIN nesse arquivo. Não presuma que catálogo é público ou que JWT, sozinho, concede acesso administrativo.
- Ao mudar filtros ou campos de produto, confira schema Prisma, tipos, validadores, service e documentação da rota: há contratos existentes que não estão alinhados entre si.
- Confira a implementação antes de confiar em variáveis de ambiente ou funcionalidades descritas como futuras. Por exemplo, `HOST` e `UPLOAD_DIR` aparecem no `.env.example`, mas não são usados atualmente pelo servidor.

## Comandos e validação

- `npm run dev`: inicia `src/app.ts` com recarga via `tsx`.
- `npm run build`: compila os arquivos incluídos pelo `tsconfig.json` (`src/`) para `dist/`.
- `npm run prisma:generate`: gera o Prisma Client.
- `npm run prisma:migrate`: executa migrações de desenvolvimento; requer `DATABASE_URL`.
- `npm run prisma:studio`: abre o Prisma Studio; requer configuração do banco.
- `npm run prisma:seed`: executa `prisma/seed.ts`; requer configuração e acesso ao banco.
- Não há script de testes configurado e `tests/` está vazio. Não reporte testes como executados sem uma suíte disponível.
- Execute `npm run build` após alterações TypeScript. Para mudanças Prisma, valide também o schema e a migração.
- Antes de alterar o comando de produção, confira a saída real do build: `npm start` aponta para `dist/server.js`, enquanto o ponto de entrada existente é `src/app.ts`.
