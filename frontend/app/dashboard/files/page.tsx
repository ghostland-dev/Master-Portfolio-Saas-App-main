"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icon } from "@/components/ui/icon"
import { useSupabase } from "@/components/providers/supabase-provider"
import { useProjects } from "@/hooks/use-supabase-data"

interface FileItem {
  id: string
  name: string
  type: "document" | "image" | "code" | "archive" | "other"
  size: number
  uploadDate: string
  projectId: string
  projectTitle: string
  uploadedBy: string
  description?: string
  version: string
}

export default function FilesPage() {
  const { user, loading: authLoading } = useSupabase()
  const isAdmin = user?.user_metadata?.role === 'admin'
  const { projects, loading: projectsLoading } = useProjects()
  
  const [files, setFiles] = useState<FileItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [newFile, setNewFile] = useState({
    name: "",
    description: "",
    projectId: "",
    file: null as File | null,
  })

  // Données simulées de fichiers
  const mockFiles: FileItem[] = [
    {
      id: "file1",
      name: "maquette-homepage.fig",
      type: "image",
      size: 2048576, // 2MB
      uploadDate: "2023-05-18T10:30:00",
      projectId: "project1",
      projectTitle: "E-commerce Platform",
      uploadedBy: "Marie Dupont",
      description: "Maquette de la page d'accueil avec les sections principales",
      version: "1.2",
    },
    {
      id: "file2",
      name: "specifications-techniques.pdf",
      type: "document",
      size: 1536000, // 1.5MB
      uploadDate: "2023-05-17T14:20:00",
      projectId: "project1",
      projectTitle: "E-commerce Platform",
      uploadedBy: "Ismail MOUYAHADA",
      description: "Documentation technique complète du projet",
      version: "2.0",
    },
    {
      id: "file3",
      name: "database-schema.sql",
      type: "code",
      size: 512000, // 512KB
      uploadDate: "2023-05-16T09:15:00",
      projectId: "project2",
      projectTitle: "CRM Dashboard",
      uploadedBy: "Ismail MOUYAHADA",
      description: "Schéma de base de données pour le CRM",
      version: "1.0",
    },
    {
      id: "file4",
      name: "assets-bundle.zip",
      type: "archive",
      size: 5242880, // 5MB
      uploadDate: "2023-05-15T16:45:00",
      projectId: "project3",
      projectTitle: "DevOps Pipeline",
      uploadedBy: "Sophie Legrand",
      description: "Archive contenant tous les assets du projet",
      version: "1.1",
    },
    {
      id: "file5",
      name: "user-manual.docx",
      type: "document",
      size: 1024000, // 1MB
      uploadDate: "2023-05-14T11:30:00",
      projectId: "project2",
      projectTitle: "CRM Dashboard",
      uploadedBy: "Jean Martin",
      description: "Manuel utilisateur pour le CRM",
      version: "1.0",
    },
  ]

  // Charger les données
  useEffect(() => {
    if (authLoading || !user) return

    try {
      // Filtrer les projets selon le rôle
      const projectsData = isAdmin ? projects : projects.filter((p: any) => p.client_id === user.id)
      // Filtrer les fichiers selon les projets accessibles
      const accessibleProjectIds = projectsData.map((p: any) => p.id)
      const filteredFiles = mockFiles.filter((f: any) => accessibleProjectIds.includes(f.projectId))
      setFiles(filteredFiles)
    } catch (error) {
      console.error("Erreur lors du chargement des fichiers:", error)
    }
  }, [user, isAdmin, authLoading, projects])

  // Filtrer les fichiers
  const filteredFiles = files.filter((file: any) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesProject = selectedProject === "all" || file.projectId === selectedProject
    const matchesType = selectedType === "all" || file.type === selectedType
    return matchesSearch && matchesProject && matchesType
  })

  // Obtenir les projets accessibles
  const getAccessibleProjects = () => {
    if (isAdmin) return projects
    return projects.filter((p: any) => p.client_id === user?.id)
  }

  // Formater la taille des fichiers
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Obtenir l'icône selon le type de fichier
  const getFileIcon = (type: string) => {
    switch (type) {
      case "document": return "FileText"
      case "image": return "Image"
      case "code": return "Code"
      case "archive": return "Archive"
      default: return "File"
    }
  }

  // Obtenir la couleur selon le type de fichier
  const getFileColor = (type: string) => {
    switch (type) {
      case "document": return "text-blue-600"
      case "image": return "text-green-600"
      case "code": return "text-purple-600"
      case "archive": return "text-orange-600"
      default: return "text-gray-600"
    }
  }

  // Gérer l'upload de fichier
  const handleFileUpload = async () => {
    if (!newFile.file || !newFile.name || !newFile.projectId) return

    setUploading(true)
    // Simuler l'upload
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const newFileItem: FileItem = {
      id: `file${Date.now()}`,
      name: newFile.name,
      type: newFile.file.type.startsWith('image/') ? 'image' : 
            newFile.file.type.includes('pdf') || newFile.file.type.includes('document') ? 'document' :
            newFile.file.type.includes('zip') || newFile.file.type.includes('rar') ? 'archive' :
            newFile.file.type.includes('text/') || newFile.file.type.includes('javascript') ? 'code' : 'other',
      size: newFile.file.size,
      uploadDate: new Date().toISOString(),
      projectId: newFile.projectId,
      projectTitle: getAccessibleProjects().find((p: any) => p.id === newFile.projectId)?.title || "",
      uploadedBy: user?.user_metadata?.full_name || user?.user_metadata?.name || "Utilisateur",
      description: newFile.description,
      version: "1.0",
    }

    setFiles((prev: any) => [newFileItem, ...prev])
    setNewFile({ name: "", description: "", projectId: "", file: null })
    setIsUploadDialogOpen(false)
    setUploading(false)
  }

  if (authLoading || projectsLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[50vh]">
        <Icon name="Loader2" className="h-12 w-12 animate-spin text-primary mb-4" aria-hidden={true} />
        <p className="text-lg">Chargement des fichiers...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Fichiers</h1>
          <p className="text-muted-foreground mt-2">Gérez vos documents et fichiers de projet</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Icon name="Upload" className="h-4 w-4 mr-2" />
              Télécharger un fichier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Télécharger un fichier</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau fichier à votre espace de travail.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fileName">Nom du fichier</Label>
                <Input
                  id="fileName"
                  value={newFile.name}
                  onChange={(e: any) => setNewFile((prev: any) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nom du fichier"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileProject">Projet</Label>
                <Select value={newFile.projectId} onValueChange={(value: any) => setNewFile((prev: any) => ({ ...prev, projectId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un projet" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAccessibleProjects().map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileDescription">Description (optionnel)</Label>
                <Textarea
                  id="fileDescription"
                  value={newFile.description}
                  onChange={(e: any) => setNewFile((prev: any) => ({ ...prev, description: e.target.value }))}
                  placeholder="Description du fichier"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fileUpload">Fichier</Label>
                <Input
                  id="fileUpload"
                  type="file"
                  onChange={(e: any) => setNewFile((prev: any) => ({ ...prev, file: e.target.files?.[0] || null }))}
                />
              </div>
              <Button onClick={handleFileUpload} disabled={uploading || !newFile.file || !newFile.name || !newFile.projectId} className="w-full">
                {uploading ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin mr-2" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Icon name="Upload" className="h-4 w-4 mr-2" />
                    Télécharger
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un fichier..."
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tous les projets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les projets</SelectItem>
            {getAccessibleProjects().map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="code">Code</SelectItem>
            <SelectItem value="archive">Archives</SelectItem>
            <SelectItem value="other">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Icon name="File" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Fichiers</p>
                <p className="text-2xl font-bold">{files.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Icon name="HardDrive" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Espace Utilisé</p>
                <p className="text-2xl font-bold">
                  {formatFileSize(files.reduce((sum: number, file: any) => sum + file.size, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Icon name="Image" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Images</p>
                <p className="text-2xl font-bold">{files.filter((f: any) => f.type === "image").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Documents</p>
                <p className="text-2xl font-bold">{files.filter((f: any) => f.type === "document").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des fichiers */}
      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="grid">Grille</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Icon name="FileX" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun fichier trouvé</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedProject !== "all" || selectedType !== "all"
                    ? "Aucun fichier ne correspond à vos critères de recherche."
                    : "Commencez par télécharger votre premier fichier."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg bg-muted ${getFileColor(file.type)}`}>
                          <Icon name={getFileIcon(file.type) as any} className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{file.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              v{file.version}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {file.description || "Aucune description"}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{file.projectTitle}</span>
                            <span>•</span>
                            <span>{formatFileSize(file.size)}</span>
                            <span>•</span>
                            <span>{new Date(file.uploadDate).toLocaleDateString("fr-FR")}</span>
                            <span>•</span>
                            <span>Par {file.uploadedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Icon name="Download" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icon name="Share" className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Icon name="MoreHorizontal" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="grid" className="space-y-4">
          {filteredFiles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Icon name="FileX" className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun fichier trouvé</h3>
                <p className="text-muted-foreground">
                  {searchQuery || selectedProject !== "all" || selectedType !== "all"
                    ? "Aucun fichier ne correspond à vos critères de recherche."
                    : "Commencez par télécharger votre premier fichier."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg bg-muted ${getFileColor(file.type)}`}>
                          <Icon name={getFileIcon(file.type) as any} className="h-6 w-6" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          v{file.version}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-medium text-sm truncate" title={file.name}>
                          {file.name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {file.description || "Aucune description"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          <p>{file.projectTitle}</p>
                          <p>{formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString("fr-FR")}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Par {file.uploadedBy}</span>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Icon name="Download" className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="Share" className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Icon name="MoreHorizontal" className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

