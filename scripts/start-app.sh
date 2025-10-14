#!/bin/bash

# Script de démarrage complet de l'application avec Supabase
echo "🚀 Démarrage de l'application Portfolio SaaS avec Supabase..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f .env.local ]; then
    echo "📝 Création du fichier .env.local..."
    cp supabase.env .env.local
    echo "✅ Fichier .env.local créé. Veuillez le personnaliser selon vos besoins."
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances npm..."
    npm install
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers nécessaires..."
mkdir -p supabase/storage
mkdir -p supabase/migrations
mkdir -p supabase/functions

# Démarrer Supabase
echo "🐳 Démarrage de Supabase..."
docker-compose --env-file supabase.env up -d

# Attendre que Supabase soit prêt
echo "⏳ Attente du démarrage de Supabase..."
sleep 30

# Vérifier le statut de Supabase
echo "🔍 Vérification du statut de Supabase..."
if ! docker-compose --env-file supabase.env ps | grep -q "Up"; then
    echo "❌ Erreur lors du démarrage de Supabase"
    docker-compose --env-file supabase.env logs
    exit 1
fi

echo "✅ Supabase démarré avec succès !"

# Démarrer l'application Next.js
echo "🚀 Démarrage de l'application Next.js..."
echo ""
echo "🌐 Services disponibles :"
echo "   - Application Next.js: http://localhost:3000"
echo "   - Supabase Studio: http://localhost:3000 (port 3000 déjà utilisé par Next.js)"
echo "   - API REST: http://localhost:8000/rest/v1/"
echo "   - API Auth: http://localhost:8000/auth/v1/"
echo "   - API Realtime: http://localhost:8000/realtime/v1/"
echo "   - API Storage: http://localhost:8000/storage/v1/"
echo "   - Base de données: localhost:54322"
echo ""
echo "🔑 Clés d'API :"
echo "   - Anon Key: $(grep ANON_KEY supabase.env | cut -d'=' -f2)"
echo "   - Service Role Key: $(grep SERVICE_ROLE_KEY supabase.env | cut -d'=' -f2)"
echo ""
echo "📚 Pour arrêter l'application :"
echo "   ./scripts/stop-app.sh"
echo ""
echo "📚 Pour voir les logs :"
echo "   docker-compose --env-file supabase.env logs -f"
echo ""
echo "🎉 Application démarrée ! Ouvrez http://localhost:3000 dans votre navigateur."

# Démarrer Next.js en arrière-plan
npm run dev
