import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { TEAM_INDEX_BLUE, TEAM_INDEX_RED } from '@/const'

// 定义返回类型
export interface GameLogParticipant {
  user_id: string
  nickname: string
  team_index: number
  score: number
}

export interface GameLogBuff {
  buff_id: string
  buff_name: string
  buff_description: string
}

export interface GameLogRecord {
  id: string
  created_at: string
  teamRed: GameLogParticipant[]
  teamBlue: GameLogParticipant[]
  winner_team_index: number | null
  buff: GameLogBuff | null
}

export interface GameLogResponse {
  success: boolean
  data?: {
    records: GameLogRecord[]
    pagination: {
      page: number
      pageSize: number
      total: number
      totalPages: number
    }
  }
  error?: string
}

export async function GET(request: NextRequest): Promise<NextResponse<GameLogResponse>> {
    try {
        const { searchParams } = new URL(request.url)
        const page = parseInt(searchParams.get('page') || '1')
        const pageSize = parseInt(searchParams.get('pageSize') || '10')
        const offset = (page - 1) * pageSize

        const supabase = await createClient()

        // 查询比赛总数
        const { count: totalCount, error: countError } = await supabase
            .from('games')
            .select('*', { count: 'exact', head: true })
        
        if (countError) throw countError

        // 分页查询比赛记录
        const { data: games, error: gamesError } = await supabase
            .from('games')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + pageSize - 1)
        
        if (gamesError) throw gamesError

        if (!games || games.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    records: [],
                    pagination: {
                        page,
                        pageSize,
                        total: totalCount || 0,
                        totalPages: Math.ceil((totalCount || 0) / pageSize)
                    }
                }
            })
        }

        const gameIds = games.map(g => g.id)

        // 查询这些比赛的参与者信息
        const { data: participants, error: participantsError } = await supabase
            .from('game_participants')
            .select('game_id, user_id, team_index, score')
            .in('game_id', gameIds)
        
        if (participantsError) throw participantsError

        // 查询用户信息
        const userIds = participants?.map(p => p.user_id) || []
        const { data: users, error: usersError } = await supabase
            .from('user')
            .select('user_custom_id, nickname')
            .in('user_custom_id', userIds)
        
        if (usersError) throw usersError

        // 查询buff信息
        const buffIds = games.map(g => g.game_buff_id).filter(Boolean)
        let buffs: any[] = []
        if (buffIds.length > 0) {
            const { data: buffData, error: buffsError } = await supabase
                .from('buff_history')
                .select('buff_id, buff_name, buff_description')
                .in('buff_id', buffIds)
            
            if (buffsError) throw buffsError
            buffs = buffData || []
        }

        // 构建映射
        const userMap = Object.fromEntries(users?.map(u => [u.user_custom_id, u.nickname]) || [])
        const buffMap = Object.fromEntries(buffs.map(b => [b.buff_id, b]))

        // 整理数据
        const records = games.map(game => {
            const gameParticipants = participants
                ?.filter(p => p.game_id === game.id)
                .map(p => ({
                    user_id: p.user_id,
                    nickname: userMap[p.user_id] || '未知用户',
                    team_index: p.team_index,
                    score: p.score
                })) || []

            // 按队伍分组
            const teamRed = gameParticipants.filter(p => p.team_index === TEAM_INDEX_RED)
            const teamBlue = gameParticipants.filter(p => p.team_index === TEAM_INDEX_BLUE)

            return {
                id: game.id,
                created_at: game.created_at,
                teamRed,
                teamBlue,
                winner_team_index: game.winner_team_index,
                buff: game.game_buff_id ? buffMap[game.game_buff_id] || null : null
            }
        })

        return NextResponse.json({
            success: true,
            data: {
                records,
                pagination: {
                    page,
                    pageSize,
                    total: totalCount || 0,
                    totalPages: Math.ceil((totalCount || 0) / pageSize)
                }
            }
        })

    } catch (error) {
        console.error('获取比赛记录失败:', error)
        return NextResponse.json(
            { 
                success: false, 
                error: '获取比赛记录失败' 
            },
            { status: 500 }
        )
    }
}
