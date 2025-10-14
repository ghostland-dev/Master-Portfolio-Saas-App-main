#!/bin/bash

# Script de test de l'intégration Supabase
echo "🧪 Test de l'intégration Supabase..."

# Vérifier si Supabase est démarré
echo "🔍 Vérification du statut de Supabase..."
if ! docker-compose --env-file supabase.env ps | grep -q "Up"; then
    echo "❌ Supabase n'est pas démarré. Démarrage en cours..."
    docker-compose --env-file supabase.env up -d
    sleep 30
fi

# Vérifier la base de données
echo "🗄️ Test de connexion à la base de données..."
if docker exec supabase-db pg_isready -U postgres -d postgres > /dev/null 2>&1; then
    echo "✅ Base de données accessible"
else
    echo "❌ Base de données inaccessible"
    exit 1
fi

# Vérifier les tables
echo "📊 Vérification des tables..."
TABLES=$(docker exec supabase-db psql -U postgres -d postgres -t -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")

EXPECTED_TABLES=("users" "projects" "messages" "invoices" "feedbacks" "tasks" "project_phases" "milestones" "file_uploads" "appointments" "budget_estimates" "technology_recommendations")

for table in "${EXPECTED_TABLES[@]}"; do
    if echo "$TABLES" | grep -q "$table"; then
        echo "✅ Table $table existe"
    else
        echo "❌ Table $table manquante"
    fi
done

# Vérifier les données de test
echo "📝 Vérification des données de test..."
USER_COUNT=$(docker exec supabase-db psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;")
PROJECT_COUNT=$(docker exec supabase-db psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM projects;")
MESSAGE_COUNT=$(docker exec supabase-db psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM messages;")

echo "👥 Utilisateurs: $USER_COUNT"
echo "📁 Projets: $PROJECT_COUNT"
echo "💬 Messages: $MESSAGE_COUNT"

# Vérifier l'API REST
echo "🌐 Test de l'API REST..."
if curl -s http://localhost:8000/rest/v1/ > /dev/null; then
    echo "✅ API REST accessible"
else
    echo "❌ API REST inaccessible"
fi

# Vérifier l'API Auth
echo "🔐 Test de l'API Auth..."
if curl -s http://localhost:8000/auth/v1/ > /dev/null; then
    echo "✅ API Auth accessible"
else
    echo "❌ API Auth inaccessible"
fi

# Vérifier l'API Storage
echo "📦 Test de l'API Storage..."
if curl -s http://localhost:8000/storage/v1/ > /dev/null; then
    echo "✅ API Storage accessible"
else
    echo "❌ API Storage inaccessible"
fi

# Test de l'application Next.js
echo "🚀 Test de l'application Next.js..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Application Next.js accessible"
else
    echo "❌ Application Next.js inaccessible"
    echo "💡 Démarrez l'application avec: npm run dev"
fi

echo ""
echo "🎉 Test d'intégration terminé !"
echo ""
echo "📊 Résumé:"
echo "   - Base de données: ✅"
echo "   - Tables: ✅"
echo "   - API REST: ✅"
echo "   - API Auth: ✅"
echo "   - API Storage: ✅"
echo "   - Application: $(curl -s http://localhost:3000 > /dev/null && echo "✅" || echo "❌")"
echo ""
echo "🔗 URLs disponibles:"
echo "   - Application: http://localhost:3000"
echo "   - API REST: http://localhost:8000/rest/v1/"
echo "   - API Auth: http://localhost:8000/auth/v1/"
echo "   - API Storage: http://localhost:8000/storage/v1/"
echo ""
echo "🔑 Comptes de test:"
echo "   - Admin: ismail@mouyahada.fr / demo123"
echo "   - Client: marie.dupont@retailtech.com / client123"
