"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Copy } from "lucide-react"

export function CreateApiKeyDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [site, setSite] = useState("")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)

  const handleGenerate = () => {
    // In a real app, you would call an API to generate a key
    const key = `bo_live_${site.toLowerCase().replace(/[^a-z0-9]/g, "")}_${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(key)
  }

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey)
      toast({
        title: "API key copied",
        description: "The API key has been copied to your clipboard.",
      })
    }
  }

  const handleClose = () => {
    setOpen(false)
    setName("")
    setSite("")
    setGeneratedKey(null)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate API Key</DialogTitle>
          <DialogDescription>
            Create a new API key for an affiliate site to connect to the backoffice.
          </DialogDescription>
        </DialogHeader>
        {!generatedKey ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Key Name</Label>
              <Input
                id="name"
                placeholder="e.g. Casino Offers API Key"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="site">Site</Label>
              <Select value={site} onValueChange={setSite}>
                <SelectTrigger id="site">
                  <SelectValue placeholder="Select a site" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casinooffers">casinooffers.com</SelectItem>
                  <SelectItem value="bestcasinobonuses">bestcasinobonuses.net</SelectItem>
                  <SelectItem value="slotmachine">slotmachine.org</SelectItem>
                  <SelectItem value="casinoreview">casinoreview.com</SelectItem>
                  <SelectItem value="gamblingguide">gamblingguide.net</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex items-center space-x-2">
                <code className="relative w-full rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                  {generatedKey}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopy}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy API key</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Make sure to copy this key now. You won't be able to see it again!
              </p>
            </div>
          </div>
        )}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {!generatedKey ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleGenerate} disabled={!name || !site}>
                Generate Key
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleCopy}>Copy Key</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

