import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "react-router-dom"
import { useCreateUserMutation } from "../useHubs"

export const createUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "staff", "customer"]),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>

export function useCreateUser() {
  const navigate = useNavigate()
  const mutation = useCreateUserMutation()

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "customer",
      phone: "",
      bio: "",
    },
  })

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values)
  })

  const handleCancel = () => {
    navigate("/dashboard/users")
  }

  return {
    form,
    onSubmit,
    handleCancel,
    isSubmitting: mutation.isPending,
  }
}
