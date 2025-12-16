#!/usr/bin/env node

/**
 * Script para testar performance do site Vale Apps
 * Executa análises de bundle size, lighthouse e métricas de carregamento
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Iniciando análise de performance...\n');

// 1. Análise do bundle size
console.log('📦 Analisando tamanho do bundle...');
try {
    // Verificar tamanho dos arquivos gerados
    const outputDir = path.join(process.cwd(), '.output/public/_nuxt');
    if (fs.existsSync(outputDir)) {
        const files = fs.readdirSync(outputDir);
        const jsFiles = files.filter(f => f.endsWith('.js'));
        const cssFiles = files.filter(f => f.endsWith('.css'));

        console.log('\n📊 Tamanhos dos arquivos:');

        let totalJSSize = 0;
        let totalCSSSize = 0;

        jsFiles.forEach(file => {
            const filePath = path.join(outputDir, file);
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            totalJSSize += stats.size;
            console.log(`  JS: ${file} - ${sizeKB} KB`);
        });

        cssFiles.forEach(file => {
            const filePath = path.join(outputDir, file);
            const stats = fs.statSync(filePath);
            const sizeKB = (stats.size / 1024).toFixed(2);
            totalCSSSize += stats.size;
            console.log(`  CSS: ${file} - ${sizeKB} KB`);
        });

        console.log(`\n📈 Total JS: ${(totalJSSize / 1024).toFixed(2)} KB`);
        console.log(`📈 Total CSS: ${(totalCSSSize / 1024).toFixed(2)} KB`);
        console.log(`📈 Total Bundle: ${((totalJSSize + totalCSSSize) / 1024).toFixed(2)} KB`);
    } else {
        console.log('❌ Diretório de build não encontrado. Execute npm run build primeiro.');
    }
} catch (error) {
    console.error('❌ Erro na análise do bundle:', error.message);
}

// 2. Verificar otimizações implementadas
console.log('\n🔍 Verificando otimizações implementadas...');

const optimizations = [
    {
        name: 'Lazy Loading de Bibliotecas',
        files: ['app/components/ui/DarkVeil.vue', 'app/components/ui/CardSwap.vue'],
        check: (content) => content.includes('loadLibrary') || content.includes('await import')
    },
    {
        name: 'Componentes Assíncronos',
        files: ['app/pages/index.vue'],
        check: (content) => content.includes('defineAsyncComponent')
    },
    {
        name: 'Otimização de Imagens',
        files: ['app/components/ui/StickyScrollCards.vue'],
        check: (content) => content.includes('loading="lazy"') && content.includes('srcset')
    },
    {
        name: 'Scripts Otimizados',
        files: ['nuxt.config.ts'],
        check: (content) => content.includes('window.addEventListener(\'load\'')
    },
    {
        name: 'Composables de Performance',
        files: ['app/composables/useLazyLibrary.ts', 'app/composables/useImageOptimization.ts'],
        check: () => true
    }
];

optimizations.forEach(opt => {
    const implemented = opt.files.every(file => {
        if (!fs.existsSync(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        return opt.check(content);
    });

    console.log(`  ${implemented ? '✅' : '❌'} ${opt.name}`);
});

// 3. Recomendações de teste
console.log('\n📋 Próximos passos para testar:');
console.log('  1. Execute: npm run preview');
console.log('  2. Teste no Google PageSpeed Insights: https://pagespeed.web.dev/');
console.log('  3. Use Chrome DevTools > Lighthouse');
console.log('  4. Monitore Web Vitals no console do navegador');
console.log('  5. Teste em dispositivos móveis');

console.log('\n🎯 Métricas alvo:');
console.log('  • FCP (First Contentful Paint): < 1.8s');
console.log('  • LCP (Largest Contentful Paint): < 2.5s');
console.log('  • CLS (Cumulative Layout Shift): < 0.1');
console.log('  • FID (First Input Delay): < 100ms');
console.log('  • Performance Score: > 90');

console.log('\n✨ Análise concluída!');