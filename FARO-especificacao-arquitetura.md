# FARO — Plataforma pessoal de Sales Intelligence
### Especificação de produto e arquitetura — v1.0 (para validação)

---

## 1. Identidade do produto

**Nome escolhido: FARO**

Em português, "ter faro para negócios" significa ter instinto para identificar boas oportunidades comerciais — exatamente o que a ferramenta faz. É curto, fácil de lembrar, soa profissional e internacional (Faro também é uma cidade litorânea, o que dá um ar sofisticado à marca).

Alternativas, caso prefira: **Mira** (mirar no alvo certo) ou **Alvo** (mais direto, menos sutil).

**Identidade visual**
- Preto `#000000` como base, dourado `#ed9e19` como cor de destaque (CTAs, score alto, ícones ativos)
- Superfícies em cinza-chumbo (`#121212` / `#1a1a1a`) para cards sobre o preto
- Tipografia: Inter ou Geist — sans-serif geométrica, mesma linha do Linear/Vercel
- Cards com borda sutil, acendendo em dourado no hover
- Ícones lineares (estilo Lucide/Tabler), nunca preenchidos
- Dark mode nativo — não é um "modo", é o único modo

---

## 2. Stack tecnológica (com justificativa)

| Camada | Escolha | Por quê |
|---|---|---|
| Frontend/UI | Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui | Um único código React atende Web e Desktop sem duplicar interface |
| Empacotamento desktop | **Tauri** (não Electron) | Binário até 10x menor, muito menos RAM, sandboxing nativo em Rust — mais seguro para uma ferramenta que guarda dados sensíveis de prospecção |
| Mapa | MapLibre GL JS + tiles OpenStreetMap (gratuito), com opção de plugar Google Maps depois | Você pediu para priorizar fontes gratuitas; MapLibre + OSM cobre busca por raio, polígono livre, bairro/cidade sem custo |
| API principal | Node.js + NestJS (TypeScript) | Modular, tipado, integra fácil com o frontend, bom para orquestrar os módulos |
| Workers de coleta/enriquecimento | Python (Playwright, BeautifulSoup) rodando como serviços separados | Python tem o melhor ecossistema para scraping e análise de texto (NLP para achar decisor); rodar isolado da API evita travar o app principal |
| Fila de tarefas | Redis + BullMQ | Evita sobrecarregar fontes externas, permite retry automático e limita requisições por minuto (importante para não ser bloqueado) |
| Banco de dados | PostgreSQL 16 + extensão **PostGIS** | PostGIS resolve nativamente busca por raio, polígono desenhado, "empresas dentro deste bairro" — exatamente o que o mapa precisa |
| IA generativa | API Anthropic (Claude), chamada sob demanda | Só quando você clica em um card de ação — nunca automaticamente |
| Infraestrutura | Docker Compose (sobe tudo: app, API, workers, Postgres, Redis) + **Tailscale** | Roda igual em Windows e Linux; Tailscale te dá acesso do celular/navegador sem expor portas públicas |

---

## 3. Decisões confirmadas

- **Acesso**: local (Docker Compose no seu computador) + acesso remoto via **Tailscale** — rede privada entre seus dispositivos, sem expor portas públicas nem precisar de VPN/certificado gerenciado por você.
- **Mapa**: OpenStreetMap + MapLibre (gratuito), sem Google Maps.
- **LinkedIn/Instagram/Facebook**: automação direta (login próprio + Playwright), aceitando o risco. Implicações de arquitetura:
  - Módulo isolado como **conector plugável** — pode ser trocado ou desligado sem afetar o resto do sistema
  - Throttling e pausas para simular navegação humana (reduz risco de bloqueio, não elimina)
  - Login feito com sua própria conta, credenciais nunca saem do seu ambiente local
  - Tela de configurações mostra claramente quando essa fonte está ativa, empresa por empresa
  - Risco residual: conta pessoal pode ser suspensa pela plataforma; isso é um risco operacional que você optou por assumir

**Ainda vale lembrar**: nomes, e-mails e telefones de decisores são dados pessoais protegidos pela LGPD mesmo em uso pessoal e mesmo vindos de fonte pública — o CRM será desenhado com finalidade clara e opção de exclusão de registro. Dados de CNPJ na Receita Federal são públicos e livres de consultar (BrasilAPI/ReceitaWS).

---

## 4. Arquitetura de alto nível

*(veja o diagrama acima)*

Fluxo: o **cliente** (web ou desktop) fala com um **API gateway** único, que distribui para quatro serviços centrais — **mapa e busca**, **scraping/enriquecimento**, **IA sob demanda** e **CRM e score** — todos apoiados por **PostgreSQL+PostGIS** (dados estruturados e geoespaciais) e **Redis** (cache e filas).

Fontes externas consultadas pelo serviço de scraping: Google Maps/OSM, Google Business Profile, Meta Ads Library (API oficial gratuita), Google Ads Transparency Center, LinkedIn/Instagram/Facebook (páginas públicas), site institucional da empresa, BrasilAPI/ReceitaWS (CNPJ).

---

## 5. Modelagem de dados (entidades principais)

- **companies** — nome, endereço, geolocalização (PostGIS point), segmento, CNPJ, avaliação Google, nº avaliações, horário, faixa de faturamento estimada, nº funcionários estimado
- **contacts** (decisores) — nome, cargo, empresa vinculada, fonte da descoberta (LinkedIn/site/Receita Federal...), nível de confiança (0–100%)
- **digital_presence** — site, Instagram, Facebook, WhatsApp, e-mail, telefone, velocidade do site, SEO score, tecnologias detectadas (JSON)
- **ad_signals** — possui Pixel Meta, GTM, GA, Google Ads; histórico de anúncios ativos/pausados (Meta Ads Library, Google Ads Transparency)
- **lead_scores** — score final, breakdown de cada critério que compôs o score, data do cálculo
- **pipeline_stages / pipeline_items** — kanban, status, data de entrada em cada etapa
- **tags**, **notes**, **tasks** — CRM básico
- **prospecting_batches** — lote de empresas selecionadas + ações escolhidas manualmente
- **ai_generations** — histórico de cada conteúdo gerado por IA (tipo, empresa, resultado, se foi usado)
- **integrations_config** — chaves/tokens para Google Sheets, Notion, N8N, WhatsApp
- **export_logs / import_logs**

---

## 6. Módulos do sistema

1. Mapa e busca (raio, polígono, bairro/cidade/CEP)
2. Motor de filtros combináveis
3. Motor de enriquecimento (scraping + detecção de tecnologias/pixels)
4. Descoberta de decisor (multi-fonte, com nível de confiança)
5. Lead Score
6. Perfil da empresa (visão 360°)
7. CRM (kanban, tarefas, notas, tags, follow-up)
8. Cards de ação de IA (diagnóstico, proposta, mensagens, scripts)
9. Prospecção em massa (seleção múltipla + ações manuais)
10. Integrações (Sheets, Notion, N8N, WhatsApp, export/import)
11. Configurações (fontes de dados, chaves de API, preferências de score)

---

## 7. Principais endpoints (ilustrativo)

```
GET   /companies/search          — busca com filtros combinados + geolocalização
GET   /companies/:id             — perfil completo
POST  /companies/:id/enrich      — dispara enriquecimento manual
GET   /companies/:id/score       — score + breakdown
POST  /companies/:id/ai/generate — gera conteúdo (tipo no body), nunca automático
GET   /crm/pipeline              — kanban
POST  /crm/tasks
POST  /prospecting/batches       — cria lote de prospecção
POST  /prospecting/batches/:id/actions — executa ação escolhida no lote
GET   /map/search                — busca geoespacial (raio/polígono)
```

---

## 8. Telas principais

| Tela | Função |
|---|---|
| Dashboard | Visão geral: leads quentes, tarefas do dia, funil |
| Mapa de busca | Mapa interativo + painel de filtros lateral, resultados sincronizados |
| Resultados | Alterna entre lista / tabela / cards, sempre sincronizado com o mapa |
| Perfil da empresa | Todos os dados coletados + cards de ação de IA |
| Pipeline (Kanban) | Arrastar empresas entre etapas do funil |
| Prospecção em massa | Seleção múltipla + escolha manual de ações |
| Configurações | Fontes de dados, integrações, chaves de API, pesos do score |

---

## 9. Como o Lead Score é calculado (transparente, nunca uma caixa-preta)

Pontuação de 0 a 100, soma ponderada de sinais — exemplo de pesos iniciais (ajustáveis nas configurações):

```
+20  Não faz anúncios atualmente
+15  Já anunciou no passado e parou (tem orçamento, mas está insatisfeito — oportunidade)
+15  Instagram ativo (posts nos últimos 30 dias)
+10  WhatsApp disponível publicamente
+15  Não possui site, OU site considerado "ruim"
     (critério de "site ruim": sem SSL, não responsivo, PageSpeed < 50, sem CTA claro)
+15  Potencial financeiro (nº funcionários, nº e nota de avaliações Google)
+10  Segmento historicamente responsivo a automação/IA/tráfego pago
```
Cada empresa mostra o breakdown completo — você vê exatamente por que ela ficou "quente", "morna" ou "fria".

---

## 10. Fluxo de aprovação humana (nada acontece sozinho)

- Todo dado é **coletado e analisado automaticamente** — isso é o motor de enriquecimento.
- Toda **ação estratégica** (gerar mensagem, proposta, mover no funil, enviar algo) aparece como um **card com botão** — só executa quando você clica.
- Nada é enviado para fora do app (WhatsApp, e-mail, Sheets, Notion, N8N) sem você escolher explicitamente a ação e confirmar.

---

## 11. Backlog / roadmap por fases

- **Fase 1 — Core**: setup do banco, mapa básico + busca por raio, filtros essenciais, perfil de empresa simples
- **Fase 2 — Enriquecimento**: site, redes sociais, WhatsApp/e-mail, detecção de Pixel/GTM/GA
- **Fase 3 — Inteligência de anúncios**: Meta Ads Library, Google Ads Transparency
- **Fase 4 — Descoberta de decisor** com nível de confiança
- **Fase 5 — Lead Score**
- **Fase 6 — CRM completo**: kanban, tarefas, notas, tags
- **Fase 7 — Cards de ação de IA**
- **Fase 8 — Prospecção em massa + integrações** (Sheets, Notion, N8N, WhatsApp)
- **Fase 9 — Polimento de UX + dashboard analítico + export/import**

---

## 12. Sugestões de funcionalidades adicionais (alto valor, não pedidas explicitamente)

- **Alertas de mudança**: avisar quando uma empresa monitorada começa ou para de anunciar
- **Watchlist**: acompanhar empresas específicas ao longo do tempo, com histórico de mudanças
- **Benchmark por segmento/região**: score médio do seu nicho, para calibrar expectativa
- **Estimador de investimento em ads**: heurística de "quanto essa empresa provavelmente gasta"
- **Templates de abordagem por segmento**, reaproveitáveis nos cards de IA
- **Detecção de duplicados** ao importar/buscar de múltiplas fontes
- **Exportação de relatório em PDF** por empresa (dossiê pronto para reunião)

---

## Próximo passo

Arquitetura, stack, dados, telas e roadmap validados. Falta só seu sinal verde para eu começar a implementação pela **Fase 1** (setup do banco com PostGIS, mapa com MapLibre/OSM, filtros essenciais, perfil de empresa básico) — ou, se preferir, posso primeiro detalhar melhor alguma tela específica antes de codar.
