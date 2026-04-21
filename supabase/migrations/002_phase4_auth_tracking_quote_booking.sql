create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists full_name text;
alter table public.users add column if not exists phone text;
alter table public.users add column if not exists role text not null default 'customer';
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'users_role_check'
      and conrelid = 'public.users'::regclass
  ) then
    alter table public.users
      add constraint users_role_check check (role in ('customer', 'admin'));
  end if;
end;
$$;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  tracking_number text not null unique,
  reference_code text,
  service_type text not null,
  package_type text,
  origin_country text not null,
  origin_city text not null,
  destination_country text not null,
  destination_city text not null,
  recipient_name text not null,
  recipient_phone text,
  sender_name text,
  weight_kg numeric(10,2) not null default 0,
  declared_value numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  status text not null default 'label_created',
  estimated_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists user_id uuid references public.users(id) on delete set null;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists reference_code text;
alter table public.orders add column if not exists service_type text;
alter table public.orders add column if not exists package_type text;
alter table public.orders add column if not exists origin_country text;
alter table public.orders add column if not exists origin_city text;
alter table public.orders add column if not exists destination_country text;
alter table public.orders add column if not exists destination_city text;
alter table public.orders add column if not exists recipient_name text;
alter table public.orders add column if not exists recipient_phone text;
alter table public.orders add column if not exists sender_name text;
alter table public.orders add column if not exists weight_kg numeric(10,2) not null default 0;
alter table public.orders add column if not exists declared_value numeric(12,2) not null default 0;
alter table public.orders add column if not exists currency text not null default 'EUR';
alter table public.orders add column if not exists status text not null default 'label_created';
alter table public.orders add column if not exists estimated_delivery_date date;
alter table public.orders add column if not exists created_at timestamptz not null default now();
alter table public.orders add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_tracking_number_key'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_tracking_number_key unique (tracking_number);
  end if;
end;
$$;

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status text not null,
  label text not null,
  description text,
  location_name text,
  event_time timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.pricing_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  service_type text not null,
  zone text not null,
  min_weight_kg numeric(10,2) not null default 0,
  max_weight_kg numeric(10,2),
  base_price numeric(12,2) not null,
  per_kg_price numeric(12,2) not null default 0,
  fuel_surcharge_rate numeric(5,2) not null default 0,
  remote_area_flat numeric(12,2) not null default 0,
  is_active boolean not null default true,
  priority integer not null default 100,
  created_at timestamptz not null default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  full_name text,
  email text,
  origin_country text not null,
  origin_city text not null,
  destination_country text not null,
  destination_city text not null,
  service_type text not null,
  package_type text,
  weight_kg numeric(10,2) not null,
  declared_value numeric(12,2) not null default 0,
  currency text not null default 'EUR',
  subtotal numeric(12,2) not null,
  fuel_surcharge numeric(12,2) not null,
  remote_area_surcharge numeric(12,2) not null,
  total numeric(12,2) not null,
  status text not null default 'calculated',
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  label text,
  contact_name text not null,
  company_name text,
  phone text,
  email text,
  line_1 text not null,
  line_2 text,
  city text not null,
  state_region text,
  postal_code text,
  country text not null,
  address_type text not null default 'saved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  quote_id uuid references public.quotes(id) on delete set null,
  pickup_address_id uuid references public.addresses(id) on delete set null,
  delivery_address_id uuid references public.addresses(id) on delete set null,
  sender_name text not null,
  sender_email text not null,
  sender_phone text,
  recipient_name text not null,
  recipient_email text,
  recipient_phone text,
  service_type text not null,
  package_type text,
  weight_kg numeric(10,2) not null,
  declared_value numeric(12,2) not null default 0,
  pickup_date date not null,
  pickup_window text,
  special_instructions text,
  status text not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_users_updated_at on public.users;
create trigger set_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at
before update on public.addresses
for each row execute function public.set_updated_at();

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, full_name, phone, role)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', ''),
    'customer'
  )
  on conflict (id) do update
  set
    full_name = coalesce(excluded.full_name, public.users.full_name),
    phone = coalesce(excluded.phone, public.users.phone),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.tracking_events enable row level security;
alter table public.quotes enable row level security;
alter table public.addresses enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "users_select_own" on public.users;
create policy "users_select_own"
on public.users for select to authenticated
using (id = auth.uid());

drop policy if exists "users_update_own" on public.users;
create policy "users_update_own"
on public.users for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "users_admin_select_all" on public.users;
create policy "users_admin_select_all"
on public.users for select to authenticated
using (public.is_admin());

drop policy if exists "users_admin_update_all" on public.users;
create policy "users_admin_update_all"
on public.users for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
on public.orders for select to authenticated
using (user_id = auth.uid());

drop policy if exists "orders_admin_select_all" on public.orders;
create policy "orders_admin_select_all"
on public.orders for select to authenticated
using (public.is_admin());

drop policy if exists "orders_admin_insert_all" on public.orders;
create policy "orders_admin_insert_all"
on public.orders for insert to authenticated
with check (public.is_admin());

drop policy if exists "orders_admin_update_all" on public.orders;
create policy "orders_admin_update_all"
on public.orders for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "orders_public_tracking_select" on public.orders;
create policy "orders_public_tracking_select"
on public.orders for select to anon
using (tracking_number is not null);

drop policy if exists "tracking_events_select_own_order" on public.tracking_events;
create policy "tracking_events_select_own_order"
on public.tracking_events for select to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = tracking_events.order_id
      and orders.user_id = auth.uid()
  )
);

drop policy if exists "tracking_events_admin_select_all" on public.tracking_events;
create policy "tracking_events_admin_select_all"
on public.tracking_events for select to authenticated
using (public.is_admin());

drop policy if exists "tracking_events_admin_insert_all" on public.tracking_events;
create policy "tracking_events_admin_insert_all"
on public.tracking_events for insert to authenticated
with check (public.is_admin());

drop policy if exists "tracking_events_admin_update_all" on public.tracking_events;
create policy "tracking_events_admin_update_all"
on public.tracking_events for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "tracking_events_public_tracking_select" on public.tracking_events;
create policy "tracking_events_public_tracking_select"
on public.tracking_events for select to anon
using (
  exists (
    select 1
    from public.orders
    where orders.id = tracking_events.order_id
      and orders.tracking_number is not null
  )
);

drop policy if exists "quotes_select_own" on public.quotes;
create policy "quotes_select_own"
on public.quotes for select to authenticated
using (user_id = auth.uid());

drop policy if exists "quotes_insert_own" on public.quotes;
create policy "quotes_insert_own"
on public.quotes for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "quotes_insert_anon" on public.quotes;
create policy "quotes_insert_anon"
on public.quotes for insert to anon
with check (user_id is null);

drop policy if exists "quotes_admin_select_all" on public.quotes;
create policy "quotes_admin_select_all"
on public.quotes for select to authenticated
using (public.is_admin());

drop policy if exists "quotes_admin_update_all" on public.quotes;
create policy "quotes_admin_update_all"
on public.quotes for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "addresses_select_own" on public.addresses;
create policy "addresses_select_own"
on public.addresses for select to authenticated
using (user_id = auth.uid());

drop policy if exists "addresses_insert_own" on public.addresses;
create policy "addresses_insert_own"
on public.addresses for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "addresses_update_own" on public.addresses;
create policy "addresses_update_own"
on public.addresses for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "addresses_delete_own" on public.addresses;
create policy "addresses_delete_own"
on public.addresses for delete to authenticated
using (user_id = auth.uid());

drop policy if exists "addresses_admin_select_all" on public.addresses;
create policy "addresses_admin_select_all"
on public.addresses for select to authenticated
using (public.is_admin());

drop policy if exists "addresses_admin_update_all" on public.addresses;
create policy "addresses_admin_update_all"
on public.addresses for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "addresses_insert_anon_booking" on public.addresses;
create policy "addresses_insert_anon_booking"
on public.addresses for insert to anon
with check (user_id is null and address_type in ('pickup', 'delivery'));

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
on public.bookings for select to authenticated
using (user_id = auth.uid());

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "bookings_insert_anon" on public.bookings;
create policy "bookings_insert_anon"
on public.bookings for insert to anon
with check (user_id is null);

drop policy if exists "bookings_admin_select_all" on public.bookings;
create policy "bookings_admin_select_all"
on public.bookings for select to authenticated
using (public.is_admin());

drop policy if exists "bookings_admin_update_all" on public.bookings;
create policy "bookings_admin_update_all"
on public.bookings for update to authenticated
using (public.is_admin())
with check (public.is_admin());

grant usage on schema public to anon, authenticated;
grant execute on function public.is_admin() to authenticated;

grant select, update on public.users to authenticated;

grant select (
  id,
  tracking_number,
  reference_code,
  service_type,
  package_type,
  origin_country,
  origin_city,
  destination_country,
  destination_city,
  recipient_name,
  sender_name,
  weight_kg,
  currency,
  status,
  estimated_delivery_date,
  created_at,
  updated_at
) on public.orders to anon;
grant select, insert, update on public.orders to authenticated;

grant select (
  id,
  order_id,
  status,
  label,
  description,
  location_name,
  event_time,
  created_at
) on public.tracking_events to anon;
grant select, insert, update on public.tracking_events to authenticated;

grant select on public.pricing_rules to anon, authenticated;

grant insert on public.quotes to anon;
grant select, insert, update on public.quotes to authenticated;

grant insert on public.addresses to anon;
grant select, insert, update, delete on public.addresses to authenticated;

grant insert on public.bookings to anon;
grant select, insert, update on public.bookings to authenticated;

insert into public.pricing_rules (
  name,
  service_type,
  zone,
  min_weight_kg,
  max_weight_kg,
  base_price,
  per_kg_price,
  fuel_surcharge_rate,
  remote_area_flat,
  is_active,
  priority
)
select *
from (
  values
    ('Express EU 0-5kg', 'Express', 'EU', 0::numeric, 5::numeric, 24::numeric, 4.5::numeric, 8::numeric, 0::numeric, true, 10),
    ('Express International 0-5kg', 'Express', 'International', 0::numeric, 5::numeric, 48::numeric, 9.5::numeric, 12::numeric, 0::numeric, true, 20),
    ('Economy EU 0-5kg', 'Economy', 'EU', 0::numeric, 5::numeric, 14::numeric, 2.75::numeric, 6::numeric, 0::numeric, true, 30),
    ('Economy International 0-5kg', 'Economy', 'International', 0::numeric, 5::numeric, 32::numeric, 6::numeric, 10::numeric, 0::numeric, true, 40)
) as seed (
  name,
  service_type,
  zone,
  min_weight_kg,
  max_weight_kg,
  base_price,
  per_kg_price,
  fuel_surcharge_rate,
  remote_area_flat,
  is_active,
  priority
)
where not exists (select 1 from public.pricing_rules);
