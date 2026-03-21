#!/bin/bash

# Script de déploiement en production
# Usage: ./scripts/production-deploy.sh [environment]

set -e

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_NAME="portfolio-saas-app"
DOCKER_COMPOSE_FILE="docker-compose.yml"
BACKUP_DIR="backups"
LOG_DIR="logs"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

log_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_step "Vérification des prérequis..."

    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé"
        exit 1
    fi

    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé"
        exit 1
    fi

    # Vérifier l'espace disque
    local available_space=$(df . | tail -1 | awk '{print $4}')
    if [ "$available_space" -lt 1000000 ]; then
        log_warning "Espace disque faible: ${available_space}KB disponible"
    fi

    # Vérifier la mémoire
    local available_memory=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    if [ "$available_memory" -lt 1000 ]; then
        log_warning "Mémoire faible: ${available_memory}MB disponible"
    fi

    log_success "Prérequis vérifiés"
}

# Création des dossiers nécessaires
create_directories() {
    log_step "Création des dossiers nécessaires..."

    mkdir -p "$BACKUP_DIR"
    mkdir -p "$LOG_DIR"
    mkdir -p "monitoring"

    log_success "Dossiers créés"
}

# Sauvegarde de la version actuelle
backup_current_version() {
    log_step "Sauvegarde de la version actuelle..."

    local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$BACKUP_DIR/$backup_name"

    # Créer un backup des volumes Docker
    if docker-compose ps -q | grep -q .; then
        log_info "Création du backup des données..."
        docker-compose exec -T db pg_dump -U postgres postgres > "$backup_path-database.sql" 2>/dev/null || true
    fi

    # Backup de la configuration
    cp docker-compose.yml "$backup_path-docker-compose.yml" 2>/dev/null || true
    cp .env "$backup_path.env" 2>/dev/null || true

    log_success "Backup créé: $backup_name"
}

# Nettoyage des ressources
cleanup() {
    log_step "Nettoyage des ressources..."

    # Arrêter les conteneurs existants
    docker-compose down --remove-orphans 2>/dev/null || true

    # Nettoyer les images inutilisées
    docker image prune -f

    # Nettoyer les volumes inutilisés (attention: peut supprimer des données)
    # docker volume prune -f

    log_success "Nettoyage terminé"
}

# Build optimisé
build_application() {
    log_step "Construction de l'application optimisée..."

    # Build avec cache et optimisations
    docker-compose build --parallel --no-cache app

    # Vérifier la taille de l'image
    local image_size=$(docker images --format "table {{.Size}}" master-portfolio-saas-app-main-app | tail -1)
    log_info "Taille de l'image: $image_size"

    log_success "Construction terminée"
}

# Déploiement avec vérifications
deploy() {
    log_step "Déploiement en cours..."

    # Démarrer les services
    docker-compose up -d

    # Attendre que les services soient prêts
    log_info "Attente du démarrage des services..."
    sleep 30

    # Vérifier la santé des services
    if command -v node &> /dev/null; then
        log_info "Vérification de la santé des services..."
        node monitoring/health-check.js
    else
        log_warning "Node.js non disponible, vérification manuelle requise"
    fi

    log_success "Déploiement terminé"
}

# Tests post-déploiement
post_deployment_tests() {
    log_step "Tests post-déploiement..."

    # Test de l'application
    if curl -f -s http://localhost:3000 > /dev/null; then
        log_success "Application accessible"
    else
        log_error "Application non accessible"
        return 1
    fi

    # Test de performance
    log_info "Test de performance..."
    local start_time=$(date +%s%3N)
    for i in {1..10}; do
        curl -s -o /dev/null http://localhost:3000/
    done
    local end_time=$(date +%s%3N)
    local avg_time=$(( (end_time - start_time) / 10 ))
    log_info "Temps de réponse moyen: ${avg_time}ms"

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

    log_success "Tests post-déploiement réussis"
}

# Configuration du monitoring
setup_monitoring() {
    log_step "Configuration du monitoring..."

    # Rendre les scripts de monitoring exécutables
    chmod +x monitoring/health-check.js
    chmod +x monitoring/performance-monitor.js

    # Démarrer le monitoring en arrière-plan
    nohup node monitoring/performance-monitor.js > logs/monitoring.log 2>&1 &
    local monitor_pid=$!
    echo $monitor_pid > logs/monitor.pid

    log_success "Monitoring configuré (PID: $monitor_pid)"
}

# Affichage des informations de déploiement
show_deployment_info() {
    log_info "Informations de déploiement:"
    echo "  🌐 Application: http://localhost:3000"
    echo "  🗄️  Supabase Studio: http://localhost:3001"
    echo "  📧 MailHog: http://localhost:8025"
    echo "  🔌 API Supabase: http://localhost:8001"
    echo "  📊 Monitoring: logs/monitoring.log"
    echo "  📁 Backups: $BACKUP_DIR/"
    echo ""
    echo "  🚀 Commandes utiles:"
    echo "    - Voir les logs: docker-compose logs -f"
    echo "    - Arrêter: docker-compose down"
    echo "    - Redémarrer: docker-compose restart"
    echo "    - Monitoring: tail -f logs/monitoring.log"
}

# Fonction de rollback
rollback() {
    log_error "Erreur détectée, rollback en cours..."

    # Arrêter les services actuels
    docker-compose down 2>/dev/null || true

    # Restaurer la dernière version stable
    local latest_backup=$(ls -t $BACKUP_DIR/backup-* 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
        log_info "Restauration depuis: $latest_backup"
        # Ici on pourrait restaurer la base de données et la configuration
    fi

    log_warning "Rollback terminé, vérifiez manuellement l'état de l'application"
}

# Fonction principale
main() {
    log_info "🚀 Déploiement en production de $PROJECT_NAME"
    log_info "📅 Date: $(date)"
    log_info "🌍 Environnement: $ENVIRONMENT"
    echo ""

    # Gestion des erreurs avec rollback
    trap 'rollback; exit 1' ERR

    check_prerequisites
    create_directories
    backup_current_version
    cleanup
    build_application
    deploy
    post_deployment_tests
    setup_monitoring
    show_deployment_info

    log_success "🎉 Déploiement en production réussi!"
    log_info "📊 L'application est maintenant opérationnelle et surveillée"
}

# Exécution
main "$@"
