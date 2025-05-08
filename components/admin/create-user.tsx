"use client"

import { useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

type CreateUserProps = {
  tenantId: string
}

export default function CreateUser({ tenantId }: CreateUserProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("editor")
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  async function inviteUser() {
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    // In a real app, you'd send an invitation email with a signup link
    // For this example, we'll just create the user directly
    const { data, error } = await supabase.from("users").insert([
      {
        email,
        role,
        tenant_id: tenantId,
      },
    ])

    setLoading(false)

    if (error) {
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "User invited",
        description: `Successfully invited ${email} as ${role}`,
      })
      setEmail("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite User</CardTitle>
        <CardDescription>Add a new user to your organization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">User Role</Label>
          <Select value={role} onValueChange={setRole}>
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
          {loading ? "Sending Invitation..." : "Invite User"}
        </Button>
      </CardFooter>
    </Card>
  )
}
