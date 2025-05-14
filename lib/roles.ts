export type UserRole = "super_admin" | "admin" | "editor" | "viewer"

// Map of role names to display names
export const roleDisplayNames: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  viewer: "Viewer",
}

// Role hierarchy (higher index = more permissions)
export const roleHierarchy: UserRole[] = ["viewer", "editor", "admin", "super_admin"]

/**
 * Check if a user has at least the specified role level
 * @param userRole The user's current role
 * @param requiredRole The minimum role required
 * @returns boolean indicating if the user has sufficient permissions
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const userRoleIndex = roleHierarchy.indexOf(userRole)
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole)

  return userRoleIndex >= requiredRoleIndex
}

/**
 * Get a list of roles that a user can assign to others based on their own role
 * Users can only assign roles that are lower in the hierarchy than their own
 * @param userRole The user's current role
 * @returns Array of roles the user can assign
 */
export function getAssignableRoles(userRole: UserRole): UserRole[] {
  const userRoleIndex = roleHierarchy.indexOf(userRole)
  return roleHierarchy.filter((_, index) => index < userRoleIndex)
}

/**
 * Format a role for display
 * @param role The role to format
 * @returns Formatted role name
 */
export function formatRole(role: string): string {
  return roleDisplayNames[role as UserRole] || role
}
