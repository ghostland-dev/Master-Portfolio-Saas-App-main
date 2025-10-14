# 🧪 Guide des Tests - Portfolio SaaS

Ce document décrit la suite de tests complète pour l'application Portfolio SaaS.

## 📁 Structure des Tests

```
tests/
├── unit/                    # Tests unitaires
│   ├── components/         # Tests des composants React
│   ├── lib/               # Tests des utilitaires
│   └── utils/             # Tests des fonctions utilitaires
├── integration/            # Tests d'intégration
│   ├── api/               # Tests des API
│   ├── auth/              # Tests d'authentification
│   └── database/          # Tests de base de données
└── e2e/                   # Tests end-to-end
    ├── auth/              # Tests d'authentification E2E
    ├── dashboard/         # Tests du tableau de bord
    └── portfolio/         # Tests du portfolio
```

## 🚀 Commandes de Test

### Tests Unitaires
```bash
# Exécuter tous les tests unitaires
npm run test:unit

# Exécuter en mode watch
npm run test:watch

# Avec couverture de code
npm run test:coverage
```

### Tests d'Intégration
```bash
# Exécuter les tests d'intégration
npm run test:integration
```

### Tests End-to-End
```bash
# Exécuter les tests E2E
npm run test:e2e

# Interface utilisateur
npm run test:e2e:ui

# Mode headless
npm run test:e2e:headed
```

### Tous les Tests
```bash
# Exécuter tous les tests
npm run test:all

# Pour CI/CD
npm run test:ci

# Script personnalisé
./scripts/run-tests.sh
```

## 📊 Couverture de Code

La couverture de code est configurée avec les seuils suivants :
- **Branches** : 70%
- **Fonctions** : 70%
- **Lignes** : 70%
- **Statements** : 70%

## 🔧 Configuration

### Jest (Tests Unitaires & Intégration)
- Configuration : `jest.config.js`
- Setup : `jest.setup.js`
- Environnement : `jsdom`

### Playwright (Tests E2E)
- Configuration : `playwright.config.ts`
- Navigateurs : Chrome, Firefox, Safari
- Mobile : iPhone 12, Pixel 5

## 📝 Types de Tests

### 1. Tests Unitaires
Testent les composants et fonctions individuellement.

**Exemples :**
- Rendu des composants
- Gestion des événements
- Validation des données
- Fonctions utilitaires

### 2. Tests d'Intégration
Testent l'interaction entre différents modules.

**Exemples :**
- Connexion à Supabase
- API REST
- Authentification
- Base de données

### 3. Tests End-to-End
Testent l'application complète du point de vue utilisateur.

**Exemples :**
- Flux d'authentification
- Navigation
- Fonctionnalités métier
- Responsive design

## 🎯 Bonnes Pratiques

### Tests Unitaires
- Un test par fonctionnalité
- Noms descriptifs
- Arrange-Act-Assert pattern
- Mocks appropriés

### Tests d'Intégration
- Données de test isolées
- Nettoyage après chaque test
- Tests des cas d'erreur
- Vérification des appels API

### Tests E2E
- Scénarios utilisateur réalistes
- Données de test cohérentes
- Attentes explicites
- Gestion des timeouts

## 🐛 Débogage

### Tests Unitaires
```bash
# Mode debug
npm run test:unit -- --verbose

# Tests spécifiques
npm run test:unit -- --testNamePattern="ModeToggle"
```

### Tests E2E
```bash
# Mode debug
npm run test:e2e:headed

# Tests spécifiques
npm run test:e2e -- --grep="login"
```

## 📈 CI/CD

Les tests sont automatiquement exécutés :
- Sur chaque push
- Sur chaque pull request
- Avant le déploiement

Configuration : `.github/workflows/test.yml`

## 🔍 Rapports

### Couverture de Code
- Fichier : `coverage/lcov-report/index.html`
- Format : LCOV
- Intégration : Codecov

### Tests E2E
- Rapport : `playwright-report/`
- Screenshots : `test-results/`
- Vidéos : `test-results/`

## 🚨 Dépannage

### Problèmes Courants

1. **Tests qui échouent de manière intermittente**
   - Vérifier les timeouts
   - Ajouter des attentes explicites
   - Vérifier les mocks

2. **Erreurs de connexion Supabase**
   - Vérifier les variables d'environnement
   - S'assurer que Supabase est démarré
   - Vérifier les mocks

3. **Tests E2E qui échouent**
   - Vérifier que l'application est démarrée
   - Vérifier les sélecteurs
   - Ajouter des délais d'attente

### Logs
```bash
# Logs détaillés
npm run test:unit -- --verbose

# Logs E2E
DEBUG=pw:api npm run test:e2e
```

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Supabase Testing](https://supabase.com/docs/guides/getting-started/testing)
