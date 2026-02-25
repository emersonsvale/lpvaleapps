/**
 * Script de diag nostico para propostas
 * Execute no console do navegador para ver o status
 */

// Diagnóstico no cliente - verificar logs
console.log('=== DIAGNÓSTICO DE PROPOSTAS ===')
console.log('1. Abra a página admin/propostas e veja o console para logs')
console.log('2. Se houver propostas SEM slug, um aviso amarelo aparecerá')
console.log('3. Clique em "Corrigir agora" para corrigir automaticamente')
console.log('4. Depois, teste clicar em um link de proposta')
console.log('')
console.log('Para testar via API, execute no node/terminal:')
console.log('curl -X POST http://localhost:3000/api/admin/fix-proposta-slugs')
