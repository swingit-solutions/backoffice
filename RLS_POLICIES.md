# Row Level Security (RLS) Policies

This document explains the Row Level Security (RLS) policies used in our Supabase database and how to troubleshoot common issues.

## Overview

Row Level Security (RLS) is a feature in PostgreSQL that allows us to restrict which rows a user can access or modify in a table. We use RLS to ensure data isolation between tenants and to enforce access control.

## Required Policies for Registration

For the registration process to work correctly, the following policies must be in place:

1. **Tenant Creation Policy**:
\`\`\`sql
CREATE POLICY "Allow authenticated users to insert into tenants" ON public.tenants
FOR INSERT TO authenticated
WITH CHECK (true);
\`\`\`

2. **User Creation Policy**:
\`\`\`sql
CREATE POLICY "Allow authenticated users to insert into users" ON public.users
FOR INSERT TO authenticated
WITH CHECK (true);
\`\`\`

3. **Affiliate Network Creation Policy**:
\`\`\`sql
CREATE POLICY "Allow authenticated users to insert into affiliate_networks" ON public.affiliate_networks
FOR INSERT TO authenticated
WITH CHECK (true);
\`\`\`

## Common RLS Issues

### "new row violates row-level security policy for table 'tenants'"

This error occurs when a user tries to insert a row into the `tenants` table but doesn't have permission according to the RLS policies.

**Solution**:
1. Run the `fix-rls-policies.sql` script in your Supabase SQL Editor
2. Verify the policies exist by querying:
\`\`\`sql
SELECT * FROM pg_policies WHERE tablename = 'tenants';
\`\`\`

### Testing RLS Policies

To test if your RLS policies are working correctly:

1. Open the Supabase Dashboard
2. Go to the SQL Editor
3. Run the following query:
\`\`\`sql
-- Enable RLS testing mode
SET request.jwt.claim.sub = 'user-id-here';

-- Try to insert a test tenant
INSERT INTO public.tenants (name, subscription_status)
VALUES ('Test Tenant', 'trial')
RETURNING *;

-- Clean up (optional)
DELETE FROM public.tenants WHERE name = 'Test Tenant';
\`\`\`

## Applying RLS Fixes

If you encounter RLS issues in production:

1. Go to the Supabase Dashboard > SQL Editor
2. Copy and paste the contents of `fix-rls-policies.sql`
3. Run the script
4. Try the registration process again

## Best Practices

1. Always test RLS policies locally before deploying
2. Include RLS policy creation in your database migration scripts
3. Use the `WITH CHECK` clause for INSERT operations
4. Use the `USING` clause for SELECT, UPDATE, and DELETE operations
5. Be explicit about which roles can access which data
