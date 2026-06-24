-- TrakXP schema

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  trial_start timestamptz,
  trial_end timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text default 'trialing',
  created_at timestamptz default now()
);

create table if not exists items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  category text not null,
  exp_date date not null,
  lead_days int not null default 30,
  notes text,
  alerted boolean not null default false,
  created_at timestamptz default now()
);

-- Row level security
alter table profiles enable row level security;
alter table items enable row level security;

-- Profiles: users can only read/write their own row
create policy "profiles: own row" on profiles
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Items: users can only access their own items
create policy "items: own rows" on items
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Service role bypasses RLS (for edge functions and webhooks)
