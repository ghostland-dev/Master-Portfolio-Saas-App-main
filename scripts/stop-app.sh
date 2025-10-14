#!/bin/bash

# Script d'arrêt complet de l'application avec Supabase
echo "🛑 Arrêt de l'application Portfolio SaaS avec Supabase..."

# Arrêter Next.js (si en cours d'exécution)
echo "🔄 Arrêt de Next.js..."
pkill -f "next dev" || true

# Arrêter Supabase
echo "🐳 Arrêt de Supabase..."
docker-compose --env-file supabase.env down

echo "✅ Application arrêtée avec succès !"
echo ""
echo "💡 Pour redémarrer :"
echo "   ./scripts/start-app.sh"
echo ""
echo "💡 Pour supprimer complètement (données incluses) :"
echo "   docker-compose --env-file supabase.env down -v"
