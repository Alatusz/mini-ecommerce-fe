import { Link } from "react-router-dom"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Google from "@/assets/google.svg"

import { useLogin } from "./useHooks"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"

function LoginPage() {
  const { control, handleSubmit, isSubmitting } = useLogin()

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-sm shadow-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="example@email"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="******"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button type="submit" className="w-full">
              {isSubmitting ? "Loggin in..." : "Login"}
            </Button>
          </form>

          <div className="relative my-4 flex items-center justify-center">
            <Separator />
            <span className="absolute bg-card px-2 text-xs text-muted-foreground uppercase">
              OR
            </span>
          </div>

          <Button variant="outline" className="w-full gap-2">
            <img src={Google} alt="Google" className="h-4 w-4" />
            <span>Google</span>
          </Button>
        </CardContent>

        <CardFooter className="justify-center border-t text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="ml-1 text-primary hover:underline">
            Sign up
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage
