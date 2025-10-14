#!/bin/bash

# Script de test pour vérifier les tags Docker
echo "🔍 Test des tags Docker pour GitHub Container Registry"

# Variables
REPO_OWNER="ismail-mouyahada"
REPO_NAME="master-portfolio-saas-app-main"
IMAGE_NAME="portfolio-saas"
TAG="latest"

# Test 1: Vérifier que le nom du repository est en minuscules
echo "✅ Test 1: Vérification de la casse"
if [[ "$REPO_OWNER" =~ ^[a-z0-9-]+$ ]] && [[ "$REPO_NAME" =~ ^[a-z0-9-]+$ ]]; then
    echo "   ✅ Repository owner et name sont en minuscules"
else
    echo "   ❌ Repository owner ou name contient des majuscules"
    exit 1
fi

# Test 2: Construire le tag complet
FULL_TAG="ghcr.io/$REPO_OWNER/$REPO_NAME/$IMAGE_NAME:$TAG"
echo "✅ Test 2: Tag complet"
echo "   Tag: $FULL_TAG"

# Test 3: Vérifier la validité du tag
echo "✅ Test 3: Validation du tag"
if [[ "$FULL_TAG" =~ ^ghcr\.io/[a-z0-9-]+/[a-z0-9-]+/[a-z0-9-]+:[a-z0-9.-]+$ ]]; then
    echo "   ✅ Tag valide pour GitHub Container Registry"
else
    echo "   ❌ Tag invalide"
    exit 1
fi

# Test 4: Vérifier la longueur du tag
echo "✅ Test 4: Longueur du tag"
TAG_LENGTH=${#FULL_TAG}
if [ $TAG_LENGTH -lt 255 ]; then
    echo "   ✅ Longueur du tag OK ($TAG_LENGTH caractères)"
else
    echo "   ❌ Tag trop long ($TAG_LENGTH caractères)"
    exit 1
fi

echo "🎉 Tous les tests sont passés !"
echo "📦 Tag final: $FULL_TAG"
