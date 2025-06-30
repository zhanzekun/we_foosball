import { Player } from "@/types"
import { POSITION_INDEX } from "@/const"

// 同队伍中会优先匹配一前锋一后卫，若玩家为全能则都可以担任任意位置。
export const rankMatch = (players: Player[]) => {
    // 检查players.length >= 4
    if (players.length < 4) {
        throw new Error("players.length < 4")
    }

    // 打乱顺序
    const randomPlayers = players.sort(() => Math.random() - 0.5)

    // 按位置分类玩家
    const forwards = randomPlayers.filter(p => p.position === POSITION_INDEX.FORWARD)
    const defenders = randomPlayers.filter(p => p.position === POSITION_INDEX.DEFENDER)
    const allRounders = randomPlayers.filter(p => p.position === POSITION_INDEX.ALL_ROUNDER)

    // 创建结果数组
    const result: Player[] = []
    
    // 第一队：优先匹配一前锋一后卫
    let team1Forward: Player | null = null
    let team1Defender: Player | null = null
    
    // 尝试为第一队分配前锋
    if (forwards.length > 0) {
        team1Forward = forwards.shift()!
    } else if (allRounders.length > 0) {
        team1Forward = allRounders.shift()!
    }
    
    // 尝试为第一队分配后卫
    if (defenders.length > 0) {
        team1Defender = defenders.shift()!
    } else if (allRounders.length > 0) {
        team1Defender = allRounders.shift()!
    }
    
    // 如果第一队还没有完整，从剩余玩家中补充
    if (!team1Forward && forwards.length > 0) {
        team1Forward = forwards.shift()!
    }
    if (!team1Defender && defenders.length > 0) {
        team1Defender = defenders.shift()!
    }
    
    // 将第一队玩家加入结果数组
    if (team1Forward) result.push(team1Forward)
    if (team1Defender) result.push(team1Defender)
    
    // 第二队：分配剩余玩家
    const remainingPlayers = [...forwards, ...defenders, ...allRounders]
    
    // 如果第一队不完整，从剩余玩家中补充
    while (result.length < 2 && remainingPlayers.length > 0) {
        result.push(remainingPlayers.shift()!)
    }
    
    // 将第二队玩家加入结果数组
    while (result.length < 4 && remainingPlayers.length > 0) {
        result.push(remainingPlayers.shift()!)
    }
    
    // 确保返回4个玩家
    if (result.length !== 4) {
        throw new Error("匹配失败：无法组成两个完整的队伍")
    }
    
    return result
}