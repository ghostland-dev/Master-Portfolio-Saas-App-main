#!/bin/bash

# Script pour exécuter tous les tests
set -e

echo "🧪 Démarrage de la suite de tests complète..."

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    error "npm n'est pas installé"
    exit 1
fi

log "Installation des dépendances..."
npm ci

# Tests unitaires
log "🧪 Exécution des tests unitaires..."
if npm run test:unit; then
    success "Tests unitaires réussis"
else
    error "Tests unitaires échoués"
    exit 1
fi

# Tests d'intégration
log "🔗 Exécution des tests d'intégration..."
if npm run test:integration; then
    success "Tests d'intégration réussis"
else
    error "Tests d'intégration échoués"
    exit 1
fi

# Tests E2E
log "🌐 Exécution des tests end-to-end..."
if npm run test:e2e; then
    success "Tests E2E réussis"
else
    error "Tests E2E échoués"
    exit 1
fi

# Rapport de couverture
log "📊 Génération du rapport de couverture..."
npm run test:coverage

success "🎉 Tous les tests sont passés avec succès!"

# Afficher le résumé
echo ""
echo "📋 Résumé des tests:"
echo "- Tests unitaires: ✅"
echo "- Tests d'intégration: ✅"
echo "- Tests E2E: ✅"
echo "- Couverture de code: 📊 (voir coverage/lcov-report/index.html)"
echo ""
echo "🚀 L'application est prête pour le déploiement!"
