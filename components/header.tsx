"use client"

import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, User } from "lucide-react"
import Link from "next/link"
import { siteConfig } from "@/config/site"

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <header className="bg-casino-darker border-b border-casino-blue/20">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gold">
          {siteConfig.name}
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm text-gray-400 hover:text-gold">
            Home
          </Link>
          <Link href="/casinos" className="text-sm text-gray-400 hover:text-gold">
            Casinos
          </Link>
          <Link href="/bonuses" className="text-sm text-gray-400 hover:text-gold">
            Bonuses
          </Link>
          <Link href="/articles" className="text-sm text-gray-400 hover:text-gold">
            Articles
          </Link>
        </nav>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">Administrator</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login" className="text-sm text-gray-400 hover:text-gold">
            Login
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header

