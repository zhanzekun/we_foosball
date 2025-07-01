import { BuffCard, MatchResult, Player, PlayerScore } from '@/types'
import { create } from 'zustand'
import supabase from '@/lib/supabase/client'

interface MatchStore {
    players: Player[]
    selectedPlayers: Set<string>
    matchResult: MatchResult | null
    combo2v2: Player[] | null
    show2v2: boolean
    isMatchStarted: boolean
    playerScores: PlayerScore
    buff: BuffCard | null
    playersGamesCount: Record<Player['user_custom_id'], number>
    refreshPlayers: () => Promise<void>
    forceRefreshPlayers: () => Promise<void>
    fetchBuff: () => Promise<void>
    setSelectedPlayers: (selectedPlayers: Set<string>) => void
    setMatchResult: (matchResult: MatchResult | null) => void
    setCombo2v2: (combo2v2: Player[] | null) => void
    setShow2v2: (show2v2: boolean) => void
    setIsMatchStarted: (isMatchStarted: boolean) => void
    setPlayerScores: (playerScores: PlayerScore) => void
    setBuff: (buff: BuffCard | null) => void
    resetMatch: () => void
}

const useMatchStore = create<MatchStore>((set, get) => ({
    players: [],
    selectedPlayers: new Set(),
    matchResult: null,
    combo2v2: null,
    show2v2: false,
    isMatchStarted: false,
    playerScores: {},
    buff: null,
    // 缓存2小时，过期后则清空
    playersGamesCount: {},
    
    refreshPlayers: async () => {
        try {
            // 先尝试从缓存加载
            const cachedPlayers = localStorage.getItem('cached_players')
            const cacheTime = localStorage.getItem('cached_players_time')
            
            if (cachedPlayers && cacheTime) {
                const now = Date.now()
                const cacheAge = now - parseInt(cacheTime)
                const fiveMinutes = 5 * 60 * 1000
                
                // 如果缓存未过期，先显示缓存数据
                if (cacheAge < fiveMinutes) {
                    set({ players: JSON.parse(cachedPlayers) })
                }
            }
            
            // 从服务器获取最新数据
            const { data, error } = await supabase
                .from('user')
                .select('user_custom_id, nickname, position')
            if (error) throw error
            
            const playersData = data || []
            set({ players: playersData })
            
            // 更新缓存
            localStorage.setItem('cached_players', JSON.stringify(playersData))
            localStorage.setItem('cached_players_time', Date.now().toString())
        } catch (error) {
            console.error('获取玩家列表失败:', error)
            
            // 如果网络请求失败，尝试使用缓存（即使过期）
            const cachedPlayers = localStorage.getItem('cached_players')
            if (cachedPlayers) {
                set({ players: JSON.parse(cachedPlayers) })
            }
            throw error
        }
    },

    fetchBuff: async () => {
        try {
            // 先尝试从缓存加载
            const cachedBuff = localStorage.getItem('cached_buff')
            const cacheTime = localStorage.getItem('cached_buff_time')
            
            if (cachedBuff && cacheTime) {
                const now = Date.now()
                const cacheAge = now - parseInt(cacheTime)
                const oneHour = 60 * 60 * 1000 // 1小时缓存
                
                // 如果缓存未过期，先显示缓存数据
                if (cacheAge < oneHour) {
                    set({ buff: JSON.parse(cachedBuff) })
                }
            }
            
            // 获取当前日期
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            const today = `${yyyy}-${mm}-${dd}`;
            // 判断上午/下午
            const hour = now.getHours();
            const period = hour < 14 ? 'am' : 'pm';
            
            // 查询 supabase
            const { data, error } = await supabase
                .from('buff_history')
                .select('buff_name, buff_description')
                .eq('date', today)
                .eq('period', period)
                .maybeSingle();
            
            let buffData: BuffCard;
            if (data) {
                buffData = { name: data.buff_name, description: data.buff_description };
            } else {
                buffData = { name: '暂无Buff', description: '今日Buff尚未生成' };
            }
            
            set({ buff: buffData })
            
            // 更新缓存
            localStorage.setItem('cached_buff', JSON.stringify(buffData))
            localStorage.setItem('cached_buff_time', Date.now().toString())
        } catch (error) {
            console.error('获取Buff失败:', error)
            
            // 如果网络请求失败，尝试使用缓存（即使过期）
            const cachedBuff = localStorage.getItem('cached_buff')
            if (cachedBuff) {
                set({ buff: JSON.parse(cachedBuff) })
            } else {
                // 如果连缓存都没有，设置默认值
                set({ buff: { name: '暂无Buff', description: '今日Buff尚未生成' } })
            }
        }
    },

    // 强制刷新（清除缓存）
    forceRefreshPlayers: async () => {
        try {
            // 清除缓存
            localStorage.removeItem('cached_players')
            localStorage.removeItem('cached_players_time')
            
            // 从服务器获取最新数据
            const { data, error } = await supabase
                .from('user')
                .select('user_custom_id, nickname, position')
            if (error) throw error
            
            const playersData = data || []
            set({ players: playersData })
            
            // 更新缓存
            localStorage.setItem('cached_players', JSON.stringify(playersData))
            localStorage.setItem('cached_players_time', Date.now().toString())
        } catch (error) {
            console.error('强制刷新玩家列表失败:', error)
            throw error
        }
    },

    setSelectedPlayers: (selectedPlayers: Set<string>) => {
        set({ selectedPlayers })
    },

    setMatchResult: (matchResult: MatchResult | null) => {
        set({ matchResult })
    },

    setCombo2v2: (combo2v2: Player[] | null) => {
        set({ combo2v2 })
        // 更新玩家游戏次数
        if (combo2v2) {
            combo2v2.forEach(player => {
                set({ playersGamesCount: { ...get().playersGamesCount, [player.user_custom_id]: (get().playersGamesCount[player.user_custom_id] || 0) + 1 } })
            })
        }
    },

    setShow2v2: (show2v2: boolean) => {
        set({ show2v2 })
    },

    setIsMatchStarted: (isMatchStarted: boolean) => {
        set({ isMatchStarted })
    },

    setPlayerScores: (playerScores: PlayerScore) => {
        set({ playerScores })
    },

    setBuff: (buff: BuffCard | null) => {
        set({ buff })
    },

    resetMatch: () => {
        set({
            // selectedPlayers: new Set(),
            matchResult: null,
            combo2v2: null,
            show2v2: false,
            isMatchStarted: false,
            playerScores: {}
        })
    }
}))

export default useMatchStore