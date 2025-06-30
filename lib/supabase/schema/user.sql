create table public.user (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  user_custom_id text null,
  nickname text null,
  position integer not null default 1, -- 1: 前锋, 2: 后卫, 3: 全能
  constraint user_pkey primary key (id)
) TABLESPACE pg_default;