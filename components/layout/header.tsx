import { UserNav } from "./user-nav"
import type { User } from "@supabase/supabase-js"

interface HeaderProps {
  user: User
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">Affiliate Hub</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
