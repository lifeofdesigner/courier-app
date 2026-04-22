alter table public.quotes
add column if not exists transport_mode text not null default 'road';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'quotes_transport_mode_check'
      and conrelid = 'public.quotes'::regclass
  ) then
    alter table public.quotes
      add constraint quotes_transport_mode_check
      check (transport_mode in ('air', 'road', 'freight'));
  end if;
end;
$$;

comment on column public.quotes.transport_mode is
'Stores the selected public quote transport mode: air, road, or freight.';

comment on column public.quotes.service_type is
'Stores legacy service tiers or mode-aware service codes such as express_air, standard_road, and ltl_freight.';

create index if not exists quotes_transport_mode_service_type_idx
on public.quotes (transport_mode, service_type, created_at desc);
