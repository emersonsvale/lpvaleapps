# 🔧 Troubleshooting - Deploy Coolify

## ❌ **Problemas Identificados no Deploy**

### **Erro 1: Native Bindings (RESOLVIDO)**
```
ERROR Cannot find native binding. npm has a bug related to optional dependencies
Cannot find module '@oxc-parser/binding-linux-x64-musl'
```

### **Erro 2: Vite Build - Image Import (RESOLVIDO)**
```
[plugin:vite:import-analysis] Failed to resolve import '/Solucoeesdigitais.png' from Logo.vue
```

### **Causas:**
1. **Node.js 18**: Nuxt 4.2.2 requer Node.js 20+
2. **Alpine Linux**: Problemas com bindings nativos do oxc-parser
3. **Dependencies**: Conflito entre dependências de produção e desenvolvimento
4. **Nomes de Arquivos**: Caracteres especiais e acentos em nomes de imagens causam problemas no Vite build

---

## ✅ **Soluções Implementadas**

### **1. Dockerfile Corrigido**
- **Node.js 20**: Atualizado de 18 para 20
- **Build otimizado**: Separação clara entre build e runtime
- **Dependencies**: Instalação correta das dependências

### **2. Dockerfile Alternativo (Debian)**
- **`Dockerfile.debian`**: Versão usando Debian em vez de Alpine
- **Melhor compatibilidade**: Para casos de problemas com bindings nativos
- **Mesmo resultado**: Performance similar, maior compatibilidade

### **3. Renomeação de Arquivos de Imagem**
- **Problema**: Nomes com acentos e caracteres especiais (`Solucoeesdigitais.png`, `Retângulo 3 copiar.png`)
- **Solução**: Renomeados para nomes seguros:
  - `Solucoeesdigitais.png` → `logo-vale-apps.png`
  - `Retângulo 3 copiar.png` → `favicon.png`
  - `LogoValeAapps.png` → `logo-header.png`
- **Resultado**: Build do Vite funciona sem erros de importação

---

## 🚀 **Como Fazer Deploy Agora**

### **Opção 1: Dockerfile Principal (Recomendado)**
```yaml
# No Coolify
Repository: https://github.com/emersonsvale/lpvaleapps
Dockerfile: Dockerfile
Build Context: .
Target Stage: runner
```

### **Opção 2: Dockerfile Debian (Se houver problemas)**
```yaml
# No Coolify
Repository: https://github.com/emersonsvale/lpvaleapps
Dockerfile: Dockerfile.debian
Build Context: .
Target Stage: runner
```

### **Variáveis de Ambiente:**
```env
NODE_ENV=production
NITRO_PORT=3000
NITRO_HOST=0.0.0.0
NITRO_PRESET=node-server
```

---

## 🔍 **Verificações Pré-Deploy**

### **1. Teste Local:**
```bash
# Testar Dockerfile principal
docker build -t vale-apps .
docker run -p 3000:3000 vale-apps

# Testar Dockerfile Debian (se necessário)
docker build -f Dockerfile.debian -t vale-apps-debian .
docker run -p 3000:3000 vale-apps-debian
```

### **2. Verificar Build:**
```bash
# Build local para verificar
npm ci
npm run build
node .output/server/index.mjs
```

---

## 🛠️ **Configurações Coolify Atualizadas**

### **1. Configuração Docker:**
- **Base Image**: Node.js 20 (não mais 18)
- **Multi-stage**: Builder + Runner separados
- **Dependencies**: Instalação correta por stage
- **Health Check**: Integrado e funcional

### **2. Configuração de Recursos:**
```yaml
Memory Limit: 512Mi
CPU Limit: 500m
Memory Request: 256Mi
CPU Request: 250m
```

### **3. Health Check:**
```yaml
Path: /
Port: 3000
Interval: 30s
Timeout: 10s
Retries: 3
Start Period: 30s
```

---

## 📊 **Monitoramento Pós-Deploy**

### **1. Verificar Logs:**
```bash
# No Coolify Dashboard
- Verificar logs de build
- Verificar logs de runtime
- Monitorar health checks
```

### **2. Testar Endpoints:**
```bash
# Após deploy bem-sucedido
curl https://valeapps.com.br
curl https://valeapps.com.br/sitemap.xml
curl https://valeapps.com.br/robots.txt
curl https://valeapps.com.br/manifest.json
```

### **3. Performance Check:**
```bash
# Verificar métricas
- Tempo de startup: < 30s
- Memory usage: ~256MB
- CPU usage: Baixo
- Response time: < 500ms
```

---

## 🚨 **Problemas Comuns e Soluções**

### **1. Build Falha - Node Version**
```yaml
Problema: Unsupported engine Node.js 18
Solução: Usar Dockerfile atualizado com Node.js 20
```

### **2. Build Falha - Native Bindings**
```yaml
Problema: Cannot find native binding
Solução: Usar Dockerfile.debian em vez de Alpine
```

### **3. Runtime Falha - Dependencies**
```yaml
Problema: Module not found
Solução: Verificar se build stage instalou todas as deps
```

### **4. Health Check Falha**
```yaml
Problema: Health check timeout
Solução: Aumentar start_period para 60s
```

---

## 📋 **Checklist de Deploy**

### **Pré-Deploy:**
- [ ] Código commitado no GitHub
- [ ] Dockerfile atualizado (Node.js 20)
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado no Coolify

### **Durante Deploy:**
- [ ] Build iniciado sem erros
- [ ] Dependencies instaladas corretamente
- [ ] Build da aplicação concluído
- [ ] Container iniciado com sucesso

### **Pós-Deploy:**
- [ ] Health check passando
- [ ] Site acessível via HTTPS
- [ ] Sitemap funcionando
- [ ] Performance adequada
- [ ] Logs sem erros críticos

---

## 🎯 **Próximos Passos**

### **1. Deploy Imediato:**
1. Fazer push das correções
2. Tentar deploy no Coolify
3. Monitorar logs de build
4. Verificar funcionamento

### **2. Se Ainda Houver Problemas:**
1. Usar `Dockerfile.debian`
2. Aumentar recursos se necessário
3. Verificar logs detalhados
4. Ajustar configurações conforme necessário

### **3. Pós-Deploy Bem-Sucedido:**
1. Configurar monitoramento
2. Submeter sitemap ao Google
3. Testar performance
4. Configurar backups

---

## 💡 **Dicas Importantes**

### **✅ Fazer:**
- Usar Node.js 20+ sempre
- Testar build localmente primeiro
- Monitorar logs durante deploy
- Verificar health checks

### **❌ Evitar:**
- Usar Node.js 18 com Nuxt 4+
- Ignorar warnings de engine
- Deploy sem testar localmente
- Configurar recursos insuficientes

---

**🚀 Com essas correções, o deploy deve funcionar perfeitamente! 🚀**