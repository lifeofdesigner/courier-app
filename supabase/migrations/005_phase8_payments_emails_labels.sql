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

alter table public.bookings add column if not exists payment_status text not null default 'unpaid';
alter table public.bookings add column if not exists payment_provider text;
alter table public.bookings add column if not exists stripe_checkout_session_id text;
alter table public.bookings add column if not exists stripe_payment_intent_id text;
alter table public.bookings add column if not exists amount_due numeric(12,2) not null default 0;
alter table public.bookings add column if not exists amount_paid numeric(12,2) not null default 0;
alter table public.bookings add column if not exists currency text not null default 'EUR';
alter table public.bookings add column if not exists label_url text;
alter table public.bookings add column if not exists label_generated_at timestamptz;
alter table public.bookings add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_payment_status_check'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_payment_status_check
      check (payment_status in ('unpaid', 'checkout_created', 'paid', 'payment_failed', 'refunded'));
  end if;
end;
$$;

alter table public.orders add column if not exists booking_id uuid references public.bookings(id) on delete set null;
alter table public.orders add column if not exists label_url text;
alter table public.orders add column if not exists label_generated_at timestamptz;

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create index if not exists bookings_payment_status_idx
on public.bookings (payment_status);

create unique index if not exists bookings_stripe_checkout_session_id_idx
on public.bookings (stripe_checkout_session_id)
where stripe_checkout_session_id is not null;

create unique index if not exists orders_booking_id_idx
on public.orders (booking_id)
where booking_id is not null;

alter table public.bookings enable row level security;
alter table public.orders enable row level security;

drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own"
on public.bookings for select to authenticated
using (user_id = auth.uid());

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings for insert to authenticated
with check (
  user_id = auth.uid()
  and payment_status = 'unpaid'
  and amount_paid = 0
  and stripe_checkout_session_id is null
  and stripe_payment_intent_id is null
);

drop policy if exists "bookings_insert_anon" on public.bookings;
create policy "bookings_insert_anon"
on public.bookings for insert to anon
with check (
  user_id is null
  and payment_status = 'unpaid'
  and amount_paid = 0
  and stripe_checkout_session_id is null
  and stripe_payment_intent_id is null
);

drop policy if exists "bookings_admin_select_all" on public.bookings;
create policy "bookings_admin_select_all"
on public.bookings for select to authenticated
using (public.is_admin());

drop policy if exists "bookings_admin_update_all" on public.bookings;
create policy "bookings_admin_update_all"
on public.bookings for update to authenticated
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

grant execute on function public.is_admin() to authenticated;

grant insert on public.bookings to anon;
grant select, insert, update on public.bookings to authenticated;

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
