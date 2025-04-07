import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase-server"
import LoginForm from "@/components/login-form"

export default async function LoginPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is already logged in, redirect to the dashboard
  if (session) {
    redirect("/backoffice/dashboard")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Backoffice Login</h1>
          <p className="mt-2 text-gray-400">Sign in to manage your affiliate network</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

