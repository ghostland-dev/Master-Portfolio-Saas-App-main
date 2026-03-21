"use client"

import * as React from "react"
import { Formik, FormikProps, FormikConfig, FormikValues } from "formik"
import { cn } from "@/lib/utils"

interface FormProps<Values extends FormikValues>
  extends Omit<FormikConfig<Values>, "children"> {
  children: (props: FormikProps<Values>) => React.ReactNode
  className?: string
}

export function Form<Values extends FormikValues>({
  children,
  className,
  ...formikProps
}: FormProps<Values>) {
  return (
    <Formik<Values> {...formikProps}>
      {(formikProps) => (
        <form
          onSubmit={formikProps.handleSubmit}
          className={cn("space-y-6", className)}
        >
          {children(formikProps)}
        </form>
      )}
    </Formik>
  )
}

interface FormFieldProps {
  name: string
  label?: string
  error?: string
  touched?: boolean
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  name,
  label,
  error,
  touched,
  required,
  children,
  className
}: FormFieldProps) {
  const hasError = error && touched

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <span className="h-4 w-4">⚠️</span>
          {error}
        </p>
      )}
    </div>
  )
}

interface FormGroupProps {
  children: React.ReactNode
  className?: string
}

export function FormGroup({ children, className }: FormGroupProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  )
}

interface FormActionsProps {
  children: React.ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={cn("flex items-center gap-3 pt-4", className)}>
      {children}
    </div>
  )
}
