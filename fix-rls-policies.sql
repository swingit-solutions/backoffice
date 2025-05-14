-- Fix RLS policies for tenant creation during registration
-- This script adds the necessary policies to allow tenant creation

-- First, check if the policy already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'tenants' 
        AND policyname = 'Allow authenticated users to insert into tenants'
    ) THEN
        -- Create the policy if it doesn't exist
        EXECUTE 'CREATE POLICY "Allow authenticated users to insert into tenants" ON public.tenants
                FOR INSERT TO authenticated
                WITH CHECK (true)';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'users' 
        AND policyname = 'Allow authenticated users to insert into users'
    ) THEN
        -- Create the policy if it doesn't exist
        EXECUTE 'CREATE POLICY "Allow authenticated users to insert into users" ON public.users
                FOR INSERT TO authenticated
                WITH CHECK (true)';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'affiliate_networks' 
        AND policyname = 'Allow authenticated users to insert into affiliate_networks'
    ) THEN
        -- Create the policy if it doesn't exist
        EXECUTE 'CREATE POLICY "Allow authenticated users to insert into affiliate_networks" ON public.affiliate_networks
                FOR INSERT TO authenticated
                WITH CHECK (true)';
    END IF;
END
$$;
