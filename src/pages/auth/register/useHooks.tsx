import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { register } from "@/services/auth.services"
import { toast } from "@/components/ui/toast"

// 1. Zod Validation
export const registerSchema = z
  .object({
    email: z
      .email()
      .min(1, "กรุณากรอกอีเมล"),
    password: z.string().trim().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().trim().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export function useRegister() {
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await register({
        email: data.email,
        password: data.password,
      })

      toast.add({
        type: "success",
        description: "สมัครสมาชิกสำเร็จเรียบร้อยแล้ว",
      })

      navigate("/login")
    } catch (error: any) {
      toast.add({
        type: "error",
        description:
          error.response?.data?.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก",
      })
    }
  }

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isSubmitting,
  }
}
