import { Player, PlayerWithGamesCount } from "@/types"
import { POSITION_INDEX } from "@/const"

// 新规则：
// 1. 优先让上场次数少的人先上场，将玩家池按上场次数升序排列
// 2. 优先匹配后卫，后卫不够时全能和前锋都可以补齐，全能和前锋之间不排序，按原顺序补齐
export const rankMatch = (players: PlayerWithGamesCount[]) => {
    // 检查players.length >= 4
    if (players.length < 4) {
        throw new Error("players.length < 4")
    }

    // 1. 按上场次数升序排列，如果同上场次数，则打乱顺序
    const sortedPlayers = [...players].sort((a, b) => {
        if (a.game_played_count !== b.game_played_count) {
            return a.game_played_count - b.game_played_count
        } else {
            return Math.random() - 0.5
        }
    })

    // 2. 先选后卫
    const defenders = sortedPlayers.filter(p => p.position === POSITION_INDEX.DEFENDER)
    let result: PlayerWithGamesCount[] = []
    for (const p of defenders) {
        if (result.length < 4) result.push(p)
    }

    // 3. 后卫不够时，从剩下的玩家中补齐（全能和前锋都行，且不排序，按原顺序）
    if (result.length < 4) {
        const rest = sortedPlayers.filter(p => p.position !== POSITION_INDEX.DEFENDER)
        for (const p of rest) {
            if (result.length < 4) result.push(p)
        }
    }

    if (result.length !== 4) {
        throw new Error("匹配失败：无法组成4人队伍")
    }

    return result
}