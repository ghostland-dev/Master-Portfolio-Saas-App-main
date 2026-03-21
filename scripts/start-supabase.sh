#!/bin/bash

# Script de démarrage pour Supabase avec Docker
echo "🚀 Démarrage de Supabase avec Docker..."

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

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f .env.local ]; then
    echo "📝 Création du fichier .env.local..."
    cp backend/supabase.env .env.local
    echo "✅ Fichier .env.local créé. Veuillez le personnaliser selon vos besoins."
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers nécessaires..."
mkdir -p supabase/storage
mkdir -p supabase/migrations
mkdir -p supabase/functions

# Démarrer les services Supabase
echo "🐳 Démarrage des services Docker..."
docker compose --env-file backend/supabase.env up -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier le statut des services
echo "🔍 Vérification du statut des services..."
docker-compose ps

echo ""
echo "✅ Supabase est maintenant démarré !"
echo ""
echo "🌐 Services disponibles :"
echo "   - Supabase Studio: http://localhost:3000"
echo "   - API REST: http://localhost:8000/rest/v1/"
echo "   - API Auth: http://localhost:8000/auth/v1/"
echo "   - API Realtime: http://localhost:8000/realtime/v1/"
echo "   - API Storage: http://localhost:8000/storage/v1/"
echo "   - Base de données: localhost:54322"
echo ""
echo "🔑 Clés d'API :"
echo "   - Anon Key: $(grep ANON_KEY backend/supabase.env | cut -d'=' -f2)"
echo "   - Service Role Key: $(grep SERVICE_ROLE_KEY backend/supabase.env | cut -d'=' -f2)"
echo ""
echo "📚 Pour arrêter les services :"
echo "   docker-compose down"
echo ""
echo "📚 Pour voir les logs :"
echo "   docker-compose logs -f"
echo ""
echo "🎉 Bon développement !"
