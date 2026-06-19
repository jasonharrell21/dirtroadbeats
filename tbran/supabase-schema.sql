-- Tbran Technologies — Supabase Schema
-- Run this in the Supabase SQL editor to set up the database.

-- Customers table (created by Stripe webhook on successful checkout)
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_session_id text,
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'business')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sites table (populated by intake form)
create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  owner_email text,              -- denormalized for easy auth lookups
  slug text unique not null,     -- subdomain slug, e.g. "tomsboats"
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'business')),
  is_live boolean default true,

  -- Identity
  business_name text not null,
  business_category text,
  tagline text,
  logo_url text,
  about_text text,               -- Pro/Business only

  -- Media
  media_urls jsonb default '[]', -- [{url, type}] — Pro/Business only

  -- Services
  services jsonb default '[]',   -- [{name, description, price}]

  -- Contact
  contact_phone text,
  contact_email text,
  contact_address text,
  contact_hours text,

  -- Social links (Pro/Business) — only platforms with a URL
  social_links jsonb default '{}', -- {facebook: url, instagram: url, ...}

  -- Business tier extras
  testimonials jsonb default '[]', -- [{name, role, quote}]
  stripe_connect_account_id text,  -- Stripe Express account ID

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for fast slug lookups (used on every customer site load)
create index if not exists sites_slug_idx on sites(slug);
create index if not exists sites_customer_id_idx on sites(customer_id);
create index if not exists sites_owner_email_idx on sites(owner_email);

-- RLS policies
alter table customers enable row level security;
alter table sites enable row level security;

-- Public read for sites that are live (powers customer site rendering)
create policy "Public can read live sites"
  on sites for select
  using (is_live = true);

-- Authenticated users can read/write their own site
create policy "Owners can manage their site"
  on sites for all
  using (owner_email = auth.jwt() ->> 'email');

-- Service role bypasses RLS (used by webhook + API functions)
-- No extra policy needed; service key inherits superuser access.

-- Storage bucket: site-assets
-- Create this manually in Supabase dashboard:
--   Bucket name: site-assets
--   Public: true (for public logo/media URLs)
--   File size limit: 50MB
--   Allowed MIME types: image/*, video/*
