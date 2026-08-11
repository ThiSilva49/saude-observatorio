# Observatório de Saúde

Painel público de dados de **COVID-19**, **dengue**, **zika** e **chikungunya** no Brasil, feito para ser instalado e usado direto do celular (PWA).

## Funcionalidades

- **COVID-19 no Brasil**: totais nacionais (casos, mortes, ativos, recuperados) e gráficos de tendência acumulada, via [disease.sh](https://disease.sh).
- **Dengue / Zika / Chikungunya por cidade**: casos estimados/confirmados, incidência por 100 mil habitantes, nível de alerta (verde a vermelho) e série semanal, via [InfoDengue](https://info.dengue.mat.br) (Fiocruz), com seletor de capital.
- **Instalável no celular** (PWA): manifest + service worker, funciona offline com os últimos dados carregados e pode ser adicionado à tela inicial no Android e iOS.

## Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Stack

- Next.js 16 (App Router, TypeScript)
- Tailwind CSS 4
- Recharts

## Fontes de dados

- COVID-19: [disease.sh](https://disease.sh) (API pública, sem necessidade de chave)
- Dengue / Zika / Chikungunya: [InfoDengue](https://info.dengue.mat.br) — Fiocruz/UFMG

Este painel tem fins informativos e não substitui orientação médica ou dos órgãos oficiais de saúde.

## Deploy

O projeto é compatível com deploy direto na [Vercel](https://vercel.com) (sem variáveis de ambiente obrigatórias).
