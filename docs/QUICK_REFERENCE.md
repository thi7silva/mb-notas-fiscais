# ⚡ Guia Rápido - Comandos Essenciais

## 🚀 Comandos Mais Usados

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (http://localhost:5173)

# Build para Zoho
npm run build:zoho       # Gera arquivos em app/

# Zoho Local
zet validate            # Valida configuração
zet run                 # Servidor local (https://127.0.0.1:5000)
```

## 📁 Onde Editar

```
✅ EDITE AQUI:
   src/
   ├── components/      # Seus componentes React
   ├── App.tsx          # Componente principal
   └── index.css        # Estilos globais

❌ NÃO EDITE:
   app/
   ├── widget.css       # Gerado automaticamente
   └── widget.js        # Gerado automaticamente
```

## 🔄 Fluxo Básico

1. **Desenvolver**: Edite em `src/` com `npm run dev` rodando
2. **Converter**: Execute `npm run build:zoho`
3. **Upload**: Envie arquivos de `app/` para Zoho Creator

## 🎨 Adicionar Componentes shadcn/ui

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add select
```

## 🐛 Problemas Comuns

### Build falha

```bash
npm run build          # Veja os erros TypeScript
```

### Servidor não inicia

```bash
npm install            # Reinstale dependências
zet validate          # Valide configuração
```

### Mudanças não aparecem

```bash
npm run build:zoho    # Regere os arquivos
```

## 📚 Documentação

- **Completa**: [BUILD_ZOHO_README.md](./BUILD_ZOHO_README.md)
- **Workflow**: [WORKFLOW.md](./WORKFLOW.md)
- **Principal**: [README.md](./README.md)

## 🔗 Links Úteis

- [React Docs](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zoho Widgets](https://www.zoho.com/creator/help/widgets/)

---

**Dica**: Salve este arquivo nos favoritos! 📌
