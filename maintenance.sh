#!/bin/bash

# Script de maintenance pour Portfolio SaaS
# Usage: ./maintenance.sh [option]
# Options: backup, cleanup, update, health, logs, restart

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_DIR="/backups/portfolio"
LOG_DIR="/var/log/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[MAINTENANCE]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Fonction de sauvegarde
backup_data() {
    print_status "Début de la sauvegarde..."
    
    # Créer le répertoire de sauvegarde
    mkdir -p $BACKUP_DIR
    
    # Sauvegarde de la base de données
    print_status "Sauvegarde de la base de données..."
    docker exec supabase-db pg_dump -U postgres postgres > $BACKUP_DIR/db_backup_$DATE.sql
    
    # Compression
    gzip $BACKUP_DIR/db_backup_$DATE.sql
    
    # Sauvegarde des volumes Docker
    print_status "Sauvegarde des volumes Docker..."
    docker run --rm -v portfolio_db-data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/volumes_backup_$DATE.tar.gz -C /data .
    
    # Sauvegarde de la configuration
    print_status "Sauvegarde de la configuration..."
    tar czf $BACKUP_DIR/config_backup_$DATE.tar.gz \
        docker-compose.yml \
        docker-compose.prod.yml \
        .env \
        .env.local \
        next.config.js \
        tailwind.config.js \
        package.json
    
    # Nettoyage des anciennes sauvegardes (30 jours)
    find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
    find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
    
    print_success "Sauvegarde terminée: $BACKUP_DIR"
}

# Fonction de nettoyage
cleanup_system() {
    print_status "Début du nettoyage..."
    
    # Nettoyage Docker
    print_status "Nettoyage des conteneurs Docker..."
    docker system prune -f
    
    # Nettoyage des images inutilisées
    print_status "Nettoyage des images Docker..."
    docker image prune -f
    
    # Nettoyage des volumes inutilisés
    print_status "Nettoyage des volumes Docker..."
    docker volume prune -f
    
    # Nettoyage des logs
    print_status "Nettoyage des logs..."
    find /var/log -name "*.log" -mtime +7 -delete 2>/dev/null || true
    
    # Nettoyage des fichiers temporaires
    print_status "Nettoyage des fichiers temporaires..."
    find /tmp -type f -mtime +1 -delete 2>/dev/null || true
    
    print_success "Nettoyage terminé"
}

# Fonction de mise à jour
update_application() {
    print_status "Début de la mise à jour..."
    
    # Sauvegarde avant mise à jour
    backup_data
    
    # Arrêt des services
    print_status "Arrêt des services..."
    docker-compose down
    
    # Mise à jour du code (si git est disponible)
    if command -v git &> /dev/null; then
        print_status "Mise à jour du code..."
        git pull origin main
    fi
    
    # Reconstruction des images
    print_status "Reconstruction des images..."
    docker-compose build --no-cache
    
    # Redémarrage des services
    print_status "Redémarrage des services..."
    docker-compose up -d
    
    # Attente du démarrage
    sleep 30
    
    # Vérification de la santé
    health_check
    
    print_success "Mise à jour terminée"
}

# Fonction de vérification de santé
health_check() {
    print_status "Vérification de la santé de l'application..."
    
    local health_score=0
    local total_checks=5
    
    # Test de l'application principale
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Application principale: OK"
        ((health_score++))
    else
        print_error "Application principale: KO"
    fi
    
    # Test de la base de données
    if docker exec supabase-db pg_isready -U postgres > /dev/null 2>&1; then
        print_success "Base de données: OK"
        ((health_score++))
    else
        print_error "Base de données: KO"
    fi
    
    # Test de MailHog
    if curl -s http://localhost:8025 > /dev/null; then
        print_success "MailHog: OK"
        ((health_score++))
    else
        print_error "MailHog: KO"
    fi
    
    # Test de Kong
    if curl -s http://localhost:8001 > /dev/null; then
        print_success "Kong API: OK"
        ((health_score++))
    else
        print_error "Kong API: KO"
    fi
    
    # Vérification des ressources
    local memory_usage=$(docker stats --no-stream --format "{{.MemUsage}}" portfolio-app | cut -d'/' -f1 | sed 's/[^0-9.]//g')
    if (( $(echo "$memory_usage < 1000" | bc -l) )); then
        print_success "Utilisation mémoire: OK ($memory_usage MB)"
        ((health_score++))
    else
        print_warning "Utilisation mémoire élevée: $memory_usage MB"
    fi
    
    # Score de santé
    local health_percentage=$((health_score * 100 / total_checks))
    print_status "Score de santé: $health_score/$total_checks ($health_percentage%)"
    
    if [ $health_percentage -ge 80 ]; then
        print_success "Application en bonne santé"
        return 0
    else
        print_error "Application nécessite une attention"
        return 1
    fi
}

# Fonction de surveillance des logs
monitor_logs() {
    print_status "Surveillance des logs (Ctrl+C pour quitter)..."
    
    # Créer le répertoire de logs
    mkdir -p $LOG_DIR
    
    # Surveillance des logs d'erreur
    docker-compose logs -f --tail=100 2>&1 | tee $LOG_DIR/application_$DATE.log
}

# Fonction de redémarrage intelligent
restart_services() {
    print_status "Redémarrage intelligent des services..."
    
    # Vérification de la santé avant redémarrage
    if ! health_check; then
        print_warning "Problèmes détectés, redémarrage complet..."
        docker-compose down
        sleep 5
        docker-compose up -d
    else
        print_status "Redémarrage des services individuels..."
        docker-compose restart
    fi
    
    # Attente du redémarrage
    sleep 30
    
    # Vérification post-redémarrage
    if health_check; then
        print_success "Redémarrage réussi"
    else
        print_error "Problèmes persistants après redémarrage"
    fi
}

# Fonction de rapport de maintenance
generate_report() {
    print_status "Génération du rapport de maintenance..."
    
    local report_file="$LOG_DIR/maintenance_report_$DATE.txt"
    
    {
        echo "=== RAPPORT DE MAINTENANCE - $(date) ==="
        echo ""
        echo "1. STATUT DES SERVICES:"
        docker-compose ps
        echo ""
        echo "2. UTILISATION DES RESSOURCES:"
        docker stats --no-stream
        echo ""
        echo "3. ESPACE DISQUE:"
        df -h
        echo ""
        echo "4. MÉMOIRE:"
        free -h
        echo ""
        echo "5. LOGS RÉCENTS:"
        docker-compose logs --tail=50
    } > $report_file
    
    print_success "Rapport généré: $report_file"
}

# Fonction d'aide
show_help() {
    echo "Portfolio SaaS - Script de maintenance"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  backup     Créer une sauvegarde complète"
    echo "  cleanup    Nettoyer le système"
    echo "  update     Mettre à jour l'application"
    echo "  health     Vérifier la santé de l'application"
    echo "  logs       Surveiller les logs"
    echo "  restart    Redémarrer les services"
    echo "  report     Générer un rapport de maintenance"
    echo "  help       Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 backup    # Sauvegarde complète"
    echo "  $0 health    # Vérification de santé"
    echo "  $0 cleanup   # Nettoyage du système"
}

# Fonction principale
main() {
    case "${1:-help}" in
        backup)
            backup_data
            ;;
        cleanup)
            cleanup_system
            ;;
        update)
            update_application
            ;;
        health)
            health_check
            ;;
        logs)
            monitor_logs
            ;;
        restart)
            restart_services
            ;;
        report)
            generate_report
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "Commande inconnue: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# Vérifier les prérequis
if ! command -v docker &> /dev/null; then
    print_error "Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose n'est pas installé"
    exit 1
fi

# Exécution
main "$@"
