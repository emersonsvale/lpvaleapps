// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: ['~/assets/css/main.css'],

  // Otimizações de performance
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  },

  // Configuração de assets
  vite: {
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp']
  },

  // Otimização de build
  nitro: {
    compressPublicAssets: true,
    minify: true,
    routeRules: {
      '/': {
        headers: {
          'Cache-Control': 's-maxage=31536000'
        }
      },
      '/**': {
        headers: {
          'Cache-Control': 'max-age=31536000, immutable'
        }
      }
    }
  },


  app: {
    head: {
      htmlAttrs: {
        class: 'dark'
      },
      title: 'Vale Apps - Soluções digitais sob medida',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Soluções digitais sob medida com IA, automação e aplicativos web/mobile. Acelere seu negócio com sistemas modernos, ágeis e escaláveis.'
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Vale Apps - Soluções digitais sob medida' },
        {
          property: 'og:description',
          content: 'Soluções digitais sob medida com IA, automação e aplicativos web/mobile. Acelere seu negócio com sistemas modernos, ágeis e escaláveis.'
        },
        { property: 'og:image', content: 'https://framerusercontent.com/images/u19OkEp1R8hzwiofmw2hDQyY.png' },
        { property: 'og:image:alt', content: 'Logo da Vale Apps' },
        { property: 'og:url', content: 'https://valeapps.com.br/' },
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Vale Apps - Soluções digitais sob medida' },
        {
          name: 'twitter:description',
          content: 'Soluções digitais sob medida com IA, automação e apps web/mobile. Impulsione seu negócio com sistemas rápidos, modernos e escaláveis.'
        },
        { name: 'twitter:image', content: 'https://framerusercontent.com/images/u19OkEp1R8hzwiofmw2hDQyY.png' },
        { name: 'twitter:image:alt', content: 'Logo da Vale Apps' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/favicon.png', sizes: '180x180' },
        // Preload de recursos críticos
        { rel: 'preload', href: '/logo-header.png', as: 'image' },
        { rel: 'preconnect', href: 'https://framerusercontent.com' },
        { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },
        { rel: 'dns-prefetch', href: 'https://connect.facebook.net' },
        // SEO Links
        { rel: 'canonical', href: 'https://valeapps.com.br/' },
        { rel: 'sitemap', type: 'application/xml', href: '/sitemap.xml' },
        // Manifest para PWA (futuro)
        { rel: 'manifest', href: '/manifest.json' }
      ],
      script: [
        // Google Tag Manager - carregamento otimizado
        {
          innerHTML: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Carregar GTM após o load da página
            window.addEventListener('load', function() {
              (function (w, d, s, l, i) {
                w[l] = w[l] || []; 
                w[l].push({'gtm.start': new Date().getTime(), event: 'gtm.js'}); 
                var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; 
                j.async = true; 
                j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; 
                f.parentNode.insertBefore(j, f);
              })(window, document, 'script', 'dataLayer', 'GTM-PRS7FS5H');
            });
          `,
          type: 'text/javascript'
        },
        // Meta Pixel - carregamento otimizado
        {
          innerHTML: `
            window.addEventListener('load', function() {
              !function (f, b, e, v, n, t, s) {
                if (f.fbq) return; 
                n = f.fbq = function () {
                  n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n; 
                n.push = n; 
                n.loaded = !0; 
                n.version = '2.0';
                n.queue = []; 
                t = b.createElement(e); 
                t.async = !0;
                t.src = v; 
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
              }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1143371970995141');
              fbq('track', 'PageView');
            });
          `,
          type: 'text/javascript'
        },
        // Google Analytics - carregamento otimizado
        {
          innerHTML: `
            window.addEventListener('load', function() {
              var script = document.createElement('script');
              script.async = true;
              script.src = 'https://www.googletagmanager.com/gtag/js?id=G-JMXFDMLNQE';
              document.head.appendChild(script);
              
              script.onload = function() {
                gtag('config', 'G-JMXFDMLNQE');
              };
            });
          `,
          type: 'text/javascript'
        },
        // JSON-LD
        {
          innerHTML: `{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Vale Apps",
            "url": "https://valeapps.com.br",
            "logo": "https://framerusercontent.com/images/qNkZZGqsnFsa83IKgjnsMSUPI.png",
            "description": "Desenvolvemos soluções digitais sob medida com IA, automação, aplicativos web e mobile.",
            "sameAs": [
              "https://www.linkedin.com/company/valeapps",
              "https://www.instagram.com/valeapps"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+55-11-96921-0065",
              "contactType": "customer support",
              "areaServed": "BR"
            }
          }`,
          type: 'application/ld+json'
        }
      ],
      noscript: [
        // Meta Pixel noscript
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1143371970995141&ev=PageView&noscript=1" />`
        }
      ]
    }
  }
})
