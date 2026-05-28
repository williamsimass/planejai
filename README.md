# 💸 Planej.ai — Educador Financeiro com IA

Projeto desenvolvido durante o bootcamp da [DIO](https://www.dio.me) com React + TypeScript + Google Gemini. Foi o projeto mais desafiador que já fiz até agora e aprendi **muita** coisa no processo!

A ideia é simples: o usuário preenche um formulário com sua renda, gastos e uma meta financeira (tipo uma viagem ou comprar um carro), e a IA gera um diagnóstico personalizado com sugestões práticas de como chegar lá.

O legal é que **tudo roda no navegador** — sem backend, sem banco de dados. Os dados ficam no `localStorage` e as análises são geradas na hora pela API do Gemini. 🤯

---

## ✨ O que o projeto faz

- **Formulário multi-step** em 6 etapas com máscara de moeda
- **Tema claro/escuro** que lembra a preferência do usuário
- **Diagnóstico da IA** com viabilidade da meta, sugestões e ideias de renda extra
- **Chat** para conversar com o educador financeiro depois do diagnóstico
- **Histórico** de todas as simulações com opção de excluir
- Os insights ficam salvos — se você voltar pra simulação não chama a API de novo

---

## 🛠️ Tecnologias que usei

Nunca tinha trabalhado com Tailwind v4 nem React Router v7, foi bem diferente do que eu estava acostumado!

| Tecnologia | Versão |
|---|---|
| React | ^19 |
| TypeScript | ~5.6 |
| Vite | ^6 |
| Tailwind CSS | ^4 |
| React Router DOM | ^7 |
| Lucide React | ícones |
| React Loading Skeleton | loading state |

---

## 🚀 Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- pnpm instalado (`npm install -g pnpm`)
- Uma chave de API do Google Gemini (é grátis!)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/seu-usuario/planejai.git
cd planejai
```

**2. Instale as dependências**
```bash
pnpm install
```

**3. Configure a chave da API**

Crie um arquivo `.env.local` na raiz do projeto:
```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

> Pega sua chave gratuita em [aistudio.google.com](https://aistudio.google.com) → Get API Key → Criar chave de API

**4. Adicione a imagem do cofrinho**

Baixe o `piggy-bank.png` do [Figma do curso](https://www.figma.com/design/MVZhmZxoVAsgotZo50gj6M/Educador-Financeiro---DIO?node-id=29-403) e coloque em:
```
src/assets/images/piggy-bank.png
```

**5. Rode o projeto**
```bash
pnpm dev
```

Abre em `http://localhost:5173` 🎉

---

## 📁 Estrutura de pastas

Tentei organizar bem os arquivos, separando por responsabilidade:

```
src/
├── assets/images/          → imagens estáticas
├── components/
│   ├── features/           → componentes específicos de cada feature
│   │   ├── Insights/       → Content, Error, Chat (Desafio 2)
│   │   ├── Simulation/     → Form, FormStep, Hero, Progress
│   │   └── SimulationResults/ → Card, AIInsightsCard
│   ├── layout/             → RootLayout (header em todas as páginas)
│   └── shared/             → Button, Divider, Header, Input, PageHero
├── context/theme/          → sistema de temas claro/escuro
├── data/                   → configuração dos steps e prompt da IA
├── hooks/                  → useInsight, useSimulationStorage, useTheme
├── pages/                  → as 3 páginas da aplicação
├── services/               → chamadas pra API do Gemini
├── styles/                 → variáveis de cor (tokens de design)
└── utils/                  → funções de formatação de moeda e cálculo
```

---

## 💡 O que aprendi nesse projeto

Foram muitas coisas novas de uma vez só, mas as que mais me marcaram:

- **Context API** pra compartilhar o tema entre todos os componentes sem prop drilling
- **useRef como flag** pra evitar chamadas duplicadas à API no StrictMode do React
- **satisfies** do TypeScript pra manter os tipos literais e gerar o `SimulationFormData` automaticamente
- **Tailwind v4** com variáveis CSS customizadas no `@theme` — muito diferente da v3
- Montar um **prompt de IA** de verdade, com schema de resposta e regras pra padronizar o output

---

## 🎨 Design

O layout foi fornecido pela DIO no Figma:
[Educador Financeiro — DIO](https://www.figma.com/design/MVZhmZxoVAsgotZo50gj6M/Educador-Financeiro---DIO?node-id=29-403)

---

## 📌 Desafios implementados

- ✅ **Desafio 1** — Página de histórico com todas as simulações salvas e opção de excluir
- ✅ **Desafio 2** — Chat com o educador financeiro dentro da página de resultados

---

Desenvolvido com 💜 durante o bootcamp da [DIO](https://www.dio.me)
