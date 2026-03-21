# Seeds SQL manuels

Scripts SQL utilisés ponctuellement pour injecter des données (hors migrations `supabase/migrations/`).

Exécution typique (depuis la machine hôte, base déjà démarrée) :

```bash
psql "postgresql://postgres:YOUR_PASSWORD@localhost:54322/postgres" -f supabase/seed-manual/nom-du-fichier.sql
```

Adapter l’URL selon `supabase.env` / votre instance.
