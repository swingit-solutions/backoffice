"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createSite } from "@/lib/api-client"

export default function NewSitePage() {
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    description: "",
    contactEmail: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Update form data
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    // If updating the name, also update the domain suggestion
    if (name === "name") {
      const domainValue = value.toLowerCase().replace(/[^a-z0-9]/g, "-")
      setFormData({
        ...formData,
        name: value,
        domain: `${domainValue}.swingit.solutions`,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Call API to create site
      const result = await createSite(formData)

      if (!result.success) {
        throw new Error(result.error || "Failed to create site")
      }

      toast({
        title: "Site created successfully",
        description: `${formData.name} has been created and is being deployed.`,
      })

      // Redirect to sites list
      router.push("/sites")
    } catch (error: any) {
      toast({
        title: "Failed to create site",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Create New Affiliate Site</h1>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Site Details</CardTitle>
          <CardDescription>
            Create a new affiliate site based on the template. This will create a new GitHub repository and deploy it to
            Vercel automatically.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Casino Offers"
                required
              />
              <p className="text-sm text-gray-500">A human-readable name for your site.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                placeholder="casino-offers.swingit.solutions"
                required
              />
              <p className="text-sm text-gray-500">The domain where your site will be accessible.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="A site featuring the best casino offers and bonuses."
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="admin@swingit.solutions"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/sites")}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Site"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

