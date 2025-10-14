# 🚀 Migration vers GitHub Container Registry

## ✅ **Avantages de GitHub Container Registry**

- **Gratuit** : Pas de coûts pour les repositories publics
- **Intégré** : Utilise votre token GitHub existant
- **Sécurisé** : Même niveau de sécurité que GitHub
- **Simple** : Pas besoin de créer un compte séparé

## 🔄 **Changements Effectués**

### **1. Workflow GitHub Actions**
- ✅ Utilise `ghcr.io` au lieu de Docker Hub
- ✅ Utilise `${{ github.actor }}` et `${{ secrets.GITHUB_TOKEN }}`
- ✅ Images taguées avec `ghcr.io/${{ github.repository }}/portfolio-saas:latest`

### **2. Secrets GitHub**
- ❌ Plus besoin de `DOCKERHUB_USERNAME`
- ❌ Plus besoin de `DOCKERHUB_TOKEN`
- ✅ Utilise automatiquement `GITHUB_TOKEN` (généré automatiquement)

### **3. Configuration Docker Compose**
- ✅ Image par défaut : `ghcr.io/your-username/your-repo/portfolio-saas:latest`
- ✅ Variable d'environnement `DOCKER_IMAGE` pour override

## 📋 **Actions Requises**

### **1. Mettre à jour les secrets GitHub**
Supprimez ces secrets (plus nécessaires) :
- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

### **2. Mettre à jour le docker-compose.prod.yml**
Remplacez `your-username/your-repo` par votre repository GitHub :
```yaml
image: ghcr.io/ismail-mouyahada/master-portfolio-saas-app-main/portfolio-saas:latest
```

### **3. Vérifier les permissions**
Assurez-vous que votre repository a les permissions pour :
- ✅ Actions GitHub
- ✅ Packages (Container Registry)

## 🎯 **URLs des Images**

Vos images seront disponibles à :
- `ghcr.io/ismail-mouyahada/master-portfolio-saas-app-main/portfolio-saas:latest`
- `ghcr.io/ismail-mouyahada/master-portfolio-saas-app-main/portfolio-saas:sha-abc123`

## 🔍 **Vérification**

1. **Poussez du code** sur la branche `main`
2. **Vérifiez l'action GitHub** dans l'onglet Actions
3. **Vérifiez les packages** dans l'onglet Packages de votre repository
4. **Testez le déploiement** sur votre serveur

## 🆘 **Dépannage**

### **Erreur : "unauthorized"**
- Vérifiez que `GITHUB_TOKEN` est configuré
- Vérifiez les permissions du repository

### **Erreur : "not found"**
- Vérifiez que l'image a été construite et poussée
- Vérifiez l'URL de l'image dans docker-compose.prod.yml

### **Erreur : "pull access denied"**
- Vérifiez que le repository est public ou que vous avez les permissions
- Vérifiez la connexion à GitHub Container Registry

## ✨ **Résultat Final**

Votre application sera déployée avec :
- 🐳 Images Docker stockées sur GitHub Container Registry
- 🔐 Authentification automatique via GitHub
- 🚀 Déploiement automatisé via GitHub Actions
- 💰 Coût zéro pour le stockage des images
