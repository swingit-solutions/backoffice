export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
        <h1 className="mt-2 text-xl font-bold">Loading...</h1>
        <p className="mt-2 text-muted-foreground">Please wait while we load the page.</p>
      </div>
    </div>
  )
}
