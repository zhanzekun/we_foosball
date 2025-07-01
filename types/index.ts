// 只用于类型提示
export type BuffCard = { name: string; description: string, buffId?: number };

export interface Player {
  user_custom_id: string
  nickname: string
  position: number
}

export interface PlayerWithGamesCount extends Player {
  game_played_count: number
}

export interface UserInfo {
  user_custom_id: string
  nickname: string
  created_at: string
  email?: string
  image?: string
  position: number
}

export interface MatchResult {
  team1: Player[]
  team2: Player[]
}

export interface PlayerScore {
  [playerId: string]: number
}