import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function SiteStats() {
  const sites = [
    {
      id: 1,
      name: "casinooffers.com",
      casinos: 24,
      articles: 36,
      banners: 8,
      status: "active",
    },
    {
      id: 2,
      name: "bestcasinobonuses.net",
      casinos: 18,
      articles: 22,
      banners: 6,
      status: "active",
    },
    {
      id: 3,
      name: "slotmachine.org",
      casinos: 15,
      articles: 12,
      banners: 4,
      status: "active",
    },
    {
      id: 4,
      name: "casinoreview.com",
      casinos: 30,
      articles: 45,
      banners: 10,
      status: "maintenance",
    },
    {
      id: 5,
      name: "gamblingguide.net",
      casinos: 12,
      articles: 18,
      banners: 5,
      status: "active",
    },
  ]

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Site</TableHead>
          <TableHead className="text-right">Casinos</TableHead>
          <TableHead className="text-right">Articles</TableHead>
          <TableHead className="text-right">Banners</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sites.map((site) => (
          <TableRow key={site.id}>
            <TableCell className="font-medium">{site.name}</TableCell>
            <TableCell className="text-right">{site.casinos}</TableCell>
            <TableCell className="text-right">{site.articles}</TableCell>
            <TableCell className="text-right">{site.banners}</TableCell>
            <TableCell className="text-right">
              <Badge variant={site.status === "active" ? "default" : "secondary"}>{site.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

