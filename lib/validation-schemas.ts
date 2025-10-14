import * as yup from "yup"

// Schéma de validation pour le contact
export const contactSchema = yup.object({
  name: yup
    .string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: yup
    .string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  subject: yup
    .string()
    .required("Le sujet est requis")
    .min(5, "Le sujet doit contenir au moins 5 caractères")
    .max(100, "Le sujet ne peut pas dépasser 100 caractères"),
  message: yup
    .string()
    .required("Le message est requis")
    .min(10, "Le message doit contenir au moins 10 caractères")
    .max(1000, "Le message ne peut pas dépasser 1000 caractères"),
})

// Schéma de validation pour l'authentification
export const authSchema = yup.object({
  email: yup
    .string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    ),
})

// Schéma de validation pour l'inscription
export const signupSchema = yup.object({
  name: yup
    .string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: yup
    .string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  password: yup
    .string()
    .required("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre"
    ),
  confirmPassword: yup
    .string()
    .required("La confirmation du mot de passe est requise")
    .oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas"),
})

// Schéma de validation pour les projets
export const projectSchema = yup.object({
  title: yup
    .string()
    .required("Le titre est requis")
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: yup
    .string()
    .required("La description est requise")
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  technologies: yup
    .array()
    .of(yup.string())
    .min(1, "Au moins une technologie doit être sélectionnée"),
  status: yup
    .string()
    .oneOf(["planning", "in-progress", "completed", "on-hold"], "Statut invalide"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Priorité invalide"),
  startDate: yup
    .date()
    .required("La date de début est requise"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "La date de fin doit être postérieure à la date de début"),
})

// Schéma de validation pour les tâches
export const taskSchema = yup.object({
  title: yup
    .string()
    .required("Le titre est requis")
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),
  description: yup
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères"),
  status: yup
    .string()
    .oneOf(["todo", "in-progress", "completed"], "Statut invalide"),
  priority: yup
    .string()
    .oneOf(["low", "medium", "high"], "Priorité invalide"),
  dueDate: yup
    .date()
    .min(new Date(), "La date d'échéance doit être dans le futur"),
})

// Schéma de validation pour les messages
export const messageSchema = yup.object({
  subject: yup
    .string()
    .required("Le sujet est requis")
    .min(5, "Le sujet doit contenir au moins 5 caractères")
    .max(100, "Le sujet ne peut pas dépasser 100 caractères"),
  content: yup
    .string()
    .required("Le contenu est requis")
    .min(10, "Le contenu doit contenir au moins 10 caractères")
    .max(2000, "Le contenu ne peut pas dépasser 2000 caractères"),
  recipientId: yup
    .string()
    .required("Le destinataire est requis"),
})

// Schéma de validation pour le profil utilisateur
export const profileSchema = yup.object({
  name: yup
    .string()
    .required("Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: yup
    .string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
  bio: yup
    .string()
    .max(500, "La bio ne peut pas dépasser 500 caractères"),
  website: yup
    .string()
    .url("Format d'URL invalide"),
  location: yup
    .string()
    .max(100, "La localisation ne peut pas dépasser 100 caractères"),
})

// Schéma de validation pour les paramètres
export const settingsSchema = yup.object({
  theme: yup
    .string()
    .oneOf(["light", "dark", "system"], "Thème invalide"),
  language: yup
    .string()
    .oneOf(["fr", "en"], "Langue invalide"),
  notifications: yup
    .object({
      email: yup.boolean(),
      push: yup.boolean(),
      sms: yup.boolean(),
    }),
  privacy: yup
    .object({
      profileVisibility: yup
        .string()
        .oneOf(["public", "private", "contacts"], "Visibilité invalide"),
      showEmail: yup.boolean(),
      showLocation: yup.boolean(),
    }),
})
