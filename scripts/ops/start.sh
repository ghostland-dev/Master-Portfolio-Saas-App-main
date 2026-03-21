#!/bin/bash

# Script de démarrage rapide pour Portfolio SaaS
# Usage: ./scripts/ops/start.sh [option]  (from repo root)
# Options: start, stop, restart, status, logs

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

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Fonction d'aide
show_help() {
    echo "Portfolio SaaS - Script de gestion"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     Démarrer tous les services"
    echo "  stop      Arrêter tous les services"
    echo "  restart   Redémarrer tous les services"
    echo "  status    Afficher le statut des services"
    echo "  logs      Afficher les logs de l'application"
    echo "  test      Exécuter les tests"
    echo "  clean     Nettoyer les conteneurs et volumes"
    echo "  help      Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 start    # Démarrer l'application"
    echo "  $0 status   # Vérifier le statut"
    echo "  $0 logs     # Voir les logs"
}

# Fonction de démarrage
start_services() {
    print_status "Démarrage des services Portfolio SaaS..."

    # Vérifier si Docker est installé
    if ! command -v docker &> /dev/null; then
        print_error "Docker n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
        exit 1
    fi

    # Démarrer les services
    docker-compose up -d

    # Attendre que les services démarrent
    print_status "Attente du démarrage des services..."
    sleep 10

    # Vérifier le statut
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Application démarrée avec succès !"
        echo ""
        echo "🌐 Accès aux services:"
        echo "   • Application: http://localhost:3000"
        echo "   • MailHog: http://localhost:8025"
        echo "   • Kong API: http://localhost:8001"
        echo "   • Supabase Studio: http://localhost:3001"
    else
        print_warning "L'application met du temps à démarrer. Vérifiez les logs avec: $0 logs"
    fi
}

# Fonction d'arrêt
stop_services() {
    print_status "Arrêt des services..."
    docker-compose down
    print_success "Services arrêtés."
}

# Fonction de redémarrage
restart_services() {
    print_status "Redémarrage des services..."
    docker-compose down
    docker-compose up -d
    print_success "Services redémarrés."
}

# Fonction de statut
show_status() {
    print_status "Statut des services:"
    echo ""
    docker-compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}"
    echo ""

    # Test de connectivité
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Application accessible sur http://localhost:3000"
    else
        print_warning "Application non accessible. Vérifiez les logs."
    fi
}

# Fonction de logs
show_logs() {
    print_status "Logs de l'application (Ctrl+C pour quitter):"
    docker-compose logs -f app
}

# Fonction de tests
run_tests() {
    print_status "Exécution des tests..."

    # Tests unitaires
    print_status "Tests unitaires..."
    npm test -- --passWithNoTests --watchAll=false || print_warning "Certains tests ont échoué"

    echo ""
    print_success "Tests terminés."
}

# Fonction de nettoyage
clean_services() {
    print_status "Nettoyage des conteneurs et volumes..."

    read -p "Êtes-vous sûr de vouloir supprimer tous les conteneurs et volumes ? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Nettoyage terminé."
    else
        print_status "Nettoyage annulé."
    fi
}

# Fonction principale
main() {
    case "${1:-start}" in
        start)
            start_services
            ;;
        stop)
            stop_services
            ;;
        restart)
            restart_services
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs
            ;;
        test)
            run_tests
            ;;
        clean)
            clean_services
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

# Exécution
main "$@"
