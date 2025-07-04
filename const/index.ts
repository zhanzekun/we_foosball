export enum POSITION_INDEX {
    FORWARD = 1,
    DEFENDER = 2,
    ALL_ROUNDER = 3,
}

export const positionOptions = [
    { label: '前锋', value: POSITION_INDEX.FORWARD },
    { label: '后卫', value: POSITION_INDEX.DEFENDER },
    { label: '全能', value: POSITION_INDEX.ALL_ROUNDER },
]

export const winnerDefaultIndex = null
export const TEAM_INDEX_RED = 1
export const TEAM_INDEX_BLUE = 2