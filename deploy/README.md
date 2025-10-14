# 🚀 Configuration du Déploiement Automatique - Portfolio SaaS

Ce dossier contient tous les fichiers nécessaires pour configurer le déploiement automatique de votre application Portfolio SaaS sur votre serveur dédié.

## 📋 Prérequis

- Serveur Ubuntu 24.04 LTS
- Accès SSH au serveur
- Docker et Docker Compose installés
- Caddy installé et configuré
- Repository GitHub avec les secrets configurés

## 🛠️ Installation Rapide

### 1. Connexion au Serveur
```bash
ssh qiwiiz@51.159.6.66
# Mot de passe: IFQ3iaq3QS
```

### 2. Installation Automatique
```bash
# Télécharger et exécuter le script d'installation
wget https://raw.githubusercontent.com/votre-repo/deploy/install-server.sh
chmod +x install-server.sh
./install-server.sh
```

### 3. Configuration des Secrets GitHub
Suivez le guide dans `setup-github-secrets.md` pour configurer tous les secrets nécessaires.

## 📁 Structure des Fichiers

```
deploy/
├── install-server.sh          # Script d'installation du serveur
├── docker-compose.prod.yml    # Configuration Docker Compose pour la production
├── kong.yml                   # Configuration Kong API Gateway
├── Caddyfile                  # Configuration Caddy
├── env.example                # Exemple de fichier d'environnement
├── setup-github-secrets.md    # Guide de configuration des secrets GitHub
└── README.md                  # Ce fichier
```

## 🔧 Configuration Manuelle

### 1. Installation des Dépendances

#### Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Caddy
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

### 2. Configuration de l'Application

#### Créer le répertoire de l'application
```bash
mkdir -p ~/Apps/portfolio-saas
cd ~/Apps/portfolio-saas
```

#### Copier les fichiers de configuration
```bash
# Copier docker-compose.prod.yml
cp deploy/docker-compose.prod.yml .

# Copier kong.yml
cp deploy/kong.yml .

# Copier Caddyfile
cp deploy/Caddyfile .

# Créer le fichier .env
cp deploy/env.example .env
nano .env  # Configurer les variables
```

### 3. Configuration de Caddy

#### Copier la configuration Caddy
```bash
sudo cp Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 4. Démarrage de l'Application

```bash
# Démarrer les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier le statut
docker-compose -f docker-compose.prod.yml ps

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔐 Configuration des Secrets GitHub

### Secrets Requis

| Secret | Description | Exemple |
|--------|-------------|---------|
| `SERVER_HOST` | Adresse IP du serveur | `51.159.6.66` |
| `SERVER_USERNAME` | Nom d'utilisateur SSH | `qiwiiz` |
| `SERVER_PASSWORD` | Mot de passe SSH | `IFQ3iaq3QS` |
| `DOMAIN` | Domaine de l'application | `portfolio.example.com` |
| `ANON_KEY` | Clé anonyme Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SERVICE_ROLE_KEY` | Clé de service Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `JWT_SECRET` | Secret JWT | `your_jwt_secret_here` |
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | `your_secure_password_here` |

### Configuration dans GitHub

1. Allez dans **Settings** → **Secrets and variables** → **Actions**
2. Cliquez sur **New repository secret**
3. Ajoutez chaque secret avec sa valeur
4. Sauvegardez

## 🚀 Déploiement

### Déploiement Automatique
Le déploiement se déclenche automatiquement à chaque push sur la branche `main`.

### Déploiement Manuel
1. Allez dans l'onglet **Actions** de votre repository
2. Sélectionnez **Deploy to Production Server**
3. Cliquez sur **Run workflow**

## 📊 Monitoring

### Vérifier le Statut
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

### Health Check
```bash
# Application
curl http://localhost:3000/health

# API
curl http://localhost:8001/rest/v1/

# Studio
curl http://localhost:8001/studio/
```

## 🔧 Maintenance

### Mise à Jour
```bash
cd ~/Apps/portfolio-saas
./deploy.sh your-dockerhub-username/portfolio-saas:latest
```

### Backup
```bash
cd ~/Apps/portfolio-saas
./backup.sh
```

### Redémarrage
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

#### 1. Erreur de Connexion SSH
```bash
# Vérifier la connectivité
ping 51.159.6.66

# Tester la connexion SSH
ssh qiwiiz@51.159.6.66
```

#### 2. Erreur Docker
```bash
# Vérifier Docker
sudo systemctl status docker

# Redémarrer Docker
sudo systemctl restart docker
```

#### 3. Erreur Caddy
```bash
# Vérifier la configuration
sudo caddy validate --config /etc/caddy/Caddyfile

# Vérifier les logs
sudo journalctl -u caddy -f
```

#### 4. Erreur de Base de Données
```bash
# Vérifier PostgreSQL
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -c "SELECT version();"

# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs db
```

### Logs de Débogage

#### GitHub Actions
1. Allez dans l'onglet **Actions**
2. Cliquez sur le workflow en cours
3. Cliquez sur le job **deploy**
4. Consultez les logs

#### Serveur
```bash
# Logs système
journalctl -f

# Logs Docker
docker logs portfolio-saas-app

# Logs Caddy
sudo journalctl -u caddy -f
```

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** : GitHub Actions, serveur, Docker
2. **Vérifiez la configuration** : Secrets, variables d'environnement
3. **Vérifiez la connectivité** : SSH, ports, services
4. **Consultez la documentation** : Docker, Caddy, Supabase

## 🎯 Prochaines Étapes

1. ✅ Configurer les secrets GitHub
2. ✅ Exécuter le script d'installation
3. ✅ Configurer votre domaine
4. ✅ Tester le déploiement
5. ✅ Configurer le monitoring
6. ✅ Configurer les backups automatiques

## 📚 Ressources Utiles

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Caddy](https://caddyserver.com/docs/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation GitHub Actions](https://docs.github.com/en/actions)
- [Documentation Kong](https://docs.konghq.com/)

---

**🎉 Félicitations ! Votre pipeline de déploiement automatique est maintenant configuré !**
