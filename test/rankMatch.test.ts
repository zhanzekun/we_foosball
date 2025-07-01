import { describe, it, expect } from 'vitest'
import { rankMatch } from '@/lib/rankMatch'
import { POSITION_INDEX } from '@/const'
import type { Player, PlayerWithGamesCount } from '@/types'

const createPlayer = (id: string, position: number): PlayerWithGamesCount => ({
  user_custom_id: id,
  nickname: id,
  position,
  game_played_count: 0
})

describe('rankMatch', () => {
  it('正常分配：2前锋2后卫', () => {
    const players = [
      createPlayer('A', POSITION_INDEX.FORWARD),
      createPlayer('B', POSITION_INDEX.FORWARD),
      createPlayer('C', POSITION_INDEX.DEFENDER),
      createPlayer('D', POSITION_INDEX.DEFENDER),
    ]
    const result = rankMatch(players)
    expect(result).toHaveLength(4)
    const forwards = result.filter(p => p.position === POSITION_INDEX.FORWARD)
    const defenders = result.filter(p => p.position === POSITION_INDEX.DEFENDER)
    expect(forwards.length).toBe(2)
    expect(defenders.length).toBe(2)
  })

  it('有全能球员时能正常分配', () => {
    const players = [
      createPlayer('A', POSITION_INDEX.FORWARD),
      createPlayer('B', POSITION_INDEX.DEFENDER),
      createPlayer('C', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('D', POSITION_INDEX.ALL_ROUNDER),
    ]
    const result = rankMatch(players)
    expect(result).toHaveLength(4)
  })

  it('全是全能球员也能分配', () => {
    const players = [
      createPlayer('A', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('B', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('C', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('D', POSITION_INDEX.ALL_ROUNDER),
    ]
    const result = rankMatch(players)
    expect(result).toHaveLength(4)
  })

  it('人数不足时抛出异常', () => {
    const players = [
      createPlayer('A', POSITION_INDEX.FORWARD),
      createPlayer('B', POSITION_INDEX.DEFENDER),
      createPlayer('C', POSITION_INDEX.ALL_ROUNDER),
    ]
    expect(() => rankMatch(players)).toThrow()
  })

  // it('无法组成两队时抛出异常', () => {
  //   const players = [
  //     createPlayer('A', POSITION_INDEX.FORWARD),
  //     createPlayer('B', POSITION_INDEX.FORWARD),
  //     createPlayer('C', POSITION_INDEX.FORWARD),
  //     createPlayer('D', POSITION_INDEX.FORWARD),
  //   ]
  //   expect(() => rankMatch(players)).toThrow()
  // })

  it('同权重玩家，多次随机匹配，每次结果不一样', () => {
    const players = [
      createPlayer('A', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('B', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('C', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('D', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('E', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('F', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('G', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('H', POSITION_INDEX.ALL_ROUNDER),
    ]
    const result1 = rankMatch(players)
    const result2 = rankMatch(players)
    expect(result1).not.toEqual(result2)
  })

  it('同初始权重玩家，经过多次匹配后，所有人上场次数相差不超过2', () => {
    const players = [
      createPlayer('A', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('B', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('C', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('D', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('E', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('F', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('G', POSITION_INDEX.ALL_ROUNDER),
      createPlayer('H', POSITION_INDEX.ALL_ROUNDER),
    ]
    Array.from({ length: 21 }).forEach(() => {
      const selectedPlayers = rankMatch(players)
      selectedPlayers.forEach(p => {
        p.game_played_count++
      })
    })
    const counts = players.map(p => p.game_played_count)
    console.log('players counts', players.map(p => ({
      name: p.nickname,
      count: p.game_played_count
    })))
    expect(Math.max(...counts) - Math.min(...counts)).toBeLessThanOrEqual(2)
  })
}) 