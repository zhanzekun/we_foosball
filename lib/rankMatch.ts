import { Player, PlayerWithGamesCount } from "@/types"
import { POSITION_INDEX } from "@/const"

// 匹配规则：
// 1. 优先让上场次数少的人先上场，将玩家池按上场次数升序排列
// 2. 如果发现同队2人是同位置（不包括全能），则将上场次数多的人换下，替补上上场次数少的人，直到同队2人位置不同
export const rankMatch = (players: PlayerWithGamesCount[]) => {
    if (players.length < 4) {
        throw new Error("players.length < 4")
    }

    // 1. 按上场次数升序排列，如果同上场次数，则打乱顺序
    const sortedPlayers = [...players].sort((a, b) => {
        return a.game_played_count - b.game_played_count
    })

    console.log('sortedPlayers', sortedPlayers.map(p => ({
        name: p.nickname,
        count: p.game_played_count
    })))

    // 2. 选出前4名作为本场参赛队员
    let selected = sortedPlayers.slice(0, 4)
    let bench = sortedPlayers.slice(4)

    // 随机打乱顺序
    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[selected[i], selected[j]] = [selected[j], selected[i]]
    }

    // 3. 分成两队
    let team1 = [selected[0], selected[1]]
    let team2 = [selected[2], selected[3]]

    // 4. 检查并调整每队是否有同位置（不包括全能）
    function hasSamePosition(team: PlayerWithGamesCount[]) {
        // 只要不是全能且位置相同
        return team[0].position === team[1].position && team[0].position !== POSITION_INDEX.ALL_ROUNDER
    }

    function tryFixTeam(team: PlayerWithGamesCount[], bench: PlayerWithGamesCount[]): [PlayerWithGamesCount[], PlayerWithGamesCount[]] {
        if (!hasSamePosition(team)) return [team, bench]
        // 找bench里有没有和team不同位置的
        for (let i = 0; i < bench.length; i++) {
            if (bench[i].position !== team[0].position || bench[i].position === POSITION_INDEX.ALL_ROUNDER) {
                // 换下team里上场次数多的
                const idx = team[0].game_played_count >= team[1].game_played_count ? 0 : 1
                const out = team[idx]
                const newTeam = [...team]
                newTeam[idx] = bench[i]
                const newBench = [...bench]
                newBench.splice(i, 1)
                newBench.push(out)
                // 递归修正（bench可能还有更合适的）
                return tryFixTeam(newTeam, newBench)
            }
        }
        // bench里没有合适的，返回原队伍
        return [team, bench]
    }

    [team1, bench] = tryFixTeam(team1, bench);
    [team2, bench] = tryFixTeam(team2, bench);

    // 最终检查
    if (hasSamePosition(team1) || hasSamePosition(team2)) {
        throw new Error("匹配失败：无法组成两队不同位置的队伍")
    }

    return [...team1, ...team2]
}