import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { login } from "@/services/auth.services"
import { toast } from "@/components/ui/toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export const loginSchema = z.object({
  email: z.string().min(1, "กรุณากรอกอีเมล").email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().trim().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export function useLogin() {
  const navigate = useNavigate()

  const { setUser } = useAuth()

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

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data)

      setUser({
        id: res.data.id,
        email: res.data.email,
        role: res.data.role,
      })

      toast.add({
        type: "success",
        description: "User logged in successfully",
      })
      navigate("/")
    } catch (error: any) {
      toast.add({
        type: "error",
        description: error.response?.data?.message || "Failed to login user",
      })
    }
  }

  return {
    control,
    register,
    handleSubmit: handleSubmit(onSubmit),
    errors,
    isSubmitting,
  }
}
