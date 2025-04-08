"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, Eye, EyeOff, MoreHorizontal, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

type ApiKey = {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
  status: "active" | "revoked"
}

// Mock data for API keys
const apiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Casino Offers API Key",
    key: "bo_live_casinooffers_12345abcdef",
    createdAt: "2023-06-15T10:00:00",
    lastUsed: "2023-07-20T15:30:00",
    status: "active",
  },
  {
    id: "2",
    name: "Best Casino Bonuses API Key",
    key: "bo_live_bestcasinobonuses_67890ghijkl",
    createdAt: "2023-06-20T11:30:00",
    lastUsed: "2023-07-19T09:45:00",
    status: "active",
  },
  {
    id: "3",
    name: "Slot Machine Guide API Key",
    key: "bo_live_slotmachine_mnopq12345",
    createdAt: "2023-07-05T14:15:00",
    lastUsed: "2023-07-18T16:20:00",
    status: "active",
  },
  {
    id: "4",
    name: "Casino Review API Key",
    key: "bo_live_casinoreview_67890rstuvw",
    createdAt: "2023-07-10T09:00:00",
    lastUsed: null,
    status: "revoked",
  },
]

export function ApiKeysList() {
  // Get auth context
  const auth = useAuth()
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null)
  const { toast } = useToast()

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "API key copied",
      description: `The API key for ${name} has been copied to your clipboard.`,
    })
  }

  const handleDeleteKey = () => {
    // In a real app, you would call an API to revoke the key
    console.log(`Revoking API key: ${keyToDelete?.name}`)
    setDeleteDialogOpen(false)
    setKeyToDelete(null)
    toast({
      title: "API key revoked",
      description: `The API key for ${keyToDelete?.name} has been revoked.`,
    })
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Last Used</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey.id}>
              <TableCell className="font-medium">{apiKey.name}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                    {visibleKeys[apiKey.id] ? apiKey.key : apiKey.key.substring(0, 8) + "••••••••••••••"}
                  </code>
                  <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(apiKey.id)}>
                    {visibleKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{visibleKeys[apiKey.id] ? "Hide" : "Show"} API key</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => copyToClipboard(apiKey.key, apiKey.name)}>
                    <Copy className="h-4 w-4" />
                    <span className="sr-only">Copy API key</span>
                  </Button>
                </div>
              </TableCell>
              <TableCell>{new Date(apiKey.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{apiKey.lastUsed ? new Date(apiKey.lastUsed).toLocaleDateString() : "Never"}</TableCell>
              <TableCell>
                <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>{apiKey.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => copyToClipboard(apiKey.key, apiKey.name)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy API Key
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => {
                        setKeyToDelete(apiKey)
                        setDeleteDialogOpen(true)
                      }}
                      disabled={apiKey.status === "revoked"}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Revoke API Key
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Revoking this API key will immediately invalidate it and any sites using it
              will lose access to the backoffice.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteKey}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
