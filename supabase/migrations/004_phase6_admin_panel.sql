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

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users(id) on delete set null
);

create table if not exists public.cms_content (
  id uuid primary key default gen_random_uuid(),
  section text not null,
  key text not null,
  value jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.users(id) on delete set null
);

alter table public.cms_content add column if not exists id uuid default gen_random_uuid();
alter table public.cms_content add column if not exists section text;
alter table public.cms_content add column if not exists key text;
alter table public.cms_content add column if not exists value jsonb not null default '{}'::jsonb;
alter table public.cms_content add column if not exists published boolean not null default false;
alter table public.cms_content add column if not exists updated_at timestamptz not null default now();
alter table public.cms_content add column if not exists updated_by uuid references public.users(id) on delete set null;

create unique index if not exists cms_content_section_key_idx
on public.cms_content (section, key);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists set_cms_content_updated_at on public.cms_content;
create trigger set_cms_content_updated_at
before update on public.cms_content
for each row execute function public.set_updated_at();

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists tracking_events_order_event_time_idx on public.tracking_events (order_id, event_time desc);
create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists users_role_idx on public.users (role);

alter table public.cms_content enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "cms_content_admin_select_all" on public.cms_content;
create policy "cms_content_admin_select_all"
on public.cms_content for select to authenticated
using (public.is_admin());

drop policy if exists "cms_content_admin_insert_all" on public.cms_content;
create policy "cms_content_admin_insert_all"
on public.cms_content for insert to authenticated
with check (public.is_admin());

drop policy if exists "cms_content_admin_update_all" on public.cms_content;
create policy "cms_content_admin_update_all"
on public.cms_content for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "cms_content_admin_delete_all" on public.cms_content;
create policy "cms_content_admin_delete_all"
on public.cms_content for delete to authenticated
using (public.is_admin());

drop policy if exists "cms_content_public_select_published" on public.cms_content;
create policy "cms_content_public_select_published"
on public.cms_content for select to anon
using (published = true);

drop policy if exists "cms_content_authenticated_select_published" on public.cms_content;
create policy "cms_content_authenticated_select_published"
on public.cms_content for select to authenticated
using (published = true);

drop policy if exists "site_settings_admin_select_all" on public.site_settings;
create policy "site_settings_admin_select_all"
on public.site_settings for select to authenticated
using (public.is_admin());

drop policy if exists "site_settings_admin_insert_all" on public.site_settings;
create policy "site_settings_admin_insert_all"
on public.site_settings for insert to authenticated
with check (public.is_admin());

drop policy if exists "site_settings_admin_update_all" on public.site_settings;
create policy "site_settings_admin_update_all"
on public.site_settings for update to authenticated
using (public.is_admin())
with check (public.is_admin());

grant select on public.cms_content to anon;
grant select, insert, update, delete on public.cms_content to authenticated;
grant select, insert, update on public.site_settings to authenticated;

drop policy if exists "users_admin_insert_all" on public.users;
create policy "users_admin_insert_all"
on public.users for insert to authenticated
with check (public.is_admin());

drop policy if exists "addresses_admin_insert_all" on public.addresses;
create policy "addresses_admin_insert_all"
on public.addresses for insert to authenticated
with check (public.is_admin());

grant select, insert, update on public.users to authenticated;
grant select, insert, update, delete on public.addresses to authenticated;

do $$
begin
  insert into storage.buckets (id, name, public)
  values ('cms-assets', 'cms-assets', true)
  on conflict (id) do update
  set public = true;
exception
  when undefined_table then
    null;
end;
$$;

do $$
begin
  drop policy if exists "cms_assets_public_read" on storage.objects;
  create policy "cms_assets_public_read"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'cms-assets');

  drop policy if exists "cms_assets_admin_insert" on storage.objects;
  create policy "cms_assets_admin_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'cms-assets' and public.is_admin());

  drop policy if exists "cms_assets_admin_update" on storage.objects;
  create policy "cms_assets_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'cms-assets' and public.is_admin())
  with check (bucket_id = 'cms-assets' and public.is_admin());

  drop policy if exists "cms_assets_admin_delete" on storage.objects;
  create policy "cms_assets_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'cms-assets' and public.is_admin());
exception
  when undefined_table then
    null;
end;
$$;

insert into public.site_settings (key, value)
values
  ('company_contact', '{"phone":"+1 (800) 555-0188","email":"support@atlascourier.com"}'::jsonb),
  ('support_hours', '{"label":"Monday-Friday, 8:00 AM-7:00 PM"}'::jsonb),
  ('social_links', '{"linkedin":"","x":"","facebook":""}'::jsonb),
  ('footer_notice', '{"text":"Professional courier support for clear handoffs and dependable delivery."}'::jsonb)
on conflict (key) do nothing;
