import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      user: "Admin",
      action: "Added a new casino",
      target: "Royal Vegas",
      time: "2 hours ago",
      initials: "A",
    },
    {
      id: 2,
      user: "Admin",
      action: "Updated article",
      target: "How to Choose the Best Online Casino",
      time: "3 hours ago",
      initials: "A",
    },
    {
      id: 3,
      user: "Admin",
      action: "Added a new banner",
      target: "Summer Promotion",
      time: "5 hours ago",
      initials: "A",
    },
    {
      id: 4,
      user: "Admin",
      action: "Created a new site",
      target: "casinobonus.com",
      time: "1 day ago",
      initials: "A",
    },
    {
      id: 5,
      user: "Admin",
      action: "Generated API key",
      target: "casinooffers.com",
      time: "2 days ago",
      initials: "A",
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{activity.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.user} {activity.action}
            </p>
            <p className="text-sm text-muted-foreground">{activity.target}</p>
          </div>
          <div className="text-xs text-muted-foreground">{activity.time}</div>
        </div>
      ))}
    </div>
  )
}

