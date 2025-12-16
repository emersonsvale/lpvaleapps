#!/bin/bash

# Script de deploy com build pré-pronto para Coolify
# Vale Apps - Deploy otimizado

echo "🚀 Iniciando deploy com build pré-pronto..."

# 1. Fazer build local
echo "📦 Fazendo build local..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build local!"
    exit 1
fi

echo "✅ Build local concluído!"

# 2. Copiar arquivos para deploy
echo "📋 Preparando arquivos para deploy..."
cp Dockerfile.prebuilt Dockerfile
cp .dockerignore.prebuilt .dockerignore

# 3. Commit e push
echo "📤 Enviando para Git..."
git add .
git commit -m "deploy: build pré-pronto com arquivos estáticos funcionando

- Build feito localmente e testado
- Dockerfile otimizado para copiar apenas .output
- Arquivos estáticos incluídos e funcionando
- Deploy direto sem build no servidor"

git push

if [ $? -ne 0 ]; then
    echo "❌ Erro no push para Git!"
    exit 1
fi

echo "✅ Deploy enviado com sucesso!"
echo "🎯 Agora faça o redeploy no Coolify"
echo "📁 O container vai usar o build já pronto da pasta .output"