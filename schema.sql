-- Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sites ENABLE ROW LEVEL SECURITY;

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subscription_status TEXT NOT NULL DEFAULT 'trial',
  subscription_tier TEXT NOT NULL DEFAULT 'basic',
  max_sites INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table with tenant relationship
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Super admin users have NULL tenant_id
  CONSTRAINT check_super_admin_or_tenant 
    CHECK ((role = 'super_admin' AND tenant_id IS NULL) OR 
           (role != 'super_admin' AND tenant_id IS NOT NULL))
);

-- Create affiliate networks table
CREATE TABLE public.affiliate_networks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate sites table
CREATE TABLE public.affiliate_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  network_id UUID NOT NULL REFERENCES public.affiliate_networks(id),
  domain TEXT NOT NULL,
  template_id TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies

-- Super admins can see all tenants
CREATE POLICY super_admin_tenant_policy ON public.tenants
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Users can only see their own tenant
CREATE POLICY user_tenant_policy ON public.tenants
  FOR SELECT USING (id = (auth.jwt() ->> 'tenant_id')::UUID);

-- Super admins can manage all users
CREATE POLICY super_admin_users_policy ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Tenant admins can manage users in their tenant
CREATE POLICY tenant_admin_users_policy ON public.users
  FOR ALL USING (
    tenant_id = (auth.jwt() ->> 'tenant_id')::UUID AND
    auth.jwt() ->> 'role' IN ('admin', 'tenant_admin')
  );

-- Users can see other users in their tenant
CREATE POLICY tenant_users_view_policy ON public.users
  FOR SELECT USING (tenant_id = (auth.jwt() ->> 'tenant_id')::UUID);

-- Network policies
CREATE POLICY tenant_networks_policy ON public.affiliate_networks
  FOR ALL USING (tenant_id = (auth.jwt() ->> 'tenant_id')::UUID);

-- Super admin can see all networks
CREATE POLICY super_admin_networks_policy ON public.affiliate_networks
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');

-- Site policies - join to get tenant_id
CREATE POLICY tenant_sites_policy ON public.affiliate_sites
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_networks
      WHERE affiliate_networks.id = affiliate_sites.network_id
      AND affiliate_networks.tenant_id = (auth.jwt() ->> 'tenant_id')::UUID
    )
  );

-- Super admin can see all sites
CREATE POLICY super_admin_sites_policy ON public.affiliate_sites
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
