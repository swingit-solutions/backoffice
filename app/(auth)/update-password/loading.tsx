import { Globe } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md text-center">
        <Globe className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-2 text-3xl font-bold">Verifying...</h1>
        <p className="mt-2 text-muted-foreground">Please wait while we verify your reset link.</p>
      </div>
    </div>
  )
}
