# Configuration des Secrets GitHub pour le Déploiement Automatique

## 🔐 Secrets Requis

Pour activer le déploiement automatique, vous devez configurer les secrets suivants dans votre repository GitHub :

### 1. Accès au Serveur
- **`SERVER_HOST`** : `51.159.6.66`
- **`SERVER_USERNAME`** : `qiwiiz`
- **`SERVER_PASSWORD`** : `IFQ3iaq3QS`

### 2. Configuration de l'Application
- **`DOMAIN`** : Votre domaine (ex: `portfolio.example.com`)
- **`ANON_KEY`** : Clé anonyme Supabase
- **`SERVICE_ROLE_KEY`** : Clé de service Supabase
- **`JWT_SECRET`** : Secret JWT pour l'authentification
- **`POSTGRES_PASSWORD`** : Mot de passe de la base de données

### 3. GitHub Container Registry (Automatique)
- **`GITHUB_TOKEN`** : Le token GitHub (généré automatiquement, pas besoin de le configurer manuellement)

## 📋 Comment Configurer les Secrets

### Étape 1 : Accéder aux Secrets GitHub
1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**

### Étape 2 : Ajouter les Secrets
1. Cliquez sur **New repository secret**
2. Entrez le nom du secret (ex: `SERVER_HOST`)
3. Entrez la valeur du secret
4. Cliquez sur **Add secret**
5. Répétez pour tous les secrets

### Étape 3 : Vérifier la Configuration
Une fois tous les secrets configurés, vous devriez voir :
- ✅ SERVER_HOST
- ✅ SERVER_USERNAME
- ✅ SERVER_PASSWORD
- ✅ DOMAIN
- ✅ ANON_KEY
- ✅ SERVICE_ROLE_KEY
- ✅ JWT_SECRET
- ✅ POSTGRES_PASSWORD
- ✅ DOCKERHUB_USERNAME (optionnel)
- ✅ DOCKERHUB_TOKEN (optionnel)

## 🚀 Activation du Déploiement

### Option 1 : Déploiement Automatique
Le déploiement se déclenche automatiquement à chaque push sur la branche `main`.

### Option 2 : Déploiement Manuel
1. Allez dans l'onglet **Actions** de votre repository
2. Sélectionnez le workflow **Deploy to Production Server**
3. Cliquez sur **Run workflow**
4. Sélectionnez la branche `main`
5. Cliquez sur **Run workflow**

## 🔧 Configuration du Serveur

### Étape 1 : Connexion au Serveur
```bash
ssh qiwiiz@51.159.6.66
# Mot de passe: IFQ3iaq3QS
```

### Étape 2 : Installation des Dépendances
```bash
# Télécharger le script d'installation
wget https://raw.githubusercontent.com/votre-repo/deploy/install-server.sh
chmod +x install-server.sh
./install-server.sh
```

### Étape 3 : Configuration de Caddy
```bash
# Éditer la configuration Caddy
sudo nano /etc/caddy/Caddyfile
```

Exemple de configuration Caddy :
```caddy
portfolio.example.com {
    reverse_proxy /* {
        to localhost:3000
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }

    # API routes
    handle /api/* {
        reverse_proxy localhost:8001
    }

    # Studio
    handle /studio/* {
        reverse_proxy localhost:8001
    }

    # Health check
    handle /health {
        respond "OK" 200
    }

    # Security headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        X-XSS-Protection "1; mode=block"
        Referrer-Policy strict-origin-when-cross-origin
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }

    # Compression
    encode gzip

    # Logging
    log {
        output file /var/log/caddy/portfolio.log
        format json
    }
}
```

### Étape 4 : Configuration de l'Environnement
```bash
cd ~/Apps/portfolio-saas
nano .env
```

Exemple de fichier `.env` :
```env
# Database
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_DB=postgres
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=3600

# Supabase
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# PGRST
PGRST_DB_SCHEMAS=public,storage,graphql_public

# Studio
STUDIO_DEFAULT_ORGANIZATION_NAME=Default Organization
STUDIO_DEFAULT_PROJECT_NAME=Default Project

# SMTP (optionnel)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_SENDER_NAME=Portfolio SaaS
```

## 🔍 Vérification du Déploiement

### Vérifier les Services
```bash
cd ~/Apps/portfolio-saas
./monitor.sh
```

### Vérifier les Logs
```bash
# Logs de l'application
docker-compose -f docker-compose.prod.yml logs -f

# Logs de Caddy
sudo journalctl -u caddy -f

# Logs du système
tail -f /var/log/portfolio-saas/monitor.log
```

### Vérifier la Santé de l'Application
```bash
# Health check
curl http://localhost:3000/health

# Vérifier l'API
curl http://localhost:8001/rest/v1/

# Vérifier Studio
curl http://localhost:8001/studio/
```

## 🛠️ Maintenance

### Mise à Jour Manuelle
```bash
cd ~/Apps/portfolio-saas
./deploy.sh your-dockerhub-username/portfolio-saas:latest
```

### Backup
```bash
cd ~/Apps/portfolio-saas
./backup.sh
```

### Redémarrage des Services
```bash
# Redémarrer l'application
sudo systemctl restart portfolio-saas

# Redémarrer Caddy
sudo systemctl restart caddy

# Redémarrer Docker
sudo systemctl restart docker
```

## 🚨 Dépannage

### Problèmes Courants

1. **Erreur de connexion SSH**
   - Vérifiez que le serveur est accessible
   - Vérifiez les credentials dans les secrets GitHub

2. **Erreur Docker**
   - Vérifiez que Docker est installé et démarré
   - Vérifiez les permissions utilisateur

3. **Erreur Caddy**
   - Vérifiez la configuration Caddyfile
   - Vérifiez que le port 80/443 est libre

4. **Erreur de base de données**
   - Vérifiez les variables d'environnement
   - Vérifiez que PostgreSQL est démarré

### Logs de Débogage
```bash
# Logs GitHub Actions
# Allez dans l'onglet Actions de votre repository

# Logs du serveur
journalctl -u portfolio-saas -f
journalctl -u caddy -f
docker-compose -f docker-compose.prod.yml logs -f
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs GitHub Actions
2. Vérifiez les logs du serveur
3. Vérifiez la configuration des secrets
4. Consultez la documentation Docker et Caddy
