# 🔄 Workflow de Desenvolvimento

Este documento descreve o fluxo de trabalho recomendado para desenvolver widgets Zoho Creator.

## 📋 Workflow Completo

### 1️⃣ Configuração Inicial (Apenas uma vez)

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd shadcnProject

# Instale as dependências
npm install

# Valide a configuração Zoho
zet validate
```

### 2️⃣ Desenvolvimento Diário

```bash
# Inicie o servidor de desenvolvimento
npm run dev
```

- Acesse `http://localhost:5173`
- Edite arquivos em `src/`
- Veja mudanças em tempo real (hot-reload)
- Use React DevTools para debug

### 3️⃣ Teste Local com Zoho

```bash
# Gere os arquivos para Zoho
npm run build:zoho

# Inicie o servidor Zoho local
zet run
```

- Acesse `https://127.0.0.1:5000`
- Aceite o certificado SSL
- Teste o widget no ambiente Zoho

### 4️⃣ Deploy para Zoho Creator

```bash
# Gere os arquivos finais
npm run build:zoho

# Valide antes do upload
zet validate
```

**Upload Manual:**

1. Acesse seu widget no Zoho Creator
2. Faça upload dos arquivos de `app/`:
   - `widget.html`
   - `widget.css`
   - `widget.js`

## 🎨 Adicionando Novos Componentes

### Componentes shadcn/ui

```bash
# Ver componentes disponíveis
npx shadcn@latest add

# Adicionar componente específico
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
```

### Componentes Customizados

1. Crie em `src/components/MeuComponente.tsx`
2. Importe em `src/App.tsx`
3. Use normalmente

```tsx
// src/components/MeuComponente.tsx
export function MeuComponente() {
  return <div>Meu Componente</div>;
}

// src/App.tsx
import { MeuComponente } from "./components/MeuComponente";

function App() {
  return <MeuComponente />;
}
```

## 🐛 Debug e Troubleshooting

### Verificar Erros de Build

```bash
# Build normal (mostra erros TypeScript)
npm run build

# Se houver erros, corrija antes de:
npm run build:zoho
```

### Limpar Cache

```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install

# Limpar cache do Vite
rm -rf dist
npm run build
```

### Verificar Arquivos Gerados

```bash
# Após build:zoho, verifique:
ls -lh app/

# Deve mostrar:
# widget.html (~0.4 KB)
# widget.css  (~16 KB)
# widget.js   (~220 KB)
```

## 📦 Versionamento

### Antes de Commitar

```bash
# Verifique o que mudou
git status

# Adicione apenas arquivos de src/
git add src/

# NÃO adicione app/widget.css e app/widget.js
# (já estão no .gitignore)

# Commit
git commit -m "feat: adiciona novo componente"

# Push
git push
```

### Arquivos Versionados

✅ **SIM** - Versionar:

- `src/**/*` - Código fonte
- `build-zoho.js` - Script de build
- `package.json` - Dependências
- `*.md` - Documentação
- `server/index.js` - Servidor Zoho
- `app/translations/` - Traduções

❌ **NÃO** - Versionar:

- `app/widget.css` - Gerado automaticamente
- `app/widget.js` - Gerado automaticamente
- `dist/` - Build temporário
- `node_modules/` - Dependências

## 🔄 Atualizando Dependências

```bash
# Verificar atualizações disponíveis
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar específica
npm update react react-dom

# Após atualizar, teste:
npm run dev
npm run build:zoho
```

## 🚀 Otimização

### Reduzir Tamanho do Bundle

1. **Remova imports não usados**
2. **Use tree-shaking** (automático com Vite)
3. **Lazy loading** para componentes grandes:

```tsx
import { lazy, Suspense } from "react";

const ComponentePesado = lazy(() => import("./ComponentePesado"));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ComponentePesado />
    </Suspense>
  );
}
```

### Verificar Tamanho

```bash
# Build e veja o tamanho dos arquivos
npm run build

# Analise o bundle (opcional, requer plugin)
npm run build -- --mode analyze
```

## 📝 Checklist de Deploy

- [ ] Código testado em `npm run dev`
- [ ] Build sem erros: `npm run build`
- [ ] Gerados arquivos: `npm run build:zoho`
- [ ] Validação OK: `zet validate`
- [ ] Testado localmente: `zet run`
- [ ] Arquivos verificados em `app/`
- [ ] Upload para Zoho Creator
- [ ] Teste no ambiente de produção Zoho

## 🎯 Dicas de Produtividade

### Aliases úteis (opcional)

Adicione ao seu `.bashrc` ou `.zshrc`:

```bash
alias zdev="npm run dev"
alias zbuild="npm run build:zoho"
alias zrun="zet run"
alias zval="zet validate"
```

### VS Code Extensions Recomendadas

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier

### Atalhos Úteis

- `Ctrl + Shift + P` → Comandos VS Code
- `Ctrl + `` → Toggle terminal
- `F5` → Debug
- `Ctrl + Space` → Autocomplete

---

**Happy Coding! 🚀**
