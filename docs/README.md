# 🎨 Zoho Creator Widget Template

> Template padrão para desenvolvimento de widgets Zoho Creator com React + TypeScript + Vite

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para Zoho Creator
npm run build:zoho

# Testar localmente com Zoho
zet run
```

## 📖 Documentação Completa

Para documentação detalhada, veja **[BUILD_ZOHO_README.md](./BUILD_ZOHO_README.md)**

## 🎯 O que é este template?

Este é um template completo para desenvolver widgets Zoho Creator usando tecnologias modernas:

- ✅ **React 19** com TypeScript
- ✅ **Vite** para build ultrarrápido
- ✅ **Tailwind CSS** para estilização
- ✅ **shadcn/ui** para componentes prontos
- ✅ **Script automático** de conversão para Zoho

## 💡 Como Funciona

1. **Desenvolva** normalmente em React na pasta `src/`
2. **Execute** `npm run build:zoho` para converter
3. **Faça upload** dos arquivos de `app/` para o Zoho Creator

## 📁 Estrutura

```
├── src/              # Seu código React (EDITE AQUI)
├── app/              # Arquivos Zoho (GERADOS)
├── build-zoho.js     # Script de conversão
└── server/           # Servidor local Zoho
```

## 🛠️ Scripts Disponíveis

| Comando              | Descrição                               |
| -------------------- | --------------------------------------- |
| `npm run dev`        | Inicia servidor de desenvolvimento Vite |
| `npm run build`      | Build de produção                       |
| `npm run build:zoho` | **Converte para formato Zoho**          |
| `npm run lint`       | Executa linter                          |
| `zet validate`       | Valida configuração Zoho                |
| `zet run`            | Inicia servidor local Zoho              |

## 📦 Dependências Principais

### Produção

- React 19 + React DOM
- Tailwind CSS 4
- shadcn/ui components
- Express (servidor Zoho)

### Desenvolvimento

- TypeScript 5.9
- Vite 7
- ESLint

## 🔧 Configuração ES Modules

Este projeto usa **ES Modules** modernos. Todos os arquivos `.js` devem usar:

```javascript
import fs from "fs";
// NÃO usar: const fs = require('fs');
```

## 📚 Recursos

- [Documentação Completa](./BUILD_ZOHO_README.md)
- [Zoho Creator Widgets](https://www.zoho.com/creator/help/widgets/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🤝 Contribuindo

Este é o template padrão da Wizark. Ao fazer melhorias:

1. Teste completamente
2. Atualize a documentação
3. Commit e push

## 📄 Licença

MIT License - Baseado no Zoho Extension Toolkit

---

**Desenvolvido com ❤️ para Wizark**
