-- Add policies to allow registration with correct PostgreSQL syntax
CREATE POLICY "Allow authenticated users to insert into tenants" ON public.tenants
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert into users" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert into affiliate_networks" ON public.affiliate_networks
  FOR INSERT TO authenticated
  WITH CHECK (true);
