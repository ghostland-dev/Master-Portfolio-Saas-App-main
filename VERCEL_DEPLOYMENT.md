# 🚀 Guide de Déploiement Vercel

Ce guide vous accompagne pour déployer votre application Portfolio SaaS sur Vercel.

## 📋 Prérequis

1. **Compte Vercel** : Créez un compte sur [vercel.com](https://vercel.com)
2. **Projet Supabase** : Votre projet Supabase doit être configuré
3. **Repository GitHub** : Votre code doit être sur GitHub

## 🔧 Configuration Vercel

### 1. Connexion GitHub

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Sign Up" ou "Log In"
3. Choisissez "Continue with GitHub"
4. Autorisez Vercel à accéder à vos repositories

### 2. Import du Projet

1. Cliquez sur "New Project"
2. Sélectionnez votre repository `Master-Portfolio-Saas-App-main`
3. Vercel détectera automatiquement que c'est un projet Next.js

### 3. Configuration des Variables d'Environnement

Dans les paramètres du projet, ajoutez ces variables :

```bash
# Variables Supabase (obligatoires)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Variables optionnelles
NODE_ENV=production
```

**Comment obtenir les clés Supabase :**
1. Allez sur [supabase.com](https://supabase.com)
2. Ouvrez votre projet
3. Allez dans Settings > API
4. Copiez l'URL et la clé `anon public`

### 4. Configuration du Build

Vercel détectera automatiquement :
- **Framework** : Next.js
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

## 🚀 Déploiement

### Déploiement Automatique

1. **Push sur main** : Chaque push sur la branche `main` déclenchera un déploiement
2. **Pull Requests** : Les PR créent des prévisualisations automatiques
3. **Branches** : Chaque branche peut être déployée séparément

### Déploiement Manuel

1. Allez dans votre dashboard Vercel
2. Cliquez sur "Deploy" sur votre projet
3. Vercel construira et déploiera votre application

## 🔍 Vérification du Déploiement

### 1. Test de l'Application

- **URL de production** : `https://your-project.vercel.app`
- **URL de prévisualisation** : `https://your-project-git-branch.vercel.app`

### 2. Vérification des Fonctionnalités

- [ ] Page d'accueil se charge
- [ ] Navigation fonctionne
- [ ] Connexion/Inscription fonctionne
- [ ] Dashboard accessible
- [ ] API routes fonctionnent

### 3. Logs et Monitoring

- **Logs** : Dashboard Vercel > Functions > Logs
- **Analytics** : Dashboard Vercel > Analytics
- **Performance** : Dashboard Vercel > Speed Insights

## 🛠️ Configuration Avancée

### 1. Domaine Personnalisé

1. Allez dans Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions Vercel

### 2. Variables d'Environnement par Environnement

- **Production** : Variables pour la production
- **Preview** : Variables pour les prévisualisations
- **Development** : Variables pour le développement local

### 3. Fonctions Serverless

Vos API routes (`app/api/*`) deviennent automatiquement des fonctions serverless Vercel.

## 🔧 Dépannage

### Problèmes Courants

1. **Build Failed**
   - Vérifiez les logs dans Vercel Dashboard
   - Assurez-vous que toutes les dépendances sont installées
   - Vérifiez les erreurs TypeScript

2. **Variables d'Environnement**
   - Vérifiez que toutes les variables sont définies
   - Redéployez après avoir ajouté des variables

3. **Erreurs Runtime**
   - Consultez les logs des fonctions
   - Vérifiez la configuration Supabase

### Support

- **Documentation Vercel** : [vercel.com/docs](https://vercel.com/docs)
- **Support Vercel** : [vercel.com/support](https://vercel.com/support)
- **Community** : [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

## 🎉 Avantages Vercel

- **Déploiement automatique** depuis GitHub
- **Prévisualisations** pour chaque PR
- **CDN global** pour des performances optimales
- **Fonctions serverless** intégrées
- **Monitoring** et analytics intégrés
- **HTTPS** automatique
- **Domaine personnalisé** facile à configurer

---

**Votre application Portfolio SaaS est maintenant prête pour Vercel ! 🚀**
