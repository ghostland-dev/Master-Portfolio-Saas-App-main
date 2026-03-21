# Configuration Supabase avec Docker

Ce guide vous explique comment configurer et utiliser Supabase avec Docker pour votre application Portfolio SaaS.

## 🚀 Démarrage rapide

### 1. Prérequis
- Docker et Docker Compose installés
- Node.js et npm installés
- Ports 3000, 54322, et 8000 disponibles

### 2. Démarrage des services
```bash
# Démarrer Supabase
./scripts/start-supabase.sh

# Ou manuellement
docker-compose --env-file supabase.env up -d
```

### 3. Arrêt des services
```bash
# Arrêter Supabase
./scripts/stop-supabase.sh

# Ou manuellement
docker-compose --env-file supabase.env down
```

## 📊 Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **Supabase Studio** | http://localhost:3000 | Interface d'administration |
| **API REST** | http://localhost:8000/rest/v1/ | API REST automatique |
| **API Auth** | http://localhost:8000/auth/v1/ | Authentification |
| **API Realtime** | http://localhost:8000/realtime/v1/ | Temps réel |
| **API Storage** | http://localhost:8000/storage/v1/ | Stockage de fichiers |
| **Base de données** | localhost:54322 | PostgreSQL |

## 🔑 Configuration

### Variables d'environnement
Le fichier `supabase.env` contient toutes les configurations nécessaires :

```env
# Supabase Configuration
SUPABASE_URL=http://localhost:8000
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=54322
POSTGRES_DB=postgres
POSTGRES_PASSWORD=your-password
```

### Configuration Next.js
Ajoutez ces variables à votre `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 🗄️ Structure de la base de données

### Tables principales
- **users** - Utilisateurs (admin/client)
- **projects** - Projets
- **messages** - Messages
- **invoices** - Factures
- **feedbacks** - Retours clients
- **tasks** - Tâches
- **project_phases** - Phases de projet
- **milestones** - Jalons
- **file_uploads** - Fichiers uploadés
- **appointments** - Rendez-vous
- **budget_estimates** - Estimations budgétaires
- **technology_recommendations** - Recommandations technologiques

### Types personnalisés
- `user_role` - Rôles utilisateur (admin, client)
- `project_status` - Statuts de projet
- `message_priority` - Priorités de message
- `invoice_status` - Statuts de facture
- `feedback_status` - Statuts de retour

## 🔐 Sécurité

### Row Level Security (RLS)
Toutes les tables ont RLS activé avec des politiques appropriées :

- **Utilisateurs** : Peuvent lire/modifier leurs propres données
- **Projets** : Clients voient leurs projets, admins voient tout
- **Messages** : Utilisateurs voient leurs messages
- **Factures** : Clients voient leurs factures, admins gèrent tout

### Authentification
- JWT tokens pour l'authentification
- Rôles utilisateur (admin/client)
- Politiques de sécurité granulaires

## 🛠️ Utilisation dans l'application

### Provider Supabase
```tsx
import { SupabaseProvider } from '@/components/supabase-provider'

function App() {
  return (
    <SupabaseProvider>
      {/* Votre application */}
    </SupabaseProvider>
  )
}
```

### Hooks personnalisés
```tsx
import { useProjects, useMessages, useInvoices } from '@/hooks/use-supabase-data'

function MyComponent() {
  const { projects, loading, createProject } = useProjects()
  const { messages, sendMessage } = useMessages()
  const { invoices, createInvoice } = useInvoices()

  // Utilisation...
}
```

### Client Supabase
```tsx
import { supabaseClient } from '@/lib/supabase'

// Requête directe
const { data, error } = await supabaseClient
  .from('projects')
  .select('*')
  .eq('status', 'active')
```

## 📈 Fonctionnalités avancées

### Temps réel
```tsx
// Écouter les changements en temps réel
const subscription = supabaseClient
  .channel('projects')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'projects' },
    (payload) => console.log('Changement:', payload)
  )
  .subscribe()
```

### Stockage de fichiers
```tsx
// Upload de fichier
const { data, error } = await supabaseClient.storage
  .from('project-files')
  .upload('file.pdf', file)

// Téléchargement
const { data } = supabaseClient.storage
  .from('project-files')
  .getPublicUrl('file.pdf')
```

### Authentification
```tsx
import { useSupabase } from '@/components/supabase-provider'

function LoginForm() {
  const { signIn, signUp, signOut, user } = useSupabase()

  const handleLogin = async (email, password) => {
    const { error } = await signIn(email, password)
    if (error) console.error(error)
  }

  // ...
}
```

## 🔧 Maintenance

### Sauvegarde de la base de données
```bash
# Créer une sauvegarde
docker exec supabase-db pg_dump -U postgres postgres > backup.sql

# Restaurer une sauvegarde
docker exec -i supabase-db psql -U postgres postgres < backup.sql
```

### Logs
```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f db
docker-compose logs -f auth
docker-compose logs -f rest
```

### Mise à jour
```bash
# Arrêter les services
docker-compose down

# Mettre à jour les images
docker-compose pull

# Redémarrer
docker-compose up -d
```

## 🐛 Dépannage

### Problèmes courants

1. **Port déjà utilisé**
   ```bash
   # Vérifier les ports utilisés
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :54322
   netstat -tulpn | grep :8000
   ```

2. **Services ne démarrent pas**
   ```bash
   # Vérifier les logs
   docker-compose logs

   # Redémarrer
   docker-compose restart
   ```

3. **Base de données inaccessible**
   ```bash
   # Vérifier la connexion
   docker exec -it supabase-db psql -U postgres -d postgres
   ```

4. **Permissions insuffisantes**
   ```bash
   # Donner les permissions
   chmod +x scripts/*.sh
   ```

### Reset complet
```bash
# Arrêter et supprimer tout
docker-compose down -v
docker system prune -a

# Redémarrer
./scripts/start-supabase.sh
```

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Docker](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js avec Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez les logs : `docker-compose logs`
2. Consultez la documentation Supabase
3. Vérifiez la configuration des ports
4. Redémarrez les services si nécessaire

---

**Note** : Ce setup est conçu pour le développement local. Pour la production, utilisez Supabase Cloud ou configurez un environnement de production sécurisé.
