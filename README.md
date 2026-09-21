# Geometria Natalina 🎄

Jogo educacional digital que transforma conceitos de geometria em desafios visuais com temática natalina. O estudante percorre um caderno de desafios e constrói desenhos em um plano cartesiano a partir de pontos e segmentos, ganhando XP e subindo de nível a cada desafio concluído.

Alinhado a habilidades da BNCC de Matemática (plano cartesiano, polígonos, triângulos e transformações geométricas). Veja a apresentação completa em [docs/geometria-natalina-bncc.pdf](docs/geometria-natalina-bncc.pdf).

## Como funciona

Cada desafio apresenta uma figura (presente, estrela, árvore de Natal...) que o aluno reconstrói marcando pontos e segmentos no plano cartesiano, com missões guiadas, contagem de pontos e tentativas.

## Estrutura do projeto

- [app/](app/) — aplicação Next.js (React + TypeScript + Tailwind) com o jogo
- [docs/](docs/) — material de apresentação e alinhamento com a BNCC
- [imagens-desenhos/](imagens-desenhos/) — ilustrações de referência das figuras-alvo de cada desafio
- [design/](design/) — materiais de design do projeto

## Rodando localmente

```bash
cd app
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Stack

- [Next.js](https://nextjs.org)
- React + TypeScript
- Tailwind CSS
