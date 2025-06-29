create table public.games (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  winner_team_index smallint null,
  game_buff_id text null,
  constraint games_pkey primary key (id)
) TABLESPACE pg_default;