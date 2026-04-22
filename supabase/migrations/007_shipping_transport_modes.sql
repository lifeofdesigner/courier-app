alter table public.orders
add column if not exists transport_mode text not null default 'road';

alter table public.bookings
add column if not exists transport_mode text not null default 'road';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_transport_mode_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table public.orders
      add constraint orders_transport_mode_check
      check (transport_mode in ('air', 'road', 'freight'));
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'bookings_transport_mode_check'
      and conrelid = 'public.bookings'::regclass
  ) then
    alter table public.bookings
      add constraint bookings_transport_mode_check
      check (transport_mode in ('air', 'road', 'freight'));
  end if;
end;
$$;

create index if not exists orders_transport_mode_status_idx
on public.orders (transport_mode, status, created_at desc);

create index if not exists bookings_transport_mode_idx
on public.bookings (transport_mode);
