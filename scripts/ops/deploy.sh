#!/bin/bash

# Script de déploiement automatisé pour Portfolio SaaS
# Usage: ./scripts/ops/deploy.sh [environment]
# Environments: dev, staging, prod

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$REPO_ROOT"

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-dev}
DEPLOY_DIR="/opt/portfolio-saas"
BACKUP_DIR="/backups/portfolio"
LOG_FILE="/var/log/portfolio/deploy_$(date +%Y%m%d_%H%M%S).log"

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[DEPLOY]${NC} $1" | tee -a $LOG_FILE
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Fonction de vérification des prérequis
check_prerequisites() {
    print_status "Vérification des prérequis..."

    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé"
        exit 1
    fi

    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé"
        exit 1
    fi

    # Vérifier Git
    if ! command -v git &> /dev/null; then
        print_error "Git n'est pas installé"
        exit 1
    fi

    # Vérifier l'espace disque
    local available_space=$(df / | awk 'NR==2 {print $4}')
    if [ $available_space -lt 1000000 ]; then
        print_error "Espace disque insuffisant (minimum 1GB requis)"
        exit 1
    fi

    print_success "Prérequis vérifiés"
}

# Fonction de sauvegarde
backup_current() {
    print_status "Sauvegarde de la version actuelle..."

    # Créer le répertoire de sauvegarde
    mkdir -p $BACKUP_DIR

    # Sauvegarde de la base de données
    if docker ps | grep -q supabase-db; then
        print_status "Sauvegarde de la base de données..."
        docker exec supabase-db pg_dump -U postgres postgres > $BACKUP_DIR/db_backup_$(date +%Y%m%d_%H%M%S).sql
    fi

    # Sauvegarde des volumes
    print_status "Sauvegarde des volumes Docker..."
    docker run --rm -v portfolio_db-data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes_backup_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .

    print_success "Sauvegarde terminée"
}

# Fonction de déploiement en développement
deploy_dev() {
    print_status "Déploiement en environnement de développement..."

    # Arrêter les services existants
    docker-compose down 2>/dev/null || true

    # Mise à jour du code
    if [ -d ".git" ]; then
        print_status "Mise à jour du code..."
        git pull origin main
    fi

    # Reconstruction des images
    print_status "Reconstruction des images..."
    docker-compose build --no-cache

    # Démarrage des services
    print_status "Démarrage des services..."
    docker-compose up -d

    # Attente du démarrage
    print_status "Attente du démarrage des services..."
    sleep 30

    # Vérification de la santé
    health_check

    print_success "Déploiement en développement terminé"
}

# Fonction de déploiement en staging
deploy_staging() {
    print_status "Déploiement en environnement de staging..."

    # Configuration staging
    export NODE_ENV=staging
    export NEXT_PUBLIC_SUPABASE_URL=http://staging.domain.com

    # Arrêter les services existants
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

    # Mise à jour du code
    if [ -d ".git" ]; then
        print_status "Mise à jour du code..."
        git pull origin develop
    fi

    # Reconstruction des images
    print_status "Reconstruction des images..."
    docker-compose -f docker-compose.prod.yml build --no-cache

    # Démarrage des services
    print_status "Démarrage des services..."
    docker-compose -f docker-compose.prod.yml up -d

    # Attente du démarrage
    print_status "Attente du démarrage des services..."
    sleep 60

    # Vérification de la santé
    health_check

    print_success "Déploiement en staging terminé"
}

# Fonction de déploiement en production
deploy_prod() {
    print_status "Déploiement en environnement de production..."

    # Confirmation pour la production
    read -p "Êtes-vous sûr de vouloir déployer en production ? (yes/no): " -r
    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        print_warning "Déploiement en production annulé"
        exit 0
    fi

    # Sauvegarde complète
    backup_current

    # Configuration production
    export NODE_ENV=production
    export NEXT_PUBLIC_SUPABASE_URL=https://domain.com

    # Arrêter les services existants
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

    # Mise à jour du code
    if [ -d ".git" ]; then
        print_status "Mise à jour du code..."
        git pull origin main
    fi

    # Reconstruction des images
    print_status "Reconstruction des images..."
    docker-compose -f docker-compose.prod.yml build --no-cache

    # Démarrage des services
    print_status "Démarrage des services..."
    docker-compose -f docker-compose.prod.yml up -d

    # Attente du démarrage
    print_status "Attente du démarrage des services..."
    sleep 90

    # Vérification de la santé
    health_check

    # Test de charge
    load_test

    print_success "Déploiement en production terminé"
}

# Fonction de vérification de santé
health_check() {
    print_status "Vérification de la santé de l'application..."

    local max_attempts=30
    local attempt=0

    while [ $attempt -lt $max_attempts ]; do
        if curl -s http://localhost:3000 > /dev/null; then
            print_success "Application accessible"
            return 0
        fi

        print_status "Tentative $((attempt + 1))/$max_attempts..."
        sleep 10
        ((attempt++))
    done

    print_error "Application non accessible après $max_attempts tentatives"
    return 1
}

# Fonction de test de charge
load_test() {
    print_status "Test de charge..."

    local success_count=0
    local total_requests=20

    for i in $(seq 1 $total_requests); do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
            ((success_count++))
        fi
        sleep 0.5
    done

    local success_rate=$((success_count * 100 / total_requests))

    if [ $success_rate -ge 95 ]; then
        print_success "Test de charge réussi: $success_count/$total_requests ($success_rate%)"
    else
        print_error "Test de charge échoué: $success_count/$total_requests ($success_rate%)"
        return 1
    fi
}

# Fonction de rollback
rollback() {
    print_status "Rollback vers la version précédente..."

    # Arrêter les services actuels
    docker-compose down 2>/dev/null || true
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

    # Restaurer la base de données
    local latest_backup=$(ls -t $BACKUP_DIR/db_backup_*.sql 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
        print_status "Restauration de la base de données..."
        docker-compose up -d db
        sleep 30
        docker exec -i supabase-db psql -U postgres postgres < $latest_backup
    fi

    # Redémarrer les services
    if [ "$ENVIRONMENT" = "prod" ]; then
        docker-compose -f docker-compose.prod.yml up -d
    else
        docker-compose up -d
    fi

    print_success "Rollback terminé"
}

# Fonction de nettoyage
cleanup() {
    print_status "Nettoyage des ressources..."

    # Nettoyage des images inutilisées
    docker image prune -f

    # Nettoyage des conteneurs arrêtés
    docker container prune -f

    # Nettoyage des volumes inutilisés
    docker volume prune -f

    print_success "Nettoyage terminé"
}

# Fonction d'aide
show_help() {
    echo "Portfolio SaaS - Script de déploiement"
    echo ""
    echo "Usage: $0 [ENVIRONMENT]"
    echo ""
    echo "Environments:"
    echo "  dev       Déploiement en développement"
    echo "  staging   Déploiement en staging"
    echo "  prod      Déploiement en production"
    echo ""
    echo "Exemples:"
    echo "  $0 dev      # Déploiement en développement"
    echo "  $0 staging  # Déploiement en staging"
    echo "  $0 prod     # Déploiement en production"
    echo ""
    echo "Commandes spéciales:"
    echo "  $0 rollback # Rollback vers la version précédente"
    echo "  $0 cleanup  # Nettoyage des ressources"
}

# Fonction principale
main() {
    # Créer le répertoire de logs
    mkdir -p $(dirname $LOG_FILE)

    print_status "Début du déploiement - Environnement: $ENVIRONMENT"
    print_status "Log: $LOG_FILE"

    case "$ENVIRONMENT" in
        dev)
            check_prerequisites
            deploy_dev
            cleanup
            ;;
        staging)
            check_prerequisites
            backup_current
            deploy_staging
            cleanup
            ;;
        prod)
            check_prerequisites
            deploy_prod
            cleanup
            ;;
        rollback)
            rollback
            ;;
        cleanup)
            cleanup
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Environnement inconnu: $ENVIRONMENT"
            echo ""
            show_help
            exit 1
            ;;
    esac

    print_success "Déploiement terminé avec succès !"
}

# Exécution
main "$@"
