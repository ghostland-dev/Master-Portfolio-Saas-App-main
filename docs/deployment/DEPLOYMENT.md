# 🚀 Guide de Déploiement - Portfolio SaaS

## 📋 Prérequis

### Serveur de Production
- **OS** : Ubuntu 20.04+ / CentOS 8+ / RHEL 8+
- **RAM** : Minimum 4GB, recommandé 8GB+
- **CPU** : 2 cœurs minimum, 4 cœurs recommandés
- **Stockage** : 20GB minimum
- **Réseau** : Accès internet stable

### Logiciels Requis
- **Docker** : 20.10+
- **Docker Compose** : 2.0+
- **Git** : Pour cloner le repository
- **Nginx** : Pour le reverse proxy (optionnel)

## 🔧 Installation

### 1. Préparation du Serveur

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Redémarrage pour appliquer les changements
sudo reboot
```

### 2. Déploiement de l'Application

```bash
# Cloner le repository
git clone <repository-url>
cd Master-Portfolio-Saas-App-main

# Rendre les scripts opérationnels exécutables
chmod +x scripts/ops/*.sh

# Démarrer l'application
./scripts/ops/start.sh start
```

### 3. Configuration de Production

#### Variables d'Environnement
Créez un fichier `.env.production` :

```env
# Base de données
POSTGRES_DB=portfolio_prod
POSTGRES_USER=portfolio_user
POSTGRES_PASSWORD=your_secure_password_here
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Supabase
SUPABASE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SERVICE_ROLE_KEY=your_service_role_key_here

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=3600

# Email (SMTP de production)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-email-password
GOTRUE_SMTP_HOST=smtp.your-provider.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=your-email@domain.com
GOTRUE_SMTP_PASS=your-email-password

# Sécurité
GOTRUE_SITE_URL=https://your-domain.com
GOTRUE_URI_ALLOW_LIST=https://your-domain.com
```

#### Configuration Nginx (Recommandé)

```nginx
# /etc/nginx/sites-available/portfolio-saas
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # Certificats SSL (Let's Encrypt recommandé)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Configuration SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Proxy vers l'application
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy vers MailHog (optionnel, pour les tests)
    location /mailhog/ {
        proxy_pass http://localhost:8025/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 Sécurité

### 1. Configuration Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Ou iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3000 -j DROP  # Bloquer l'accès direct
```

### 2. Certificats SSL

```bash
# Installation de Certbot
sudo apt install certbot python3-certbot-nginx

# Génération du certificat
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Renouvellement automatique
sudo crontab -e
# Ajouter: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 3. Sauvegarde de la Base de Données

```bash
# Script de sauvegarde quotidienne
#!/bin/bash
# /usr/local/bin/backup-portfolio.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/portfolio"
mkdir -p $BACKUP_DIR

# Sauvegarde PostgreSQL
docker exec supabase-db pg_dump -U postgres portfolio_prod > $BACKUP_DIR/portfolio_$DATE.sql

# Compression
gzip $BACKUP_DIR/portfolio_$DATE.sql

# Suppression des sauvegardes anciennes (30 jours)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Ajouter au crontab
# 0 2 * * * /usr/local/bin/backup-portfolio.sh
```

## 📊 Monitoring

### 1. Logs Centralisés

```bash
# Configuration Docker logging
# Dans docker-compose.yml, ajouter:
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 2. Monitoring des Ressources

```bash
# Installation de htop et iotop
sudo apt install htop iotop

# Surveillance des conteneurs
docker stats --no-stream

# Surveillance des logs
docker-compose logs -f --tail=100
```

### 3. Alertes (Optionnel)

```bash
# Script de monitoring simple
#!/bin/bash
# /usr/local/bin/monitor-portfolio.sh

if ! curl -s http://localhost:3000 > /dev/null; then
    echo "ALERT: Portfolio SaaS is down!" | mail -s "Portfolio Alert" admin@your-domain.com
    # Redémarrage automatique
    cd /path/to/portfolio && ./scripts/ops/start.sh restart
fi
```

## 🔄 Mise à Jour

### 1. Mise à Jour de l'Application

```bash
# Arrêt des services
./scripts/ops/start.sh stop

# Sauvegarde
./scripts/ops/start.sh backup

# Mise à jour du code
git pull origin main

# Reconstruction et redémarrage
docker-compose build --no-cache
./scripts/ops/start.sh start
```

### 2. Mise à Jour de la Base de Données

```bash
# Migration des données
docker-compose exec db psql -U postgres -d portfolio_prod -f /path/to/migration.sql
```

## 🚨 Dépannage

### Problèmes Courants

1. **Application ne démarre pas**
   ```bash
   # Vérifier les logs
   ./scripts/ops/start.sh logs

   # Vérifier les ports
   netstat -tulpn | grep :3000
   ```

2. **Base de données inaccessible**
   ```bash
   # Vérifier le conteneur
   docker-compose ps db

   # Vérifier les logs
   docker-compose logs db
   ```

3. **Problèmes de mémoire**
   ```bash
   # Nettoyer Docker
   docker system prune -a

   # Vérifier l'espace disque
   df -h
   ```

### Commandes Utiles

```bash
# Statut des services
./scripts/ops/start.sh status

# Logs en temps réel
./scripts/ops/start.sh logs

# Redémarrage complet
./scripts/ops/start.sh restart

# Nettoyage complet
./scripts/ops/start.sh clean

# Tests
./scripts/ops/start.sh test
```

## 📈 Optimisation

### 1. Performance

- **Cache Nginx** : Configurer le cache pour les assets statiques
- **CDN** : Utiliser un CDN pour les images et assets
- **Compression** : Activer la compression gzip
- **Monitoring** : Utiliser des outils comme Prometheus + Grafana

### 2. Scalabilité

- **Load Balancer** : Nginx ou HAProxy
- **Base de données** : PostgreSQL en cluster
- **Cache** : Redis pour le cache
- **Conteneurs** : Kubernetes pour l'orchestration

## 📞 Support

En cas de problème :

1. Vérifier les logs : `./scripts/ops/start.sh logs`
2. Vérifier le statut : `./scripts/ops/start.sh status`
3. Consulter la documentation
4. Créer une issue sur le repository

---

**L'application est maintenant prête pour la production ! 🚀**
