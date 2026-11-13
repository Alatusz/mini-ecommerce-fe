import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate, useParams } from "react-router-dom"
import { useUserDetailQuery, useUpdateUserMutation } from "../useHubs"

export const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  role: z.enum(["admin", "staff", "customer"]),
  phone: z.string().optional(),
  bio: z.string().optional(),
})

export type EditUserFormValues = z.infer<typeof editUserSchema>

export function useEditUser() {
  const { id = "" } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = useUserDetailQuery(id)
  const mutation = useUpdateUserMutation(id)

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
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

  const user = data?.data

  useEffect(() => {
    if (user) {
      form.reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        role: user.role || "customer",
        phone: user.phone || "",
        bio: user.bio || "",
      })
    }
  }, [user, form])

  const onSubmit = form.handleSubmit((values) => {
    const payload = {
      ...values,
      password: values.password?.trim() ? values.password : undefined,
    }
    mutation.mutate(payload)
  })

  const handleCancel = () => {
    navigate("/dashboard/users")
  }

  return {
    form,
    onSubmit,
    handleCancel,
    isLoading,
    isSubmitting: mutation.isPending,
  }
}
