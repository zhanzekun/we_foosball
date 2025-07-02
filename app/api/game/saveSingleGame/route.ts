import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Player } from "@/types";
import { TEAM_INDEX_RED, TEAM_INDEX_BLUE } from "@/const";

// 定义请求体的类型接口
interface SaveGameRequest {
  team1: Player[];
  team2: Player[];
  playerScores: Record<string, number>;
  winnerTeamIndex: number;
  gameBuffId?: number | null;
}

export async function POST(request: NextRequest) {
  try {
    // 在请求处理函数内部创建 Supabase 客户端
    const supabase = await createClient();
    
    const body: SaveGameRequest = await request.json();
    const { team1, team2, playerScores, winnerTeamIndex, gameBuffId } = body;

    // 检查参数合法性
    if (!team1 || !team2 || !playerScores || winnerTeamIndex === undefined) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    // 检查队伍人数
    if (team1.length !== 2 || team2.length !== 2) {
      return NextResponse.json({ error: '每队必须包含2名玩家' }, { status: 400 });
    }

    // 检查获胜队伍索引
    if (![TEAM_INDEX_RED, TEAM_INDEX_BLUE].includes(winnerTeamIndex)) {
      return NextResponse.json({ error: '获胜队伍索引无效' }, { status: 400 });
    }

    // 检查得分是否为非负数
    const allPlayers = [...team1, ...team2];
    for (const player of allPlayers) {
      const score = playerScores[player.user_custom_id];
      if (score !== undefined && score < 0) {
        return NextResponse.json({ error: `玩家 ${player.nickname} 得分不能为负数` }, { status: 400 });
      }
    }

    // 获取当前日期和时间
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0];



    // 直接使用传入的获胜队伍索引，而不是根据得分计算
    // winnerTeamIndex: 0 表示红队获胜, 1 表示蓝队获胜
    
    const { data: gameData, error: gameError } = await supabase
      .from('games')  // 注意表名是 games 不是 game
      .insert({
        winner_team_index: winnerTeamIndex,
        game_buff_id: gameBuffId
      })
      .select()
      .single();

    if (gameError) {
      console.error('保存比赛记录失败:', gameError);
      return NextResponse.json({ error: '保存比赛记录失败' }, { status: 500 });
    }

    const gameId = gameData.id;

    // 2. 保存参与者得分到 game_participants 表
    const participants: {
      game_id: number;
      user_id: string;
      score: number;
      team_index: number;
    }[] = [];

    // 添加红队玩家
    team1.forEach((player: Player) => {
      participants.push({
        game_id: gameId,
        user_id: player.user_custom_id,
        score: playerScores[player.user_custom_id] ?? 0,
        team_index: TEAM_INDEX_RED  // 红队索引为0
      });
    });

    // 添加蓝队玩家
    team2.forEach((player: Player) => {
      participants.push({
        game_id: gameId,
        user_id: player.user_custom_id,
        score: playerScores[player.user_custom_id] ?? null,
        team_index: TEAM_INDEX_BLUE  // 蓝队索引为1
      });
    });

    // 批量插入参与者记录
    const { error: participantsError } = await supabase
      .from('game_participants')
      .insert(participants);

    if (participantsError) {
      console.error('保存参与者记录失败:', participantsError);
      return NextResponse.json({ error: '保存参与者记录失败' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      gameId: gameId,
      message: '比赛结果保存成功' 
    });

  } catch (error) {
    console.error('保存比赛结果失败:', error);
    return NextResponse.json({ error: '保存比赛结果失败' }, { status: 500 });
  }
}