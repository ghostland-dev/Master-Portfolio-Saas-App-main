# Infrastructure as Code (IaC) & DevSecOps

Ce dossier contient les configurations nécessaires pour déployer et gérer l'application dans un environnement de production cloud sécurisé.

## 🏗️ Terraform (`/terraform`)
Utilisé pour provisionner l'infrastructure sur AWS.

### Pré-requis
- Terraform CLI installé.
- Identifiants AWS configurés.

### Utilisation
1. `cd terraform`
2. `terraform init`
3. `terraform plan`
4. `terraform apply`

## ☸️ Kubernetes (`/k8s`)
Utilisé pour l'orchestration des conteneurs après le provisionnement de l'infrastructure.

### Pré-requis
- Un cluster Kubernetes (EKS, GKE, ou local avec Minikube).
- `kubectl` configuré.

### Déploiement
1. `kubectl apply -f production-stack.yaml`

## 🔒 Sécurité (DevSecOps)
- **Terraform** : Utilisation de modules certifiés et gestion des secrets via variables.
- **Kubernetes** : Resource limits, Healthchecks, et Ingress TLS.
- **CI/CD** : Pipeline GitHub Actions inclus (`.github/workflows/devsecops.yml`) avec scans de vulnérabilités.
