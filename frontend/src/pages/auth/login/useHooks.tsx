import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().trim().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLogin() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form Data:", data)
  }

  return {
    control,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  }
}
