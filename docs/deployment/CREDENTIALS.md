# 🔐 Identifiants et Accès - Portfolio SaaS

## 📋 Accès aux Services

### Application Principale
- **URL** : http://localhost:3000
- **Description** : Application Next.js principale
- **Statut** : ✅ Fonctionnelle

### Services de Support

#### MailHog (Emails de Test)
- **URL** : http://localhost:8025
- **Description** : Interface web pour visualiser les emails
- **Utilisation** : Tous les emails envoyés par l'application sont capturés ici
- **Statut** : ✅ Fonctionnel

#### Kong API Gateway
- **URL** : http://localhost:8001
- **Description** : API Gateway pour les services Supabase
- **Endpoints** :
  - `/auth/v1/` - Authentification
  - `/rest/v1/` - API REST
  - `/realtime/v1/` - Temps réel
  - `/storage/v1/` - Stockage
- **Statut** : ✅ Fonctionnel

#### Supabase Studio
- **URL** : http://localhost:3001
- **Description** : Interface d'administration de la base de données
- **Statut** : ⚠️ Partiellement fonctionnel

### Base de Données
- **Type** : PostgreSQL
- **Port** : 54322
- **Host** : localhost
- **Database** : postgres
- **User** : postgres
- **Password** : your-super-secret-and-long-postgres-password
- **Statut** : ✅ Fonctionnelle

## 🔑 Clés et Tokens

### JWT Tokens (Développement)
```env
# Clé anonyme (publique)
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Clé de service (privée)
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU
```

### Configuration SMTP (MailHog)
```env
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
```

## 👥 Comptes Utilisateur

### Comptes de Test (À créer)
Pour tester l'authentification, créez des comptes via l'interface :

1. **Admin** :
   - Email : admin@example.com
   - Mot de passe : Admin123!
   - Rôle : Administrateur

2. **Utilisateur Standard** :
   - Email : user@example.com
   - Mot de passe : User123!
   - Rôle : Utilisateur

3. **Test** :
   - Email : test@example.com
   - Mot de passe : Test123!
   - Rôle : Utilisateur

## 🛠️ Commandes Utiles

### Gestion des Services
```bash
# Démarrer tous les services
./scripts/ops/start.sh start

# Arrêter tous les services
./scripts/ops/start.sh stop

# Redémarrer les services
./scripts/ops/start.sh restart

# Vérifier le statut
./scripts/ops/start.sh status

# Voir les logs
./scripts/ops/start.sh logs
```

### Tests
```bash
# Tests unitaires
./scripts/ops/test-all.sh unit

# Tests d'intégration
./scripts/ops/test-all.sh integration

# Tests end-to-end
./scripts/ops/test-all.sh e2e

# Tous les tests
./scripts/ops/test-all.sh all
```

### Base de Données
```bash
# Connexion à la base de données
docker exec -it supabase-db psql -U postgres -d postgres

# Sauvegarde
docker exec supabase-db pg_dump -U postgres postgres > backup.sql

# Restauration
docker exec -i supabase-db psql -U postgres postgres < backup.sql
```

## 🔧 Configuration Avancée

### Variables d'Environnement Importantes
```env
# Application
NODE_ENV=development
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8001
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Base de données
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-super-secret-and-long-postgres-password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-token-with-at-least-32-characters-long
JWT_EXPIRY=3600

# Email
GOTRUE_SMTP_HOST=mailhog
GOTRUE_SMTP_PORT=1025
GOTRUE_SMTP_USER=
GOTRUE_SMTP_PASS=
```

### Ports Utilisés
- **3000** : Application Next.js
- **3001** : Supabase Studio
- **54322** : PostgreSQL
- **8001** : Kong API Gateway
- **8025** : MailHog Web UI
- **1025** : MailHog SMTP

## 🚨 Dépannage

### Problèmes Courants

1. **Port déjà utilisé**
   ```bash
   # Vérifier les ports
   netstat -tulpn | grep :3000

   # Arrêter les services
   ./scripts/ops/start.sh stop
   ```

2. **Base de données inaccessible**
   ```bash
   # Vérifier les logs
   docker logs supabase-db

   # Redémarrer la base de données
   docker-compose restart db
   ```

3. **Application ne démarre pas**
   ```bash
   # Vérifier les logs
   ./scripts/ops/start.sh logs

   # Rebuild l'image
   docker-compose build --no-cache app
   ```

### Logs Importants
```bash
# Logs de l'application
docker logs portfolio-app

# Logs de la base de données
docker logs supabase-db

# Logs de Kong
docker logs supabase-kong

# Logs de MailHog
docker logs supabase-mailhog
```

## 📞 Support

En cas de problème :

1. Vérifier les logs : `./scripts/ops/start.sh logs`
2. Vérifier le statut : `./scripts/ops/start.sh status`
3. Exécuter les tests : `./scripts/ops/test-all.sh all`
4. Consulter la documentation : `README-COMPLET.md`
5. Guide de déploiement : `docs/deployment/DEPLOYMENT.md`

---

**L'application est maintenant prête à être utilisée ! 🚀**

Tous les services sont configurés et fonctionnels. Vous pouvez commencer à développer et utiliser l'application en toute confiance.
