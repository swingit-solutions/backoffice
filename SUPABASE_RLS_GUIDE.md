# Supabase Row Level Security (RLS) Guide

This document provides a comprehensive guide to understanding and troubleshooting Row Level Security (RLS) in Supabase for our application.

## Understanding the Issue

The error `new row violates row-level security policy for table "tenants"` occurs when a user tries to insert data into a table but doesn't have the necessary permissions according to the RLS policies.

## Root Cause Analysis

In our application, this issue occurs during registration because:

1. When a user registers, they are authenticated but don't yet have a tenant
2. The RLS policies are set up to allow only specific operations
3. The registration process needs to create records in multiple tables (tenants, users, affiliate_networks)

## Solution Approaches

### Approach 1: Service Role API

The most secure approach is to use a service role API endpoint for registration:

1. The client authenticates the user with Supabase Auth
2. The client then calls a server API endpoint with the service role key
3. The server endpoint creates the necessary records bypassing RLS

This approach is implemented in our application with:
- `app/api/auth/service-role/route.ts` - Server endpoint with service role
- Updated registration form to use this endpoint

### Approach 2: Broader RLS Policies

If the service role approach doesn't work, we can broaden the RLS policies:

\`\`\`sql
-- Add the anon role to the policies
CREATE POLICY "Allow authenticated users to insert into tenants" ON public.tenants
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Grant insert permissions to anon
GRANT INSERT ON public.tenants TO anon;
\`\`\`

### Approach 3: Disable RLS Temporarily

As a last resort, you can temporarily disable RLS during development:

\`\`\`sql
-- Only use this for development/testing!
ALTER TABLE public.tenants DISABLE ROW LEVEL SECURITY;
\`\`\`

Remember to re-enable it before going to production:

\`\`\`sql
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
\`\`\`

## Debugging RLS Issues

To debug RLS issues:

1. Check existing policies:
\`\`\`sql
SELECT * FROM pg_policies WHERE tablename = 'tenants';
\`\`\`

2. Verify RLS is enabled:
\`\`\`sql
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'tenants';
\`\`\`

3. Test policies with a specific role:
\`\`\`sql
-- Set the role for testing
SET LOCAL ROLE authenticated;

-- Try an operation
INSERT INTO public.tenants (name, subscription_status) VALUES ('Test', 'trial');
\`\`\`

4. Check the Supabase logs for detailed error messages

## Best Practices

1. Use service role APIs for operations that need to bypass RLS
2. Keep RLS policies as restrictive as possible
3. Test RLS policies thoroughly before deployment
4. Document all RLS policies and their purposes
5. Use parameterized policies with functions like `auth.uid()` when possible
