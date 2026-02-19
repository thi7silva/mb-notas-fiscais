import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("🚀 Iniciando build para Zoho Creator...\n");

// 1. Executar o build do Vite
console.log("📦 Compilando projeto com Vite...");
try {
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build concluído com sucesso!\n");
} catch (error) {
  console.error("❌ Erro ao executar build:", error.message);
  process.exit(1);
}

// 2. Ler o arquivo HTML gerado
const distPath = path.join(__dirname, "dist");
const indexHtmlPath = path.join(distPath, "index.html");

if (!fs.existsSync(indexHtmlPath)) {
  console.error("❌ Arquivo index.html não encontrado em dist/");
  process.exit(1);
}

console.log("📄 Processando arquivos gerados...");
let htmlContent = fs.readFileSync(indexHtmlPath, "utf-8");

// 3. Extrair e combinar todos os arquivos CSS
const cssFiles = [];
const cssRegex = /<link[^>]*href="([^"]*\.css)"[^>]*>/g;
let match;

while ((match = cssRegex.exec(htmlContent)) !== null) {
  cssFiles.push(match[1]);
}

let combinedCSS = "";
cssFiles.forEach((cssFile) => {
  const cssPath = path.join(distPath, cssFile);
  if (fs.existsSync(cssPath)) {
    const cssContent = fs.readFileSync(cssPath, "utf-8");
    combinedCSS += cssContent + "\n";
    console.log(`  ✓ CSS extraído: ${cssFile}`);
  }
});

// 4. Extrair e combinar todos os arquivos JS
const jsFiles = [];
const jsRegex = /<script[^>]*src="([^"]*\.js)"[^>]*>/g;

while ((match = jsRegex.exec(htmlContent)) !== null) {
  jsFiles.push(match[1]);
}

let combinedJS = "";
jsFiles.forEach((jsFile) => {
  const jsPath = path.join(distPath, jsFile);
  if (fs.existsSync(jsPath)) {
    const jsContent = fs.readFileSync(jsPath, "utf-8");
    combinedJS += jsContent + "\n";
    console.log(`  ✓ JS extraído: ${jsFile}`);
  }
});

// 5. Remover referências aos arquivos CSS locais do HTML (preserva CDN)
htmlContent = htmlContent.replace(
  /<link[^>]*href="(?!https?:\/\/)[^"]*\.css"[^>]*>/g,
  "",
);
// Remover apenas scripts locais (não externos como SDK do Zoho)
htmlContent = htmlContent.replace(
  /<script[^>]*src="(?!https?:\/\/)[^"]*\.js"[^>]*><\/script>/g,
  "",
);

// 6. Garantir que o SDK do Zoho Creator está incluído
const ZOHO_SDK_URL =
  "https://js.zohostatic.com/creator/widgets/version/2.0/widgetsdk-min.js";
const ZOHO_SDK_TAG = `<script src="${ZOHO_SDK_URL}"></script>`;

// Verificar se o SDK já está no HTML
const hasZohoSDK = htmlContent.includes("zohostatic.com/creator/widgets");

if (!hasZohoSDK) {
  console.log("  ✓ SDK do Zoho Creator adicionado automaticamente");
  // Adicionar SDK antes do </head>
  htmlContent = htmlContent.replace("</head>", `  ${ZOHO_SDK_TAG}\n  </head>`);
}

// 7. Adicionar referências aos novos arquivos inline
const finalHTML = htmlContent
  .replace("</head>", '  <link rel="stylesheet" href="widget.css">\n  </head>')
  .replace("</body>", '  <script src="widget.js"></script>\n  </body>');

// 7. Criar pasta app se não existir
const appPath = path.join(__dirname, "app");
if (!fs.existsSync(appPath)) {
  fs.mkdirSync(appPath, { recursive: true });
}

// 8. Salvar arquivos na pasta app
const widgetHtmlPath = path.join(appPath, "widget.html");
const widgetCssPath = path.join(appPath, "widget.css");
const widgetJsPath = path.join(appPath, "widget.js");

fs.writeFileSync(widgetHtmlPath, finalHTML, "utf-8");
fs.writeFileSync(widgetCssPath, combinedCSS, "utf-8");
fs.writeFileSync(widgetJsPath, combinedJS, "utf-8");

console.log("\n✨ Conversão concluída com sucesso!");
console.log("\n📁 Arquivos gerados em app/:");
console.log(
  `  ✓ widget.html (${(fs.statSync(widgetHtmlPath).size / 1024).toFixed(2)} KB)`,
);
console.log(
  `  ✓ widget.css (${(fs.statSync(widgetCssPath).size / 1024).toFixed(2)} KB)`,
);
console.log(
  `  ✓ widget.js (${(fs.statSync(widgetJsPath).size / 1024).toFixed(2)} KB)`,
);
console.log("\n🎉 Pronto para usar no Zoho Creator!\n");
