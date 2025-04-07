import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { SitesList } from "@/components/sites/sites-list"

export default function SitesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sites</h1>
          <p className="text-muted-foreground">Manage your affiliate websites</p>
        </div>
        <Button asChild>
          <Link href="/sites/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Site
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Affiliate Sites</CardTitle>
          <CardDescription>View and manage all your affiliate websites</CardDescription>
        </CardHeader>
        <CardContent>
          <SitesList />
        </CardContent>
      </Card>
    </div>
  )
}

