"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Icon } from "@/components/ui/icon"
import { useToast } from "@/components/ui/use-toast"
import { format, addDays, isAfter, isBefore } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, Clock, User, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react"

type AppointmentType = "consultation" | "project-discussion" | "technical-review" | "training"
type Duration = "30" | "60" | "90" | "120"
type TimeSlot = "09:00" | "10:00" | "11:00" | "14:00" | "15:00" | "16:00" | "17:00"

interface TimeSlotData {
  time: TimeSlot
  available: boolean
}

export default function AppointmentPage() {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<TimeSlot | null>(null)
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("consultation")
  const [duration, setDuration] = useState<Duration>("60")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDescription: "",
    budget: "",
    timeline: "",
    additionalInfo: ""
  })

  // Available time slots (simplified - in real app, this would come from API)
  const timeSlots: TimeSlotData[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:00", available: true }
  ]

  const appointmentTypes = [
    {
      id: "consultation" as AppointmentType,
      title: "Consultation gratuite",
      description: "Discussion de 30 minutes pour évaluer vos besoins",
      duration: "30 min",
      price: "Gratuit",
      icon: "MessageSquare"
    },
    {
      id: "project-discussion" as AppointmentType,
      title: "Discussion de projet",
      description: "Analyse détaillée de votre projet et estimation",
      duration: "60 min",
      price: "Gratuit",
      icon: "Briefcase"
    },
    {
      id: "technical-review" as AppointmentType,
      title: "Revue technique",
      description: "Audit de votre code ou architecture existante",
      duration: "90 min",
      price: "150€",
      icon: "Code"
    },
    {
      id: "training" as AppointmentType,
      title: "Formation",
      description: "Session de formation personnalisée",
      duration: "2h",
      price: "200€",
      icon: "GraduationCap"
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset time when date changes
  }

  const handleTimeSelect = (time: TimeSlot) => {
    setSelectedTime(time)
  }

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: "destructive",
        title: "Sélection requise",
        description: "Veuillez sélectionner une date et un créneau horaire.",
      })
      return
    }

    if (!formData.name || !formData.email) {
      toast({
        variant: "destructive",
        title: "Informations requises",
        description: "Veuillez remplir au moins votre nom et email.",
      })
      return
    }

    // Simulate appointment booking
    toast({
      title: "Rendez-vous confirmé !",
      description: `Votre ${appointmentTypes.find(t => t.id === appointmentType)?.title.toLowerCase()} est programmé pour le ${format(selectedDate, "dd/MM/yyyy", { locale: fr })} à ${selectedTime}.`,
    })

    // Reset form
    setStep(1)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      projectDescription: "",
      budget: "",
      timeline: "",
      additionalInfo: ""
    })
  }

  const nextStep = () => {
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const isDateDisabled = (date: Date) => {
    return isBefore(date, new Date()) || isAfter(date, addDays(new Date(), 30))
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Prendre rendez-vous</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Planifiez une consultation personnalisée pour discuter de votre projet et obtenir des conseils d'expert.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step > stepNumber ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Type de rendez-vous"}
                  {step === 2 && "Sélection de la date"}
                  {step === 3 && "Créneau horaire"}
                  {step === 4 && "Informations de contact"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Choisissez le type de consultation qui correspond à vos besoins"}
                  {step === 2 && "Sélectionnez une date disponible"}
                  {step === 3 && "Choisissez un créneau horaire"}
                  {step === 4 && "Renseignez vos informations de contact"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Appointment Type */}
                {step === 1 && (
                  <div className="space-y-4">
                    <RadioGroup value={appointmentType} onValueChange={(value) => setAppointmentType(value as AppointmentType)}>
                      {appointmentTypes.map((type) => (
                        <div key={type.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                          <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                          <div className="flex-1">
                            <Label htmlFor={type.id} className="cursor-pointer">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <Icon name={type.icon as any} className="h-5 w-5" />
                                  <span className="font-medium">{type.title}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline">{type.duration}</Badge>
                                  <Badge variant={type.price === "Gratuit" ? "default" : "secondary"}>
                                    {type.price}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                )}

                {/* Step 2: Date Selection */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={isDateDisabled}
                        className="rounded-md border"
                      />
                    </div>
                    {selectedDate && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Date sélectionnée : {format(selectedDate, "EEEE dd MMMM yyyy", { locale: fr })}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Step 3: Time Selection */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => handleTimeSelect(slot.time)}
                          className="h-12"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                    {selectedTime && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Créneau sélectionné : {selectedTime}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}

                {/* Step 4: Contact Information */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          placeholder="Votre nom complet"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Entreprise</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => handleInputChange("company", e.target.value)}
                          placeholder="Nom de votre entreprise"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Description du projet</Label>
                      <Textarea
                        id="projectDescription"
                        value={formData.projectDescription}
                        onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                        placeholder="Décrivez brièvement votre projet..."
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget estimé</Label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<5000">Moins de 5 000€</SelectItem>
                            <SelectItem value="5000-15000">5 000€ - 15 000€</SelectItem>
                            <SelectItem value="15000-50000">15 000€ - 50 000€</SelectItem>
                            <SelectItem value="50000+">Plus de 50 000€</SelectItem>
                            <SelectItem value="discuss">À discuter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Délai souhaité</Label>
                        <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un délai" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent (1-2 semaines)</SelectItem>
                            <SelectItem value="1month">1 mois</SelectItem>
                            <SelectItem value="2-3months">2-3 mois</SelectItem>
                            <SelectItem value="6months+">6 mois ou plus</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalInfo">Informations supplémentaires</Label>
                      <Textarea
                        id="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                        placeholder="Toute information supplémentaire que vous souhaitez partager..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    Précédent
                  </Button>
                  {step < 4 ? (
                    <Button onClick={nextStep}>
                      Suivant
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Confirmer le rendez-vous
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Résumé du rendez-vous</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointmentType && (
                  <div>
                    <h4 className="font-medium mb-2">Type de consultation</h4>
                    <div className="flex items-center space-x-2">
                      <Icon name={appointmentTypes.find(t => t.id === appointmentType)?.icon as any} className="h-4 w-4" />
                      <span className="text-sm">{appointmentTypes.find(t => t.id === appointmentType)?.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {appointmentTypes.find(t => t.id === appointmentType)?.description}
                    </p>
                  </div>
                )}

                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-2">Date</h4>
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="text-sm">{format(selectedDate, "dd/MM/yyyy", { locale: fr })}</span>
                    </div>
                  </div>
                )}

                {selectedTime && (
                  <div>
                    <h4 className="font-medium mb-2">Heure</h4>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{selectedTime}</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Informations importantes</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Le rendez-vous se déroulera en visioconférence</li>
                    <li>• Un lien de connexion vous sera envoyé par email</li>
                    <li>• Vous pouvez annuler jusqu'à 24h avant</li>
                    <li>• La consultation est confidentielle</li>
                  </ul>
                </div>

                <Separator />

                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Questions ? Contactez-moi directement
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:ismail@mouyahada.fr">
                      <Mail className="mr-2 h-4 w-4" />
                      ismail@mouyahada.fr
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}