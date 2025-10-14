#!/bin/bash

# Script d'installation du serveur pour Portfolio SaaS
# Usage: ./install-server.sh

set -e

echo "🚀 Installation du serveur Portfolio SaaS..."

# Variables
APP_NAME="portfolio-saas"
APP_DIR="$HOME/Apps/$APP_NAME"
DOMAIN="${DOMAIN:-portfolio.example.com}"

# Couleurs pour les logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Vérifier si on est root
if [[ $EUID -eq 0 ]]; then
   error "Ce script ne doit pas être exécuté en tant que root"
fi

# Mise à jour du système
log "Mise à jour du système..."
sudo apt update && sudo apt upgrade -y

# Installation des dépendances
log "Installation des dépendances..."
sudo apt install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    htop \
    vim \
    ufw \
    fail2ban

# Installation de Docker
log "Installation de Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    log "Docker installé avec succès"
else
    log "Docker est déjà installé"
fi

# Installation de Docker Compose
log "Installation de Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log "Docker Compose installé avec succès"
else
    log "Docker Compose est déjà installé"
fi

# Installation de Caddy
log "Installation de Caddy..."
if ! command -v caddy &> /dev/null; then
    sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt update
    sudo apt install -y caddy
    sudo systemctl enable caddy
    sudo systemctl start caddy
    log "Caddy installé avec succès"
else
    log "Caddy est déjà installé"
fi

# Installation de PM2 pour la gestion des processus
log "Installation de PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    log "PM2 installé avec succès"
else
    log "PM2 est déjà installé"
fi

# Création des répertoires
log "Création des répertoires..."
mkdir -p $APP_DIR
mkdir -p $HOME/.ssh
mkdir -p /var/log/caddy

# Configuration du firewall
log "Configuration du firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 8001
sudo ufw allow 8025
sudo ufw status

# Configuration de fail2ban
log "Configuration de fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Création du script de déploiement
log "Création du script de déploiement..."
cat > $APP_DIR/deploy.sh << 'EOF'
#!/bin/bash

# Script de déploiement automatique
set -e

APP_NAME="portfolio-saas"
APP_DIR="$HOME/Apps/$APP_NAME"
DOCKER_IMAGE="$1"

if [ -z "$DOCKER_IMAGE" ]; then
    echo "Usage: $0 <docker-image>"
    exit 1
fi

cd $APP_DIR

# Pull latest image
docker pull $DOCKER_IMAGE

# Update docker-compose.yml with new image
sed -i "s|image: .*|image: $DOCKER_IMAGE|g" docker-compose.prod.yml

# Stop existing containers
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
sleep 30

# Health check
curl -f http://localhost:3000/health || exit 1

# Reload Caddy
sudo caddy reload --config Caddyfile || true

echo "Deployment completed successfully!"
EOF

chmod +x $APP_DIR/deploy.sh

# Création du script de monitoring
log "Création du script de monitoring..."
cat > $APP_DIR/monitor.sh << 'EOF'
#!/bin/bash

# Script de monitoring
APP_NAME="portfolio-saas"
APP_DIR="$HOME/Apps/$APP_NAME"

cd $APP_DIR

echo "=== Portfolio SaaS Status ==="
echo "Date: $(date)"
echo ""

echo "=== Docker Containers ==="
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "=== System Resources ==="
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1"%"}'

echo "Memory Usage:"
free -h

echo "Disk Usage:"
df -h

echo ""
echo "=== Application Health ==="
curl -s http://localhost:3000/health || echo "App not responding"

echo ""
echo "=== Caddy Status ==="
sudo systemctl status caddy --no-pager -l

echo ""
echo "=== Recent Logs ==="
docker-compose -f docker-compose.prod.yml logs --tail=10
EOF

chmod +x $APP_DIR/monitor.sh

# Création du script de backup
log "Création du script de backup..."
cat > $APP_DIR/backup.sh << 'EOF'
#!/bin/bash

# Script de backup
APP_NAME="portfolio-saas"
APP_DIR="$HOME/Apps/$APP_NAME"
BACKUP_DIR="$HOME/backups/$APP_NAME"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

cd $APP_DIR

echo "Creating backup for $APP_NAME..."

# Backup database
docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U postgres postgres > $BACKUP_DIR/db_backup_$DATE.sql

# Backup storage
docker-compose -f docker-compose.prod.yml exec -T storage tar -czf - /var/lib/storage > $BACKUP_DIR/storage_backup_$DATE.tar.gz

# Backup configuration
tar -czf $BACKUP_DIR/config_backup_$DATE.tar.gz docker-compose.prod.yml .env Caddyfile

echo "Backup completed: $BACKUP_DIR"
EOF

chmod +x $APP_DIR/backup.sh

# Configuration de Caddy
log "Configuration de Caddy..."
sudo mkdir -p /etc/caddy
sudo chown caddy:caddy /etc/caddy

# Création du service systemd pour l'application
log "Création du service systemd..."
sudo tee /etc/systemd/system/portfolio-saas.service > /dev/null << EOF
[Unit]
Description=Portfolio SaaS Application
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0
User=$USER
Group=$USER

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable portfolio-saas

# Configuration des logs
log "Configuration des logs..."
sudo mkdir -p /var/log/portfolio-saas
sudo chown $USER:$USER /var/log/portfolio-saas

# Création du cron job pour les backups
log "Configuration des backups automatiques..."
(crontab -l 2>/dev/null; echo "0 2 * * * $APP_DIR/backup.sh") | crontab -

# Création du cron job pour le monitoring
(crontab -l 2>/dev/null; echo "*/5 * * * * $APP_DIR/monitor.sh >> /var/log/portfolio-saas/monitor.log 2>&1") | crontab -

# Instructions finales
log "Installation terminée!"
echo ""
echo "📋 Instructions:"
echo "1. Configurez votre domaine dans le fichier .env:"
echo "   cd $APP_DIR"
echo "   nano .env"
echo ""
echo "2. Configurez Caddy:"
echo "   sudo nano /etc/caddy/Caddyfile"
echo ""
echo "3. Démarrez l'application:"
echo "   cd $APP_DIR"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "4. Vérifiez le statut:"
echo "   $APP_DIR/monitor.sh"
echo ""
echo "5. Configurez les secrets GitHub:"
echo "   - SERVER_HOST: $(curl -s ifconfig.me)"
echo "   - SERVER_USERNAME: $USER"
echo "   - SERVER_PASSWORD: [votre mot de passe]"
echo "   - DOMAIN: $DOMAIN"
echo "   - DOCKERHUB_USERNAME: [votre nom d'utilisateur Docker Hub]"
echo "   - DOCKERHUB_TOKEN: [votre token Docker Hub]"
echo ""
echo "🎉 Votre serveur est prêt pour le déploiement automatique!"
