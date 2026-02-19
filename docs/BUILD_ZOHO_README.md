# 🚀 Template de Projeto Widget Zoho Creator

Este é o repositório padrão para desenvolvimento de widgets Zoho Creator usando React + TypeScript + Vite.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Configuração Inicial](#configuração-inicial)
- [Desenvolvimento](#desenvolvimento)
- [Build para Zoho](#build-para-zoho)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este template permite desenvolver widgets Zoho Creator usando React moderno, com todas as vantagens do TypeScript, Vite e componentes reutilizáveis, e depois converter automaticamente para o formato aceito pelo Zoho Creator (HTML + CSS + JS).

### Tecnologias Utilizadas

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI acessíveis
- **ES Modules** - Módulos JavaScript modernos

---

## ⚙️ Configuração Inicial

### 1. Clonar o Repositório

```bash
git clone <url-do-repositorio>
cd shadcnProject
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Verificar Configuração Zoho

```bash
zet validate
```

---

## 💻 Desenvolvimento

### Iniciar Servidor de Desenvolvimento Vite

Para desenvolvimento rápido com hot-reload:

```bash
npm run dev
```

Acesse: `http://localhost:5173`

### Iniciar Servidor Zoho Local

Para testar o widget no ambiente Zoho:

```bash
zet run
```

Acesse: `https://127.0.0.1:5000`

> **Nota**: Você precisará aceitar o certificado SSL auto-assinado no navegador (Advanced → Proceed to 127.0.0.1)

---

## 📦 Build para Zoho

### Comando Principal

Execute sempre que quiser atualizar os arquivos para upload no Zoho Creator:

```bash
npm run build:zoho
```

### O que o Script Faz

1. ✅ **Compila o projeto** usando TypeScript e Vite
2. ✅ **Extrai todo o CSS** em um único arquivo `widget.css`
3. ✅ **Extrai todo o JavaScript** em um único arquivo `widget.js`
4. ✅ **Cria `widget.html`** raiz com referências aos arquivos CSS e JS
5. ✅ **Salva tudo na pasta `app/`** pronto para upload

### Arquivos Gerados

Após executar o build, você terá na pasta `app/`:

```
app/
├── widget.html    # HTML raiz (~0.4 KB)
├── widget.css     # Estilos combinados (~16 KB)
├── widget.js      # JavaScript combinado (~220 KB)
└── translations/  # Arquivos de tradução (se houver)
```

### Upload para Zoho Creator

1. Execute `npm run build:zoho`
2. Acesse seu widget no Zoho Creator
3. Faça upload dos 3 arquivos:
   - `widget.html`
   - `widget.css`
   - `widget.js`

---

## 📁 Estrutura do Projeto

```
shadcnProject/
├── src/                      # 📝 CÓDIGO FONTE (EDITE AQUI)
│   ├── components/          # Componentes React
│   ├── lib/                 # Utilitários
│   ├── App.tsx              # Componente principal
│   ├── App.css              # Estilos do App
│   ├── index.css            # Estilos globais
│   └── main.tsx             # Entry point
│
├── app/                      # 📦 ARQUIVOS ZOHO (GERADOS)
│   ├── widget.html          # ⚠️ NÃO EDITAR - Gerado automaticamente
│   ├── widget.css           # ⚠️ NÃO EDITAR - Gerado automaticamente
│   ├── widget.js            # ⚠️ NÃO EDITAR - Gerado automaticamente
│   └── translations/        # Traduções (mantido)
│
├── server/                   # Servidor local Zoho
│   └── index.js             # Servidor Express (ES modules)
│
├── build-zoho.js            # 🔧 Script de conversão
├── package.json             # Dependências e scripts
├── vite.config.ts           # Configuração Vite
├── tsconfig.json            # Configuração TypeScript
├── components.json          # Configuração shadcn/ui
├── plugin-manifest.json     # Manifest Zoho
├── cert.pem / key.pem       # Certificados SSL locais
└── BUILD_ZOHO_README.md     # 📖 Este arquivo
```

---

## 🔧 Configuração Importante: ES Modules

Este projeto usa **ES Modules** (`"type": "module"` no `package.json`), que é o padrão moderno do JavaScript.

### ⚠️ Importante para Novos Arquivos

Todos os arquivos `.js` devem usar sintaxe ES modules:

**✅ Correto (ES Modules):**

```javascript
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

**❌ Errado (CommonJS):**

```javascript
const fs = require("fs");
const path = require("path");
```

### Dependências do Servidor Zoho

O `server/index.js` requer as seguintes dependências (já incluídas):

- `express` - Servidor web
- `body-parser` - Parse de requisições
- `chalk` - Cores no terminal
- `errorhandler` - Tratamento de erros
- `morgan` - Logger HTTP
- `serve-index` - Listagem de diretórios
- `portfinder` - Encontrar porta disponível

---

## 🛠️ Troubleshooting

### Erro: "require is not defined in ES module scope"

**Causa**: Arquivo usando sintaxe CommonJS em projeto ES modules.

**Solução**: Converta para ES modules:

```javascript
// Antes
const fs = require("fs");

// Depois
import fs from "fs";
```

### Erro: "Cannot find module"

**Causa**: Dependência não instalada.

**Solução**:

```bash
npm install
```

### Erro no Build

**Causa**: Erros de TypeScript no código.

**Solução**: Verifique os erros:

```bash
npm run build
```

### Servidor Zoho não inicia

**Causa**: Porta 5000-5009 em uso ou certificados SSL ausentes.

**Solução**:

1. Feche outros processos usando essas portas
2. Verifique se `cert.pem` e `key.pem` existem
3. Execute `zet validate` para verificar configuração

### Arquivos não aparecem no Zoho

**Causa**: Arquivos não foram gerados ou estão na pasta errada.

**Solução**:

1. Execute `npm run build:zoho`
2. Verifique se os arquivos estão em `app/`
3. Faça upload dos 3 arquivos principais

---

## 📝 Workflow Recomendado

### Desenvolvimento Diário

1. **Inicie o dev server**:

   ```bash
   npm run dev
   ```

2. **Desenvolva normalmente** em `src/`

3. **Teste localmente** no navegador

### Deploy para Zoho

1. **Gere os arquivos**:

   ```bash
   npm run build:zoho
   ```

2. **Valide**:

   ```bash
   zet validate
   ```

3. **Teste localmente** (opcional):

   ```bash
   zet run
   ```

4. **Faça upload** dos arquivos de `app/` para o Zoho Creator

---

## 🎨 Customização

### Adicionar Componentes shadcn/ui

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

### Modificar Estilos Tailwind

Edite `src/index.css` para customizar o tema:

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... */
  }
}
```

### Adicionar Novas Páginas/Rotas

1. Crie componentes em `src/components/`
2. Importe e use em `src/App.tsx`
3. Execute `npm run build:zoho` para gerar os arquivos

---

## 📚 Recursos Úteis

- [Documentação Zoho Creator Widgets](https://www.zoho.com/creator/help/widgets/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## ✅ Checklist de Novo Projeto

- [ ] Clonar repositório
- [ ] Executar `npm install`
- [ ] Executar `zet validate`
- [ ] Testar `npm run dev`
- [ ] Testar `zet run`
- [ ] Desenvolver funcionalidades em `src/`
- [ ] Executar `npm run build:zoho`
- [ ] Fazer upload para Zoho Creator

---

## 🤝 Contribuindo

Este é um template padrão. Ao fazer melhorias:

1. Teste completamente
2. Atualize este README
3. Commit e push para o repositório
4. Use em novos projetos

---

## 📄 Licença

Este projeto é baseado no Zoho Extension Toolkit.
Copyright (c) 2017, ZOHO CORPORATION - License: MIT

---

**Desenvolvido com ❤️ para Wizark**
