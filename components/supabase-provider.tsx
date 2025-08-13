"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseClient, User } from "@supabase/supabase-js"

type SupabaseContext = {
  supabase: SupabaseClient
  user: User | null
  loading: boolean
}

const Context = createContext<SupabaseContext | undefined>(undefined)

export function SupabaseProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode
  initialUser?: User | null
}) {
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<User | null>(initialUser)
  const [loading, setLoading] = useState(!initialUser)

  useEffect(() => {
    const getUser = async () => {
      if (!initialUser) {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_OUT") {
        // Clear any cached data
        setUser(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, initialUser])

  return <Context.Provider value={{ supabase, user, loading }}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}
