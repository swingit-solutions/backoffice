import { redirect } from "next/navigation"

export default async function RootPage() {
  // Redirect to the login page
  redirect("/login")
}
