"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/use-toast"

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
  const [newTenant, setNewTenant] = useState({
    name: "",
    subscription_tier: "basic",
    max_sites: 5,
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTenants()
  }, [])

  async function fetchTenants() {
    setLoading(true)
    const { data, error } = await supabase.from("tenants").select("*").order("created_at", { ascending: false })

    if (error) {
      toast({
        title: "Error fetching tenants",
        description: error.message,
        variant: "destructive",
      })
    } else {
      setTenants(data || [])
    }
    setLoading(false)
  }

  async function createTenant() {
    if (!newTenant.name) {
      toast({
        title: "Validation Error",
        description: "Tenant name is required",
        variant: "destructive",
      })
      return
    }

    const { data, error } = await supabase
      .from("tenants")
      .insert([
        {
          name: newTenant.name,
          subscription_tier: newTenant.subscription_tier,
          max_sites: newTenant.max_sites,
        },
      ])
      .select()

    if (error) {
      toast({
        title: "Error creating tenant",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Tenant created",
        description: `Successfully created tenant: ${newTenant.name}`,
      })
      setNewTenant({
        name: "",
        subscription_tier: "basic",
        max_sites: 5,
      })
      fetchTenants()
    }
  }

  async function updateTenantStatus(id: string, status: string) {
    const { error } = await supabase.from("tenants").update({ subscription_status: status }).eq("id", id)

    if (error) {
      toast({
        title: "Error updating tenant",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Tenant updated",
        description: `Successfully updated tenant status to: ${status}`,
      })
      fetchTenants()
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Tenant</CardTitle>
          <CardDescription>Add a new organization to the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={newTenant.name}
              onChange={(e) => setNewTenant({ ...newTenant, name: e.target.value })}
              placeholder="Acme Corp"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tier">Subscription Tier</Label>
            <Select
              value={newTenant.subscription_tier}
              onValueChange={(value) => setNewTenant({ ...newTenant, subscription_tier: value })}
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
              value={newTenant.max_sites}
              onChange={(e) => setNewTenant({ ...newTenant, max_sites: Number.parseInt(e.target.value) })}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createTenant}>Create Tenant</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Tenants</CardTitle>
          <CardDescription>View and manage all organizations</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : tenants.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No tenants found</p>
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
                        <span className="font-medium">Status:</span> {tenant.subscription_status}
                      </div>
                      <div>
                        <span className="font-medium">Tier:</span> {tenant.subscription_tier}
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
