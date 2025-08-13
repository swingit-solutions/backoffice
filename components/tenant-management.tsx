"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Building2 } from "lucide-react"

type Tenant = {
  id: string
  name: string
  subscription_status: string
  subscription_tier: string
  max_sites: number
  created_at: string
}

export default function TenantManagement() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [newTenant, setNewTenant] = useState({
    name: "",
    subscription_tier: "basic",
    max_sites: 5,
  })

  const supabase = createClient()

  useEffect(() => {
    fetchTenants()
  }, [])

  async function fetchTenants() {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("tenants").select("*").order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setTenants(data || [])
    } catch (error: any) {
      console.error("Error fetching tenants:", error)
      setMessage({ type: "error", text: error.message || "Failed to fetch tenants" })
    } finally {
      setLoading(false)
    }
  }

  async function createTenant() {
    if (!newTenant.name.trim()) {
      setMessage({ type: "error", text: "Tenant name is required" })
      return
    }

    setCreating(true)
    setMessage(null)

    try {
      const { data, error } = await supabase
        .from("tenants")
        .insert([
          {
            name: newTenant.name.trim(),
            subscription_tier: newTenant.subscription_tier,
            subscription_status: "trial",
            max_sites: newTenant.max_sites,
          },
        ])
        .select()

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: `Successfully created tenant: ${newTenant.name}`,
      })

      setNewTenant({
        name: "",
        subscription_tier: "basic",
        max_sites: 5,
      })

      fetchTenants()
    } catch (error: any) {
      console.error("Error creating tenant:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to create tenant",
      })
    } finally {
      setCreating(false)
    }
  }

  async function updateTenantStatus(id: string, status: string) {
    try {
      const { error } = await supabase.from("tenants").update({ subscription_status: status }).eq("id", id)

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: `Successfully updated tenant status to: ${status}`,
      })

      fetchTenants()
    } catch (error: any) {
      console.error("Error updating tenant:", error)
      setMessage({
        type: "error",
        text: error.message || "Failed to update tenant",
      })
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Create New Tenant
          </CardTitle>
          <CardDescription>Add a new organization to the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              placeholder="Acme Corp"
              disabled={creating}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tier">Subscription Tier</Label>
            <Select
              value={newTenant.subscription_tier}
              onValueChange={(value) => setNewTenant({ ...newTenant, subscription_tier: value })}
              disabled={creating}
            >
              <SelectTrigger id="tier">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="pro">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="max-sites">Maximum Sites</Label>
            <Input
              id="max-sites"
              type="number"
              min="1"
              max="100"
              value={newTenant.max_sites}
              onChange={(e) => setNewTenant({ ...newTenant, max_sites: Number.parseInt(e.target.value) || 5 })}
              disabled={creating}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createTenant} disabled={creating}>
            {creating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Tenant"
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Tenants</CardTitle>
          <CardDescription>View and manage all organizations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">No tenants found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {tenants.map((tenant) => (
                <Card key={tenant.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{tenant.name}</CardTitle>
                    <CardDescription>Created: {new Date(tenant.created_at).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`capitalize ${
                            tenant.subscription_status === "active"
                              ? "text-green-600"
                              : tenant.subscription_status === "trial"
                                ? "text-blue-600"
                                : tenant.subscription_status === "suspended"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                          }`}
                        >
                          {tenant.subscription_status}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Tier:</span>{" "}
                        <span className="capitalize">{tenant.subscription_tier}</span>
                      </div>
                      <div>
                        <span className="font-medium">Max Sites:</span> {tenant.max_sites}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Select
                      defaultValue={tenant.subscription_status}
                      onValueChange={(value) => updateTenantStatus(tenant.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => (window.location.href = `/admin/tenants/${tenant.id}`)}>
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
