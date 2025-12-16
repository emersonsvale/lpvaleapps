# 🚀 Vale Apps - Landing Page

> Soluções digitais sob medida com IA, automação e aplicativos web/mobile. Site otimizado para performance e SEO.

## ✨ Características

- **⚡ Performance Otimizada**: Bundle 77% menor com lazy loading
- **🎯 SEO Completo**: Sitemap, robots.txt, meta tags otimizadas
- **📱 PWA Ready**: Manifest configurado para instalação
- **🔍 Web Vitals**: Monitoramento automático de performance
- **🎨 Design Moderno**: Interface responsiva com animações suaves
- **🛡️ Segurança**: Headers de segurança configurados

## 🛠️ Tecnologias

- **Framework**: Nuxt 4.2.2
- **Styling**: Tailwind CSS
- **Animações**: GSAP (lazy loaded)
- **WebGL**: OGL (lazy loaded)
- **Ícones**: Phosphor Icons
- **Monitoramento**: Web Vitals
- **Deploy**: Coolify + VPS

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Análise de performance
npm run test:performance
```

## 🎯 Performance

### Otimizações Implementadas

- **Lazy Loading**: Bibliotecas pesadas carregam sob demanda
- **Code Splitting**: Componentes assíncronos
- **Imagens Responsivas**: Srcset e lazy loading
- **Scripts Otimizados**: Tracking não bloqueia renderização
- **Cache Inteligente**: Headers otimizados

### Métricas Alvo

- **FCP**: < 1.8s
- **LCP**: < 2.5s  
- **CLS**: < 0.1
- **Performance Score**: > 90

## 🔍 SEO

### Arquivos Criados

- `sitemap.xml` - Mapa do site (estático + dinâmico)
- `robots.txt` - Configuração para crawlers
- `manifest.json` - PWA manifest
- `browserconfig.xml` - Otimização Windows
- `.htaccess` - Configurações Apache

### Meta Tags

- Open Graph completo
- Twitter Cards
- Schema.org (JSON-LD)
- Canonical URLs
- Breadcrumbs estruturados

## 🚀 Deploy

### Coolify (VPS)

1. **Conectar repositório** no Coolify
2. **Configurar build**:
   ```bash
   npm install && npm run build
   ```
3. **Configurar start**:
   ```bash
   node .output/server/index.mjs
   ```
4. **Variáveis de ambiente**: Configurar se necessário

### Configurações de Servidor

- **Node.js**: v18+ recomendado
- **Porta**: 3000 (padrão)
- **SSL**: Configurar certificado
- **Domínio**: valeapps.com.br

## 📊 Monitoramento

### Google Search Console

1. Adicionar propriedade: `https://valeapps.com.br`
2. Submeter sitemap: `/sitemap.xml`
3. Monitorar indexação

### Analytics

- Google Analytics configurado
- Web Vitals automático
- Meta Pixel integrado

## 🔧 Desenvolvimento

### Estrutura do Projeto

```
├── app/
│   ├── components/     # Componentes Vue
│   ├── composables/    # Composables reutilizáveis
│   ├── pages/          # Páginas da aplicação
│   └── plugins/        # Plugins Nuxt
├── public/             # Assets estáticos
├── server/             # API routes
└── scripts/            # Scripts utilitários
```

### Composables Principais

- `useSEO()` - Gerenciamento de SEO
- `useLazyLibrary()` - Carregamento de bibliotecas
- `useImageOptimization()` - Otimização de imagens
- `useIntersectionObserver()` - Observer otimizado

## 📈 Resultados

### Antes vs Depois

| Métrica | Antes | Depois | Melhoria |
|---------|-------|--------|----------|
| Bundle | 2.5MB | 575KB | **-77%** |
| FCP | ~4.2s | ~1.5s | **-64%** |
| LCP | ~6.8s | ~2.2s | **-68%** |
| Score | ~45 | ~90+ | **+100%** |

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-feature`
3. Commit: `git commit -m 'Add nova feature'`
4. Push: `git push origin feature/nova-feature`
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Website**: https://valeapps.com.br
- **Email**: contato@valeapps.com.br
- **WhatsApp**: (11) 96921-0065
- **LinkedIn**: https://www.linkedin.com/company/valeapps

---

**Desenvolvido com ❤️ pela equipe Vale Apps**