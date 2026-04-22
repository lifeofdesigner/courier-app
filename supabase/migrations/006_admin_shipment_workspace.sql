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

drop policy if exists "bookings_admin_insert_all" on public.bookings;
create policy "bookings_admin_insert_all"
on public.bookings for insert to authenticated
with check (public.is_admin());

create index if not exists orders_status_created_at_idx
on public.orders (status, created_at desc);

create index if not exists orders_tracking_number_idx
on public.orders (tracking_number);

create index if not exists bookings_user_id_idx
on public.bookings (user_id)
where user_id is not null;

create index if not exists bookings_pickup_delivery_address_idx
on public.bookings (pickup_address_id, delivery_address_id);

grant execute on function public.is_admin() to authenticated;
grant select, insert, update on public.bookings to authenticated;
