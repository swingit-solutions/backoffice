-- Drop existing tables if they exist (CAUTION: this will delete all data)
DROP TABLE IF EXISTS public.content_blocks CASCADE;
DROP TABLE IF EXISTS public.affiliate_sites CASCADE;
DROP TABLE IF EXISTS public.affiliate_networks CASCADE;
DROP TABLE IF EXISTS public.user_invitations CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.tenants CASCADE;
DROP TABLE IF EXISTS public.usage_logs CASCADE;
DROP TABLE IF EXISTS public.white_label_settings CASCADE;
DROP TABLE IF EXISTS public.subscription_tiers CASCADE;

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create subscription tiers table
CREATE TABLE public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  max_sites INTEGER NOT NULL DEFAULT 5,
  max_users INTEGER NOT NULL DEFAULT 3,
  price_monthly DECIMAL(10, 2),
  price_yearly DECIMAL(10, 2),
  features JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subscription tiers
INSERT INTO public.subscription_tiers (name, description, max_sites, max_users, price_monthly, price_yearly, features)
VALUES 
  ('Free', 'Basic tier with limited features', 1, 1, 0, 0, '{"white_labeling": false, "analytics": false}'::jsonb),
  ('Starter', 'Good for small affiliate networks', 5, 3, 29.99, 299.99, '{"white_labeling": false, "analytics": true}'::jsonb),
  ('Professional', 'For growing affiliate networks', 20, 10, 99.99, 999.99, '{"white_labeling": true, "analytics": true}'::jsonb),
  ('Enterprise', 'For large affiliate networks', 100, 50, 299.99, 2999.99, '{"white_labeling": true, "analytics": true, "api_access": true}'::jsonb);

-- Create tenants table
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subscription_tier_id UUID REFERENCES public.subscription_tiers(id),
  subscription_status TEXT NOT NULL DEFAULT 'trial',
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '14 days'),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table with tenant relationship
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE, -- Links to Supabase auth.users
  tenant_id UUID REFERENCES public.tenants(id),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'editor',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Super admin users have NULL tenant_id
  CONSTRAINT check_super_admin_or_tenant 
    CHECK ((role = 'super_admin' AND tenant_id IS NULL) OR 
           (role != 'super_admin' AND tenant_id IS NOT NULL))
);

-- Create user invitations table
CREATE TABLE public.user_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor',
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES public.users(id)
);

-- Create affiliate networks table
CREATE TABLE public.affiliate_networks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate sites table
CREATE TABLE public.affiliate_sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  network_id UUID NOT NULL REFERENCES public.affiliate_networks(id),
  name TEXT NOT NULL,
  domain TEXT,
  template_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content blocks table for affiliate sites
CREATE TABLE public.content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES public.affiliate_sites(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usage logs table for analytics
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES public.tenants(id),
  user_id UUID REFERENCES public.users(id),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create white label settings table
CREATE TABLE public.white_label_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) UNIQUE,
  company_name TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E3A8A',
  custom_css TEXT,
  custom_domain TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_networks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.white_label_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;

-- Create a function to get the current user's tenant_id
CREATE OR REPLACE FUNCTION public.get_current_tenant_id()
RETURNS UUID AS $$
DECLARE
  current_user_id UUID;
  tenant_id UUID;
  user_role TEXT;
BEGIN
  -- Get the current user's ID from the JWT
  current_user_id := auth.uid();
  
  -- If no user is authenticated, return NULL
  IF current_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get the user's tenant_id and role
  SELECT u.tenant_id, u.role INTO tenant_id, user_role
  FROM public.users u
  WHERE u.auth_id = current_user_id;
  
  -- Super admins don't have a tenant_id
  IF user_role = 'super_admin' THEN
    RETURN NULL;
  END IF;
  
  RETURN tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if the current user is a super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
DECLARE
  current_user_id UUID;
  user_role TEXT;
BEGIN
  -- Get the current user's ID from the JWT
  current_user_id := auth.uid();
  
  -- If no user is authenticated, return false
  IF current_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Get the user's role
  SELECT u.role INTO user_role
  FROM public.users u
  WHERE u.auth_id = current_user_id;
  
  RETURN user_role = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Subscription Tiers policies
-- Super admins can manage all tiers
CREATE POLICY "Super admins can manage all subscription tiers" ON public.subscription_tiers
  FOR ALL TO authenticated
  USING (is_super_admin());

-- All authenticated users can view active tiers
CREATE POLICY "All users can view active subscription tiers" ON public.subscription_tiers
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Tenants policies
-- Super admins can manage all tenants
CREATE POLICY "Super admins can manage all tenants" ON public.tenants
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Users can only see their own tenant
CREATE POLICY "Users can only see their own tenant" ON public.tenants
  FOR SELECT TO authenticated
  USING (id = get_current_tenant_id());

-- Allow new tenant creation during registration
CREATE POLICY "Allow authenticated users to insert into tenants" ON public.tenants
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Users policies
-- Super admins can manage all users
CREATE POLICY "Super admins can manage all users" ON public.users
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Tenant admins can manage users in their tenant
CREATE POLICY "Tenant admins can manage users in their tenant" ON public.users
  FOR ALL TO authenticated
  USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'tenant_admin')
    )
  );

-- Users can see other users in their tenant
CREATE POLICY "Users can see other users in their tenant" ON public.users
  FOR SELECT TO authenticated
  USING (tenant_id = get_current_tenant_id());

-- Allow new user creation during registration
CREATE POLICY "Allow authenticated users to insert into users" ON public.users
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- User invitations policies
-- Super admins can manage all invitations
CREATE POLICY "Super admins can manage all invitations" ON public.user_invitations
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Tenant admins can manage invitations for their tenant
CREATE POLICY "Tenant admins can manage invitations for their tenant" ON public.user_invitations
  FOR ALL TO authenticated
  USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'tenant_admin')
    )
  );

-- Affiliate networks policies
-- Super admins can manage all networks
CREATE POLICY "Super admins can manage all networks" ON public.affiliate_networks
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Users can manage networks in their tenant
CREATE POLICY "Users can manage networks in their tenant" ON public.affiliate_networks
  FOR ALL TO authenticated
  USING (tenant_id = get_current_tenant_id());

-- Allow new network creation during registration
CREATE POLICY "Allow authenticated users to insert into affiliate_networks" ON public.affiliate_networks
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Affiliate sites policies
-- Super admins can manage all sites
CREATE POLICY "Super admins can manage all sites" ON public.affiliate_sites
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Users can manage sites in their tenant's networks
CREATE POLICY "Users can manage sites in their tenant's networks" ON public.affiliate_sites
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_networks
      WHERE affiliate_networks.id = affiliate_sites.network_id
      AND affiliate_networks.tenant_id = get_current_tenant_id()
    )
  );

-- Content blocks policies
-- Super admins can manage all content blocks
CREATE POLICY "Super admins can manage all content blocks" ON public.content_blocks
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Users can manage content blocks for their tenant's sites
CREATE POLICY "Users can manage content blocks for their tenant's sites" ON public.content_blocks
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.affiliate_sites
      JOIN public.affiliate_networks ON affiliate_sites.network_id = affiliate_networks.id
      WHERE content_blocks.site_id = affiliate_sites.id
      AND affiliate_networks.tenant_id = get_current_tenant_id()
    )
  );

-- Usage logs policies
-- Super admins can see all logs
CREATE POLICY "Super admins can see all logs" ON public.usage_logs
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Users can only see logs for their tenant
CREATE POLICY "Users can only see logs for their tenant" ON public.usage_logs
  FOR SELECT TO authenticated
  USING (tenant_id = get_current_tenant_id());

-- White label settings policies
-- Super admins can manage all white label settings
CREATE POLICY "Super admins can manage all white label settings" ON public.white_label_settings
  FOR ALL TO authenticated
  USING (is_super_admin());

-- Tenant admins can manage white label settings for their tenant
CREATE POLICY "Tenant admins can manage white label settings for their tenant" ON public.white_label_settings
  FOR ALL TO authenticated
  USING (
    tenant_id = get_current_tenant_id() AND
    EXISTS (
      SELECT 1 FROM public.users u
      WHERE u.auth_id = auth.uid() AND u.role IN ('admin', 'tenant_admin')
    )
  );

-- Users can view white label settings for their tenant
CREATE POLICY "Users can view white label settings for their tenant" ON public.white_label_settings
  FOR SELECT TO authenticated
  USING (tenant_id = get_current_tenant_id());

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON public.tenants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_networks_updated_at BEFORE UPDATE ON public.affiliate_networks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliate_sites_updated_at BEFORE UPDATE ON public.affiliate_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_white_label_settings_updated_at BEFORE UPDATE ON public.white_label_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_tiers_updated_at BEFORE UPDATE ON public.subscription_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to log user actions
CREATE OR REPLACE FUNCTION log_user_action()
RETURNS TRIGGER AS $$
DECLARE
  current_user_id UUID;
  tenant_id UUID;
  action_type TEXT;
  resource_type TEXT;
BEGIN
  -- Get the current user's ID from the JWT
  current_user_id := auth.uid();
  
  -- If no user is authenticated, use NULL
  IF current_user_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Get the user's ID and tenant_id from the users table
  SELECT u.id, u.tenant_id INTO current_user_id, tenant_id
  FROM public.users u
  WHERE u.auth_id = auth.uid();
  
  -- Determine the action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
  END IF;
  
  -- Determine the resource type based on the table name
  resource_type := TG_TABLE_NAME;
  
  -- Insert the log entry
  INSERT INTO public.usage_logs (tenant_id, user_id, action, resource_type, resource_id)
  VALUES (tenant_id, current_user_id, action_type, resource_type, 
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply the logging trigger to relevant tables
CREATE TRIGGER log_affiliate_networks_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.affiliate_networks
  FOR EACH ROW EXECUTE FUNCTION log_user_action();

CREATE TRIGGER log_affiliate_sites_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.affiliate_sites
  FOR EACH ROW EXECUTE FUNCTION log_user_action();

CREATE TRIGGER log_content_blocks_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION log_user_action();

-- Create a test tenant for testing
INSERT INTO public.tenants (name, subscription_status)
VALUES ('Test Organization', 'active');

-- Update the tenant to use the Free tier
UPDATE public.tenants 
SET subscription_tier_id = (SELECT id FROM public.subscription_tiers WHERE name = 'Free')
WHERE name = 'Test Organization';

-- Create a super admin user (you'll need to replace with your actual email)
INSERT INTO public.users (email, role, first_name, last_name)
VALUES ('admin@example.com', 'super_admin', 'Super', 'Admin');

-- Create a regular user for the test tenant
INSERT INTO public.users (email, role, tenant_id, first_name, last_name)
VALUES ('user@example.com', 'admin', 
  (SELECT id FROM public.tenants WHERE name = 'Test Organization'),
  'Test', 'User');

-- Create a test affiliate network
INSERT INTO public.affiliate_networks (tenant_id, name, description)
VALUES (
  (SELECT id FROM public.tenants WHERE name = 'Test Organization'),
  'Test Network',
  'This is a test affiliate network'
);

-- Create a test affiliate site
INSERT INTO public.affiliate_sites (network_id, name, template_id, status)
VALUES (
  (SELECT id FROM public.affiliate_networks WHERE name = 'Test Network'),
  'Test Site',
  'default',
  'published'
);

-- Create some test content blocks
INSERT INTO public.content_blocks (site_id, name, type, content, position)
VALUES (
  (SELECT id FROM public.affiliate_sites WHERE name = 'Test Site'),
  'Hero Section',
  'hero',
  '{"title": "Welcome to our affiliate site", "subtitle": "Find the best products here", "buttonText": "Learn More", "buttonUrl": "#features"}',
  0
);

INSERT INTO public.content_blocks (site_id, name, type, content, position)
VALUES (
  (SELECT id FROM public.affiliate_sites WHERE name = 'Test Site'),
  'Features Section',
  'features',
  '{"title": "Our Features", "features": [{"title": "Quality Products", "description": "We only recommend the best"}, {"title": "Best Prices", "description": "Find great deals here"}, {"title": "Expert Reviews", "description": "Detailed analysis of each product"}]}',
  1
);
