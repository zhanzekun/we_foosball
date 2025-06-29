create table public.buff_history (
  id numeric not null,
  created_at timestamp with time zone not null default now(),
  buff_id text null,
  buff_index bigint null,
  period text null,
  buff_name text null,
  buff_description text null,
  constraint buff_history_pkey primary key (id)
) TABLESPACE pg_default;