export interface BuffConfig {
  index: number;
  id: string;
  name: string;
  description: string;
  effect: string;
  deprecated?: boolean;
}

export const BUFF_CONFIGS: BuffConfig[] = [
  {
    index: 0,
    id: 'midfielder_boost',
    name: '中坚加成',
    description: '中场进球算1.5分，转球算1分，中场转球算1.5分',
    effect: 'midfielder_goal_1.5_spin_1',
    deprecated: true
  },
  {
    index: 1,
    id: 'trick_shot_double',
    name: '狗招翻倍',
    description: '狗招进球算1.5分，转球算1分，狗招转球算1.5分',
    effect: 'trick_shot_goal_1.5_spin_1',
    deprecated: true
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
    id: 'flying_ball_gift',
    name: '飞球送礼',
    description: '将球打飞到球场之外，对方+0.5分',
    effect: 'ball_out_opponent_plus_0.5'
  },
  {
    index: 4,
    id: 'position_swap',
    name: '位移互换',
    description: '任何一方进球时，双方队伍内的前锋/后卫需对换',
    effect: 'goal_triggers_position_swap'
  },
  {
    index: 5,
    id: 'uncontrolled_spin',
    name: '失控转球',
    description: '转球算1分，但转球导致飞出球台对方+0.5分',
    effect: 'uncontrolled_spin'
  },
  {
    index: 6,
    id: 'guaranteed_goal',
    name: '必进球',
    description: '单次进攻前声明自己必进球，如该次进攻进球则获得2分，否则对手获得0.5分，每局只能使用一次',
    effect: 'guaranteed_goal'
  }
];

export const BUFF_MAP = BUFF_CONFIGS.reduce((map, buff) => {
  map[buff.id] = buff;
  return map;
}, {} as Record<string, BuffConfig>);
