#!/bin/bash

# Script de déploiement Vercel
# Usage: ./scripts/deploy-vercel.sh

set -euo pipefail

echo "🚀 Déploiement sur Vercel..."

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé"
    echo "📦 Installation de Vercel CLI..."
    npm install -g vercel
fi

# Vérifier que l'utilisateur est connecté
if ! vercel whoami &> /dev/null; then
    echo "🔐 Connexion à Vercel..."
    vercel login
fi

# Build de l'application
echo "🔨 Construction de l'application..."
npm run build

# Déploiement
echo "🚀 Déploiement en cours..."
vercel --prod

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est disponible sur Vercel"
