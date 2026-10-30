-- Plane A Schema Migration: LaunchPad MVP
-- Enforces multi-tenant RLS through public.memberships across all tables

-- 1. Helper functions for RLS checks (SECURITY DEFINER to avoid infinite recursion)
CREATE OR REPLACE FUNCTION public.is_org_member(org_id UUID, uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = org_id
      AND user_id = uid
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(org_id UUID, uid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = org_id
      AND user_id = uid
      AND role IN ('owner', 'admin')
  );
$$;

-- 2. Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  billing_tier TEXT NOT NULL DEFAULT 'starter',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their organizations"
  ON public.organizations FOR SELECT
  USING (public.is_org_member(id));

CREATE POLICY "Authenticated users can create organizations"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and owners can update organization details"
  ON public.organizations FOR UPDATE
  USING (public.is_org_admin(id))
  WITH CHECK (public.is_org_admin(id));

-- 3. Memberships Table
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON public.memberships(organization_id);
CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON public.memberships(user_id);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view memberships of organizations they belong to"
  ON public.memberships FOR SELECT
  USING (user_id = auth.uid() OR public.is_org_member(organization_id));

CREATE POLICY "Users can add self as owner on org creation or admins can invite"
  ON public.memberships FOR INSERT
  WITH CHECK (user_id = auth.uid() OR public.is_org_admin(organization_id));

CREATE POLICY "Admins can update membership roles"
  ON public.memberships FOR UPDATE
  USING (public.is_org_admin(organization_id))
  WITH CHECK (public.is_org_admin(organization_id));

CREATE POLICY "Admins can remove members or users can leave"
  ON public.memberships FOR DELETE
  USING (public.is_org_admin(organization_id) OR user_id = auth.uid());

-- 4. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  stitch_project_id TEXT,
  github_repo_url TEXT,
  vercel_project_id TEXT,
  design_md TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_org_id ON public.projects(organization_id);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view projects"
  ON public.projects FOR SELECT
  USING (public.is_org_member(organization_id));

CREATE POLICY "Organization members can create projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_org_member(organization_id));

CREATE POLICY "Organization members can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_org_member(organization_id))
  WITH CHECK (public.is_org_member(organization_id));

CREATE POLICY "Admins and owners can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_org_admin(organization_id));

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'usd',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  tier TEXT NOT NULL DEFAULT 'starter',
  payment_intent_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_org_id ON public.orders(organization_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Organization members can view orders"
  ON public.orders FOR SELECT
  USING (public.is_org_member(organization_id));

CREATE POLICY "Organization members can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (public.is_org_member(organization_id));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_org_admin(organization_id))
  WITH CHECK (public.is_org_admin(organization_id));

-- 7. Deployment Logs Table
CREATE TABLE IF NOT EXISTS public.deployment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  commit_sha TEXT,
  vercel_deployment_id TEXT,
  status TEXT NOT NULL DEFAULT 'queued',
  web_vitals JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deployment_logs_project_id ON public.deployment_logs(project_id);

ALTER TABLE public.deployment_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view deployment logs for their projects"
  ON public.deployment_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = deployment_logs.project_id
        AND public.is_org_member(p.organization_id)
    )
  );

CREATE POLICY "Members can create deployment logs for their projects"
  ON public.deployment_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = deployment_logs.project_id
        AND public.is_org_member(p.organization_id)
    )
  );

-- 8. Auto-create Profile Trigger for new Auth users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
