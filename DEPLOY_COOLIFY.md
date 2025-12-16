# 🚀 Guia de Deploy - Coolify + VPS

## ✅ **Status: Código no GitHub - Pronto para Deploy**

### 📋 **Repositório GitHub**
- **URL**: https://github.com/emersonsvale/lpvaleapps
- **Branch**: master
- **Status**: ✅ Código enviado com sucesso

---

## 🛠️ **Configuração no Coolify**

### **1. Criar Nova Aplicação**

1. **Acesse o Coolify** na sua VPS
2. **Clique em "New Resource"**
3. **Selecione "Application"**
4. **Escolha "Public Repository"**

### **2. Configurar Repositório**

```
Repository URL: https://github.com/emersonsvale/lpvaleapps
Branch: master
```

### **3. Configurações de Build**

#### **Build Command:**
```bash
npm install && npm run build
```

#### **Start Command:**
```bash
node .output/server/index.mjs
```

#### **Port:**
```
3000
```

### **4. Variáveis de Ambiente**

```env
NODE_ENV=production
NITRO_PORT=3000
NITRO_HOST=0.0.0.0
```

### **5. Configurações de Domínio**

#### **Domínio Principal:**
```
valeapps.com.br
```

#### **SSL:**
- ✅ Habilitar certificado automático (Let's Encrypt)
- ✅ Forçar HTTPS

### **6. Health Check**

```
Path: /
Expected Status: 200
Timeout: 30s
```

---

## 🐳 **Alternativa: Docker (Opcional)**

Se preferir usar Docker no Coolify:

### **Dockerfile já criado:**
```dockerfile
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0
CMD ["node", ".output/server/index.mjs"]
```

---

## 📊 **Monitoramento Pós-Deploy**

### **1. Verificar URLs Importantes**

```bash
# Página principal
curl https://valeapps.com.br

# Sitemap
curl https://valeapps.com.br/sitemap.xml

# Robots
curl https://valeapps.com.br/robots.txt

# Manifest PWA
curl https://valeapps.com.br/manifest.json
```

### **2. Testar Performance**

#### **PageSpeed Insights:**
```
https://pagespeed.web.dev/analysis?url=https://valeapps.com.br
```

#### **GTmetrix:**
```
https://gtmetrix.com/
```

### **3. Verificar SEO**

#### **Google Search Console:**
1. Adicionar propriedade: `https://valeapps.com.br`
2. Submeter sitemap: `/sitemap.xml`
3. Solicitar indexação

#### **Rich Results Test:**
```
https://search.google.com/test/rich-results
```

---

## 🔧 **Configurações de Servidor (VPS)**

### **Requisitos Mínimos:**
- **RAM**: 1GB (recomendado 2GB)
- **CPU**: 1 vCore
- **Storage**: 10GB
- **Node.js**: v18+

### **Configurações Nginx (se aplicável):**

```nginx
server {
    listen 80;
    server_name valeapps.com.br www.valeapps.com.br;
    return 301 https://valeapps.com.br$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.valeapps.com.br;
    return 301 https://valeapps.com.br$request_uri;
}

server {
    listen 443 ssl http2;
    server_name valeapps.com.br;
    
    # SSL configurado pelo Coolify
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }
}
```

---

## 📈 **Métricas Esperadas**

### **Performance:**
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Performance Score**: > 90

### **SEO:**
- **SEO Score**: > 95
- **Accessibility**: > 90
- **Best Practices**: > 90

---

## 🚨 **Troubleshooting**

### **Problemas Comuns:**

#### **1. Build Falha:**
```bash
# Verificar logs no Coolify
# Possível solução: Limpar cache
npm cache clean --force
```

#### **2. Aplicação não inicia:**
```bash
# Verificar porta e host
# Verificar variáveis de ambiente
# Verificar logs da aplicação
```

#### **3. SSL não funciona:**
```bash
# Verificar DNS apontando para VPS
# Aguardar propagação DNS (até 24h)
# Verificar configuração do domínio no Coolify
```

#### **4. Performance baixa:**
```bash
# Verificar se build foi executado corretamente
# Verificar se assets estão sendo servidos com cache
# Verificar configurações de proxy
```

---

## ✅ **Checklist Pós-Deploy**

### **Imediato (Primeiros 30 min):**
- [ ] Site carregando em https://valeapps.com.br
- [ ] Redirect www → non-www funcionando
- [ ] SSL ativo e funcionando
- [ ] Sitemap acessível (/sitemap.xml)
- [ ] Robots.txt funcionando (/robots.txt)
- [ ] Manifest PWA ativo (/manifest.json)

### **Primeira Hora:**
- [ ] Testar performance no PageSpeed Insights
- [ ] Verificar Web Vitals no console
- [ ] Testar responsividade mobile
- [ ] Verificar funcionamento de todas as seções
- [ ] Testar formulário de contato (se houver)

### **Primeiro Dia:**
- [ ] Submeter sitemap no Google Search Console
- [ ] Configurar Google Analytics (se não estiver)
- [ ] Testar compartilhamento em redes sociais
- [ ] Verificar logs de erro no Coolify
- [ ] Configurar monitoramento de uptime

### **Primeira Semana:**
- [ ] Monitorar indexação no Google
- [ ] Acompanhar métricas de performance
- [ ] Verificar relatórios de Web Vitals
- [ ] Otimizar baseado em dados reais

---

## 🎯 **Próximos Passos**

1. **Deploy no Coolify** seguindo este guia
2. **Configurar domínio** e SSL
3. **Testar todas as funcionalidades**
4. **Submeter ao Google Search Console**
5. **Monitorar performance** e otimizar

---

## 📞 **Suporte**

Se encontrar problemas durante o deploy:

1. **Verificar logs** no Coolify
2. **Consultar documentação** do Coolify
3. **Testar localmente** com `npm run build && npm run preview`
4. **Verificar configurações** de DNS e domínio

**🚀 Boa sorte com o deploy! O site está otimizado e pronto para voar! 🚀**