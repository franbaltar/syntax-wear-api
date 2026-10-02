# Planejamento: CRUD de categorias

Este documento organiza a implementação do CRUD de categorias e do vínculo obrigatório entre produtos e categorias. É somente um plano: nenhuma alteração no schema, código, migration ou banco deve ser feita até a aprovação para implementar.

## Escopo e decisões

- Seguir o padrão atual `rota -> controller -> service`.
- Usar [PRD-backend.md](PRD-backend.md) como referência planejada e confirmar os contratos no código e no schema antes de implementar.
- Criar `Category` com `id`, `name`, `slug` único e `description` opcional. Cada produto terá uma categoria obrigatória.
- Preservar os produtos existentes criando a categoria `Sem categoria` (`slug: sem-categoria`) e associando-os a ela durante a migration. O seed também deve garantir essa categoria.
- Manter `GET /categories` público. As operações administrativas em `/admin/categories` exigirão JWT e role `ADMIN`.
- O JWT atual contém `userId`, não a role; a autorização deve consultar a role atual do usuário no banco e responder `401` sem autenticação e `403` para usuário autenticado sem permissão.
- Não permitir excluir uma categoria enquanto houver produtos vinculados; usar restrição de chave estrangeira, sem exclusão em cascata ou soft delete.
- Pedidos, checkout, upload e outras funcionalidades futuras do PRD não fazem parte deste escopo.

## Etapas

### 1. Schema, migration e banco

- Atualizar `prisma/schema.prisma` com `Category`, a relação um-para-muitos com `Product` e `Product.categoryId` obrigatório.
- Gerar e revisar uma nova migration. A ordem precisa preservar os dados: criar a tabela e a categoria padrão; adicionar `categoryId` inicialmente anulável; associar os produtos existentes à categoria padrão; então tornar o campo obrigatório e criar a FK com exclusão restrita.
- Aplicar a migration ao banco configurado por `DATABASE_URL` e verificar tabela, vínculo dos produtos existentes, constraint e estado da migration.
- Conferir conjuntamente `prisma.config.ts`, `prisma/schema.prisma`, o adapter `PrismaPg` e as versões instaladas de `prisma`, `@prisma/client` e `@prisma/adapter-pg` antes de executar comandos Prisma.
- `prisma/migrations/` está ignorado pelo `.gitignore`; confirmar que a migration nova será incluída no controle de versão.

### 2. Services e contratos de dados

- Criar `src/services/categories.service.ts` para listar, obter por ID, criar, atualizar e excluir categorias, usando o cliente compartilhado de `src/utils/prisma.ts`.
- Tratar categoria inexistente e slug duplicado com erros de domínio/status HTTP coerentes com o tratamento central de erros.
- Atualizar `src/services/products.service.ts` para persistir e retornar o vínculo e filtrar produtos por `categoryId`.
- Alinhar `src/types/index.ts` e os schemas Zod de `src/utils/validators.ts`: `categoryId` obrigatório ao criar produto e opcional ao atualizar.
- Atualizar `prisma/seed.ts` para criar ou reutilizar a categoria padrão e associar os produtos sem categoria explícita.

### 3. Controller

- Criar `src/controllers/categories.controller.ts` no padrão de `src/controllers/products.controller.ts`.
- Validar entradas, chamar somente o service e montar respostas HTTP para listar, obter, criar, atualizar e excluir.
- Prever `201` na criação, `200` nas operações concluídas, `400` para entrada inválida, `404` para recurso inexistente e `409` para slug duplicado ou exclusão de categoria vinculada.

### 4. Rotas e integração

- Criar `src/routes/categories.routes.ts` com `GET /categories` público e endpoints administrativos em `/admin/categories` para listar/obter, criar, atualizar e excluir.
- Documentar parâmetros, corpos, respostas e códigos de erro nos schemas OpenAPI; seguir o padrão `PUT` usado na atualização de produtos.
- Implementar o guard de autorização ADMIN consultando a role atual do usuário, sem presumir que JWT sozinho concede acesso administrativo.
- Registrar as rotas em `src/app.ts` e atualizar a documentação/validação OpenAPI das rotas de produtos para incluir `categoryId` e filtro por categoria.

## Arquivos envolvidos

- Persistência: `prisma/schema.prisma`, `prisma/migrations/`, `prisma.config.ts`.
- Services: `src/services/categories.service.ts` (novo), `src/services/products.service.ts` e a camada usada para consultar a role.
- Controllers: `src/controllers/categories.controller.ts` (novo), seguindo `src/controllers/products.controller.ts`.
- Rotas: `src/routes/categories.routes.ts` (novo), `src/routes/products.routes.ts` e `src/app.ts`.
- Contratos: `src/types/index.ts`, `src/utils/validators.ts` e schemas OpenAPI das rotas.
- Autorização e erros: `src/middlewares/auth.middleware.ts`, `src/services/auth.service.ts`, `src/utils/errors.ts` e `src/middlewares/error.middleware.ts`.
- Seed: `prisma/seed.ts`.

## Critérios de validação

1. `npx prisma validate` e `npm run prisma:generate` concluem sem erro.
2. Com `DATABASE_URL` configurada, a migration aplica sem perder produtos existentes; todos ficam associados à categoria padrão e a FK é obrigatória.
3. `npm run build` conclui após as alterações TypeScript.
4. Smoke tests confirmam: listagem pública sem JWT; escrita e operações administrativas com ADMIN; `401` sem token; `403` para role sem permissão; `404` para IDs inexistentes; `409` para slug duplicado e tentativa de excluir categoria vinculada; criação/atualização de produto com categoria e filtro por `categoryId`.

Não há script de testes configurado e `tests/` está vazio; os smoke tests devem ser executados manualmente até existir uma suíte automatizada.
