alter table public.orders
add column if not exists transport_mode text not null default 'road';

alter table public.bookings
add column if not exists transport_mode text not null default 'road';

comment on column public.orders.service_type is
'Stores legacy service tiers or mode-aware service codes such as express_air, standard_road, and ltl_freight.';

comment on column public.bookings.service_type is
'Stores legacy service tiers or mode-aware service codes such as express_air, standard_road, and ltl_freight.';

create index if not exists orders_transport_mode_service_type_idx
on public.orders (transport_mode, service_type, created_at desc);

create index if not exists bookings_transport_mode_service_type_idx
on public.bookings (transport_mode, service_type, created_at desc);
