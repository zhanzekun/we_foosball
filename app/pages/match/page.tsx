'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, Button, Checkbox, Input, Modal } from 'antd-mobile'
import { RedoOutline, QuestionCircleOutline } from 'antd-mobile-icons'
import supabase from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import useMatchStore from '@/store/match'
import { BuffCard, MatchResult, Player, PlayerScore } from '@/types'
import Image from 'next/image'
import { winnerDefaultIndex, TEAM_INDEX_RED, TEAM_INDEX_BLUE } from '@/const'


const winnerIcon = (
  <Image
    src="/trophy_1184688.png"
    alt="胜利"
    width={20}
    height={20}
  />
)

export default function Match() {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [buff, setBuff] = useState<BuffCard | null>(null)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const [winnerTeamIndex, setWinnerTeamIndex] = useState<number>(winnerDefaultIndex)

  // 使用 store
  const {
    forceRefreshPlayers,
    players,
    selectedPlayers,
    setSelectedPlayers,
    matchResult,
    setMatchResult,
    isMatchStarted,
    setIsMatchStarted,
    show2v2,
    setShow2v2,
    combo2v2,
    setCombo2v2,
    playerScores,
    setPlayerScores
  } = useMatchStore()

  // 刷新玩家列表
  const refreshPlayers = async () => {
    setIsRefreshing(true)
    try {
      // 使用 store 中的强制刷新方法
      await forceRefreshPlayers()
    } catch (error) {
      console.error('刷新玩家列表失败:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // 获取玩家列表
  useEffect(() => {
    const { refreshPlayers } = useMatchStore.getState()
    refreshPlayers()
  }, [])

  // 获取当前buff
  useEffect(() => {
    const fetchBuff = async () => {
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
      if (data) {
        setBuff({ name: data.buff_name, description: data.buff_description });
      } else {
        setBuff({ name: '暂无Buff', description: '今日Buff尚未生成' });
      }
    }

    fetchBuff()
  }, [])

  // 处理玩家选择
  const handlePlayerSelect = (user_custom_id: string, checked: boolean) => {
    const newSelected = new Set(selectedPlayers)
    if (checked) {
      newSelected.add(user_custom_id)
    } else {
      newSelected.delete(user_custom_id)
    }
    setSelectedPlayers(newSelected)
  }

  // 随机匹配逻辑
  const performMatch = (selectedPlayerIds: string[]): MatchResult => {
    const selectedPlayerList = players.filter(player => selectedPlayerIds.includes(player.user_custom_id))

    // 随机打乱数组
    const shuffled = [...selectedPlayerList].sort(() => Math.random() - 0.5)

    // 分成两队，每队4人
    const team1 = shuffled.slice(0, 4)
    const team2 = shuffled.slice(4, 8)

    return { team1, team2 }
  }

  // 开始匹配
  const handleStartMatch = () => {
    if (selectedPlayers.size < 4) {
      // 请至少选择4名玩家进行2v2匹配
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      const selectedArr = Array.from(selectedPlayers)

      // 随机选4人做2v2
      const shuffled = [...selectedArr].sort(() => Math.random() - 0.5)
      const twoVtwoIds = shuffled.slice(0, 4)
      const twoVtwoPlayers = players.filter(p => twoVtwoIds.includes(p.user_custom_id))
      setCombo2v2(twoVtwoPlayers)
      setShow2v2(true)
      setMatchResult(null)
      setIsMatchStarted(true)
      setIsLoading(false)
      // 已随机出2v2组合！
    }, 1000)
  }

  // 处理玩家进球数输入
  const handlePlayerScoreChange = (playerId: string, value: string) => {
    const numValue = parseFloat(value) || 0
    const newPlayerScores = { ...playerScores, [playerId]: numValue }
    setPlayerScores(newPlayerScores)
  }

  // 获取玩家进球数显示值
  const getPlayerScoreDisplayValue = (playerId: string) => {
    const score = playerScores[playerId]
    return score !== undefined ? score.toString() : ''
  }

  // 计算队伍总进球数
  const getTeamTotalScore = (teamPlayers: Player[]) => {
    return teamPlayers.reduce((total, player) => {
      const score = playerScores[player.user_custom_id]
      return total + (score !== undefined ? score : 0)
    }, 0)
  }

  // 处理队伍选择
  const handleTeamSelect = (teamIndex: number) => {
    setWinnerTeamIndex(teamIndex)
  }

  // 结算比赛
  const handleSettle = async () => {
    if (winnerTeamIndex === null) {
      // 请选择获胜队伍
      return
    }

    setIsSubmitting(true)

    try {
      // 这里可以添加保存比赛结果的逻辑
      const matchData = {
        team1: combo2v2?.slice(0, 2),
        team2: combo2v2?.slice(2, 4),
        playerScores,
        team1Total: getTeamTotalScore(combo2v2?.slice(0, 2) || []),
        team2Total: getTeamTotalScore(combo2v2?.slice(2, 4) || []),
        winnerTeamIndex: winnerTeamIndex
      }

      // 保存比赛结果
      const response = await fetch('/api/game/saveSingleGame', {
        method: 'POST',
        body: JSON.stringify(matchData)
      })
      const data = await response.json()

      if (data.success) {
        // 使用 store 的 resetMatch 方法
        useMatchStore.getState().resetMatch()
        // 重置本地状态
        setWinnerTeamIndex(winnerDefaultIndex)
      } else {
        // 比赛结果保存失败
      }
    } catch (error) {
      // 比赛结果保存失败
    } finally {
      setIsSubmitting(false)
    }
  }

  // 取消比赛
  const handleCancel = () => {
    // 使用 store 的 resetMatch 方法
    useMatchStore.getState().resetMatch()
    // 重置本地状态
    setWinnerTeamIndex(winnerDefaultIndex)
  }

  const selectedCount = selectedPlayers.size
  const canStartMatch = selectedCount >= 4

  const handleBuffClick = async () => {
    // 移除点击处理逻辑
  }

  // 显示规则说明
  const showRules = () => {
    setShowRulesModal(true)
  }

  return (
    <div className="match-container">
      {/* Buff 卡片 */}
      <div className="buff-card-container">
        <div className="buff-card">
          <div className="buff-card-content">
            <div className="buff-name">{buff ? buff.name : '加载中...'}</div>
            <div className="buff-desc">{buff ? buff.description : ''}</div>
          </div>
        </div>
      </div>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>选择玩家进行匹配</span>
            <Button
              size="mini"
              loading={isRefreshing}
              onClick={(e) => {
                e.stopPropagation()
                refreshPlayers()
              }}
              style={{
                width: '16px',
                height: '16px',
                padding: '0',
                marginLeft: '8px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <RedoOutline style={{ fontSize: '16px' }} />
            </Button>
          </div>
        }
      >
        <div className="player-grid">
          {players.map(player => {
            const checked = selectedPlayers.has(player.user_custom_id);
            return (
              <div
                key={player.user_custom_id}
                className={`player-item${checked ? ' checked' : ''}`}
                onClick={() => handlePlayerSelect(player.user_custom_id, !checked)}
                tabIndex={0}
                role="button"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handlePlayerSelect(player.user_custom_id, !checked)
                  }
                }}
              >
                <Checkbox
                  checked={checked}
                  onChange={(checked) => handlePlayerSelect(player.user_custom_id, checked)}
                  onClick={e => e.stopPropagation()}
                />
                <span className="player-name">{player.nickname} [{player.position === 1 ? '前锋' : player.position === 2 ? '后卫' : '全能'}]</span>
              </div>
            )
          })}
        </div>

        {/* 开始匹配按钮 */}
        {!isMatchStarted && (
          <div className="start-match-container">
            <Button
              color="primary"
              size="middle"
              loading={isLoading}
              disabled={!canStartMatch}
              onClick={handleStartMatch}
              style={{
                width: '200px',
                margin: '0 auto',
                display: 'block'
              }}
            >
              {isLoading ? '匹配中...' : '开始匹配'}
            </Button>
          </div>
        )}
      </Card>

      {/* 2v2 组合展示 */}
      <AnimatePresence>
        {show2v2 && combo2v2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            key="2v2"
          >
            <Card
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>2v2 匹配组合</span>
                  <QuestionCircleOutline
                    style={{ fontSize: '16px', color: '#999', cursor: 'pointer' }}
                    onClick={showRules}
                  />
                </div>
              }
              style={{ marginTop: 16 }}
            >
              <div className="match-result">
                <div
                  className={`team vertical-team`}
                >
                  <div className={`team-header ${winnerTeamIndex === TEAM_INDEX_RED ? 'winner' : ''}`} onClick={() => handleTeamSelect(TEAM_INDEX_RED)}>
                    <div className="winner-icon-placeholder">
                      {winnerTeamIndex === TEAM_INDEX_RED && winnerIcon}
                    </div>
                    <h4>
                      红队
                    </h4>
                  </div>
                  <div className="team-list">
                    {combo2v2.slice(0, 2).map(player => (
                      <div key={player.user_custom_id} className="player-score-row">
                        <div className="player-name ellipsis">{player.nickname}</div>
                        <div className="score-input">
                          <Input
                            type="number"
                            placeholder="得分"
                            value={getPlayerScoreDisplayValue(player.user_custom_id)}
                            onChange={value => handlePlayerScoreChange(player.user_custom_id, value)}
                            step="0.5"
                            min={0}
                            style={{ '--text-align': 'center' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="vs-divider">VS</div>
                <div
                  className={`team vertical-team`}
                >
                  <div className={`team-header ${winnerTeamIndex === TEAM_INDEX_BLUE ? 'winner' : ''}`} onClick={() => handleTeamSelect(TEAM_INDEX_BLUE)}>
                    <div className="winner-icon-placeholder">
                      {winnerTeamIndex === TEAM_INDEX_BLUE && winnerIcon}
                    </div>
                    <h4>
                      蓝队
                    </h4>
                  </div>
                  <div className="team-list">
                    {combo2v2.slice(2, 4).map(player => (
                      <div key={player.user_custom_id} className="player-score-row">
                        <div className="player-name ellipsis">{player.nickname}</div>
                        <div className="score-input">
                          <Input
                            type="number"
                            placeholder="得分"
                            value={getPlayerScoreDisplayValue(player.user_custom_id)}
                            onChange={value => handlePlayerScoreChange(player.user_custom_id, value)}
                            step="0.5"
                            min={0}
                            style={{ '--text-align': 'center' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 操作按钮 */}
      {isMatchStarted && (
        <div className="action-buttons">
          <Button
            color="primary"
            size="large"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSettle}
            style={{ flex: 1, marginRight: 8 }}
          >
            {isSubmitting ? '保存中...' : '结算'}
          </Button>
          <Button
            color="default"
            size="large"
            disabled={isSubmitting}
            onClick={handleCancel}
            style={{ flex: 1, marginLeft: 8 }}
          >
            取消
          </Button>
        </div>
      )}

      {/* 规则说明 Modal */}
      <Modal
        visible={showRulesModal}
        title="比分填写规则"
        content={
          <div style={{ padding: '16px 0' }}>
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>📝 得分规则</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li>每个玩家输入自己的进球数</li>
                <li>支持小数，如 0.5、1.5 等</li>
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🏆 获胜规则</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li>点击红队或蓝队区域选择获胜队伍</li>
                <li>获胜队伍旁会显示奖杯图标</li>
                <li>获胜队伍与得分总和无关，由裁判决定</li>
                <li>必须选择获胜队伍才能结算比赛</li>
              </ul>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>⚽ 示例说明</h4>
              <div style={{ color: '#666', lineHeight: '1.6' }}>
                <p style={{ margin: '4px 0' }}><strong>红队：</strong></p>
                <p style={{ margin: '4px 0' }}>• A1 得分：1.5</p>
                <p style={{ margin: '4px 0' }}>• A2 得分：0.5</p>
                <p style={{ margin: '8px 0' }}><strong>蓝队：</strong></p>
                <p style={{ margin: '4px 0' }}>• B1 得分：2</p>
                <p style={{ margin: '4px 0' }}>• B2 得分：0</p>
                <p style={{ margin: '8px 0' }}><strong>结果：</strong>点击红队或蓝队选择获胜方</p>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>🎯 特殊情况</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#666', lineHeight: '1.6' }}>
                <li>乌龙球：玩家打进自己球门，计入该玩家得分</li>
                <li>意外得分：非正常进球，计入相应玩家得分</li>
              </ul>
            </div>
          </div>
        }
        closeOnAction
        onClose={() => setShowRulesModal(false)}
        actions={[
          {
            key: 'confirm',
            text: '知道了',
          },
        ]}
      />

      <style jsx>{`
        .match-container {
          padding: 12px;
          width: 100%;
          box-sizing: border-box;
          min-height: 100%;
        }
        
        .player-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .start-match-container {
          margin-top: 8px;
          padding-top: 8px;
          margin-bottom: 8px;
        }
        
        .player-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          background-color: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          cursor: pointer;
          transition: box-shadow 0.18s, border-color 0.18s;
          outline: none;
          min-height: 36px;
        }
        
        .player-item:active, .player-item:focus {
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          border-color: #b2f7ef;
        }
        
        .player-item.checked {
          border-color: #0ea47a;
        }
        
        .player-name {
          font-size: 13px;
          color: #333;
          font-weight: 500;
        }
        
        .match-info {
          margin-bottom: 16px;
          padding: 12px;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .match-info p {
          margin: 4px 0;
          font-size: 14px;
          color: #666;
        }
        
        .match-result {
          display: flex;
          gap: 16px;
          align-items: stretch;
          justify-content: center;
        }
        
        .vertical-team {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          padding: 16px;
          border-radius: 12px;
          cursor: pointer;
          position: relative;
        }
        
        .team-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          border: 1px solid transparent;
        }
        
        .team-header.winner {
          background-color: rgba(255, 215, 0, 0.15);
          border: 1px solid rgba(255, 215, 0, 0.3);
        }
        
        .team-header h4 {
          margin: 0;
          display: flex;
          align-items: center;
        }
        
        .winner-icon-placeholder {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .vertical-team.winner {
          background-color: rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
        }
        
        .team-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          margin-bottom: 12px;
        }
        
        .player-score-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          justify-content: space-between;
        }
        
        .player-score-row .player-name {
          flex: 1;
          text-align: left;
          font-size: 14px;
          color: #333;
          max-width: 80px;
          background-color: #f8f9fa;
          padding: 8px 12px;
          border-radius: 6px;
          text-align: center;
        }
        
        .score-input {
          width: 48px;
          flex-shrink: 0;
          background-color: #f8f9fa;
          padding: 8px 2px;
          border-radius: 6px;
        }
        
        .ellipsis {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .vs-divider {
          font-weight: bold;
          font-size: 20px;
          color: #e74c3c;
          letter-spacing: 2px;
          user-select: none;
          align-self: center;
          display: flex;
          align-items: center;
          height: auto;
        }
        
        .team h4 {
          margin: 0;
          text-align: center;
          color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .team-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        
        .action-buttons {
          display: flex;
          gap: 16px;
          padding: 16px;
          padding-bottom: calc(16px + env(safe-area-inset-bottom));
          background-color: #fff;
          border-top: 1px solid #e9ecef;
          z-index: 1000;
        }
        
        .buff-card-container {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          margin-top: 0;
        }
        .buff-card {
          width: calc(100vw - 24px);
          max-width: 480px;
          height: 140px;
          position: relative;
          margin: 0 12px;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          background: linear-gradient(135deg, #e0ffe7 0%, #b2f7ef 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .buff-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }
        
        .buff-name {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #0ea47a;
        }
        
        .buff-desc {
          font-size: 14px;
          color: #0ea47a;
          text-align: center;
          line-height: 1.4;
        }
        
        .system-score {
          font-size: 12px;
          color: #999;
          text-align: center;
          margin-top: 8px;
          font-style: italic;
        }
      `}</style>
    </div>
  )
}