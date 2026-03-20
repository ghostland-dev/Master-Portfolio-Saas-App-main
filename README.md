 

# Ismail MOUYAHADA - Solutions Numériques Sur Mesure

![Aperçu du portfolio](docs/assets/image.png)


Welcome to the personal portfolio website of **Ismail MOUYAHADA**, a professional offering tailor-made digital solutions with expertise in full-stack development and DevOps practices. This website showcases my skills, services, and recent projects, demonstrating my ability to build high-performance applications using the latest technologies.

## Overview

As a full-stack developer and DevOps engineer, I focus on delivering scalable and efficient solutions. This website presents my technical expertise, recent projects, and the services I offer. It also includes client testimonials and detailed information about my skill set and development tools.

## Features

- **Personal Profile**: An introduction to my professional journey and expertise.
- **Services Offered**: A list of services covering front-end and back-end development, DevOps, and cloud architecture.
- **Portfolio**: Showcasing recent projects that I have worked on, such as e-commerce platforms, CRM dashboards, and DevOps pipelines.
- **Technical Expertise**: A breakdown of my skills and technologies, including React, Node.js, Docker, Kubernetes, AWS, and more.
- **Client Testimonials**: Positive feedback from clients describing their experiences working with me.
- **Contact & Collaboration**: A section for potential clients to schedule a consultation and discuss their projects.

## Technologies

- **Frontend**:
  - React.js
  - Tailwind CSS
  - Vite (for fast builds and optimization)
- **Backend**:
  - Node.js
  - Express.js
  - PostgreSQL, MongoDB (for database management)
  - AWS, Docker, Kubernetes (for cloud and container management)
- **DevOps**:
  - CI/CD Pipelines (GitHub Actions, Jenkins)
  - Docker
  - Kubernetes
  - Terraform (optional, if used for infrastructure provisioning)
- **Others**:
  - Git & GitHub for version control
  - Cloud-based services (AWS, Azure, etc.)

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd ismail-mouyahada-portfolio
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:3000`.

## 🚀 Déploiement Rapide

### Option 1: Déploiement Vercel (Recommandé)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Ismail-Mouyahada/Master-Portfolio-Saas-App-main)

1. Cliquez sur le bouton "Deploy with Vercel" ci-dessus
2. Connectez votre compte GitHub
3. Configurez les variables d'environnement Supabase
4. Déployez en un clic !

### Option 2: Déploiement Local

```bash
# Installation des dépendances
npm install

# Configuration des variables d'environnement
cp config/examples/env.vercel.example .env.local
# Éditez .env.local avec vos clés Supabase

# Démarrage du serveur de développement
npm run dev
```

### Option 3: Déploiement Serveur Dédié

Consultez le guide complet dans `deploy/README.md` pour le déploiement sur serveur dédié avec Docker.

## Structure du dépôt

| Dossier / fichier | Rôle |
|-------------------|------|
| `app/` | Routes Next.js (App Router), pages et API |
| `components/` | Composants React réutilisables |
| `hooks/` | Hooks React |
| `lib/` | Utilitaires, client Supabase, schémas |
| `public/` | Assets statiques |
| `scripts/` | Scripts shell (Docker, déploiement, CI locale) |
| `scripts/ops/` | Démarrage stack, tests manuels, déploiement, maintenance |
| `tests/` | Jest (`unit`, `integration`) et Playwright (`e2e`) |
| `tests/manual/node/` | Anciens scripts Node de test / debug (hors CI) |
| `docs/` | Documentation (déploiement, guides) |
| `docs/assets/` | Captures et médias pour la doc |
| `config/examples/` | Exemples d’environnement, crontab |
| `supabase/` | Docker, SQL d’init, seeds manuels |
| `supabase/seed-manual/` | Scripts SQL d’injection de données (hors migrations versionnées) |
| `deploy/` | Guides et fichiers liés au déploiement serveur |
| `monitoring/` | Config Prometheus / health checks |
| `pages/` | `_document` / `_app` (compat build Next.js) |

Index de la documentation : [`docs/README.md`](docs/README.md).

## Configuration

- **Environment Variables**: Set up any necessary environment variables (e.g., API keys for external services) in the `.env` file.

- **Vite Configuration**: Adjust the Vite configuration for production builds if necessary.

## Portfolio Highlights

Here are some examples of the projects I have worked on:

- **E-commerce Platform**: A complete platform with a shopping cart, payment processing, and order management system built using React and MongoDB.
- **CRM Dashboard**: A dashboard for client and sales management built with Node.js, Express, and PostgreSQL.
- **DevOps Pipeline**: A fully automated CI/CD pipeline for deploying applications using Docker and Kubernetes.

## Testimonials

> *"Ismail transformed our idea into a fully functioning web application in record time. His expertise in full-stack development is unparalleled."*  
> — **Sophie Martin**, CEO of Textariat

> *"Ismail set up our DevOps pipeline, making our deployment process seamless and efficient. We saw a significant improvement in delivery times."*  
> — **Thomas Dubois**, CTO of MimicCorp

> *"Working with Ismail was a fantastic experience. His technical knowledge and communication skills ensured the project met all our objectives."*  
> — **Marie Leroy**, Product Manager at E-Shop Plus

## Contributing

If you'd like to contribute to the project, feel free to fork the repository and submit pull requests with bug fixes or improvements.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For collaboration inquiries, feel free to reach out through the contact form on the website or email me at [your-email@example.com](mailto:your-email@example.com).

## Footer

```
© 2025 Ismail MOUYAHADA. All rights reserved.
```

 