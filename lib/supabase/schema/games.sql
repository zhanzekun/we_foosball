create table public.user (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_custom_id text null,
  nickname text null,
  constraint user_pkey primary key (id)
) TABLESPACE pg_default;