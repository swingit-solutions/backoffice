import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiKeysList } from "@/components/api-keys/api-keys-list"
import { PlusCircle } from "lucide-react"
import { CreateApiKeyDialog } from "@/components/api-keys/create-api-key-dialog"

export const dynamic = "force-dynamic"

export default function ApiKeysPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API Keys</h1>
          <p className="text-muted-foreground">Manage API keys for your affiliate sites</p>
        </div>
        <CreateApiKeyDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Generate API Key
          </Button>
        </CreateApiKeyDialog>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>API keys allow your affiliate sites to connect to the backoffice</CardDescription>
        </CardHeader>
        <CardContent>
          <ApiKeysList />
        </CardContent>
      </Card>
    </div>
  )
}
