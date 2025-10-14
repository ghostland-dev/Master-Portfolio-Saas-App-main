#!/bin/bash

# Script de déploiement optimisé
# Usage: ./scripts/deploy.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="portfolio-saas-app"
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi
    
    log_success "Prérequis vérifiés"
}

# Nettoyage des ressources
cleanup() {
    log_info "Nettoyage des ressources..."
    
    # Arrêter les conteneurs existants
    docker-compose down --remove-orphans 2>/dev/null || true
    
    # Nettoyer les images inutilisées
    docker image prune -f
    
    # Nettoyer les volumes inutilisés
    docker volume prune -f
    
    log_success "Nettoyage terminé"
}

# Build optimisé
build_application() {
    log_info "Construction de l'application..."
    
    # Build avec cache
    docker-compose build --parallel --no-cache app
    
    log_success "Construction terminée"
}

# Déploiement
deploy() {
    log_info "Déploiement en cours..."
    
    # Démarrer les services
    docker-compose up -d
    
    # Attendre que les services soient prêts
    log_info "Attente du démarrage des services..."
    sleep 30
    
    # Vérifier la santé des services
    if command -v node &> /dev/null; then
        node monitoring/health-check.js
    else
        log_warning "Node.js non disponible, vérification manuelle requise"
    fi
    
    log_success "Déploiement terminé"
}

# Vérification post-déploiement
post_deployment_check() {
    log_info "Vérification post-déploiement..."
    
    # Test de l'application
    if curl -f -s http://localhost:3000 > /dev/null; then
        log_success "Application accessible"
    else
        log_error "Application non accessible"
        exit 1
    fi
    
    # Test de l'API Supabase
    if curl -f -s http://localhost:8001/rest/v1/ > /dev/null; then
        log_success "API Supabase accessible"
    else
        log_warning "API Supabase non accessible"
    fi
    
    # Test de MailHog
    if curl -f -s http://localhost:8025 > /dev/null; then
        log_success "MailHog accessible"
    else
        log_warning "MailHog non accessible"
    fi
}

# Affichage des informations
show_info() {
    log_info "Informations de déploiement:"
    echo "  - Environnement: $ENVIRONMENT"
    echo "  - Application: http://localhost:3000"
    echo "  - Supabase Studio: http://localhost:3001"
    echo "  - MailHog: http://localhost:8025"
    echo "  - API Supabase: http://localhost:8001"
}

# Fonction principale
main() {
    log_info "Déploiement de $PROJECT_NAME en mode $ENVIRONMENT"
    
    check_prerequisites
    cleanup
    build_application
    deploy
    post_deployment_check
    show_info
    
    log_success "Déploiement réussi! 🎉"
}

# Gestion des erreurs
trap 'log_error "Déploiement échoué!"; exit 1' ERR

# Exécution
main "$@"
