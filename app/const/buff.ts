export interface BuffConfig {
  index: number;
  id: string;
  name: string;
  description: string;
  effect: string;
}

export const BUFF_CONFIGS: BuffConfig[] = [
  {
    index: 0,
    id: 'midfielder_boost',
    name: '中坚加成',
    description: '中场进球算1.5分，转球算1分',
    effect: 'midfielder_goal_1.5_spin_1'
  },
  {
    index: 1,
    id: 'trick_shot_double',
    name: '狗招翻倍',
    description: '狗招进球算1.5分，转球算1分',
    effect: 'trick_shot_goal_1.5_spin_1'
  },
  {
    index: 2,
    id: 'no_touch_score',
    name: '无触得分',
    description: '球入场后，即使不碰到任何球员的情况下进球也算得分',
    effect: 'no_touch_goal_valid'
  },
  {
    index: 3,
    id: 'champion_penalty',
    name: '打擂台',
    description: '赢的队伍下一场仍在场，但对方获胜所需分数-1.5，直到擂主下场重置',
    effect: 'winner_stays_opponent_score_minus_1.5'
  },
  {
    index: 4,
    id: 'flying_ball_gift',
    name: '飞球送礼',
    description: '将球打飞到球场之外，对方+0.5分',
    effect: 'ball_out_opponent_plus_0.5'
  },
  {
    index: 5,
    id: 'position_swap',
    name: '位移互换',
    description: '任何一方进球时，双方队伍内的前锋/后卫需对换',
    effect: 'goal_triggers_position_swap'
  }
];

export const BUFF_MAP = BUFF_CONFIGS.reduce((map, buff) => {
  map[buff.id] = buff;
  return map;
}, {} as Record<string, BuffConfig>);
