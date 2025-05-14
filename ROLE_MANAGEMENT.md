# Role Management Guide

This document explains the role system in our application and how to manage user roles.

## Role Hierarchy

Our application uses the following role hierarchy (from highest to lowest permissions):

1. **super_admin** - Full system access, can manage all tenants and users
2. **admin** - Can manage users and content within their tenant
3. **editor** - Can create and edit content but not manage users
4. **viewer** - Read-only access to content

## Role Capabilities

### super_admin
- Access to all features and data
- Can create, update, and delete tenants
- Can manage all users across all tenants
- Can access system settings
- Can view system-wide analytics

### admin
- Can manage users within their tenant
- Can create, update, and delete content
- Can view analytics for their tenant
- Cannot access other tenants' data
- Cannot access system settings

### editor
- Can create and edit content
- Cannot manage users
- Cannot delete certain types of content
- Cannot access system settings

### viewer
- Read-only access to content
- Cannot make any changes
- Cannot access user management or settings

## Role Assignment

### Initial Setup
- The first user is typically assigned the `super_admin` role
- This is done through the `/api/setup` endpoint

### User Management
- `super_admin` users can assign any role to any user
- `admin` users can only assign `editor` and `viewer` roles to users within their tenant
- `editor` and `viewer` users cannot assign roles

## Troubleshooting

### Common Issues

#### User can't access admin features
- Check if the user has the correct role in the database
- Verify that the role is spelled correctly (`super_admin`, not `superadmin`)
- Check if the user is trying to access features outside their role's permissions

#### Role not being recognized
- Make sure the role is one of: `super_admin`, `admin`, `editor`, `viewer`
- Check for typos in the role name
- Verify that the role is stored correctly in the database

### How to Fix Role Issues

#### Updating a user's role
1. Go to the Supabase dashboard
2. Navigate to the SQL Editor
3. Run the following SQL (replace values as needed):
\`\`\`sql
UPDATE public.users
SET role = 'super_admin'  -- or 'admin', 'editor', 'viewer'
WHERE email = 'user@example.com';
\`\`\`

#### Converting an admin to super_admin
\`\`\`sql
UPDATE public.users
SET role = 'super_admin', tenant_id = NULL
WHERE email = 'admin@example.com';
\`\`\`

Note: `super_admin` users should have `tenant_id` set to `NULL` as they are not associated with any specific tenant.

## Best Practices

1. Limit the number of `super_admin` users
2. Regularly audit user roles
3. Follow the principle of least privilege
4. Document role changes
5. Test role-based access after making changes
