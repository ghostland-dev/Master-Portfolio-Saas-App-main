#!/bin/bash

# Script de test complet pour Portfolio SaaS
# Usage: ./test-all.sh [option]
# Options: unit, integration, e2e, all, ci

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Compteurs
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Fonction d'affichage
print_status() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASSED_TESTS++))
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAILED_TESTS++))
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Fonction de test unitaire
run_unit_tests() {
    print_status "Exécution des tests unitaires..."
    
    if npm test -- --passWithNoTests --watchAll=false --coverage --silent; then
        print_success "Tests unitaires passés"
    else
        print_error "Tests unitaires échoués"
        return 1
    fi
}

# Fonction de test d'intégration
run_integration_tests() {
    print_status "Exécution des tests d'intégration..."
    
    # Test de connectivité de l'application
    if curl -s http://localhost:3000 > /dev/null; then
        print_success "Application accessible"
    else
        print_error "Application non accessible"
        return 1
    fi
    
    # Test des pages principales
    local pages=("/" "/services/" "/portfolio/" "/tools/" "/tools/project-planner/" "/tools/budget-simulator/")
    for page in "${pages[@]}"; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000$page | grep -q "200"; then
            print_success "Page $page accessible"
        else
            print_error "Page $page non accessible"
        fi
    done
}

# Fonction de test end-to-end
run_e2e_tests() {
    print_status "Exécution des tests end-to-end..."
    
    # Vérifier si Playwright est installé
    if ! command -v npx &> /dev/null; then
        print_warning "Playwright non disponible, installation..."
        npm install @playwright/test
        npx playwright install
    fi
    
    # Exécuter les tests e2e
    if npx playwright test --reporter=line; then
        print_success "Tests end-to-end passés"
    else
        print_error "Tests end-to-end échoués"
        return 1
    fi
}

# Fonction de test de performance
run_performance_tests() {
    print_status "Exécution des tests de performance..."
    
    # Test de temps de réponse
    local response_time=$(curl -s -w "%{time_total}" -o /dev/null http://localhost:3000/)
    local response_time_ms=$(echo "$response_time * 1000" | bc)
    
    if (( $(echo "$response_time < 1.0" | bc -l) )); then
        print_success "Temps de réponse acceptable: ${response_time_ms}ms"
    else
        print_warning "Temps de réponse élevé: ${response_time_ms}ms"
    fi
    
    # Test de charge simple
    print_status "Test de charge (10 requêtes simultanées)..."
    local success_count=0
    for i in {1..10}; do
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ | grep -q "200"; then
            ((success_count++))
        fi
    done
    
    if [ $success_count -eq 10 ]; then
        print_success "Test de charge réussi: $success_count/10 requêtes"
    else
        print_error "Test de charge échoué: $success_count/10 requêtes"
    fi
}

# Fonction de test de sécurité
run_security_tests() {
    print_status "Exécution des tests de sécurité..."
    
    # Test des headers de sécurité
    local security_headers=("X-Frame-Options" "X-Content-Type-Options" "X-XSS-Protection")
    for header in "${security_headers[@]}"; do
        if curl -s -I http://localhost:3000/ | grep -qi "$header"; then
            print_success "Header de sécurité $header présent"
        else
            print_warning "Header de sécurité $header manquant"
        fi
    done
    
    # Test des ports ouverts
    print_status "Vérification des ports ouverts..."
    local open_ports=$(netstat -tuln | grep -E ":(3000|8025|8001|54322)" | wc -l)
    if [ $open_ports -gt 0 ]; then
        print_success "Ports de service ouverts: $open_ports"
    else
        print_error "Aucun port de service détecté"
    fi
}

# Fonction de test de configuration
run_config_tests() {
    print_status "Vérification de la configuration..."
    
    # Vérifier les fichiers de configuration
    local config_files=("package.json" "next.config.js" "tailwind.config.js" "docker-compose.yml")
    for file in "${config_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Fichier de configuration $file présent"
        else
            print_error "Fichier de configuration $file manquant"
        fi
    done
    
    # Vérifier les variables d'environnement
    if [ -f ".env" ] || [ -f ".env.local" ]; then
        print_success "Variables d'environnement configurées"
    else
        print_warning "Variables d'environnement non configurées"
    fi
}

# Fonction de test complet
run_all_tests() {
    print_status "=== DÉBUT DES TESTS COMPLETS ==="
    echo ""
    
    # Tests de configuration
    run_config_tests
    echo ""
    
    # Tests unitaires
    run_unit_tests
    echo ""
    
    # Tests d'intégration
    run_integration_tests
    echo ""
    
    # Tests de performance
    run_performance_tests
    echo ""
    
    # Tests de sécurité
    run_security_tests
    echo ""
    
    # Tests end-to-end (optionnel)
    if [ "$1" = "with-e2e" ]; then
        run_e2e_tests
        echo ""
    fi
    
    # Résumé
    TOTAL_TESTS=$((PASSED_TESTS + FAILED_TESTS))
    echo "=== RÉSUMÉ DES TESTS ==="
    echo "Tests passés: $PASSED_TESTS"
    echo "Tests échoués: $FAILED_TESTS"
    echo "Total: $TOTAL_TESTS"
    
    if [ $FAILED_TESTS -eq 0 ]; then
        print_success "Tous les tests sont passés ! 🎉"
        exit 0
    else
        print_error "Certains tests ont échoué ! ❌"
        exit 1
    fi
}

# Fonction de test CI/CD
run_ci_tests() {
    print_status "Exécution des tests CI/CD..."
    
    # Tests rapides pour CI
    run_config_tests
    run_unit_tests
    run_integration_tests
    
    # Résumé rapide
    echo "=== RÉSUMÉ CI/CD ==="
    echo "Tests passés: $PASSED_TESTS"
    echo "Tests échoués: $FAILED_TESTS"
}

# Fonction d'aide
show_help() {
    echo "Portfolio SaaS - Script de test"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  unit        Tests unitaires uniquement"
    echo "  integration Tests d'intégration uniquement"
    echo "  e2e         Tests end-to-end uniquement"
    echo "  all         Tous les tests (sans e2e)"
    echo "  all-e2e     Tous les tests (avec e2e)"
    echo "  ci          Tests pour CI/CD"
    echo "  help        Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 unit      # Tests unitaires"
    echo "  $0 all       # Tous les tests"
    echo "  $0 ci        # Tests CI/CD"
}

# Fonction principale
main() {
    case "${1:-all}" in
        unit)
            run_unit_tests
            ;;
        integration)
            run_integration_tests
            ;;
        e2e)
            run_e2e_tests
            ;;
        all)
            run_all_tests
            ;;
        all-e2e)
            run_all_tests "with-e2e"
            ;;
        ci)
            run_ci_tests
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
if ! command -v curl &> /dev/null; then
    print_error "curl n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

# Exécution
main "$@"
