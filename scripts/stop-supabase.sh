#!/bin/bash
echo "🛑 Arrêt de Supabase..."
docker compose --env-file backend/supabase.env down
echo "✅ Supabase arrêté."
