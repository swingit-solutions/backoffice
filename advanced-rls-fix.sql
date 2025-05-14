-- Advanced RLS fix for tenant creation during registration
-- This script addresses the specific issue with the 42501 error

-- First, let's check the current RLS setup
SELECT * FROM pg_policies WHERE tablename = 'tenants';

-- The issue might be with the role used during registration
-- Let's modify the policy to be more permissive

-- 1. Drop and recreate the policy with broader permissions
DROP POLICY IF EXISTS "Allow authenticated users to insert into tenants" ON public.tenants;

CREATE POLICY "Allow authenticated users to insert into tenants" ON public.tenants
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 2. Also ensure the other required policies exist with proper permissions
DROP POLICY IF EXISTS "Allow authenticated users to insert into users" ON public.users;

CREATE POLICY "Allow authenticated users to insert into users" ON public.users
FOR INSERT TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert into affiliate_networks" ON public.affiliate_networks;

CREATE POLICY "Allow authenticated users to insert into affiliate_networks" ON public.affiliate_networks
FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- 3. Check if there are any conflicting policies
SELECT * FROM pg_policies WHERE tablename IN ('tenants', 'users', 'affiliate_networks');

-- 4. Verify the RLS is enabled on these tables
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename IN ('tenants', 'users', 'affiliate_networks');

-- 5. Grant proper permissions to the anon role
GRANT INSERT ON public.tenants TO anon;
GRANT INSERT ON public.users TO anon;
GRANT INSERT ON public.affiliate_networks TO anon;
