# FARO — Acompanhamento por Fase

Este arquivo registra o que foi entregue em cada fase do projeto. A especificação completa de arquitetura está em `FARO-especificacao-arquitetura.md`.

---

## ✅ Fase 1 — Core (concluída)

**Entregue:**
- Banco de dados PostgreSQL + PostGIS rodando via Docker Compose
- Mapa interativo (MapLibre + OpenFreeMap, gratuito, sem chave de API)
- Busca geoespacial real por raio (1 a 50 km) usando `ST_DWithin`/`ST_Distance` do PostGIS
- Busca de localização com autocomplete (Nominatim/OpenStreetMap) — pesquisa cidade/bairro/país e o mapa "voa" até lá
- Filtro de raio **opcional** (desligado por padrão) — quando ligado, restringe por proximidade do pino; quando desligado, os filtros de nome/segmento/cidade valem para o banco inteiro
- Filtros combináveis: nome, segmento, cidade, possui site, Instagram ativo, WhatsApp, avaliação mínima
- Lista de resultados sincronizada com o mapa (cards + marcadores clicáveis)
- Perfil básico da empresa
- Seed com 10 empresas de exemplo (Santa Luzia/BH, MG) para desenvolvimento

**Correções feitas durante o setup:**
- Dockerfile da API sem OpenSSL (Prisma não rodava em Alpine)
- `.dockerignore` faltando (node_modules do Windows vazava pro build do Linux)
- `tsconfig.json` compilando `prisma/` junto com `src/`, gerando `dist/src/main.js` em vez de `dist/main.js`
- Estilo de mapa de teste (`demotiles`) trocado por um mapa de verdade (OpenFreeMap Liberty)
- Câmera do mapa não seguia o pino ao buscar um local (bug no efeito `flyTo`)

---

## 🚧 Fase 2 — Motor de enriquecimento (próxima)

**Objetivo:** substituir os dados de exemplo por coleta real — encontrar site, Instagram, Facebook, WhatsApp, e-mail, telefone; detectar Pixel Meta, GTM, GA; analisar SEO/velocidade/tecnologias do site.

**Status:** não iniciada.

---

## Fases seguintes (ver especificação completa para detalhes)

- **Fase 3** — Inteligência de anúncios (Meta Ads Library, Google Ads Transparency)
- **Fase 4** — Descoberta de decisor (multi-fonte, com nível de confiança)
- **Fase 5** — Lead Score
- **Fase 6** — CRM completo (kanban, tarefas, notas, tags)
- **Fase 7** — Cards de ação de IA
- **Fase 8** — Prospecção em massa + integrações (Sheets, Notion, N8N, WhatsApp)
- **Fase 9** — Polimento de UX + dashboard analítico + export/import