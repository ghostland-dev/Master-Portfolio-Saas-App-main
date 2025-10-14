#!/bin/bash

# Script d'arrêt pour Supabase avec Docker
echo "🛑 Arrêt de Supabase avec Docker..."

# Arrêter les services
echo "🐳 Arrêt des services Docker..."
docker-compose --env-file supabase.env down

# Optionnel : supprimer les volumes (décommentez si vous voulez supprimer les données)
# echo "🗑️  Suppression des volumes..."
# docker-compose --env-file supabase.env down -v

echo "✅ Supabase a été arrêté avec succès !"
echo ""
echo "💡 Pour redémarrer :"
echo "   ./scripts/start-supabase.sh"
echo ""
echo "💡 Pour supprimer complètement (données incluses) :"
echo "   docker-compose --env-file supabase.env down -v"
