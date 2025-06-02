import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "../../lib/utils"
import { Label } from "./label"

// Root form provider
const Form = FormProvider

const FormFieldContext = React.createContext({})
const FormItemContext = React.createContext({})

// === Field ===
const FormField = (props) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// === Hook ===
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

// === Form Item ===
const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        ref={ref}
        className={cn("space-y-1.5 text-[#1a1a1a]", className)}
        {...props}
      />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// === Label ===
const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      htmlFor={formItemId}
      className={cn(
        "block text-sm font-medium",
        error ? "text-red-600" : "text-[#1a1a1a]",
        className
      )}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

// === Control ===
const FormControl = React.forwardRef((props, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

// === Description ===
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-xs text-[#6b7280]", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// === Message ===
const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) return null

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-xs font-medium text-red-600", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
