"use client"

import { toast } from "sonner"
import React from "react"
import { Icon } from "@/components/ui/icon"

export interface ToastOptions {
  title?: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const useToast = () => {
  const showToast = (
    type: "success" | "error" | "warning" | "info",
    message: string,
    options: ToastOptions = {}
  ) => {
    const { title, description, duration = 4000, action } = options

    const toastConfig = {
      description: description || message,
      duration,
      action: action ? {
        label: action.label,
        onClick: action.onClick
      } : undefined,
    }

    switch (type) {
      case "success":
        return toast.success(title || "Succès", {
          ...toastConfig,
          icon: React.createElement(Icon, { name: "CheckCircle", className: "h-4 w-4" }),
        })
      
      case "error":
        return toast.error(title || "Erreur", {
          ...toastConfig,
          icon: React.createElement(Icon, { name: "XCircle", className: "h-4 w-4" }),
        })
      
      case "warning":
        return toast.warning(title || "Attention", {
          ...toastConfig,
          icon: React.createElement(Icon, { name: "AlertTriangle", className: "h-4 w-4" }),
        })
      
      case "info":
        return toast.info(title || "Information", {
          ...toastConfig,
          icon: React.createElement(Icon, { name: "Info", className: "h-4 w-4" }),
        })
      
      default:
        return toast(message, toastConfig)
    }
  }

  return {
    toast: showToast,
    success: (message: string, options?: ToastOptions) => 
      showToast("success", message, options),
    error: (message: string, options?: ToastOptions) => 
      showToast("error", message, options),
    warning: (message: string, options?: ToastOptions) => 
      showToast("warning", message, options),
    info: (message: string, options?: ToastOptions) => 
      showToast("info", message, options),
    dismiss: toast.dismiss,
    promise: toast.promise,
  }
}