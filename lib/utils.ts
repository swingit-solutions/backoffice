import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single className string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string to a readable format
 */
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Truncates a string to a specified length
 */
export function truncateString(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Formats a role string to be more readable
 */
export function formatRole(role: string) {
  return role.split("_").map(capitalizeFirstLetter).join(" ")
}

/**
 * Checks if a user has a specific role
 */
export function hasRole(userRole: string, requiredRoles: string[]) {
  return requiredRoles.includes(userRole)
}

/**
 * Checks if a user has permission to access a resource
 * This is a simplified version - in a real app, you'd have more complex permission logic
 */
export function hasPermission(userRole: string, action: string, resource: string) {
  // Super admin can do anything
  if (userRole === "super_admin") return true

  // Tenant admin can do anything within their tenant
  if (userRole === "admin" || userRole === "tenant_admin") {
    return true
  }

  // Editor can create and update content, but not delete or manage users
  if (userRole === "editor") {
    if (action === "delete" && resource !== "content_blocks") return false
    if (resource === "users" && action !== "view") return false
    return true
  }

  // Viewer can only view
  if (userRole === "viewer") {
    return action === "view"
  }

  return false
}
