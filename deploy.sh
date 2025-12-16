#!/bin/bash

# Script de Deploy Automatizado - Vale Apps
# Para uso com Coolify ou deploy manual

set -e

echo "🚀 Iniciando deploy do Vale Apps..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado!"
fi

# Verificar se docker-compose está instalado
if ! command -v docker-compose &> /dev/null; then
    warn "docker-compose não encontrado, tentando usar 'docker compose'"
    DOCKER_COMPOSE="docker compose"
else
    DOCKER_COMPOSE="docker-compose"
fi

# Função para build local
build_local() {
    log "🔨 Fazendo build local..."
    
    # Instalar dependências
    log "📦 Instalando dependências..."
    npm ci
    
    # Fazer build
    log "🏗️ Executando build..."
    npm run build
    
    # Testar build
    log "🧪 Testando build..."
    npm run preview &
    PREVIEW_PID=$!
    
    sleep 5
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "✅ Build testado com sucesso!"
        kill $PREVIEW_PID
    else
        error "❌ Falha no teste do build!"
    fi
}

# Função para build Docker
build_docker() {
    log "🐳 Fazendo build Docker..."
    
    # Build da imagem
    docker build -t vale-apps:latest .
    
    # Testar container
    log "🧪 Testando container Docker..."
    docker run -d --name vale-apps-test -p 3001:3000 vale-apps:latest
    
    sleep 10
    
    if curl -f http://localhost:3001 > /dev/null 2>&1; then
        log "✅ Container testado com sucesso!"
        docker stop vale-apps-test
        docker rm vale-apps-test
    else
        docker stop vale-apps-test
        docker rm vale-apps-test
        error "❌ Falha no teste do container!"
    fi
}

# Função para deploy com docker-compose
deploy_compose() {
    log "🚀 Fazendo deploy com docker-compose..."
    
    # Parar containers existentes
    $DOCKER_COMPOSE down
    
    # Build e start
    $DOCKER_COMPOSE up --build -d
    
    # Verificar se está rodando
    sleep 10
    
    if curl -f http://localhost:3000 > /dev/null 2>&1; then
        log "✅ Deploy realizado com sucesso!"
        log "🌐 Aplicação disponível em: http://localhost:3000"
    else
        error "❌ Falha no deploy!"
    fi
}

# Função para mostrar logs
show_logs() {
    log "📋 Mostrando logs da aplicação..."
    $DOCKER_COMPOSE logs -f vale-apps
}

# Função para análise de performance
performance_check() {
    log "📊 Executando análise de performance..."
    
    if [ -f "scripts/test-performance.js" ]; then
        npm run test:performance
    else
        warn "Script de performance não encontrado"
    fi
}

# Menu principal
case "${1:-help}" in
    "build")
        build_local
        ;;
    "docker")
        build_docker
        ;;
    "deploy")
        deploy_compose
        ;;
    "logs")
        show_logs
        ;;
    "performance")
        performance_check
        ;;
    "full")
        log "🎯 Deploy completo..."
        build_local
        build_docker
        deploy_compose
        performance_check
        ;;
    "help"|*)
        echo -e "${BLUE}"
        echo "🚀 Script de Deploy - Vale Apps"
        echo ""
        echo "Uso: ./deploy.sh [comando]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  build       - Build local (npm)"
        echo "  docker      - Build Docker image"
        echo "  deploy      - Deploy com docker-compose"
        echo "  logs        - Mostrar logs da aplicação"
        echo "  performance - Análise de performance"
        echo "  full        - Deploy completo (build + docker + deploy + performance)"
        echo "  help        - Mostrar esta ajuda"
        echo ""
        echo "Exemplos:"
        echo "  ./deploy.sh build"
        echo "  ./deploy.sh docker"
        echo "  ./deploy.sh deploy"
        echo "  ./deploy.sh full"
        echo -e "${NC}"
        ;;
esac

log "✨ Script finalizado!"