"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

type CreateUserProps = {
  tenantId: string
}

export default function CreateUser({ tenantId }: CreateUserProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("editor")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const supabase = createClient()

  async function inviteUser() {
    if (!email) {
      setMessage({ type: "error", text: "Email is required" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // First, check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .eq("tenant_id", tenantId)
        .single()

      if (existingUser) {
        setMessage({ type: "error", text: "User already exists in this organization" })
        setLoading(false)
        return
      }

      // Create user invitation record
      const { data, error } = await supabase
        .from("user_invitations")
        .insert([
          {
            email,
            role,
            tenant_id: tenantId,
            invited_at: new Date().toISOString(),
            status: "pending",
          },
        ])
        .select()

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: `Successfully invited ${email} as ${role}. They will receive an email with instructions.`,
      })
      setEmail("")
      setRole("editor")
    } catch (error: any) {
      console.error("Error inviting user:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to invite user",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite User</CardTitle>
        <CardDescription>Add a new user to your organization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            disabled={loading}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">User Role</Label>
          <Select value={role} onValueChange={setRole} disabled={loading}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={inviteUser} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Invitation...
            </>
          ) : (
            "Invite User"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
