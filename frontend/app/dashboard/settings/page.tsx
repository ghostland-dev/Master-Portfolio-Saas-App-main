"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { user, loading: authLoading } = useSupabase()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    profile: {
      name: "",
      email: "",
      phone: "",
      company: "",
      bio: "",
      avatar: "",
    },
    preferences: {
      language: "fr",
      timezone: "Europe/Paris",
      theme: "system",
      notifications: {
        email: true,
        push: true,
        sms: false,
        projectUpdates: true,
        invoiceReminders: true,
        systemAlerts: true,
      },
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
    },
    billing: {
      currency: "EUR",
      taxRate: 20,
      paymentMethod: "card",
    },
  })

  // Charger les données utilisateur
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          name: user.user_metadata?.name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
          company: user.user_metadata?.company || "",
          bio: user.user_metadata?.bio || "",
          avatar: user.user_metadata?.avatar || "",
        },
      }))
    }
  }, [user])

  // Sauvegarder les paramètres
  const handleSave = async (section: string) => {
    setSaving(true)
    try {
      // Simuler la sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast("success", `Vos paramètres ${section} ont été mis à jour avec succès.`, {
        title: "Paramètres sauvegardés",
      })
    } catch (error) {
      toast("error", "Une erreur est survenue lors de la sauvegarde.")
    } finally {
      setSaving(false)
    }
  }

  // Gérer le changement de mot de passe
  const handlePasswordChange = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      toast("error", "Les mots de passe ne correspondent pas.")
      return
    }

    setSaving(true)
    try {
      // Simuler le changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast("success", "Votre mot de passe a été mis à jour avec succès.", {
        title: "Mot de passe modifié",
      })
    } catch (error) {
      toast("error", "Une erreur est survenue lors du changement de mot de passe.")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Icon name="Loader2" className="h-12 w-12 animate-spin text-primary mb-4" aria-hidden={true} />
        <p className="text-lg">Chargement des paramètres...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground mt-2">Personnalisez votre expérience et gérez vos préférences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations du profil</CardTitle>
              <CardDescription>Gérez vos informations personnelles et professionnelles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    {settings.profile.avatar ? (
                      <img
                        src={settings.profile.avatar}
                        alt="Avatar"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <Icon name="User" className="h-10 w-10 text-muted-foreground" />
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
                    variant="outline"
                  >
                    <Icon name="Camera" className="h-3 w-3" />
                  </Button>
                </div>
                <div>
                  <h3 className="font-medium">{settings.profile.name}</h3>
                  <p className="text-sm text-muted-foreground">{settings.profile.email}</p>
                  <Badge variant={isAdmin ? "default" : "secondary"} className="mt-1">
                    {isAdmin ? "Administrateur" : "Client"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={settings.profile.name}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, name: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, phone: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise</Label>
                  <Input
                    id="company"
                    value={settings.profile.company}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, company: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biographie</Label>
                <Textarea
                  id="bio"
                  value={settings.profile.bio}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value }
                  }))}
                  placeholder="Parlez-nous de vous..."
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={() => handleSave("du profil")} disabled={saving}>
                {saving ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Sauvegarder le profil
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences générales</CardTitle>
              <CardDescription>Personnalisez votre expérience utilisateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select
                    value={settings.preferences.language}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, language: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={settings.preferences.timezone}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, timezone: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Thème</Label>
                <Select
                  value={settings.preferences.theme}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Clair</SelectItem>
                    <SelectItem value="dark">Sombre</SelectItem>
                    <SelectItem value="system">Système</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notifications</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications importantes par email
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.notifications.email}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, email: checked }
                        }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des notifications dans votre navigateur
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.notifications.push}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, push: checked }
                        }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mises à jour de projet</Label>
                      <p className="text-sm text-muted-foreground">
                        Soyez informé des progrès de vos projets
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.notifications.projectUpdates}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, projectUpdates: checked }
                        }
                      }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Rappels de facturation</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevez des rappels pour les factures en attente
                      </p>
                    </div>
                    <Switch
                      checked={settings.preferences.notifications.invoiceReminders}
                      onCheckedChange={(checked) => setSettings(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          notifications: { ...prev.preferences.notifications, invoiceReminders: checked }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("de préférences")} disabled={saving}>
                {saving ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Sauvegarder les préférences
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sécurité du compte</CardTitle>
              <CardDescription>Gérez la sécurité de votre compte et vos mots de passe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Authentification à deux facteurs</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Activer l'authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">
                      Ajoutez une couche de sécurité supplémentaire à votre compte
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, twoFactorAuth: checked }
                    }))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Changer le mot de passe</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button
                  onClick={() => handlePasswordChange("", "", "")}
                  disabled={saving}
                  variant="outline"
                >
                  {saving ? (
                    <>
                      <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                      Changement...
                    </>
                  ) : (
                    <>
                      <Icon name="Key" className="h-4 w-4 mr-2" />
                      Changer le mot de passe
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Sessions actives</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Session actuelle</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date().toLocaleString("fr-FR")} • Navigateur actuel
                      </p>
                    </div>
                    <Badge variant="default">Actif</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Icon name="LogOut" className="h-4 w-4 mr-2" />
                  Terminer toutes les autres sessions
                </Button>
              </div>

              <Button onClick={() => handleSave("de sécurité")} disabled={saving}>
                {saving ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Sauvegarder les paramètres de sécurité
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de facturation</CardTitle>
              <CardDescription>Gérez vos préférences de facturation et de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise</Label>
                  <Select
                    value={settings.billing.currency}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      billing: { ...prev.billing, currency: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    value={settings.billing.taxRate}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      billing: { ...prev.billing, taxRate: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode de paiement préférée</Label>
                <Select
                  value={settings.billing.paymentMethod}
                  onValueChange={(value) => setSettings(prev => ({
                    ...prev,
                    billing: { ...prev.billing, paymentMethod: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Carte bancaire</SelectItem>
                    <SelectItem value="transfer">Virement bancaire</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Informations de facturation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="billingName">Nom de facturation</Label>
                    <Input id="billingName" placeholder="Nom de l'entreprise" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingAddress">Adresse</Label>
                    <Input id="billingAddress" placeholder="Adresse de facturation" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCity">Ville</Label>
                    <Input id="billingCity" placeholder="Ville" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingPostal">Code postal</Label>
                    <Input id="billingPostal" placeholder="Code postal" />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("de facturation")} disabled={saving}>
                {saving ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Icon name="Save" className="h-4 w-4 mr-2" />
                    Sauvegarder les paramètres de facturation
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

