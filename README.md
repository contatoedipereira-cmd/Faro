# FARO — Fase 1

Setup do banco (PostgreSQL + PostGIS), mapa com MapLibre/OpenStreetMap, filtros essenciais e perfil de empresa básico.

O código foi escrito e validado neste ambiente (`npm install`, `prisma generate` do schema, `tsc` e `next build` do frontend rodaram sem erros de tipo). O único passo que não foi possível testar aqui é subir o Postgres/Docker de verdade — vale rodar `docker compose up` uma vez no seu computador e me avisar se algo não subir.

## Pré-requisitos

- Docker e Docker Compose instalados (Windows ou Linux)
- Node.js 20+ (só necessário se quiser rodar `prisma migrate`/seed fora do container, ou desenvolver com hot-reload)

## Como rodar

```bash
cp .env.example .env

# 1. Sobe banco (com PostGIS já habilitado via infra/postgres/init) e Redis
docker compose up -d db redis

# 2. Cria as tabelas e popula com empresas de exemplo (Santa Luzia/BH, MG)
cd apps/api
npm install
npx prisma migrate dev --name init
npm run prisma:seed
cd ../..

# 3. Sobe a API e o frontend
docker compose up --build
```

- Frontend: http://localhost:3000 (redireciona para `/search`)
- API: http://localhost:3333/companies/search

## O que já funciona nesta fase

- Mapa interativo (MapLibre + OpenStreetMap, gratuito) com pino móvel — clique no mapa para reposicionar
- Busca por raio (1, 3, 5, 10, 20, 50 km) usando PostGIS (`ST_DWithin`/`ST_Distance`) direto no Postgres
- Filtros combináveis: nome, segmento, cidade, possui site / Instagram / WhatsApp, avaliação mínima do Google
- Lista de resultados sincronizada com o mapa (cards + marcadores clicáveis)
- Perfil básico da empresa com todos os dados salvos no banco

## O que ainda não está aqui (fases seguintes, conforme o roadmap)

- Coleta/enriquecimento automático (scraping) — Fase 2
- Meta Ads Library / Google Ads Transparency — Fase 3
- Descoberta de decisor — Fase 4
- Lead Score — Fase 5
- CRM completo (kanban, tarefas, notas) — Fase 6
- Cards de ação de IA — Fase 7

## Estrutura

```
faro/
├── docker-compose.yml
├── infra/postgres/init/001-postgis.sql   # habilita a extensão PostGIS na primeira subida do banco
├── apps/
│   ├── api/     # NestJS + Prisma — apps/api/prisma/schema.prisma tem o modelo Company
│   └── web/     # Next.js 14 + Tailwind + MapLibre
```
