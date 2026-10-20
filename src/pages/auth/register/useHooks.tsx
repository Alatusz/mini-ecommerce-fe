import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export const registerSchema = z
  .object({
    email: z.email().min(1, "กรุณากรอกอีเมล"),
    password: z.string().trim().min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"),
    confirmPassword: z.string().trim().min(1, "กรุณายืนยันรหัสผ่าน"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "รหัสผ่านไม่ตรงกัน",
    path: ["confirmPassword"],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

export function useRegister() {
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

  const onSubmit = (data: RegisterFormValues) => {
    console.log("Register Data:", data)
    // เตรียมเชื่อมต่อ API สมัครสมาชิกตรงนี้
  }

  return {
    control,
    handleSubmit: handleSubmit(onSubmit),
    isSubmitting,
  }
}
